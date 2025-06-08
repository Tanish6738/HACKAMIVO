// CSV validation utility for outreach contacts
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Check if it's a valid length (10-15 digits)
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

export const validateCsvStructure = (csvData) => {
  const errors = [];
  const warnings = [];
  
  if (!csvData || csvData.length === 0) {
    errors.push('CSV file is empty');
    return { isValid: false, errors, warnings };
  }

  // Check for required columns
  const headers = Object.keys(csvData[0]).map(h => h.toLowerCase().trim());
  const hasEmail = headers.some(h => h.includes('email') || h.includes('mail'));
  const hasPhone = headers.some(h => h.includes('phone') || h.includes('mobile') || h.includes('number'));
  const hasName = headers.some(h => h.includes('name') || h.includes('first') || h.includes('last'));

  if (!hasEmail && !hasPhone) {
    errors.push('CSV must contain at least one email or phone column');
  }

  if (!hasName) {
    warnings.push('No name column detected. Consider adding a name column for better personalization');
  }

  // Validate data rows
  let validEmails = 0;
  let validPhones = 0;
  let invalidEmails = 0;
  let invalidPhones = 0;

  csvData.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because array is 0-indexed and CSV has header row
    
    // Find email column
    const emailColumn = Object.keys(row).find(key => 
      key.toLowerCase().includes('email') || key.toLowerCase().includes('mail')
    );
    
    // Find phone column
    const phoneColumn = Object.keys(row).find(key => 
      key.toLowerCase().includes('phone') || 
      key.toLowerCase().includes('mobile') || 
      key.toLowerCase().includes('number')
    );

    if (emailColumn && row[emailColumn]) {
      if (validateEmail(row[emailColumn].trim())) {
        validEmails++;
      } else {
        invalidEmails++;
        if (invalidEmails <= 5) { // Only show first 5 errors
          errors.push(`Invalid email format in row ${rowNumber}: ${row[emailColumn]}`);
        }
      }
    }

    if (phoneColumn && row[phoneColumn]) {
      if (validatePhoneNumber(row[phoneColumn].toString().trim())) {
        validPhones++;
      } else {
        invalidPhones++;
        if (invalidPhones <= 5) { // Only show first 5 errors
          errors.push(`Invalid phone format in row ${rowNumber}: ${row[phoneColumn]}`);
        }
      }
    }
  });

  // Summary warnings
  if (invalidEmails > 5) {
    warnings.push(`${invalidEmails - 5} more invalid email addresses found`);
  }
  
  if (invalidPhones > 5) {
    warnings.push(`${invalidPhones - 5} more invalid phone numbers found`);
  }

  const totalValid = validEmails + validPhones;
  const totalInvalid = invalidEmails + invalidPhones;

  if (totalValid === 0) {
    errors.push('No valid email addresses or phone numbers found');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalRows: csvData.length,
      validEmails,
      invalidEmails,
      validPhones,
      invalidPhones,
      totalValid,
      totalInvalid
    }
  };
};

export const cleanContactData = (csvData) => {
  return csvData.map((row, index) => {
    const cleanedRow = { ...row, _rowId: index };
    
    // Find and clean email
    const emailColumn = Object.keys(row).find(key => 
      key.toLowerCase().includes('email') || key.toLowerCase().includes('mail')
    );
    if (emailColumn && row[emailColumn]) {
      cleanedRow.email = row[emailColumn].trim().toLowerCase();
      cleanedRow.hasEmail = validateEmail(cleanedRow.email);
    }

    // Find and clean phone
    const phoneColumn = Object.keys(row).find(key => 
      key.toLowerCase().includes('phone') || 
      key.toLowerCase().includes('mobile') || 
      key.toLowerCase().includes('number')
    );
    if (phoneColumn && row[phoneColumn]) {
      cleanedRow.phone = row[phoneColumn].toString().trim();
      cleanedRow.hasPhone = validatePhoneNumber(cleanedRow.phone);
    }

    // Find and clean name
    const nameColumn = Object.keys(row).find(key => 
      key.toLowerCase().includes('name')
    );
    const firstNameColumn = Object.keys(row).find(key => 
      key.toLowerCase().includes('first')
    );
    const lastNameColumn = Object.keys(row).find(key => 
      key.toLowerCase().includes('last')
    );

    if (nameColumn) {
      cleanedRow.name = row[nameColumn].trim();
    } else if (firstNameColumn || lastNameColumn) {
      const firstName = firstNameColumn ? row[firstNameColumn].trim() : '';
      const lastName = lastNameColumn ? row[lastNameColumn].trim() : '';
      cleanedRow.name = `${firstName} ${lastName}`.trim();
    } else {
      cleanedRow.name = cleanedRow.email ? cleanedRow.email.split('@')[0] : 'Unknown';
    }

    return cleanedRow;
  }).filter(row => row.hasEmail || row.hasPhone); // Only keep rows with valid contact info
};
