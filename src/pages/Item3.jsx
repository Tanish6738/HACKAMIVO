import React, { useState, useRef } from 'react';
import { 
  csvFileToJson, 
  csvStringToJson, 
  jsonToCsvString, 
  downloadJsonAsCsv, 
  validateCsvData, 
  getCsvStatistics 
} from '../services/csv-to-json.js';

const Item7 = () => {
  const [csvData, setCsvData] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [validation, setValidation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'text'
  const [conversionOptions, setConversionOptions] = useState({
    delimiter: ',',
    hasHeaders: true,
    skipEmptyLines: true,
    trimValues: true
  });
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await csvFileToJson(file, conversionOptions);
      setJsonData(result);
      setStatistics(getCsvStatistics(result));
      setSuccess(`Successfully converted ${result.length} rows from CSV to JSON!`);
    } catch (err) {
      setError(`Error converting file: ${err.message}`);
      setJsonData(null);
      setStatistics(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle text input conversion
  const handleTextConversion = () => {
    if (!csvData.trim()) {
      setError('Please enter CSV data');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate CSV data first
      const validationResult = validateCsvData(csvData, conversionOptions);
      setValidation(validationResult);

      if (!validationResult.isValid) {
        setError(`CSV validation failed: ${validationResult.errors.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // Convert to JSON
      const result = csvStringToJson(csvData, conversionOptions);
      setJsonData(result);
      setStatistics(getCsvStatistics(result));
      setSuccess(`Successfully converted ${result.length} rows from CSV to JSON!`);
    } catch (err) {
      setError(`Error converting data: ${err.message}`);
      setJsonData(null);
      setStatistics(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Download JSON as file
  const downloadJson = () => {
    if (!jsonData) return;

    try {
      const dataStr = JSON.stringify(jsonData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted-data.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Error downloading JSON: ${err.message}`);
    }
  };

  // Download as CSV (convert back)
  const downloadCsv = () => {
    if (!jsonData) return;

    try {
      downloadJsonAsCsv(jsonData, 'converted-data.csv', {
        delimiter: conversionOptions.delimiter,
        includeHeaders: conversionOptions.hasHeaders
      });
    } catch (err) {
      setError(`Error downloading CSV: ${err.message}`);
    }
  };

  // Clear all data
  const clearData = () => {
    setCsvData('');
    setJsonData(null);
    setStatistics(null);
    setValidation(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <h1 className="text-4xl font-bold text-gray-900">CSV to JSON Converter</h1>
          </div>
          <p className="text-xl text-gray-600">Convert your CSV data to JSON format with advanced options</p>
        </div>

        {/* Input Method Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'file'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'text'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                CSV Input
              </h2>

              {/* File Upload Tab */}
              {activeTab === 'file' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-sm text-gray-600 mb-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                          Click to upload a CSV file
                        </span>
                        <input
                          id="file-upload"
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">CSV files only, up to 10MB</p>
                  </div>
                </div>
              )}

              {/* Text Input Tab */}
              {activeTab === 'text' && (
                <div className="space-y-4">
                  <textarea
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    placeholder="Paste your CSV data here...&#10;Example:&#10;name,email,age&#10;John Doe,john@example.com,30&#10;Jane Smith,jane@example.com,25"
                    className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  />
                  <button
                    onClick={handleTextConversion}
                    disabled={isLoading || !csvData.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Converting...' : 'Convert to JSON'}
                  </button>
                </div>
              )}

              {/* Messages */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              )}

              {/* Validation Errors */}
              {validation && !validation.isValid && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Validation Issues:</h4>
                  <ul className="text-sm text-yellow-700 list-disc list-inside">
                    {validation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Options Panel */}
          <div className="space-y-6">
            {/* Conversion Options */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Options
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delimiter
                  </label>
                  <select
                    value={conversionOptions.delimiter}
                    onChange={(e) => setConversionOptions(prev => ({ ...prev, delimiter: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionOptions.hasHeaders}
                      onChange={(e) => setConversionOptions(prev => ({ ...prev, hasHeaders: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">First row contains headers</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionOptions.skipEmptyLines}
                      onChange={(e) => setConversionOptions(prev => ({ ...prev, skipEmptyLines: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Skip empty lines</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionOptions.trimValues}
                      onChange={(e) => setConversionOptions(prev => ({ ...prev, trimValues: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Trim whitespace</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {statistics && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Rows:</span>
                    <span className="text-sm font-medium">{statistics.totalRows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Columns:</span>
                    <span className="text-sm font-medium">{statistics.totalColumns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Empty Values:</span>
                    <span className="text-sm font-medium">{statistics.emptyValues}</span>
                  </div>
                  
                  {statistics.columnNames.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Column Types:</p>
                      <div className="space-y-1">
                        {statistics.columnNames.slice(0, 5).map(column => (
                          <div key={column} className="flex justify-between text-xs">
                            <span className="text-gray-600 truncate mr-2">{column}:</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              statistics.columnTypes[column] === 'number' ? 'bg-blue-100 text-blue-800' :
                              statistics.columnTypes[column] === 'boolean' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {statistics.columnTypes[column]}
                            </span>
                          </div>
                        ))}
                        {statistics.columnNames.length > 5 && (
                          <p className="text-xs text-gray-500">+{statistics.columnNames.length - 5} more columns</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {jsonData && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={downloadJson}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Download JSON
                  </button>
                  <button
                    onClick={downloadCsv}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Download as CSV
                  </button>
                  <button
                    onClick={clearData}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* JSON Output */}
        {jsonData && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                JSON Output ({jsonData.length} records)
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
                    setSuccess('JSON copied to clipboard!');
                    setTimeout(() => setSuccess(''), 3000);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Copy JSON
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(jsonData.slice(0, 10), null, 2)}
                {jsonData.length > 10 && (
                  <div className="text-gray-500 italic mt-2">
                    ... and {jsonData.length - 10} more records
                  </div>
                )}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700 text-center">Converting CSV to JSON...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item7;