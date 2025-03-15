import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { kycService } from '../../services/api';
import { FaSearch, FaFilter, FaCheck, FaTimes, FaHourglass } from 'react-icons/fa';
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
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="badge badge-success"><FaCheck /> Approved</span>;
      case 'rejected':
        return <span className="badge badge-danger"><FaTimes /> Rejected</span>;
      default:
        return <span className="badge badge-warning"><FaHourglass /> Pending</span>;
    }
  };

  if (loading && kycRequests.length === 0) {
    return <div className="loading">Loading KYC requests...</div>;
  }

  return (
    <div className="kyc-verification">
      <h1 className="page-title">KYC Verification Requests</h1>
      
      {/* Search and Filter Section */}
      <div className="card search-filter-card">
        <form onSubmit={handleSearchSubmit}>
          <div className="search-bar">
            <div className="search-input-container">
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search by ID, name or email..."
                className="form-control search-input"
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </div>
            
            <button type="button" className="filter-toggle-btn" onClick={toggleFilters}>
              <FaFilter /> Filters {showFilters ? '▲' : '▼'}
            </button>
          </div>
          
          {showFilters && (
            <div className="filter-section">
              <div className="filters-row">
                <div className="filter-group">
                  <label>Status</label>
                  <select 
                    name="status" 
                    value={filters.status} 
                    onChange={handleFilterChange} 
                    className="form-control"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Verification Type</label>
                  <select 
                    name="verificationType" 
                    value={filters.verificationType} 
                    onChange={handleFilterChange} 
                    className="form-control"
                  >
                    <option value="">All Types</option>
                    <option value="idCard">ID Card</option>
                    <option value="passport">Passport</option>
                    <option value="drivingLicense">Driving License</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Date From</label>
                  <input 
                    type="date" 
                    name="dateFrom" 
                    value={filters.dateFrom} 
                    onChange={handleFilterChange} 
                    className="form-control"
                  />
                </div>
                
                <div className="filter-group">
                  <label>Date To</label>
                  <input 
                    type="date" 
                    name="dateTo" 
                    value={filters.dateTo} 
                    onChange={handleFilterChange} 
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="filter-actions">
                <button type="button" onClick={resetFilters} className="btn">
                  Reset Filters
                </button>
                <button type="submit" className="btn btn-primary">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* KYC Requests List */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>User</th>
                <th>Verification Type</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.id.substring(0, 8)}</td>
                  <td>
                    <div className="user-info-cell">
                      <div>{request.userName || 'N/A'}</div>
                      <small>{request.userEmail || 'No email'}</small>
                    </div>
                  </td>
                  <td>{request.verificationType}</td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>
                    <Link to={`/kyc/${request.id}`} className="btn btn-primary btn-sm">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
              
              {kycRequests.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="no-data">
                    No KYC requests found with the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(1)} 
              disabled={pagination.page === 1}
              className="pagination-btn"
            >
              First
            </button>
            <button 
              onClick={() => handlePageChange(pagination.page - 1)} 
              disabled={pagination.page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button 
              onClick={() => handlePageChange(pagination.page + 1)} 
              disabled={pagination.page === pagination.totalPages}
              className="pagination-btn"
            >
              Next
            </button>
            <button 
              onClick={() => handlePageChange(pagination.totalPages)} 
              disabled={pagination.page === pagination.totalPages}
              className="pagination-btn"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCVerification;