import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { FaHome, FaIdCard, FaChartBar, FaSignOutAlt, FaUser, FaBars, FaTimes, FaCreditCard, FaUserEdit, FaBuilding, FaUsers, FaCloudUploadAlt, FaFileAlt } from 'react-icons/fa';
import '../../styles/Layout.css';

const MainLayout = ({ onLogout }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    country: ''
  });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setCurrentUser(userData);
        setProfileData({
          name: userData?.name || 'Admin User',
          email: userData?.email || 'admin@example.com',
          company: userData?.company || 'Company Name',
          phone: userData?.phone || '+1234567890',
          country: userData?.country || 'United States'
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If there's an error, we'll handle it through the interceptor
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    onLogout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
    setProfileDropdownOpen(false);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd update the profile via API
    // authService.updateUserProfile(profileData);
    
    // Update local user state to reflect changes
    setCurrentUser(prev => ({
      ...prev,
      name: profileData.name,
      email: profileData.email,
      company: profileData.company,
      phone: profileData.phone,
      country: profileData.country
    }));
    
    closeProfileModal();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        <div className="sidebar-user" ref={dropdownRef}>
          <div className="user-avatar" onClick={toggleProfileDropdown}>
            <FaUser />
          </div>
          <div className="user-info" onClick={toggleProfileDropdown}>
            <p>{currentUser?.name || 'Admin User'}</p>
            <small>{currentUser?.email || 'admin@example.com'}</small>
          </div>
          
          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <button className="profile-dropdown-item" onClick={openProfileModal}>
                <FaUserEdit /> <span>View/Edit Profile</span>
              </button>
              <button className="profile-dropdown-item logout" onClick={handleLogout}>
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaHome /> <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/ministries" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaBuilding /> <span>Ministry Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/staff" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaUsers /> <span>Staff Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/upload" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaCloudUploadAlt /> <span>Bulk Upload</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/kyc" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaIdCard /> <span>eKYC Verification</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaFileAlt /> <span>Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaChartBar /> <span>Analytics</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <h3>User Profile</h3>
              <button className="close-button" onClick={closeProfileModal}>&times;</button>
            </div>
            <form onSubmit={handleProfileSubmit}>
              <div className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={profileData.name} 
                    onChange={handleProfileChange} 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={profileData.email} 
                    onChange={handleProfileChange} 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    value={profileData.company} 
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input 
                    type="text" 
                    id="country" 
                    name="country" 
                    value={profileData.country} 
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              
              <div className="profile-actions">
                <button type="button" className="btn-cancel" onClick={closeProfileModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;