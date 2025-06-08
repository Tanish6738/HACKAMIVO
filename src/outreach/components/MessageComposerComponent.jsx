import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, FileText, User, Building, Calendar, MessageSquare } from 'lucide-react';
import messageService from '../services/messageService';

const MessageComposerComponent = ({ selectedContacts = [], onSendComplete }) => {
  const [activeTab, setActiveTab] = useState('email');
  const [senderInfo, setSenderInfo] = useState({
    senderName: '',
    companyName: '',
    customMessage: '',
    eventName: ''
  });
  
  // Email state
  const [emailData, setEmailData] = useState({
    subject: '',
    body: '',
    templateId: null
  });
  
  // SMS state
  const [smsData, setSmsData] = useState({
    body: '',
    templateId: null
  });
  
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState(null);
  const [templates, setTemplates] = useState({ email: [], sms: [] });

  useEffect(() => {
    // Load templates
    const allTemplates = messageService.getTemplates();
    setTemplates(allTemplates);
  }, []);

  const handleSenderInfoChange = (field, value) => {
    setSenderInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailChange = (field, value) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  const handleSmsChange = (field, value) => {
    setSmsData(prev => ({ ...prev, [field]: value }));
  };

  const loadTemplate = (type, templateId) => {
    const templateList = type === 'email' ? templates.email : templates.sms;
    const template = templateList.find(t => t.id === parseInt(templateId));
    
    if (!template) return;

    if (type === 'email') {
      setEmailData(prev => ({
        ...prev,
        subject: template.subject || '',
        body: template.body,
        templateId: template.id
      }));
    } else {
      setSmsData(prev => ({
        ...prev,
        body: template.body,
        templateId: template.id
      }));
    }
  };

  const getRecipientsByType = (type) => {
    if (type === 'email') {
      return selectedContacts.filter(contact => contact.hasEmail);
    } else {
      return selectedContacts.filter(contact => contact.hasPhone);
    }
  };

  const handleSend = async () => {
    if (selectedContacts.length === 0) {
      alert('Please select contacts to send messages to');
      return;
    }

    const recipients = getRecipientsByType(activeTab);
    if (recipients.length === 0) {
      alert(`No contacts with valid ${activeTab} addresses found`);
      return;
    }

    setIsSending(true);
    setSendResults(null);

    try {
      let results;
      
      if (activeTab === 'email') {
        if (!emailData.subject.trim() || !emailData.body.trim()) {
          throw new Error('Please fill in both subject and message body');
        }
        
        results = await messageService.sendEmail(recipients, emailData, senderInfo);
      } else {
        if (!smsData.body.trim()) {
          throw new Error('Please fill in the message body');
        }
        
        results = await messageService.sendSms(recipients, smsData, senderInfo);
      }

      setSendResults(results);
      onSendComplete?.(results);

    } catch (error) {
      alert(`Error sending messages: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const getCharacterCount = () => {
    if (activeTab === 'email') {
      return emailData.body.length;
    } else {
      return smsData.body.length;
    }
  };

  const getCharacterLimit = () => {
    return activeTab === 'email' ? 10000 : 160;
  };

  const isOverLimit = () => {
    return getCharacterCount() > getCharacterLimit();
  };

  const previewMessage = (contact) => {
    const data = activeTab === 'email' ? emailData : smsData;
    const testData = {
      name: contact.name,
      ...senderInfo
    };
    
    return messageService.replacePlaceholders(data.body, testData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <MessageSquare className="h-6 w-6" />
          Message Composer
        </h2>
        <p className="text-gray-600">
          Create and send personalized messages to your selected contacts
        </p>
        
        {selectedContacts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{selectedContacts.length}</div>
                  <div className="text-sm text-blue-600">Selected</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {getRecipientsByType('email').length}
                  </div>
                  <div className="text-sm text-green-600">Email</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {getRecipientsByType('sms').length}
                  </div>
                  <div className="text-sm text-purple-600">SMS</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sender Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Sender Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={senderInfo.senderName}
              onChange={(e) => handleSenderInfoChange('senderName', e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={senderInfo.companyName}
              onChange={(e) => handleSenderInfoChange('companyName', e.target.value)}
              placeholder="Enter company name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name (Optional)
            </label>
            <input
              type="text"
              value={senderInfo.eventName}
              onChange={(e) => handleSenderInfoChange('eventName', e.target.value)}
              placeholder="Enter event name if applicable"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message
            </label>
            <input
              type="text"
              value={senderInfo.customMessage}
              onChange={(e) => handleSenderInfoChange('customMessage', e.target.value)}
              placeholder="Your main message"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Message Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('email')}
              className={`w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'email'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Mail className="h-5 w-5 inline mr-2" />
              Email ({getRecipientsByType('email').length})
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'sms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Phone className="h-5 w-5 inline mr-2" />
              SMS ({getRecipientsByType('sms').length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Choose Template (Optional)
            </label>
            <select
              value={activeTab === 'email' ? emailData.templateId || '' : smsData.templateId || ''}
              onChange={(e) => {
                const templateId = e.target.value;
                if (templateId) {
                  loadTemplate(activeTab, templateId);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a template...</option>
              {(activeTab === 'email' ? templates.email : templates.sms).map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Email Composer */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => handleEmailChange('subject', e.target.value)}
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Body
                </label>
                <textarea
                  value={emailData.body}
                  onChange={(e) => handleEmailChange('body', e.target.value)}
                  placeholder="Enter your email message. Use {name}, {companyName}, {senderName}, {customMessage}, {eventName} for personalization."
                  rows={8}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isOverLimit() ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <div className={`text-sm mt-1 ${isOverLimit() ? 'text-red-600' : 'text-gray-500'}`}>
                  {getCharacterCount()}/{getCharacterLimit()} characters
                </div>
              </div>
            </div>
          )}

          {/* SMS Composer */}
          {activeTab === 'sms' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMS Message
                </label>
                <textarea
                  value={smsData.body}
                  onChange={(e) => handleSmsChange('body', e.target.value)}
                  placeholder="Enter your SMS message. Use {name}, {companyName}, {senderName}, {customMessage}, {eventName} for personalization. Keep it under 160 characters."
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isOverLimit() ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <div className={`text-sm mt-1 ${isOverLimit() ? 'text-red-600' : 'text-gray-500'}`}>
                  {getCharacterCount()}/{getCharacterLimit()} characters
                  {isOverLimit() && ' (Message too long!)'}
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedContacts.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Message Preview</h4>
              <div className="text-sm text-gray-600 mb-2">
                Preview for: {selectedContacts[0]?.name}
              </div>
              <div className="bg-white p-3 rounded border text-sm">
                {activeTab === 'email' && emailData.subject && (
                  <div className="font-medium mb-2">
                    Subject: {messageService.replacePlaceholders(emailData.subject, { name: selectedContacts[0]?.name, ...senderInfo })}
                  </div>
                )}
                <div className="whitespace-pre-wrap">
                  {previewMessage(selectedContacts[0])}
                </div>
              </div>
            </div>
          )}

          {/* Send Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSend}
              disabled={isSending || selectedContacts.length === 0 || isOverLimit() || getRecipientsByType(activeTab).length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send {activeTab === 'email' ? 'Emails' : 'SMS'} ({getRecipientsByType(activeTab).length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Send Results */}
      {sendResults && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sendResults.total}</div>
              <div className="text-sm text-blue-600">Total Sent</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sendResults.successful.length}</div>
              <div className="text-sm text-green-600">Successful</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{sendResults.failed.length}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
          </div>

          {sendResults.failed.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Failed Deliveries:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {sendResults.failed.map((failure, index) => (
                  <li key={index}>
                    {failure.name} ({failure.email || failure.phone}): {failure.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageComposerComponent;
