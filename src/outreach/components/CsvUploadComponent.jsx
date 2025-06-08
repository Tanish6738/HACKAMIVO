import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { validateCsvStructure, cleanContactData } from '../utils/csvValidator';

const CsvUploadComponent = ({ onDataUpload, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const fileInputRef = useRef(null);

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row = { _id: index };
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      return row;
    });

    return data;
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      onError?.('Please select a valid CSV file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      onError?.('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      
      if (csvData.length === 0) {
        throw new Error('CSV file is empty or invalid');
      }

      // Validate the CSV structure
      const validation = validateCsvStructure(csvData);
      setValidationResult(validation);

      if (validation.isValid) {
        const cleanedData = cleanContactData(csvData);
        setPreviewData(cleanedData.slice(0, 5)); // Show first 5 rows as preview
        
        // Call the parent callback with cleaned data
        onDataUpload?.(cleanedData, validation.stats);
      }

    } catch (error) {
      console.error('Error processing CSV:', error);
      onError?.(`Error processing CSV: ${error.message}`);
      setValidationResult(null);
      setPreviewData(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setValidationResult(null);
    setPreviewData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : uploadedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Processing CSV file...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg font-medium text-gray-900">{uploadedFile.name}</p>
            <p className="text-gray-500 mb-4">File uploaded successfully</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearUpload();
              }}
              className="text-red-600 hover:text-red-800 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your CSV file here, or click to browse
            </p>
            <p className="text-gray-500 mb-4">
              CSV should contain email and/or phone number columns
            </p>
            <div className="text-sm text-gray-400">
              Supported formats: .csv (max 10MB)
            </div>
          </div>
        )}
      </div>

      {/* Validation Results */}
      {validationResult && (
        <div className={`rounded-lg p-4 ${validationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center mb-3">
            {validationResult.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <h3 className={`font-medium ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
              {validationResult.isValid ? 'Validation Successful' : 'Validation Failed'}
            </h3>
          </div>

          {/* Statistics */}
          {validationResult.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{validationResult.stats.totalRows}</div>
                <div className="text-sm text-gray-600">Total Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{validationResult.stats.validEmails}</div>
                <div className="text-sm text-gray-600">Valid Emails</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{validationResult.stats.validPhones}</div>
                <div className="text-sm text-gray-600">Valid Phones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{validationResult.stats.totalValid}</div>
                <div className="text-sm text-gray-600">Total Valid</div>
              </div>
            </div>
          )}

          {/* Errors */}
          {validationResult.errors?.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
              <ul className="list-disc list-inside space-y-1">
                {validationResult.errors.map((error, index) => (
                  <li key={index} className="text-red-700 text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {validationResult.warnings?.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Warnings:</h4>
              <ul className="list-disc list-inside space-y-1">
                {validationResult.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-700 text-sm">{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Preview Data */}
      {previewData && previewData.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Data Preview (First 5 rows)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{row.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {row.email && (
                        <span className={row.hasEmail ? 'text-green-600' : 'text-red-600'}>
                          {row.email}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {row.phone && (
                        <span className={row.hasPhone ? 'text-green-600' : 'text-red-600'}>
                          {row.phone}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex gap-1">
                        {row.hasEmail && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Email ✓
                          </span>
                        )}
                        {row.hasPhone && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Phone ✓
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvUploadComponent;
