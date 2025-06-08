# Outreach Dashboard - User Guide

## Overview
The Outreach Dashboard is a comprehensive contact management and messaging system that allows you to upload CSV contact lists, manage contacts, and send personalized emails and SMS messages.

## Features

### 🔄 CSV Upload & Validation
- Drag-and-drop CSV file upload
- Automatic validation of email and phone formats
- Real-time data preview and statistics
- Support for various CSV column names (email, mail, phone, mobile, name, etc.)

### 📊 Contact Management
- View all uploaded contacts in an organized list
- Search contacts by name, email, or phone
- Filter contacts by email/phone availability
- Bulk selection for messaging campaigns
- Pagination for large contact lists

### ✉️ Message Composition
- **Email Mode**: Rich text email composer with subject lines
- **SMS Mode**: Character-limited SMS composer (160 chars)
- Pre-built message templates for quick campaigns
- Dynamic placeholder replacement ({{name}}, {{email}}, etc.)
- Real-time recipient count and character counting

### 📈 Campaign Analytics
- Visual charts showing message distribution and campaign history
- Campaign statistics (total sent, success rates, etc.)
- Historical campaign tracking with detailed metrics
- Filterable time periods (7 days, 30 days, 90 days, all time)

## Getting Started

### 1. Upload Contacts
1. Navigate to the **Upload Contacts** tab
2. Drag and drop your CSV file or click to browse
3. Ensure your CSV contains columns for:
   - Name (name, first_name, last_name)
   - Email (email, email_address, mail)
   - Phone (phone, mobile, phone_number)
4. Review validation results and data preview
5. Valid contacts are automatically processed and saved

### 2. Manage Contacts
1. Go to the **Contacts** tab to view uploaded contacts
2. Use the search bar to find specific contacts
3. Filter by email/phone availability using dropdown filters
4. Select contacts for messaging by checking the boxes
5. Use "Select All" for bulk operations

### 3. Compose Messages
1. Select contacts from the Contacts tab (they'll appear in "Compose" tab)
2. Choose between **Email** or **SMS** mode
3. Select a template or write a custom message
4. Use placeholders like {{name}} for personalization
5. Preview your message and send to selected contacts

### 4. View Analytics
1. Visit the **Analytics** tab to see campaign performance
2. Review charts showing message distribution and history
3. Check success rates and total messages sent
4. Filter by time period to analyze trends
5. View detailed campaign history table

## CSV Format Requirements

### Required Columns
Your CSV must contain at least one of:
- Email column: `email`, `email_address`, `mail`
- Phone column: `phone`, `mobile`, `phone_number`, `number`

### Optional Columns
- Name column: `name`, `first_name`, `last_name`
- Any additional columns for custom data

### Sample CSV Format
```csv
name,email,phone
John Doe,john.doe@example.com,+1-555-123-4567
Jane Smith,jane.smith@gmail.com,555-234-5678
Bob Johnson,bob.johnson@yahoo.com,+1 (555) 345-6789
```

### File Requirements
- Format: `.csv` files only
- Size: Maximum 10MB
- Encoding: UTF-8 recommended

## Message Templates

### Email Templates
- **Welcome**: Professional welcome message for new contacts
- **Follow-up**: Gentle follow-up for previous interactions
- **Newsletter**: Regular updates and news
- **Promotion**: Marketing and promotional content

### SMS Templates
- **Quick Hello**: Brief greeting message
- **Reminder**: Appointment or event reminders
- **Update**: Short status updates
- **Thank You**: Appreciation messages

## Personalization Placeholders

Use these placeholders in your messages for automatic personalization:
- `{{name}}`: Contact's name
- `{{email}}`: Contact's email address
- `{{phone}}`: Contact's phone number

## Tips for Success

### CSV Upload
- ✅ Use clear column headers (name, email, phone)
- ✅ Remove empty rows and columns
- ✅ Ensure email formats are valid (user@domain.com)
- ✅ Format phone numbers consistently
- ❌ Avoid special characters in CSV structure

### Message Composition
- ✅ Keep SMS messages under 160 characters
- ✅ Test messages with a small group first
- ✅ Use personalization for better engagement
- ✅ Include clear call-to-action
- ❌ Don't send too many messages at once

### Contact Management
- ✅ Regularly clean and update contact lists
- ✅ Remove invalid or bounced contacts
- ✅ Segment contacts for targeted campaigns
- ✅ Keep backup of your contact data

## Troubleshooting

### CSV Upload Issues
- **"Invalid CSV format"**: Ensure file is properly formatted CSV
- **"No valid contacts found"**: Check email/phone format in your CSV
- **"File too large"**: Reduce file size or split into multiple files

### Message Sending Issues
- **"No contacts selected"**: Select contacts in the Contacts tab first
- **"Message too long"**: SMS messages must be under 160 characters
- **"Invalid template"**: Check for proper placeholder syntax

### General Issues
- **Data not loading**: Refresh the page and try again
- **Slow performance**: Reduce number of contacts or clear browser cache
- **Display issues**: Ensure browser is up to date

## Data Privacy & Security

- All contact data is stored locally in your browser
- No data is transmitted to external servers without your action
- Clear browser data to remove all contacts and campaign history
- Messages are simulated - integrate with real service providers for actual sending

## Support

For additional help or to report issues:
1. Check the troubleshooting section above
2. Review error messages for specific guidance
3. Ensure all required fields are properly formatted
4. Contact your system administrator for technical support

---

**Version**: 1.0.0  
**Last Updated**: June 2025
