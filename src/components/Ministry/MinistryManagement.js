import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding, FaUsers, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../../styles/Ministry.css';

const MinistryManagement = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'ministry',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const mockData = [
        {
          id: 1,
          name: 'Ministry of Education',
          code: 'MOE',
          type: 'ministry',
          contactPerson: 'John Kamau',
          email: 'info@education.go.ke',
          phone: '+254-20-318681',
          address: 'Jogoo House B, Harambee Avenue',
          description: 'Ministry responsible for education policies and implementation',
          staffCount: 2450,
          verifiedStaff: 1890,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Ministry of Health',
          code: 'MOH',
          type: 'ministry',
          contactPerson: 'Mary Wanjiku',
          email: 'info@health.go.ke',
          phone: '+254-20-2717077',
          address: 'Afya House, Cathedral Road',
          description: 'Ministry responsible for health policies and healthcare delivery',
          staffCount: 3200,
          verifiedStaff: 2100,
          createdAt: '2024-01-10'
        },
        {
          id: 3,
          name: 'Kenya Revenue Authority',
          code: 'KRA',
          type: 'parastatal',
          contactPerson: 'Peter Mwangi',
          email: 'info@kra.go.ke',
          phone: '+254-20-4999999',
          address: 'Times Tower, Haile Selassie Avenue',
          description: 'Tax collection and administration authority',
          staffCount: 1800,
          verifiedStaff: 1650,
          createdAt: '2024-01-20'
        },
        {
          id: 4,
          name: 'National Social Security Fund',
          code: 'NSSF',
          type: 'parastatal',
          contactPerson: 'Grace Mutua',
          email: 'info@nssf.or.ke',
          phone: '+254-20-2729000',
          address: 'NSSF Building, Eastern Wing',
          description: 'Social security and pension fund management',
          staffCount: 950,
          verifiedStaff: 820,
          createdAt: '2024-01-12'
        },
        {
          id: 5,
          name: 'Ministry of Interior and National Administration',
          code: 'MINA',
          type: 'ministry',
          contactPerson: 'Samuel Kiprotich',
          email: 'info@interior.go.ke',
          phone: '+254-20-2227411',
          address: 'Harambee House, Harambee Avenue',
          description: 'Internal security and national administration',
          staffCount: 4500,
          verifiedStaff: 3200,
          createdAt: '2024-01-08'
        }
      ];
      setMinistries(mockData);
    } catch (error) {
      console.error('Error fetching ministries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMinistries = ministries.filter(ministry =>
    ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMinistry = () => {
    setFormData({
      name: '',
      code: '',
      type: 'ministry',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      description: ''
    });
    setShowAddModal(true);
  };

  const handleEditMinistry = (ministry) => {
    setSelectedMinistry(ministry);
    setFormData({
      name: ministry.name,
      code: ministry.code,
      type: ministry.type,
      contactPerson: ministry.contactPerson,
      email: ministry.email,
      phone: ministry.phone,
      address: ministry.address,
      description: ministry.description
    });
    setShowEditModal(true);
  };

  const handleDeleteMinistry = (ministryId) => {
    if (window.confirm('Are you sure you want to delete this ministry/agency?')) {
      setMinistries(ministries.filter(m => m.id !== ministryId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showEditModal) {
      setMinistries(ministries.map(m => 
        m.id === selectedMinistry.id ? { ...m, ...formData } : m
      ));
      setShowEditModal(false);
    } else {
      const newMinistry = {
        id: Date.now(),
        ...formData,
        staffCount: 0,
        verifiedStaff: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setMinistries([...ministries, newMinistry]);
      setShowAddModal(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedMinistry(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ministry': return '#3498db';
      case 'parastatal': return '#2ecc71';
      case 'department': return '#f39c12';
      case 'agency': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getVerificationRate = (ministry) => {
    return ministry.staffCount ? ((ministry.verifiedStaff / ministry.staffCount) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return <div className="loading">Loading ministries...</div>;
  }

  return (
    <div className="ministry-management">
      <header className="page-header">
        <h1 className="page-title">Ministry & Agency Management</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleAddMinistry}>
            <FaPlus /> Add New Ministry/Agency
          </button>
        </div>
      </header>

      <div className="ministry-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search ministries, agencies, or codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="ministry-stats">
          <div className="stat-item">
            <span className="stat-value">{ministries.length}</span>
            <span className="stat-label">Total Entities</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {ministries.reduce((sum, m) => sum + m.staffCount, 0).toLocaleString()}
            </span>
            <span className="stat-label">Total Staff</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {ministries.reduce((sum, m) => sum + m.verifiedStaff, 0).toLocaleString()}
            </span>
            <span className="stat-label">Verified Staff</span>
          </div>
        </div>
      </div>

      <div className="ministry-grid">
        {filteredMinistries.map(ministry => (
          <div key={ministry.id} className="ministry-card">
            <div className="ministry-header">
              <div className="ministry-title">
                <div 
                  className="ministry-type-badge"
                  style={{ backgroundColor: getTypeColor(ministry.type) }}
                >
                  {ministry.type.toUpperCase()}
                </div>
                <h3>{ministry.name}</h3>
                <p className="ministry-code">({ministry.code})</p>
              </div>
              <div className="ministry-actions">
                <button 
                  className="btn-icon edit"
                  onClick={() => handleEditMinistry(ministry)}
                  title="Edit Ministry"
                >
                  <FaEdit />
                </button>
                <button 
                  className="btn-icon delete"
                  onClick={() => handleDeleteMinistry(ministry.id)}
                  title="Delete Ministry"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="ministry-content">
              <p className="ministry-description">{ministry.description}</p>
              
              <div className="ministry-contact">
                <div className="contact-item">
                  <FaUsers className="contact-icon" />
                  <span>{ministry.contactPerson}</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>{ministry.email}</span>
                </div>
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <span>{ministry.phone}</span>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>{ministry.address}</span>
                </div>
              </div>

              <div className="ministry-stats-card">
                <div className="stat-row">
                  <div className="stat-col">
                    <span className="stat-number">{ministry.staffCount.toLocaleString()}</span>
                    <span className="stat-text">Total Staff</span>
                  </div>
                  <div className="stat-col">
                    <span className="stat-number">{ministry.verifiedStaff.toLocaleString()}</span>
                    <span className="stat-text">Verified</span>
                  </div>
                  <div className="stat-col">
                    <span className="stat-number">{getVerificationRate(ministry)}%</span>
                    <span className="stat-text">Completion</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getVerificationRate(ministry)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="ministry-modal">
            <div className="modal-header">
              <h3>{showEditModal ? 'Edit Ministry/Agency' : 'Add New Ministry/Agency'}</h3>
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="ministry-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ministry of Education"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="code">Code *</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    placeholder="MOE"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="ministry">Ministry</option>
                    <option value="parastatal">Parastatal</option>
                    <option value="department">Department</option>
                    <option value="agency">Agency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="contactPerson">Contact Person *</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="info@ministry.go.ke"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+254-20-xxxxxxx"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Building Name, Street Address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description of the ministry/agency roles and responsibilities"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {showEditModal ? 'Update' : 'Create'} Ministry/Agency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinistryManagement;