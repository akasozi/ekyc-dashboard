import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaDownload, FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaEnvelope, FaPhone, FaIdCard, FaUser, FaCheck, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/Staff.css';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState(null);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const mockMinistries = [
        { id: 1, name: 'Ministry of Education', code: 'MOE' },
        { id: 2, name: 'Ministry of Health', code: 'MOH' },
        { id: 3, name: 'Kenya Revenue Authority', code: 'KRA' },
        { id: 4, name: 'National Social Security Fund', code: 'NSSF' },
        { id: 5, name: 'Ministry of Interior and National Administration', code: 'MINA' }
      ];

      const mockStaff = [
        {
          id: 1,
          nationalId: '12345678',
          payrollNumber: 'MOE001234',
          kraPin: 'A012345678X',
          nssfNumber: 'NS001234567',
          shifNumber: 'SH001234567',
          firstName: 'John',
          lastName: 'Kamau',
          email: 'john.kamau@education.go.ke',
          phone: '+254712345678',
          jobTitle: 'Senior Education Officer',
          department: 'Policy Development',
          ministryId: 1,
          ministryName: 'Ministry of Education',
          eKycStatus: 'completed',
          invitationSent: true,
          invitationDate: '2024-08-15',
          verificationDate: '2024-08-18',
          documentsUploaded: true,
          livenessCheck: 'passed',
          systemVerification: {
            iprs: { status: 'verified', lastChecked: '2024-08-18T10:30:00Z', details: 'Same identity as MOH staff' },
            kra: { status: 'warning', lastChecked: '2024-08-18T10:31:00Z', details: 'Multiple employer records detected' },
            nssf: { status: 'warning', lastChecked: '2024-08-18T10:32:00Z', details: 'Contributions from multiple sources' },
            ecitizen: { status: 'verified', lastChecked: '2024-08-18T10:33:00Z', details: 'Digital ID verified' }
          },
          riskScore: 85,
          riskLevel: 'high',
          duplicateEmployment: true,
          duplicateMinistries: ['Ministry of Education', 'Ministry of Health'],
          createdAt: '2024-08-10'
        },
        {
          id: 2,
          nationalId: '23456789',
          payrollNumber: 'MOH002345',
          kraPin: 'A023456789Y',
          nssfNumber: 'NS002345678',
          shifNumber: 'SH002345678',
          firstName: 'Mary',
          lastName: 'Wanjiku',
          email: 'mary.wanjiku@health.go.ke',
          phone: '+254723456789',
          jobTitle: 'Medical Officer',
          department: 'Clinical Services',
          ministryId: 2,
          ministryName: 'Ministry of Health',
          eKycStatus: 'pending',
          invitationSent: true,
          invitationDate: '2024-08-20',
          verificationDate: null,
          documentsUploaded: false,
          livenessCheck: null,
          systemVerification: {
            iprs: { status: 'verified', lastChecked: '2024-08-20T09:15:00Z', details: 'Identity confirmed' },
            kra: { status: 'verified', lastChecked: '2024-08-20T09:16:00Z', details: 'Active taxpayer' },
            nssf: { status: 'warning', lastChecked: '2024-08-20T09:17:00Z', details: 'Contribution gaps detected' },
            ecitizen: { status: 'pending', lastChecked: null, details: 'Verification in progress' }
          },
          riskScore: 25,
          riskLevel: 'low',
          createdAt: '2024-08-15'
        },
        {
          id: 3,
          nationalId: '34567890',
          payrollNumber: 'KRA003456',
          kraPin: 'A034567890Z',
          nssfNumber: 'NS003456789',
          shifNumber: 'SH003456789',
          firstName: 'Peter',
          lastName: 'Mwangi',
          email: 'peter.mwangi@kra.go.ke',
          phone: '+254734567890',
          jobTitle: 'Tax Officer',
          department: 'Domestic Taxes',
          ministryId: 3,
          ministryName: 'Kenya Revenue Authority',
          eKycStatus: 'failed',
          invitationSent: true,
          invitationDate: '2024-08-12',
          verificationDate: '2024-08-14',
          documentsUploaded: true,
          livenessCheck: 'failed',
          systemVerification: {
            iprs: { status: 'verified', lastChecked: '2024-08-14T14:20:00Z', details: 'Identity confirmed' },
            kra: { status: 'failed', lastChecked: '2024-08-14T14:21:00Z', details: 'KRA PIN mismatch detected' },
            nssf: { status: 'warning', lastChecked: '2024-08-14T14:22:00Z', details: 'Inactive NSSF account' },
            ecitizen: { status: 'verified', lastChecked: '2024-08-14T14:23:00Z', details: 'Digital profile exists' }
          },
          riskScore: 75,
          riskLevel: 'high',
          createdAt: '2024-08-08'
        },
        {
          id: 4,
          nationalId: '45678901',
          payrollNumber: 'NSSF004567',
          kraPin: 'A045678901A',
          nssfNumber: 'NS004567890',
          shifNumber: 'SH004567890',
          firstName: 'Grace',
          lastName: 'Mutua',
          email: 'grace.mutua@nssf.or.ke',
          phone: '+254745678901',
          jobTitle: 'Finance Officer',
          department: 'Investments',
          ministryId: 4,
          ministryName: 'National Social Security Fund',
          eKycStatus: 'not_invited',
          invitationSent: false,
          invitationDate: null,
          verificationDate: null,
          documentsUploaded: false,
          livenessCheck: null,
          createdAt: '2024-08-25'
        },
        {
          id: 5,
          nationalId: '56789012',
          payrollNumber: 'MINA005678',
          kraPin: 'A056789012B',
          nssfNumber: 'NS005678901',
          shifNumber: 'SH005678901',
          firstName: 'Samuel',
          lastName: 'Kiprotich',
          email: 'samuel.kiprotich@interior.go.ke',
          phone: '+254756789012',
          jobTitle: 'Assistant Administrator',
          department: 'Internal Security',
          ministryId: 5,
          ministryName: 'Ministry of Interior and National Administration',
          eKycStatus: 'completed',
          invitationSent: true,
          invitationDate: '2024-08-05',
          verificationDate: '2024-08-07',
          documentsUploaded: true,
          livenessCheck: 'passed',
          createdAt: '2024-08-01'
        }
      ];

      setMinistries(mockMinistries);
      setStaff(mockStaff);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = (
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nationalId.includes(searchTerm) ||
      member.payrollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesMinistry = !selectedMinistry || member.ministryId.toString() === selectedMinistry;
    const matchesStatus = !statusFilter || member.eKycStatus === statusFilter;
    
    return matchesSearch && matchesMinistry && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="status-badge completed"><FaCheckCircle /> Completed</span>;
      case 'pending':
        return <span className="status-badge pending"><FaClock /> Pending</span>;
      case 'failed':
        return <span className="status-badge failed"><FaTimesCircle /> Failed</span>;
      case 'not_invited':
        return <span className="status-badge not-invited"><FaEnvelope /> Not Invited</span>;
      default:
        return <span className="status-badge unknown">Unknown</span>;
    }
  };

  const getStatusCount = (status) => {
    return staff.filter(member => member.eKycStatus === status).length;
  };

  const handleExport = () => {
    const csvContent = [
      ['National ID', 'Payroll Number', 'Name', 'Email', 'Phone', 'Job Title', 'Department', 'Ministry', 'eKYC Status', 'Invitation Date', 'Verification Date'],
      ...filteredStaff.map(member => [
        member.nationalId,
        member.payrollNumber,
        `${member.firstName} ${member.lastName}`,
        member.email,
        member.phone,
        member.jobTitle,
        member.department,
        member.ministryName,
        member.eKycStatus,
        member.invitationDate || 'N/A',
        member.verificationDate || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendInvitation = (staffId) => {
    setStaff(staff.map(member => 
      member.id === staffId 
        ? { ...member, invitationSent: true, invitationDate: new Date().toISOString().split('T')[0], eKycStatus: 'pending' }
        : member
    ));
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaffMember(staffMember);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedStaffMember(null);
  };

  const getSystemStatusIcon = (status) => {
    switch (status) {
      case 'verified': return '✅';
      case 'failed': return '❌';
      case 'warning': return '⚠️';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return '#2ecc71';
      case 'medium': return '#f39c12';
      case 'high': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return <div className="loading">Loading staff data...</div>;
  }

  return (
    <div className="staff-management">
      <header className="page-header">
        <h1 className="page-title">Staff Management</h1>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <FaDownload /> Export Data
          </button>
        </div>
      </header>

      <div className="staff-stats-bar">
        <div className="stat-card total">
          <div className="stat-value">{staff.length}</div>
          <div className="stat-label">Total Staff</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-value">{getStatusCount('completed')}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{getStatusCount('pending')}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card failed">
          <div className="stat-value">{getStatusCount('failed')}</div>
          <div className="stat-label">Failed</div>
        </div>
        <div className="stat-card not-invited">
          <div className="stat-value">{getStatusCount('not_invited')}</div>
          <div className="stat-label">Not Invited</div>
        </div>
      </div>

      <div className="staff-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, National ID, payroll number, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Ministry/Agency:</label>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
            >
              <option value="">All Ministries</option>
              {ministries.map(ministry => (
                <option key={ministry.id} value={ministry.id}>
                  {ministry.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>eKYC Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="not_invited">Not Invited</option>
            </select>
          </div>
          
          <button
            className="btn btn-clear"
            onClick={() => {
              setSelectedMinistry('');
              setStatusFilter('');
              setSearchTerm('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="staff-table-container">
        <table className="staff-table">
          <thead>
            <tr>
              <th>Staff Details</th>
              <th>Contact Info</th>
              <th>Employment</th>
              <th>Ministry/Agency</th>
              <th>eKYC Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaff.map(member => (
              <tr key={member.id}>
                <td>
                  <div className="staff-details">
                    <div className="staff-avatar">
                      <FaUser />
                    </div>
                    <div className="staff-info">
                      <div className="staff-name">
                        {member.firstName} {member.lastName}
                        {member.duplicateEmployment && (
                          <span className="duplicate-warning" title="Duplicate employment detected">
                            🚨 DUPLICATE
                          </span>
                        )}
                      </div>
                      <div className="staff-ids">
                        <span>ID: {member.nationalId}</span>
                        <span>PF: {member.payrollNumber}</span>
                      </div>
                      <div className="staff-numbers">
                        <small>KRA: {member.kraPin}</small>
                        {member.duplicateEmployment && (
                          <small className="duplicate-details">
                            Also in: {member.duplicateMinistries?.filter(m => m !== member.ministryName).join(', ')}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      {member.email}
                    </div>
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      {member.phone}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="employment-info">
                    <div className="job-title">{member.jobTitle}</div>
                    <div className="department">{member.department}</div>
                  </div>
                </td>
                <td>
                  <div className="ministry-info">
                    {member.ministryName}
                  </div>
                </td>
                <td>
                  <div className="status-info">
                    {getStatusBadge(member.eKycStatus)}
                    {member.invitationDate && (
                      <div className="status-date">
                        Invited: {new Date(member.invitationDate).toLocaleDateString()}
                      </div>
                    )}
                    {member.verificationDate && (
                      <div className="status-date">
                        Verified: {new Date(member.verificationDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-action view" 
                      onClick={() => handleViewDetails(member)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {member.eKycStatus === 'not_invited' && (
                      <button 
                        className="btn-action invite"
                        onClick={() => handleSendInvitation(member.id)}
                        title="Send Invitation"
                      >
                        <FaEnvelope />
                      </button>
                    )}
                    {member.eKycStatus === 'failed' && (
                      <button 
                        className="btn-action resend"
                        onClick={() => handleSendInvitation(member.id)}
                        title="Resend Invitation"
                      >
                        <FaEnvelope />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages} ({filteredStaff.length} records)
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Staff Details Modal */}
      {showDetailsModal && selectedStaffMember && (
        <div className="modal-overlay">
          <div className="staff-details-modal">
            <div className="modal-header">
              <h3>Staff Member Details</h3>
              <button className="close-button" onClick={closeDetailsModal}>&times;</button>
            </div>
            
            <div className="modal-content">
              <div className="details-section">
                <div className="staff-profile">
                  <div className="profile-avatar">
                    <FaUser />
                  </div>
                  <div className="profile-info">
                    <h4>{selectedStaffMember.firstName} {selectedStaffMember.lastName}</h4>
                    <p className="profile-title">{selectedStaffMember.jobTitle}</p>
                    <p className="profile-ministry">{selectedStaffMember.ministryName}</p>
                    <div className="profile-status">
                      {getStatusBadge(selectedStaffMember.eKycStatus)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-grid">
                <div className="details-card">
                  <h5><FaIdCard /> Identification Details</h5>
                  <div className="detail-item">
                    <label>National ID:</label>
                    <span>{selectedStaffMember.nationalId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payroll/PF Number:</label>
                    <span>{selectedStaffMember.payrollNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>KRA PIN:</label>
                    <span>{selectedStaffMember.kraPin}</span>
                  </div>
                  <div className="detail-item">
                    <label>NSSF Number:</label>
                    <span>{selectedStaffMember.nssfNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>SHIF Number:</label>
                    <span>{selectedStaffMember.shifNumber}</span>
                  </div>
                </div>

                <div className="details-card">
                  <h5><FaEnvelope /> Contact Information</h5>
                  <div className="detail-item">
                    <label>Email Address:</label>
                    <span>{selectedStaffMember.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mobile Phone:</label>
                    <span>{selectedStaffMember.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ministry/Agency:</label>
                    <span>{selectedStaffMember.ministryName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Department:</label>
                    <span>{selectedStaffMember.department}</span>
                  </div>
                </div>

                <div className="details-card">
                  <h5><FaCheck /> eKYC Verification Status</h5>
                  <div className="detail-item">
                    <label>Current Status:</label>
                    <span>{getStatusBadge(selectedStaffMember.eKycStatus)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Invitation Sent:</label>
                    <span>{selectedStaffMember.invitationSent ? 'Yes' : 'No'}</span>
                  </div>
                  {selectedStaffMember.invitationDate && (
                    <div className="detail-item">
                      <label>Invitation Date:</label>
                      <span>{new Date(selectedStaffMember.invitationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedStaffMember.verificationDate && (
                    <div className="detail-item">
                      <label>Verification Date:</label>
                      <span>{new Date(selectedStaffMember.verificationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <label>Documents Uploaded:</label>
                    <span>{selectedStaffMember.documentsUploaded ? 'Yes' : 'No'}</span>
                  </div>
                  {selectedStaffMember.livenessCheck && (
                    <div className="detail-item">
                      <label>Liveness Check:</label>
                      <span className={`liveness-status ${selectedStaffMember.livenessCheck}`}>
                        {selectedStaffMember.livenessCheck === 'passed' ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  )}
                  <div className="detail-item">
                    <label>Added to System:</label>
                    <span>{new Date(selectedStaffMember.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="details-card">
                  <h5><FaShieldAlt /> System Verification Status</h5>
                  <div className="verification-matrix-mini">
                    <div className="matrix-header">
                      <div className="risk-assessment">
                        <span className="risk-label">Ghost Worker Risk Score:</span>
                        <span 
                          className="risk-score-badge"
                          style={{ 
                            background: getRiskBadgeColor(selectedStaffMember.riskLevel),
                            color: 'white'
                          }}
                        >
                          {selectedStaffMember.riskScore}/100 ({selectedStaffMember.riskLevel?.toUpperCase()})
                        </span>
                      </div>
                    </div>
                    
                    <div className="verification-systems">
                      {selectedStaffMember.systemVerification && Object.entries(selectedStaffMember.systemVerification).map(([system, data]) => (
                        <div key={system} className="system-verification-item">
                          <div className="system-header">
                            <span className="system-name">{system.toUpperCase()}</span>
                            <span className="system-status">
                              {getSystemStatusIcon(data.status)} {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                            </span>
                          </div>
                          <div className="system-details">
                            <div className="detail-text">{data.details}</div>
                            {data.lastChecked && (
                              <div className="last-checked">
                                Last checked: {new Date(data.lastChecked).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedStaffMember.riskLevel === 'high' && (
                      <div className="risk-warning">
                        <FaExclamationTriangle />
                        <span>High risk score detected - manual review recommended</span>
                      </div>
                    )}
                    
                    {selectedStaffMember.duplicateEmployment && (
                      <div className="duplicate-employment-alert">
                        <FaExclamationTriangle />
                        <div className="alert-content">
                          <div className="alert-title">🚨 DUPLICATE EMPLOYMENT DETECTED</div>
                          <div className="alert-details">
                            <strong>{selectedStaffMember.firstName} {selectedStaffMember.lastName}</strong> appears to be employed in multiple ministries:
                          </div>
                          <ul className="duplicate-ministries-list">
                            {selectedStaffMember.duplicateMinistries?.map(ministry => (
                              <li key={ministry}>{ministry}</li>
                            ))}
                          </ul>
                          <div className="alert-recommendation">
                            <strong>Recommended Action:</strong> Investigate potential ghost worker fraud or verify legitimate dual employment.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                {selectedStaffMember.eKycStatus === 'not_invited' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      handleSendInvitation(selectedStaffMember.id);
                      closeDetailsModal();
                    }}
                  >
                    <FaEnvelope /> Send eKYC Invitation
                  </button>
                )}
                {selectedStaffMember.eKycStatus === 'failed' && (
                  <button 
                    className="btn btn-warning"
                    onClick={() => {
                      handleSendInvitation(selectedStaffMember.id);
                      closeDetailsModal();
                    }}
                  >
                    <FaEnvelope /> Resend Invitation
                  </button>
                )}
                <button className="btn btn-secondary" onClick={closeDetailsModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;