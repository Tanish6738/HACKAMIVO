import React, { useState, useEffect } from 'react';
import CsvUploadComponent from '../outreach/components/CsvUploadComponent';
import ContactListComponent from '../outreach/components/ContactListComponent';
import MessageComposerComponent from '../outreach/components/MessageComposerComponent';
import CampaignAnalyticsComponent from '../outreach/components/CampaignAnalyticsComponent';
import messageService from '../outreach/services/messageService';

const Item5 = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [refreshAnalytics, setRefreshAnalytics] = useState(0);

  useEffect(() => {
    // Load any existing contacts from localStorage
    const savedContacts = localStorage.getItem('outreach_contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const handleCsvUploaded = (uploadedContacts) => {
    const newContacts = [...contacts, ...uploadedContacts];
    setContacts(newContacts);
    localStorage.setItem('outreach_contacts', JSON.stringify(newContacts));
    setActiveTab('contacts'); // Switch to contacts tab after upload
  };

  const handleContactsSelected = (selected) => {
    setSelectedContacts(selected);
    setActiveTab('compose'); // Switch to compose tab when contacts are selected
  };

  const handleMessageSent = (messageData) => {
    // Record the campaign
    messageService.recordCampaign({
      type: messageData.type,
      subject: messageData.subject,
      content: messageData.content,
      recipientCount: selectedContacts.length,
      recipients: selectedContacts,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });

    // Refresh analytics
    setRefreshAnalytics(prev => prev + 1);
    
    // Clear selected contacts
    setSelectedContacts([]);
    
    // Switch to analytics tab to show results
    setActiveTab('analytics');
  };

  const clearAllContacts = () => {
    setContacts([]);
    setSelectedContacts([]);
    localStorage.removeItem('outreach_contacts');
  };

  const tabs = [
    {
      id: 'upload',
      label: 'Upload Contacts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      id: 'contacts',
      label: `Contacts ${contacts.length > 0 ? `(${contacts.length})` : ''}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'compose',
      label: `Compose ${selectedContacts.length > 0 ? `(${selectedContacts.length} selected)` : ''}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Contact List</h2>
              <p className="text-gray-600 mb-6">
                Upload a CSV file containing your contacts. The file should include columns for name, email, and phone number.
              </p>
              <CsvUploadComponent onDataUpload={handleCsvUploaded} />
            </div>
            
            {contacts.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      You have {contacts.length} contacts loaded. Switch to the Contacts tab to manage them.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
              {contacts.length > 0 && (
                <button
                  onClick={clearAllContacts}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All Contacts
                </button>
              )}
            </div>
            
            {contacts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts uploaded yet</h3>
                <p className="text-gray-600 mb-4">Upload a CSV file to get started with your outreach campaign</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Contacts
                </button>
              </div>
            ) : (
              <ContactListComponent
                contacts={contacts}
                onContactsSelect={handleContactsSelected}
                selectedContacts={selectedContacts}
              />
            )}
          </div>
        );

      case 'compose':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Compose Message</h2>
            
            {selectedContacts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts selected</h3>
                <p className="text-gray-600 mb-4">Select contacts from the Contacts tab to start composing messages</p>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Contacts
                </button>
              </div>
            ) : (
              <MessageComposerComponent
                selectedContacts={selectedContacts}
                onMessageSent={handleMessageSent}
              />
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <CampaignAnalyticsComponent key={refreshAnalytics} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Outreach Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage your contact outreach campaigns with ease
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
                <div className="text-sm text-gray-500">Total Contacts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{selectedContacts.length}</div>
                <div className="text-sm text-gray-500">Selected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {messageService.getCampaignHistory().length}
                </div>
                <div className="text-sm text-gray-500">Campaigns</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Item5;