import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, kycService } from '../../services/api';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { FaCheck, FaTimes, FaHourglass, FaIdCard, FaUserCheck, FaUserTimes, FaClock, FaVenusMars, FaMapMarkerAlt, FaExclamationTriangle, FaUsers, FaBuilding, FaChartBar } from 'react-icons/fa';
import '../../styles/Dashboard.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    pendingRequests: 0,
    verificationTrends: [],
    verificationTypes: { idCard: 0, passport: 0, drivingLicense: 0, other: 0 },
    ageDistribution: { "18-25": 0, "26-35": 0, "36-45": 0, "46+": 0 },
    genderDistribution: { male: 0, female: 0, other: 0 },
    districtData: {},
    avgVerificationTime: "0",
    failureReasons: {}
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        const dashboardStats = await analyticsService.getDashboardStats();
        setStats(dashboardStats);

        // Fetch recent KYC requests
        const recentKycData = await kycService.getAll({ limit: 5, sort: 'createdAt:desc' });
        setRecentRequests(recentKycData.results || []);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data for verification status
  const statusChartData = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [stats.approvedRequests, stats.rejectedRequests, stats.pendingRequests],
        backgroundColor: ['#2ecc71', '#e74c3c', '#f39c12'],
        borderWidth: 0,
      },
    ],
  };

  // Chart data for verification types
  const typesChartData = {
    labels: ['ID Card', 'Passport', 'Driving License', 'Other'],
    datasets: [
      {
        data: [
          stats.verificationTypes.idCard,
          stats.verificationTypes.passport,
          stats.verificationTypes.drivingLicense,
          stats.verificationTypes.other
        ],
        backgroundColor: ['#3498db', '#9b59b6', '#1abc9c', '#95a5a6'],
        borderWidth: 0,
      },
    ],
  };

  // Chart data for verification trends
  const trendsChartData = {
    labels: stats.verificationTrends.map(item => item.date),
    datasets: [
      {
        label: 'Verification Requests',
        data: stats.verificationTrends.map(item => item.count),
        backgroundColor: '#3498db',
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <div className="dashboard-actions">
          <div className="date-display">
            <span className="day">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
            <span className="date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </header>
      
      {/* Key Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card elevation-1 total-card">
          <div className="stat-icon-wrapper total">
            <FaUsers className="stat-icon-inner" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Total Staff</p>
            <h3 className="stat-value">12,890</h3>
            <div className="stat-trend positive">
              <span>↑ 5% from last upload</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card elevation-1 approved-card">
          <div className="stat-icon-wrapper approved">
            <FaUserCheck className="stat-icon-inner" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Verified Staff</p>
            <h3 className="stat-value">8,660</h3>
            <div className="stat-trend positive">
              <span>↑ 15% this month</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card elevation-1 pending-card">
          <div className="stat-icon-wrapper pending">
            <FaHourglass className="stat-icon-inner" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Pending Verification</p>
            <h3 className="stat-value">2,890</h3>
            <div className="stat-trend neutral">
              <span>22% of total staff</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card elevation-1 ministry-card">
          <div className="stat-icon-wrapper ministry">
            <FaBuilding className="stat-icon-inner" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Active Ministries</p>
            <h3 className="stat-value">5</h3>
            <div className="stat-trend positive">
              <span>All systems operational</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card elevation-1 ghost-card">
          <div className="stat-icon-wrapper ghost">
            <FaExclamationTriangle className="stat-icon-inner" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Potential Ghost Workers</p>
            <h3 className="stat-value">145</h3>
            <div className="stat-trend negative">
              <span>↓ 8% from last month</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card elevation-1 completion-card">
          <div className="stat-icon-wrapper completion">
            <FaChartBar className="stat-icon-inner" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Overall Completion</p>
            <h3 className="stat-value">67.2%</h3>
            <div className="stat-trend positive">
              <span>↑ 3% improvement</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="dashboard-grid">
        {/* Main Charts Section */}
        <div className="chart-section main-chart elevation-1">
          <div className="section-header">
            <h2>Verification Trends</h2>
            <div className="section-actions">
              <select className="time-selector">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
          <div className="chart-container trend-chart">
            <Bar data={trendsChartData} options={{
              ...chartOptions,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                  enabled: true,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  cornerRadius: 8,
                  titleFont: { weight: 'bold' },
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }} />
          </div>
        </div>
        
        {/* Status Breakdown */}
        <div className="chart-section status-chart elevation-1">
          <div className="section-header">
            <h2>Verification Status</h2>
          </div>
          <div className="chart-container donut-chart">
            <Doughnut 
              data={statusChartData} 
              options={{
                ...chartOptions,
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  }
                }
              }} 
            />
            <div className="chart-center-text">
              <div className="total-count">{stats.totalRequests}</div>
              <div className="total-label">Total</div>
            </div>
          </div>
        </div>
        
        {/* Verification Types */}
        <div className="chart-section types-chart elevation-1">
          <div className="section-header">
            <h2>Verification Types</h2>
          </div>
          <div className="chart-container">
            <Doughnut 
              data={typesChartData} 
              options={{
                ...chartOptions,
                cutout: '60%',
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      padding: 15,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        
        {/* Demographics Section */}
        <div className="chart-section demographics elevation-1">
          <div className="section-header">
            <h2>Demographics</h2>
            <div className="section-tabs">
              <button className="section-tab active">Age</button>
              <button className="section-tab">Gender</button>
              <button className="section-tab">Region</button>
            </div>
          </div>
          <div className="demographic-charts">
            <div className="chart-container">
              <Pie 
                data={{
                  labels: Object.keys(stats.ageDistribution),
                  datasets: [{
                    data: Object.values(stats.ageDistribution),
                    backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
                    borderWidth: 0,
                    borderRadius: 4
                  }]
                }} 
                options={{
                  ...chartOptions,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
        
        {/* Failure Reasons */}
        <div className="chart-section failure-chart elevation-1">
          <div className="section-header">
            <h2>Verification Failure Reasons</h2>
          </div>
          <div className="chart-container">
            <Bar 
              data={{
                labels: Object.keys(stats.failureReasons),
                datasets: [{
                  data: Object.values(stats.failureReasons),
                  backgroundColor: [
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(243, 156, 18, 0.8)',
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(149, 165, 166, 0.8)'
                  ],
                  borderRadius: 6,
                  maxBarThickness: 40
                }]
              }} 
              options={{
                ...chartOptions,
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        
        {/* Efficiency Cards */}
        <div className="metrics-section elevation-1">
          <div className="section-header">
            <h2>Performance Metrics</h2>
          </div>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon clock">
                <FaClock />
              </div>
              <div className="metric-info">
                <p className="metric-value">{stats.avgVerificationTime} min</p>
                <p className="metric-label">Avg. Verification Time</p>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon success-rate">
                <FaCheck />
              </div>
              <div className="metric-info">
                <p className="metric-value">
                  {stats.totalRequests 
                    ? ((stats.approvedRequests / stats.totalRequests) * 100).toFixed(1) 
                    : 0}%
                </p>
                <p className="metric-label">Success Rate</p>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon warning">
                <FaExclamationTriangle />
              </div>
              <div className="metric-info">
                <p className="metric-value">
                  {stats.totalRequests 
                    ? ((stats.rejectedRequests / stats.totalRequests) * 100).toFixed(1) 
                    : 0}%
                </p>
                <p className="metric-label">Rejection Rate</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Requests */}
        <div className="recent-requests-section elevation-1">
          <div className="section-header">
            <h2>Recent Verification Requests</h2>
            <Link to="/kyc" className="view-all-button">
              View All Requests <span>→</span>
            </Link>
          </div>
          
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(request => (
                  <tr key={request.id}>
                    <td className="id-cell">{request.id.substring(0, 8)}</td>
                    <td className="user-cell">
                      <div className="user-info">
                        <div className="user-avatar">
                          {request.userName?.charAt(0) || 'U'}
                        </div>
                        <span>{request.userName || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{request.verificationType}</td>
                    <td>{new Date(request.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <Link to={`/kyc/${request.id}`} className="action-button">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {recentRequests.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <div className="empty-state-content">
                        <FaIdCard className="empty-icon" />
                        <p>No recent verification requests found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;