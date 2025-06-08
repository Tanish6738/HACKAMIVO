// Message service for handling email and SMS outreach
class MessageService {
  constructor() {
    this.messageHistory = [];
    this.campaignHistory = []; // Add campaign history storage
    this.templates = {
      email: [
        {
          id: 1,
          name: 'Professional Introduction',
          subject: 'Introduction from {companyName}',
          body: `Hi {name},

I hope this email finds you well. My name is {senderName} from {companyName}.

{customMessage}

I'd love to connect and discuss how we can help you achieve your goals.

Best regards,
{senderName}
{companyName}`
        },
        {
          id: 2,
          name: 'Product Promotion',
          subject: 'Exclusive offer for {name}',
          body: `Dear {name},

We have an exclusive offer that might interest you.

{customMessage}

Don't miss out on this limited-time opportunity!

Best regards,
{senderName}`
        },
        {
          id: 3,
          name: 'Event Invitation',
          subject: 'You\'re invited: {eventName}',
          body: `Hi {name},

You're cordially invited to {eventName}.

{customMessage}

We hope to see you there!

Best regards,
{senderName}`
        }
      ],
      sms: [
        {
          id: 1,
          name: 'Quick Introduction',
          body: 'Hi {name}, this is {senderName} from {companyName}. {customMessage} Reply STOP to opt out.'
        },
        {
          id: 2,
          name: 'Promotional SMS',
          body: 'Hey {name}! {customMessage} Limited time offer. Reply STOP to opt out.'
        },
        {
          id: 3,
          name: 'Event Reminder',
          body: 'Hi {name}, reminder about {eventName}. {customMessage} Reply STOP to opt out.'
        }
      ]
    };
  }

  // Replace placeholders in message templates
  replacePlaceholders(template, data) {
    let message = template;
    Object.keys(data).forEach(key => {
      const placeholder = `{${key}}`;
      message = message.replace(new RegExp(placeholder, 'g'), data[key] || '');
    });
    return message;
  }

