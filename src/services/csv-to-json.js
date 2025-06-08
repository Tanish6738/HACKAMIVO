/**
 * CSV to JSON Converter Utility
 * Provides functions to convert CSV data to JSON format
 */

/**
 * Parses a CSV string and converts it to JSON array
 * @param {string} csvString - The CSV data as a string
 * @param {Object} options - Configuration options
 * @param {string} options.delimiter - CSV delimiter (default: ',')
 * @param {boolean} options.hasHeaders - Whether the first row contains headers (default: true)
 * @param {boolean} options.skipEmptyLines - Whether to skip empty lines (default: true)
 * @param {boolean} options.trimValues - Whether to trim whitespace from values (default: true)
 * @returns {Array} Array of objects representing the CSV data
 */
export function csvStringToJson(csvString, options = {}) {
  const {
    delimiter = ',',
    hasHeaders = true,
    skipEmptyLines = true,
    trimValues = true
  } = options;

  try {
    // Split CSV into lines
    const lines = csvString.split(/\r?\n/);
    
    // Filter out empty lines if requested
    const filteredLines = skipEmptyLines 
      ? lines.filter(line => line.trim() !== '') 
      : lines;

    if (filteredLines.length === 0) {
      return [];
    }

    // Parse CSV with proper handling of quoted values
    const parsedRows = filteredLines.map(line => parseCSVLine(line, delimiter, trimValues));
    
    // Get headers
    let headers;
    let dataRows;
    
    if (hasHeaders) {
      headers = parsedRows[0];
      dataRows = parsedRows.slice(1);
    } else {
      // Generate generic headers if none provided
      const maxColumns = Math.max(...parsedRows.map(row => row.length));
      headers = Array.from({ length: maxColumns }, (_, i) => `column_${i + 1}`);
      dataRows = parsedRows;
    }

    // Convert to JSON objects
    const jsonData = dataRows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        const value = row[index] || '';
        // Try to convert numeric values
        obj[header] = convertValue(value);
      });
      return obj;
    });

    return jsonData;
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${error.message}`);
  }
}

/**
 * Parses a single CSV line handling quoted values and escaped characters
 * @param {string} line - The CSV line to parse
 * @param {string} delimiter - The delimiter character
 * @param {boolean} trimValues - Whether to trim whitespace
 * @returns {Array} Array of values from the line
 */
function parseCSVLine(line, delimiter, trimValues) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      result.push(trimValues ? current.trim() : current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Add the last field
  result.push(trimValues ? current.trim() : current);
  
  return result;
}

/**
 * Attempts to convert string values to appropriate types
 * @param {string} value - The string value to convert
 * @returns {any} The converted value
 */
function convertValue(value) {
  if (value === '') return '';
  
  // Check for boolean values
  const lowerValue = value.toLowerCase();
  if (lowerValue === 'true' || lowerValue === 'false') {
    return lowerValue === 'true';
  }
  
  // Check for null/undefined values
  if (lowerValue === 'null' || lowerValue === 'undefined') {
    return null;
  }
  
  // Check for numeric values
  if (!isNaN(value) && !isNaN(parseFloat(value))) {
    const num = parseFloat(value);
    // Return integer if it's a whole number, otherwise float
    return num % 1 === 0 ? parseInt(value, 10) : num;
  }
  
  // Return as string
  return value;
}

/**
 * Converts a CSV file to JSON
 * @param {File} file - The CSV file object
 * @param {Object} options - Configuration options (same as csvStringToJson)
 * @returns {Promise<Array>} Promise that resolves to JSON array
 */
export function csvFileToJson(file, options = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      reject(new Error('File must be a CSV file'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvString = event.target.result;
        const jsonData = csvStringToJson(csvString, options);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Converts JSON array back to CSV string
 * @param {Array} jsonArray - Array of objects to convert
 * @param {Object} options - Configuration options
 * @param {string} options.delimiter - CSV delimiter (default: ',')
 * @param {boolean} options.includeHeaders - Whether to include headers (default: true)
 * @param {Array} options.fields - Specific fields to include (default: all fields)
 * @returns {string} CSV string
 */
export function jsonToCsvString(jsonArray, options = {}) {
  const {
    delimiter = ',',
    includeHeaders = true,
    fields = null
  } = options;

  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    return '';
  }

  // Get all unique fields if not specified
  const allFields = fields || [...new Set(jsonArray.flatMap(obj => Object.keys(obj)))];
  
  const csvLines = [];
  
  // Add headers if requested
  if (includeHeaders) {
    csvLines.push(allFields.map(field => escapeCSVValue(field, delimiter)).join(delimiter));
  }
  
  // Add data rows
  jsonArray.forEach(obj => {
    const row = allFields.map(field => {
      const value = obj[field];
      return escapeCSVValue(value !== undefined ? String(value) : '', delimiter);
    });
    csvLines.push(row.join(delimiter));
  });
  
  return csvLines.join('\n');
}

/**
 * Escapes a CSV value by adding quotes if necessary
 * @param {string} value - The value to escape
 * @param {string} delimiter - The delimiter character
 * @returns {string} The escaped value
 */
function escapeCSVValue(value, delimiter) {
  // Add quotes if value contains delimiter, quotes, or newlines
  if (value.includes(delimiter) || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    // Escape quotes by doubling them
    const escapedValue = value.replace(/"/g, '""');
    return `"${escapedValue}"`;
  }
  return value;
}

/**
 * Downloads JSON data as a CSV file
 * @param {Array} jsonArray - Array of objects to download
 * @param {string} filename - Name of the file (default: 'data.csv')
 * @param {Object} options - Configuration options (same as jsonToCsvString)
 */
export function downloadJsonAsCsv(jsonArray, filename = 'data.csv', options = {}) {
  try {
    const csvString = jsonToCsvString(jsonArray, options);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`Failed to download CSV: ${error.message}`);
  }
}

/**
 * Validates CSV data structure
 * @param {string} csvString - The CSV string to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateCsvData(csvString, options = {}) {
  const errors = [];
  
  try {
    if (!csvString || csvString.trim() === '') {
      errors.push('CSV data is empty');
      return { isValid: false, errors };
    }
    
    const lines = csvString.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      errors.push('No valid data lines found');
      return { isValid: false, errors };
    }
    
    // Check if all rows have the same number of columns
    const columnCounts = lines.map(line => parseCSVLine(line, options.delimiter || ',', false).length);
    const firstRowColumns = columnCounts[0];
    
    columnCounts.forEach((count, index) => {
      if (count !== firstRowColumns) {
        errors.push(`Row ${index + 1} has ${count} columns, expected ${firstRowColumns}`);
      }
    });
    
    return { isValid: errors.length === 0, errors };
  } catch (error) {
    errors.push(`Validation error: ${error.message}`);
    return { isValid: false, errors };
  }
}

/**
 * Gets basic statistics about CSV data
 * @param {Array} jsonData - JSON array converted from CSV
 * @returns {Object} Statistics object
 */
export function getCsvStatistics(jsonData) {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return {
      totalRows: 0,
      totalColumns: 0,
      columnNames: [],
      columnTypes: {},
      emptyValues: 0
    };
  }
  
  const columnNames = Object.keys(jsonData[0]);
  const columnTypes = {};
  let emptyValues = 0;
  
  // Analyze column types
  columnNames.forEach(column => {
    const values = jsonData.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
    
    if (values.length === 0) {
      columnTypes[column] = 'empty';
      return;
    }
    
    const types = values.map(val => {
      if (typeof val === 'number') return 'number';
      if (typeof val === 'boolean') return 'boolean';
      if (!isNaN(val) && !isNaN(parseFloat(val))) return 'number';
      return 'string';
    });
    
    // Determine most common type
    const typeCounts = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    columnTypes[column] = Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b
    );
  });
  
  // Count empty values
  jsonData.forEach(row => {
    Object.values(row).forEach(value => {
      if (value === null || value === undefined || value === '') {
        emptyValues++;
      }
    });
  });
  
  return {
    totalRows: jsonData.length,
    totalColumns: columnNames.length,
    columnNames,
    columnTypes,
    emptyValues
  };
}

// Export default object with all functions
export default {
  csvStringToJson,
  csvFileToJson,
  jsonToCsvString,
  downloadJsonAsCsv,
  validateCsvData,
  getCsvStatistics
};
