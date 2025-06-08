import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import messageService from '../services/messageService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CampaignAnalyticsComponent = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalSent: 0,
    emailsSent: 0,
    smsSent: 0,
    successRate: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  useEffect(() => {
    loadCampaignData();
  }, [selectedPeriod]);

  const loadCampaignData = () => {
    const campaignHistory = messageService.getCampaignHistory();
    const filteredCampaigns = filterCampaignsByPeriod(campaignHistory, selectedPeriod);
    setCampaigns(filteredCampaigns);
    calculateStats(filteredCampaigns);
  };

  const filterCampaignsByPeriod = (campaigns, period) => {
    const now = new Date();
    const periodDays = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      'all': null
    };

    if (!periodDays[period]) return campaigns;

    const cutoffDate = new Date(now.getTime() - (periodDays[period] * 24 * 60 * 60 * 1000));
    return campaigns.filter(campaign => new Date(campaign.timestamp) >= cutoffDate);
  };

  const calculateStats = (campaigns) => {
    const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.recipientCount, 0);
    const emailsSent = campaigns
      .filter(campaign => campaign.type === 'email')
      .reduce((sum, campaign) => sum + campaign.recipientCount, 0);
    const smsSent = campaigns
      .filter(campaign => campaign.type === 'sms')
      .reduce((sum, campaign) => sum + campaign.recipientCount, 0);
    
    const successfulCampaigns = campaigns.filter(campaign => campaign.status === 'sent').length;
    const successRate = campaigns.length > 0 ? (successfulCampaigns / campaigns.length) * 100 : 0;

    setStats({
      totalSent,
      emailsSent,
      smsSent,
      successRate: Math.round(successRate)
    });
  };

  const messageTypeData = {
    labels: ['Emails', 'SMS'],
    datasets: [
      {
        data: [stats.emailsSent, stats.smsSent],
        backgroundColor: ['#3B82F6', '#10B981'],
        hoverBackgroundColor: ['#2563EB', '#059669'],
      },
    ],
  };

  const campaignHistoryData = {
    labels: campaigns.slice(-10).map(campaign => 
      new Date(campaign.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Messages Sent',
        data: campaigns.slice(-10).map(campaign => campaign.recipientCount),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Analytics</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Messages</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalSent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Emails Sent</p>
              <p className="text-2xl font-bold text-green-900">{stats.emailsSent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">SMS Sent</p>
              <p className="text-2xl font-bold text-purple-900">{stats.smsSent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Success Rate</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Distribution</h3>
          <div className="h-64">
            <Pie data={messageTypeData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign History</h3>
          <div className="h-64">
            <Bar data={campaignHistoryData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Campaign History Table */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
        
        {campaigns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p>No campaigns found for the selected period</p>
            <p className="text-sm">Start by uploading contacts and sending messages</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject/Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.slice(0, 10).map((campaign, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(campaign.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {campaign.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {campaign.subject || campaign.content.substring(0, 50) + '...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.recipientCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignAnalyticsComponent;