  // Validate email message
  validateEmailMessage(messageData) {
    const errors = [];
    
    if (!messageData.subject || messageData.subject.trim().length === 0) {
      errors.push('Email subject is required');
    }
    
    if (!messageData.body || messageData.body.trim().length === 0) {
      errors.push('Email body is required');
    }
    
    if (messageData.body && messageData.body.length > 10000) {
      errors.push('Email body is too long (max 10,000 characters)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate SMS message
  validateSmsMessage(messageData) {
    const errors = [];
    
    if (!messageData.body || messageData.body.trim().length === 0) {
      errors.push('SMS message is required');
    }
    
    if (messageData.body && messageData.body.length > 160) {
      errors.push('SMS message is too long (max 160 characters)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Simulate sending email (in real app, this would integrate with email service)
  async sendEmail(recipients, messageData, senderInfo) {
    const validation = this.validateEmailMessage(messageData);
    if (!validation.isValid) {
      throw new Error(`Email validation failed: ${validation.errors.join(', ')}`);
    }

    const results = {
      successful: [],
      failed: [],
      total: recipients.length
    };

    for (const recipient of recipients) {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const personalizedSubject = this.replacePlaceholders(messageData.subject, {
          name: recipient.name,
          ...senderInfo
        });
        
        const personalizedBody = this.replacePlaceholders(messageData.body, {
          name: recipient.name,
          ...senderInfo
        });

        // Simulate random failures (5% failure rate)
        if (Math.random() < 0.05) {
          throw new Error('Delivery failed');
        }

        const emailRecord = {
          id: Date.now() + Math.random(),
          type: 'email',
          recipient: recipient.email,
          recipientName: recipient.name,
          subject: personalizedSubject,
          body: personalizedBody,
          status: 'sent',
          timestamp: new Date().toISOString(),
          senderInfo
        };

        this.messageHistory.push(emailRecord);
        results.successful.push({
          email: recipient.email,
          name: recipient.name,
          messageId: emailRecord.id
        });

      } catch (error) {
        results.failed.push({
          email: recipient.email,
          name: recipient.name,
          error: error.message
        });
      }
    }

    return results;
  }

  // Simulate sending SMS (in real app, this would integrate with SMS service)
  async sendSms(recipients, messageData, senderInfo) {
    const validation = this.validateSmsMessage(messageData);
    if (!validation.isValid) {
      throw new Error(`SMS validation failed: ${validation.errors.join(', ')}`);
    }

    const results = {
      successful: [],
      failed: [],
      total: recipients.length
    };

    for (const recipient of recipients) {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const personalizedMessage = this.replacePlaceholders(messageData.body, {
          name: recipient.name,
          ...senderInfo
        });

        // Simulate random failures (3% failure rate)
        if (Math.random() < 0.03) {
          throw new Error('SMS delivery failed');
        }

        const smsRecord = {
          id: Date.now() + Math.random(),
          type: 'sms',
          recipient: recipient.phone,
          recipientName: recipient.name,
          body: personalizedMessage,
          status: 'sent',
          timestamp: new Date().toISOString(),
          senderInfo
        };

        this.messageHistory.push(smsRecord);
        results.successful.push({
          phone: recipient.phone,
          name: recipient.name,
          messageId: smsRecord.id
        });

      } catch (error) {
        results.failed.push({
          phone: recipient.phone,
          name: recipient.name,
          error: error.message
        });
      }
    }

    return results;
  }

  // Get message templates
  getTemplates(type = 'both') {
    if (type === 'email') return this.templates.email;
    if (type === 'sms') return this.templates.sms;
    return this.templates;
  }

  // Get message history
  getMessageHistory(filter = {}) {
    let history = [...this.messageHistory];

    if (filter.type) {
      history = history.filter(msg => msg.type === filter.type);
    }

    if (filter.status) {
      history = history.filter(msg => msg.status === filter.status);
    }

    if (filter.dateFrom) {
      history = history.filter(msg => new Date(msg.timestamp) >= new Date(filter.dateFrom));
    }

    if (filter.dateTo) {
      history = history.filter(msg => new Date(msg.timestamp) <= new Date(filter.dateTo));
    }

    return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Record a campaign
  recordCampaign(campaignData) {
    const campaign = {
      id: Date.now() + Math.random(),
      ...campaignData,
      timestamp: campaignData.timestamp || new Date().toISOString()
    };
    this.campaignHistory.push(campaign);
    return campaign;
  }

  // Get campaign history
  getCampaignHistory(filter = {}) {
    let history = [...this.campaignHistory];

    if (filter.type) {
      history = history.filter(campaign => campaign.type === filter.type);
    }

    if (filter.status) {
      history = history.filter(campaign => campaign.status === filter.status);
    }

    if (filter.dateFrom) {
      history = history.filter(campaign => new Date(campaign.timestamp) >= new Date(filter.dateFrom));
    }

    if (filter.dateTo) {
      history = history.filter(campaign => new Date(campaign.timestamp) <= new Date(filter.dateTo));
    }

    return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Get campaign statistics
  getCampaignStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayMessages = this.messageHistory.filter(msg => 
      new Date(msg.timestamp) >= today
    );
    
    const weekMessages = this.messageHistory.filter(msg => 
      new Date(msg.timestamp) >= thisWeek
    );
    
    const monthMessages = this.messageHistory.filter(msg => 
      new Date(msg.timestamp) >= thisMonth
    );

    return {
      total: {
        sent: this.messageHistory.length,
        emails: this.messageHistory.filter(msg => msg.type === 'email').length,
        sms: this.messageHistory.filter(msg => msg.type === 'sms').length
      },
      today: {
        sent: todayMessages.length,
        emails: todayMessages.filter(msg => msg.type === 'email').length,
        sms: todayMessages.filter(msg => msg.type === 'sms').length
      },
      thisWeek: {
        sent: weekMessages.length,
        emails: weekMessages.filter(msg => msg.type === 'email').length,
        sms: weekMessages.filter(msg => msg.type === 'sms').length
      },
      thisMonth: {
        sent: monthMessages.length,
        emails: monthMessages.filter(msg => msg.type === 'email').length,
        sms: monthMessages.filter(msg => msg.type === 'sms').length
      }
    };
  }
}

// Create singleton instance
const messageService = new MessageService();
export default messageService;
