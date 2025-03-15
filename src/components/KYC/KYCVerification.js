import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { kycService } from '../../services/api';
import { 
  FaSearch, FaFilter, FaCheck, FaTimes, FaHourglass, FaIdCard, 
  FaPassport, FaCar, FaQuestion, FaCalendarAlt, FaUser, FaChevronLeft,
  FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight, FaEllipsisH
} from 'react-icons/fa';
import '../../styles/KYC.css';

const KYCVerification = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    verificationType: '',
    searchTerm: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchKycRequests();
  }, [pagination.page, filters]);

  const fetchKycRequests = async () => {
    setLoading(true);
    try {
      // Prepare query parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: 'createdAt:desc',
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await kycService.getAll(params);
      setKycRequests(response.results || []);
      setPagination({
        ...pagination,
        totalPages: response.totalPages || 1,
        totalResults: response.totalResults || 0
      });
      setSelectedRows([]);
      setSelectAll(false);
    } catch (err) {
      setError('Failed to load KYC requests');
      console.error('Error fetching KYC requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 }); // Reset to first page on filter change
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchKycRequests();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      verificationType: '',
      searchTerm: '',
      dateFrom: '',
      dateTo: ''
    });
    setActiveStatus('all');
  };

  const handleStatusTabClick = (status) => {
    setActiveStatus(status);
    if (status === 'all') {
      setFilters({ ...filters, status: '' });
    } else {
      setFilters({ ...filters, status });
    }
    setPagination({ ...pagination, page: 1 });
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(kycRequests.map(request => request.id));
    }
    setSelectAll(!selectAll);
  };

  // Get verification type icon
  const getVerificationTypeIcon = (type) => {
    switch(type) {
      case 'idCard':
        return <FaIdCard className="verification-type-icon id-card" />;
      case 'passport':
        return <FaPassport className="verification-type-icon passport" />;
      case 'drivingLicense':
        return <FaCar className="verification-type-icon driving" />;
      default:
        return <FaQuestion className="verification-type-icon other" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="status-badge status-approved"><FaCheck /> Approved</span>;
      case 'rejected':
        return <span className="status-badge status-rejected"><FaTimes /> Rejected</span>;
      default:
        return <span className="status-badge status-pending"><FaHourglass /> Pending</span>;
    }
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
    }
    return name.charAt(0);
  };

  // Calculate statistics
  const getTotalsByStatus = () => {
    const totals = {
      all: kycRequests.length,
      pending: kycRequests.filter(r => r.status === 'pending').length,
      approved: kycRequests.filter(r => r.status === 'approved').length,
      rejected: kycRequests.filter(r => r.status === 'rejected').length
    };
    totals.all = totals.pending + totals.approved + totals.rejected;
    return totals;
  };

  if (loading && kycRequests.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading verification requests...</p>
      </div>
    );
  }

  const statusTotals = getTotalsByStatus();

  return (
    <div className="kyc-verification-container">
      <header className="verification-header">
        <h1 className="page-title">Verification Requests</h1>
        <div className="header-actions">
          <div className="results-summary">
            Showing <span className="highlight">{kycRequests.length}</span> of{" "}
            <span className="highlight">{pagination.totalResults}</span> results
          </div>
        </div>
      </header>
      
      {/* Status Filter Tabs */}
      <div className="status-tabs">
        <button 
          className={`status-tab ${activeStatus === 'all' ? 'active' : ''}`}
          onClick={() => handleStatusTabClick('all')}
        >
          All Requests
          <span className="status-count">{statusTotals.all}</span>
        </button>
        <button 
          className={`status-tab ${activeStatus === 'pending' ? 'active' : ''}`}
          onClick={() => handleStatusTabClick('pending')}
        >
          Pending
          <span className="status-count pending">{statusTotals.pending}</span>
        </button>
        <button 
          className={`status-tab ${activeStatus === 'approved' ? 'active' : ''}`}
          onClick={() => handleStatusTabClick('approved')}
        >
          Approved
          <span className="status-count approved">{statusTotals.approved}</span>
        </button>
        <button 
          className={`status-tab ${activeStatus === 'rejected' ? 'active' : ''}`}
          onClick={() => handleStatusTabClick('rejected')}
        >
          Rejected
          <span className="status-count rejected">{statusTotals.rejected}</span>
        </button>
      </div>
      
      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search by ID, name or email..."
                className="search-input"
              />
              {filters.searchTerm && (
                <button 
                  type="button"
                  className="clear-search"
                  onClick={() => setFilters({...filters, searchTerm: ''})}
                >
                  ×
                </button>
              )}
            </div>
            
            <button type="button" className="filter-button" onClick={toggleFilters}>
              <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                <div className="filter-item">
                  <label className="filter-label">Verification Type</label>
                  <select 
                    name="verificationType" 
                    value={filters.verificationType} 
                    onChange={handleFilterChange} 
                    className="filter-select"
                  >
                    <option value="">All Types</option>
                    <option value="idCard">ID Card</option>
                    <option value="passport">Passport</option>
                    <option value="drivingLicense">Driving License</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="filter-item">
                  <label className="filter-label">Date Range</label>
                  <div className="date-range">
                    <div className="date-input-container">
                      <FaCalendarAlt className="date-icon" />
                      <input 
                        type="date" 
                        name="dateFrom" 
                        value={filters.dateFrom} 
                        onChange={handleFilterChange} 
                        className="date-input"
                        placeholder="From"
                      />
                    </div>
                    <div className="date-separator">to</div>
                    <div className="date-input-container">
                      <FaCalendarAlt className="date-icon" />
                      <input 
                        type="date" 
                        name="dateTo" 
                        value={filters.dateTo} 
                        onChange={handleFilterChange} 
                        className="date-input"
                        placeholder="To"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="filter-actions">
                <button type="button" onClick={resetFilters} className="reset-button">
                  Reset Filters
                </button>
                <button type="submit" className="apply-button">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">{selectedRows.length} requests selected</span>
          <div className="bulk-buttons">
            <button className="bulk-action-button approve">
              <FaCheck /> Approve Selected
            </button>
            <button className="bulk-action-button reject">
              <FaTimes /> Reject Selected
            </button>
          </div>
        </div>
      )}
      
      {/* KYC Requests List */}
      <div className="requests-table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <div className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAll}
                    id="select-all"
                  />
                  <label htmlFor="select-all"></label>
                </div>
              </th>
              <th>Request ID</th>
              <th>Applicant</th>
              <th>Verification Type</th>
              <th>Submission</th>
              <th>Status</th>
              <th className="actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {kycRequests.map(request => {
              const { date, time } = formatDateTime(request.createdAt);
              return (
                <tr key={request.id} className={selectedRows.includes(request.id) ? 'selected-row' : ''}>
                  <td className="checkbox-cell">
                    <div className="checkbox-wrapper">
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(request.id)}
                        onChange={() => handleRowSelect(request.id)}
                        id={`select-${request.id}`}
                      />
                      <label htmlFor={`select-${request.id}`}></label>
                    </div>
                  </td>
                  <td className="id-cell">
                    <span className="request-id">{request.id.substring(0, 8)}</span>
                  </td>
                  <td className="applicant-cell">
                    <div className="applicant-info">
                      <div className="applicant-avatar">
                        {getInitials(request.userName)}
                      </div>
                      <div className="applicant-details">
                        <div className="applicant-name">{request.userName || 'Unknown User'}</div>
                        <div className="applicant-email">{request.userEmail || 'No email provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="verification-type-cell">
                    <div className="verification-type">
                      {getVerificationTypeIcon(request.verificationType)}
                      <span className="type-name">{request.verificationType}</span>
                    </div>
                  </td>
                  <td className="submission-cell">
                    <div className="submission-time">
                      <div className="submission-date">{date}</div>
                      <div className="submission-hour">{time}</div>
                    </div>
                  </td>
                  <td className="status-cell">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <Link to={`/kyc/${request.id}`} className="review-button">
                        Review
                      </Link>
                      <button className="more-actions-button">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {kycRequests.length === 0 && !loading && (
              <tr className="empty-row">
                <td colSpan="7">
                  <div className="empty-state">
                    <div className="empty-icon">
                      <FaIdCard />
                    </div>
                    <h3>No Verification Requests Found</h3>
                    <p>There are no requests matching your current filter criteria.</p>
                    {(filters.status || filters.verificationType || filters.searchTerm || filters.dateFrom || filters.dateTo) && (
                      <button onClick={resetFilters} className="reset-filters-button">
                        Reset Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination-container">
          <div className="page-information">
            Showing page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="pagination-controls">
            <button 
              onClick={() => handlePageChange(1)} 
              disabled={pagination.page === 1}
              className="pagination-button first"
              aria-label="First page"
            >
              <FaAngleDoubleLeft />
            </button>
            <button 
              onClick={() => handlePageChange(pagination.page - 1)} 
              disabled={pagination.page === 1}
              className="pagination-button prev"
              aria-label="Previous page"
            >
              <FaChevronLeft />
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // Show current page and nearby pages
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`pagination-button page-number ${pagination.page === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => handlePageChange(pagination.page + 1)} 
              disabled={pagination.page === pagination.totalPages}
              className="pagination-button next"
              aria-label="Next page"
            >
              <FaChevronRight />
            </button>
            <button 
              onClick={() => handlePageChange(pagination.totalPages)} 
              disabled={pagination.page === pagination.totalPages}
              className="pagination-button last"
              aria-label="Last page"
            >
              <FaAngleDoubleRight />
            </button>
          </div>
          <div className="per-page-selector">
            <label>Show:</label>
            <select 
              value={pagination.limit} 
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                setPagination({ ...pagination, limit: newLimit, page: 1 });
              }}
              className="limit-select"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCVerification;