import React, { useState, useEffect } from 'react';
import {useUser} from "@clerk/clerk-react"


const Item2 = () => {
  const [retrieveUserId, setRetrieveUserId] = useState('');
  const [results, setResults] = useState(null);
  const [previousSearches, setPreviousSearches] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { user } = useUser(); 
  const { id: userId } = user || {};
  const [formData, setFormData] = useState({
    occupation: '',
    city: '',
    userId: userId
  });
  
  const API_BASE_URL = 'https://krish09bha-lead-sparks.hf.space';

  // Utility functions to handle MongoDB data format
  const extractNumberValue = (mongoField) => {
    if (typeof mongoField === 'object' && mongoField?.$numberInt) {
      return parseInt(mongoField.$numberInt);
    }
    return mongoField || 0;
  };

  const extractStringValue = (mongoField) => {
    if (typeof mongoField === 'object' && mongoField?.$oid) {
      return mongoField.$oid;
    }
    return mongoField || '';
  };

  const normalizeBusinessData = (business) => {
    // Handle incomplete entries that only have website field
    if (Object.keys(business).length === 1 && business.website) {
      return null;
    }

    return {
      number: extractNumberValue(business.number),
      name: business.name || 'N/A',
      address: business.address || 'N/A',
      province_code: business.province_code || 'N/A',
      province_name: business.province_name || 'N/A',
      phone: business.phone || 'N/A',
      website: business.website || 'No Website'
    };
  };

  const normalizeApiResponse = (data) => {
    return {
      _id: extractStringValue(data._id),
      user_id: data.user_id,
      message: data.message,
      total_entries: extractNumberValue(data.total_entries),
      entries_by_province: Object.fromEntries(
        Object.entries(data.entries_by_province || {}).map(([key, value]) => [
          key,
          extractNumberValue(value)
        ])
      ),
      timestamp: data.timestamp,
      search_params: data.search_params,
      data: data.data
        ? data.data.map(normalizeBusinessData).filter(Boolean) // Filter out null entries
        : []
    };
  };

  useEffect(() => {
    loadStats();
    loadProvinces();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadProvinces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/provinces`);
      const provincesData = await response.json();
      setProvinces(provincesData);
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScrapeSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.occupation || !formData.userId) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Ai is Scraping data ');

    try {
      const url = `${API_BASE_URL}/scrape?occupation=${encodeURIComponent(formData.occupation)}&user_id=${encodeURIComponent(formData.userId)}${formData.city ? '&city=' + encodeURIComponent(formData.city) : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to scrape data');
      }

      const data = await response.json();
      const normalizedData = normalizeApiResponse(data);
      setResults(normalizedData);
      setCurrentPage(1); // Reset to first page when new results come in
      loadStats();
    } catch (error) {
      console.error('Error scraping data:', error);
      alert('Error scraping data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrieveSubmit = async (e) => {
    e.preventDefault();
    
    if (!retrieveUserId) {
      alert('Please enter a User ID');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Retrieving previous results...');

    try {
      const response = await fetch(`${API_BASE_URL}/results/${encodeURIComponent(retrieveUserId)}`);
      const data = await response.json();
      console.log('Retrieved data:', data);
      
      // Handle the new data format - array of search results
      if (Array.isArray(data) && data.length > 0) {
        // Each item in the array is already a complete search result
        // No need to normalize as they're already in the correct format
        setPreviousSearches(data);
      } else {
        setPreviousSearches([]);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      alert('Error retrieving data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!results || !results.data || results.data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      const data = results.data;
      const headers = ['Number', 'Business Name', 'Address', 'Province Code', 'Province Name', 'Phone', 'Website'];
      
      // Escape quotes and commas in CSV fields
      const escapeCsvField = (field) => {
        const str = String(field || '');
        // If field contains comma, quote, or newline, wrap it in quotes and escape internal quotes
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      data.forEach((business, index) => {
        const row = [
          business.number || (index + 1),
          escapeCsvField(business.name),
          escapeCsvField(business.address),
          escapeCsvField(business.province_code),
          escapeCsvField(business.province_name),
          escapeCsvField(business.phone),
          escapeCsvField(business.website)
        ];
        csvContent += row.join(',') + '\n';
      });

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      const fileName = `yellow-pages-${results.search_params?.occupation || 'search'}-${new Date().toISOString().slice(0,10)}.csv`;
      link.setAttribute('download', fileName);
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log(`CSV exported successfully: ${fileName}`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV file. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Pagination logic
  const getCurrentPageData = () => {
    if (!results || !results.data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return results.data.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    if (!results || !results.data) return 0;
    return Math.ceil(results.data.length / itemsPerPage);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= getTotalPages()) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const maxVisiblePages = 5;
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Test function to load local JSON data (for development/testing)
  const loadTestData = async () => {
    try {
      const response = await fetch('/json.json');
      const data = await response.json();
      const normalizedData = normalizeApiResponse(data);
      setResults(normalizedData);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading test data:', error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <svg 
                className="w-12 h-12 text-yellow-500 mr-3" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900">Lead Finder</h1>
            </div>
            <p className="text-xl text-gray-600">Search and scrape business listings from Yellow Pages Canada</p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Left Sidebar */}
        <div className="w-96 bg-white shadow-lg overflow-y-auto border-r border-gray-200 flex-shrink-0">
          <div className="p-6 space-y-6">
            {/* Scrape Form */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                New Search
              </h3>
              <form onSubmit={handleScrapeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation/Business Type *
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., dentist, restaurant, lawyer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City (Optional)
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Toronto, Vancouver"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID *
                  </label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your unique identifier"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Searching...' : 'Start Scraping'}
                </button>
                
                {/* Test Button for Development */}
                <button
                  type="button"
                  onClick={loadTestData}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
                >
                  Load Test Data
                </button>
              </form>
            </div>

            {/* Stats Card */}
            {stats && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  System Statistics
                </h3>
                <div className="space-y-2">
                  <p className="text-sm opacity-90">Total Entries: <span className="font-bold">{stats.total_entries?.toLocaleString()}</span></p>
                  <p className="text-sm opacity-90">Total Searches: <span className="font-bold">{stats.total_searches?.toLocaleString()}</span></p>
                  <p className="text-sm opacity-90">Unique Users: <span className="font-bold">{stats.unique_users?.toLocaleString()}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Results */}
              {results && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Search Results</h3>
                    <button
                      onClick={exportToCSV}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Export CSV
                    </button>
                  </div>

                  {/* Province Stats */}
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-blue-600 mb-3">
                      Total Results: {results.total_entries?.toLocaleString()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(results.entries_by_province || {}).map(([code, count]) => (
                        <span
                          key={code}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {code}: {count}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Results Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Province</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getCurrentPageData().map((business, index) => (
                          <tr key={`${business.number}-${index}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {business.number || (currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              <div className="max-w-xs truncate" title={business.name}>
                                {business.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-sm" title={business.address}>
                                {business.address}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex flex-col">
                                <span className="font-medium">{business.province_code}</span>
                                {business.province_name && business.province_name !== 'N/A' && (
                                  <span className="text-xs text-gray-500">{business.province_name}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {business.phone && business.phone !== 'N/A' ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-900">{business.phone}</span>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => window.open(`tel:${business.phone}`, '_self')}
                                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                      title="Call"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => window.open(`sms:${business.phone}`, '_blank')}
                                      className="text-green-600 hover:text-green-800 p-1 rounded"
                                      title="Send SMS"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => window.open(`https://wa.me/${business.phone.replace(/\D/g, '')}`, '_blank')}
                                      className="text-green-500 hover:text-green-700 p-1 rounded"
                                      title="WhatsApp"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => {
                                        const subject = encodeURIComponent(`Inquiry about ${business.name}`);
                                        const body = encodeURIComponent(`Hi,\n\nI found your business listing and would like to inquire about your services.\n\nBusiness: ${business.name}\nAddress: ${business.address}\nPhone: ${business.phone}\n\nThank you!`);
                                        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                                      }}
                                      className="text-purple-600 hover:text-purple-800 p-1 rounded"
                                      title="Send Email"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">No Phone</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {business.website && business.website !== 'No Website' && business.website !== 'N/A' ? (
                                <a 
                                  href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                >
                                  Visit
                                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-gray-400">No Website</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {results.data && results.data.length > itemsPerPage && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === getTotalPages()}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing{' '}
                              <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                              {' '}to{' '}
                              <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, results.data.length)}
                              </span>
                              {' '}of{' '}
                              <span className="font-medium">{results.data.length}</span>
                              {' '}results
                            </p>
                          </div>
                          <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                              <button
                                onClick={() => goToPage(1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="First Page"
                              >
                                <span className="sr-only">First</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                              </button>

                              <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>

                              {getPageNumbers()[0] > 1 && (
                                <>
                                  <button
                                    onClick={() => goToPage(1)}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                  >
                                    1
                                  </button>
                                  {getPageNumbers()[0] > 2 && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500">
                                      ...
                                    </span>
                                  )}
                                </>
                              )}

                              {getPageNumbers().map((page) => (
                                <button
                                  key={page}
                                  onClick={() => goToPage(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === currentPage
                                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}

                              {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() && (
                                <>
                                  {getPageNumbers()[getPageNumbers().length - 1] < getTotalPages() - 1 && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500">
                                      ...
                                    </span>
                                  )}
                                  <button
                                    onClick={() => goToPage(getTotalPages())}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                  >
                                    {getTotalPages()}
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === getTotalPages()}
                                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>

                              <button
                                onClick={() => goToPage(getTotalPages())}
                                disabled={currentPage === getTotalPages()}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Last Page"
                              >
                                <span className="sr-only">Last</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414zm6 0a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items per page selector and page jump */}
                  {results.data && results.data.length > 0 && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
                          Items per page:
                        </label>
                        <select
                          id="itemsPerPage"
                          value={itemsPerPage}
                          onChange={(e) => {
                            const newItemsPerPage = parseInt(e.target.value);
                            setItemsPerPage(newItemsPerPage);
                            setCurrentPage(1);
                          }}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                      
                      {getTotalPages() > 1 && (
                        <div className="flex items-center space-x-2">
                          <label htmlFor="pageJump" className="text-sm text-gray-700">
                            Go to page:
                          </label>
                          <input
                            id="pageJump"
                            type="number"
                            min="1"
                            max={getTotalPages()}
                            value={currentPage}
                            onChange={(e) => {
                              const page = parseInt(e.target.value);
                              if (page >= 1 && page <= getTotalPages()) {
                                goToPage(page);
                              }
                            }}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span className="text-sm text-gray-500">of {getTotalPages()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {results.data?.length === 0 && (
                    <div className="mt-6 text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Retrieve Previous Searches */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Retrieve Previous Searches
                </h3>
                <form onSubmit={handleRetrieveSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID *
                    </label>
                    <input
                      type="text"
                      value={retrieveUserId}
                      onChange={(e) => setRetrieveUserId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter User ID to retrieve search history"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Retrieving...' : 'Retrieve Search History'}
                  </button>
                </form>
              </div>

              {/* Previous Searches */}
              {previousSearches && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Previous Searches ({previousSearches.length})</h3>
                  {previousSearches.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No previous searches found</h3>
                      <p className="mt-1 text-sm text-gray-500">This user hasn't performed any searches yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {previousSearches.map((search, index) => (
                        <div key={search._id?.$oid || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-gray-900 text-lg">
                                  {search.search_params?.occupation || 'Unknown Occupation'}
                                </h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  #{index + 1}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                  {search.search_params?.city ? (
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">City:</span> {search.search_params.city}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      <span className="font-medium">City:</span> All Cities
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Total Results:</span> {search.total_entries?.toLocaleString() || 0}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Data Items:</span> {search.data?.length?.toLocaleString() || 0}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Search Date:</span> {formatDate(search.timestamp)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Status:</span> {search.message || 'Completed'}
                                  </p>
                                </div>
                              </div>

                              {/* Province breakdown */}
                              {search.entries_by_province && Object.keys(search.entries_by_province).length > 0 && (
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Results by Province:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(search.entries_by_province)
                                      .sort(([,a], [,b]) => b - a)
                                      .slice(0, 8)
                                      .map(([code, count]) => (
                                      <span
                                        key={code}
                                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                                      >
                                        {code}: {count}
                                      </span>
                                    ))}
                                    {Object.keys(search.entries_by_province).length > 8 && (
                                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600">
                                        +{Object.keys(search.entries_by_province).length - 8} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-4 flex flex-col space-y-2">
                              <button 
                                onClick={() => {
                                  setResults(search);
                                  setCurrentPage(1);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                              >
                                View Results
                              </button>
                              {search.data && search.data.length > 0 && (
                                <button
                                  onClick={() => {
                                    setResults(search);
                                    setCurrentPage(1);
                                    setTimeout(() => exportToCSV(), 100);
                                  }}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                                >
                                  Export CSV
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700 text-center">{loadingMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item2;