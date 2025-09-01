import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaFileCsv, FaFileExcel, FaCheck, FaTimes, FaDownload, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/Upload.css';

const BulkUpload = () => {
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [uploadedData, setUploadedData] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const ministries = [
    { id: 1, name: 'Ministry of Education', code: 'MOE' },
    { id: 2, name: 'Ministry of Health', code: 'MOH' },
    { id: 3, name: 'Kenya Revenue Authority', code: 'KRA' },
    { id: 4, name: 'National Social Security Fund', code: 'NSSF' },
    { id: 5, name: 'Ministry of Interior and National Administration', code: 'MINA' }
  ];

  const requiredFields = [
    { key: 'nationalId', label: 'National ID *', required: true },
    { key: 'payrollNumber', label: 'Payroll/PF Number *', required: true },
    { key: 'kraPin', label: 'KRA PIN Number *', required: true },
    { key: 'nssfNumber', label: 'NSSF Number *', required: true },
    { key: 'shifNumber', label: 'SHIF Number *', required: true },
    { key: 'firstName', label: 'First Name *', required: true },
    { key: 'lastName', label: 'Last Name *', required: true },
    { key: 'email', label: 'Email Address *', required: true },
    { key: 'phone', label: 'Mobile Phone *', required: true },
    { key: 'jobTitle', label: 'Job Title *', required: true },
    { key: 'department', label: 'Department *', required: true }
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      setSelectedFile(file);
      parseFile(file);
    } else {
      alert('Please select a CSV or Excel file');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      parseFile(file);
    }
  };

  const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row = { rowIndex: index + 2 };
          headers.forEach((header, i) => {
            row[header] = values[i] || '';
          });
          return row;
        });
        
        setUploadedData(data.slice(0, 100));
        
        const autoMapping = {};
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase();
          const matchedField = requiredFields.find(field => 
            lowerHeader.includes(field.key.toLowerCase()) ||
            lowerHeader.includes(field.label.toLowerCase().replace(' *', '')) ||
            (field.key === 'nationalId' && (lowerHeader.includes('national') || lowerHeader.includes('id'))) ||
            (field.key === 'payrollNumber' && (lowerHeader.includes('payroll') || lowerHeader.includes('pf'))) ||
            (field.key === 'kraPin' && lowerHeader.includes('kra')) ||
            (field.key === 'nssfNumber' && lowerHeader.includes('nssf')) ||
            (field.key === 'shifNumber' && lowerHeader.includes('shif')) ||
            (field.key === 'firstName' && lowerHeader.includes('first')) ||
            (field.key === 'lastName' && lowerHeader.includes('last')) ||
            (field.key === 'jobTitle' && (lowerHeader.includes('job') || lowerHeader.includes('title') || lowerHeader.includes('position')))
          );
          if (matchedField) {
            autoMapping[matchedField.key] = header;
          }
        });
        
        setFieldMapping(autoMapping);
        setUploadStep(2);
      }
    };
    reader.readAsText(file);
  };

  const validateData = () => {
    const errors = [];
    const seenNationalIds = new Set();
    const seenPayrollNumbers = new Set();
    const seenEmails = new Set();

    uploadedData.forEach((row, index) => {
      const rowErrors = [];
      
      requiredFields.forEach(field => {
        const mappedColumn = fieldMapping[field.key];
        const value = mappedColumn ? row[mappedColumn] : '';
        
        if (field.required && !value) {
          rowErrors.push(`Missing ${field.label}`);
        }
        
        if (value) {
          if (field.key === 'nationalId') {
            if (!/^\d{8}$/.test(value)) {
              rowErrors.push('National ID must be 8 digits');
            }
            if (seenNationalIds.has(value)) {
              rowErrors.push('Duplicate National ID');
            }
            seenNationalIds.add(value);
          }
          
          if (field.key === 'kraPin') {
            if (!/^[A-Z]\d{9}[A-Z]$/.test(value)) {
              rowErrors.push('Invalid KRA PIN format');
            }
          }
          
          if (field.key === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              rowErrors.push('Invalid email format');
            }
            if (seenEmails.has(value)) {
              rowErrors.push('Duplicate email address');
            }
            seenEmails.add(value);
          }
          
          if (field.key === 'phone') {
            if (!/^(\+254|254|0)[7-9]\d{8}$/.test(value.replace(/\s/g, ''))) {
              rowErrors.push('Invalid phone number format');
            }
          }
          
          if (field.key === 'payrollNumber') {
            if (seenPayrollNumbers.has(value)) {
              rowErrors.push('Duplicate payroll number');
            }
            seenPayrollNumbers.add(value);
          }
        }
      });
      
      if (rowErrors.length > 0) {
        errors.push({
          rowIndex: row.rowIndex,
          errors: rowErrors,
          data: row
        });
      }
    });

    setValidationErrors(errors);
    setUploadStep(3);
  };

  const handleUpload = async () => {
    if (!selectedMinistry) {
      alert('Please select a ministry before uploading');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const validData = uploadedData.filter(row => 
      !validationErrors.some(error => error.rowIndex === row.rowIndex)
    );

    for (let i = 0; i < validData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setUploadProgress(((i + 1) / validData.length) * 100);
    }
    
    setIsUploading(false);
    setUploadStep(4);
  };

  const resetUpload = () => {
    setUploadStep(1);
    setSelectedFile(null);
    setUploadedData([]);
    setFieldMapping({});
    setValidationErrors([]);
    setSelectedMinistry('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = requiredFields.map(field => field.label.replace(' *', ''));
    const csvContent = headers.join(',') + '\n' +
      'Sample data will be here,MOE001234,A012345678X,NS001234567,SH001234567,John,Doe,john.doe@ministry.go.ke,+254712345678,Senior Officer,Administration';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bulk-upload">
      <header className="page-header">
        <h1 className="page-title">Bulk Staff Upload</h1>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={downloadTemplate}>
            <FaDownload /> Download Template
          </button>
        </div>
      </header>

      <div className="upload-progress-bar">
        <div className={`progress-step ${uploadStep >= 1 ? 'active' : ''} ${uploadStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select File</div>
        </div>
        <div className={`progress-step ${uploadStep >= 2 ? 'active' : ''} ${uploadStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Map Fields</div>
        </div>
        <div className={`progress-step ${uploadStep >= 3 ? 'active' : ''} ${uploadStep > 3 ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Validate</div>
        </div>
        <div className={`progress-step ${uploadStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Complete</div>
        </div>
      </div>

      {uploadStep === 1 && (
        <div className="upload-step">
          <div className="ministry-selection">
            <h3>Select Ministry/Agency</h3>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="ministry-select"
            >
              <option value="">Choose Ministry/Agency</option>
              {ministries.map(ministry => (
                <option key={ministry.id} value={ministry.id}>
                  {ministry.name} ({ministry.code})
                </option>
              ))}
            </select>
          </div>

          <div 
            className="file-drop-zone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaCloudUploadAlt className="upload-icon" />
            <h3>Drop your file here or click to browse</h3>
            <p>Supports CSV and Excel files (max 100MB)</p>
            <div className="supported-formats">
              <div className="format-item">
                <FaFileCsv /> CSV
              </div>
              <div className="format-item">
                <FaFileExcel /> Excel
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          {selectedFile && (
            <div className="file-info">
              <h4>Selected File:</h4>
              <div className="file-details">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadStep === 2 && (
        <div className="upload-step">
          <h3>Map Your Columns</h3>
          <p>Match your CSV columns to the required fields:</p>
          
          <div className="field-mapping">
            {requiredFields.map(field => (
              <div key={field.key} className="mapping-row">
                <div className="field-info">
                  <label>{field.label}</label>
                  {field.required && <span className="required-mark">*</span>}
                </div>
                <select
                  value={fieldMapping[field.key] || ''}
                  onChange={(e) => setFieldMapping({
                    ...fieldMapping,
                    [field.key]: e.target.value
                  })}
                  className={field.required && !fieldMapping[field.key] ? 'error' : ''}
                >
                  <option value="">Select Column</option>
                  {selectedFile && Object.keys(uploadedData[0] || {})
                    .filter(key => key !== 'rowIndex')
                    .map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="preview-section">
            <h4>Data Preview (First 5 rows):</h4>
            <div className="preview-table-container">
              <table className="preview-table">
                <thead>
                  <tr>
                    {requiredFields.map(field => (
                      <th key={field.key}>
                        {field.label}
                        {fieldMapping[field.key] && (
                          <span className="mapped-column">({fieldMapping[field.key]})</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadedData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      {requiredFields.map(field => (
                        <td key={field.key}>
                          {fieldMapping[field.key] ? row[fieldMapping[field.key]] : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="step-actions">
            <button className="btn btn-secondary" onClick={resetUpload}>
              Start Over
            </button>
            <button 
              className="btn btn-primary" 
              onClick={validateData}
              disabled={requiredFields.some(f => f.required && !fieldMapping[f.key])}
            >
              Validate Data
            </button>
          </div>
        </div>
      )}

      {uploadStep === 3 && (
        <div className="upload-step">
          <div className="validation-summary">
            <h3>Validation Results</h3>
            <div className="validation-stats">
              <div className="stat-card success">
                <FaCheck className="stat-icon" />
                <div>
                  <div className="stat-value">{uploadedData.length - validationErrors.length}</div>
                  <div className="stat-label">Valid Records</div>
                </div>
              </div>
              <div className="stat-card error">
                <FaTimes className="stat-icon" />
                <div>
                  <div className="stat-value">{validationErrors.length}</div>
                  <div className="stat-label">Invalid Records</div>
                </div>
              </div>
              <div className="stat-card total">
                <FaEye className="stat-icon" />
                <div>
                  <div className="stat-value">{uploadedData.length}</div>
                  <div className="stat-label">Total Records</div>
                </div>
              </div>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="validation-errors">
              <h4><FaExclamationTriangle /> Validation Errors</h4>
              <div className="error-list">
                {validationErrors.slice(0, 10).map((error, index) => (
                  <div key={index} className="error-item">
                    <div className="error-row">Row {error.rowIndex}:</div>
                    <div className="error-details">
                      {error.errors.map((err, errIndex) => (
                        <span key={errIndex} className="error-message">{err}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {validationErrors.length > 10 && (
                  <div className="error-item">
                    <div className="error-message">
                      And {validationErrors.length - 10} more errors...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="step-actions">
            <button className="btn btn-secondary" onClick={() => setUploadStep(2)}>
              Back to Mapping
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleUpload}
              disabled={validationErrors.length === uploadedData.length}
            >
              Upload Valid Records ({uploadedData.length - validationErrors.length})
            </button>
          </div>
        </div>
      )}

      {uploadStep === 4 && (
        <div className="upload-step">
          <div className="upload-complete">
            <FaCheck className="success-icon" />
            <h3>Upload Complete!</h3>
            <p>
              Successfully uploaded {uploadedData.length - validationErrors.length} staff records 
              to {ministries.find(m => m.id.toString() === selectedMinistry)?.name}
            </p>
            
            <div className="completion-stats">
              <div className="completion-item">
                <strong>Valid Records:</strong> {uploadedData.length - validationErrors.length}
              </div>
              <div className="completion-item">
                <strong>Invalid Records:</strong> {validationErrors.length}
              </div>
              <div className="completion-item">
                <strong>Invitations to be sent:</strong> {uploadedData.length - validationErrors.length}
              </div>
            </div>

            <div className="step-actions">
              <button className="btn btn-primary" onClick={resetUpload}>
                Upload Another File
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="upload-modal">
          <div className="upload-progress">
            <h4>Uploading Staff Data...</h4>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">{Math.round(uploadProgress)}% Complete</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;