import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, kycService } from '../../services/api';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { FaCheck, FaTimes, FaHourglass, FaIdCard, FaUserCheck, FaUserTimes, FaClock, FaVenusMars, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
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
      <h1 className="page-title">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaIdCard />
          </div>
          <div className="stat-details">
            <h3>Total Requests</h3>
            <p className="stat-value">{stats.totalRequests}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon approved">
            <FaUserCheck />
          </div>
          <div className="stat-details">
            <h3>Approved</h3>
            <p className="stat-value">{stats.approvedRequests}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon rejected">
            <FaUserTimes />
          </div>
          <div className="stat-details">
            <h3>Rejected</h3>
            <p className="stat-value">{stats.rejectedRequests}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaHourglass />
          </div>
          <div className="stat-details">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pendingRequests}</p>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="charts-section">
        <div className="row">
          <div className="col">
            <div className="card chart-card">
              <h2>Verification Status</h2>
              <div className="chart-container">
                <Doughnut data={statusChartData} options={chartOptions} />
              </div>
            </div>
          </div>
          
          <div className="col">
            <div className="card chart-card">
              <h2>Verification Types</h2>
              <div className="chart-container">
                <Doughnut data={typesChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card chart-card">
          <h2>Verification Trends</h2>
          <div className="chart-container trend-chart">
            <Bar data={trendsChartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Additional KYC Analytics */}
        <div className="row">
          <div className="col">
            <div className="card chart-card">
              <h2>Age Distribution</h2>
              <div className="chart-container">
                <Pie 
                  data={{
                    labels: Object.keys(stats.ageDistribution),
                    datasets: [{
                      data: Object.values(stats.ageDistribution),
                      backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
                      borderWidth: 0
                    }]
                  }} 
                  options={chartOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="col">
            <div className="card chart-card">
              <h2>Gender Distribution</h2>
              <div className="chart-container">
                <Pie 
                  data={{
                    labels: ['Male', 'Female', 'Other'],
                    datasets: [{
                      data: [
                        stats.genderDistribution.male,
                        stats.genderDistribution.female,
                        stats.genderDistribution.other
                      ],
                      backgroundColor: ['#3498db', '#e84393', '#95a5a6'],
                      borderWidth: 0
                    }]
                  }} 
                  options={chartOptions} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col">
            <div className="card chart-card">
              <h2>Verification Failure Reasons</h2>
              <div className="chart-container">
                <Doughnut 
                  data={{
                    labels: Object.keys(stats.failureReasons),
                    datasets: [{
                      data: Object.values(stats.failureReasons),
                      backgroundColor: ['#e74c3c', '#f39c12', '#9b59b6', '#3498db', '#95a5a6'],
                      borderWidth: 0
                    }]
                  }} 
                  options={chartOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="col">
            <div className="card chart-card">
              <h2>District Distribution</h2>
              <div className="chart-container">
                <Bar 
                  data={{
                    labels: Object.keys(stats.districtData).slice(0, 5),
                    datasets: [{
                      label: 'Verifications by District',
                      data: Object.values(stats.districtData).slice(0, 5),
                      backgroundColor: '#2980b9',
                    }]
                  }} 
                  options={{
                    ...chartOptions,
                    indexAxis: 'y',
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Efficiency Metrics */}
        <div className="row small-stats">
          <div className="col">
            <div className="card stat-detail-card">
              <div className="stat-icon clock">
                <FaClock />
              </div>
              <div className="stat-detail-content">
                <h3>Average Verification Time</h3>
                <p className="stat-value">{stats.avgVerificationTime} minutes</p>
                <p className="stat-description">Average time to complete the verification process</p>
              </div>
            </div>
          </div>
          
          <div className="col">
            <div className="card stat-detail-card">
              <div className="stat-icon success-rate">
                <FaCheck />
              </div>
              <div className="stat-detail-content">
                <h3>Verification Success Rate</h3>
                <p className="stat-value">
                  {stats.totalRequests 
                    ? ((stats.approvedRequests / stats.totalRequests) * 100).toFixed(1) 
                    : 0}%
                </p>
                <p className="stat-description">Percentage of approved verifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Requests */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Requests</h2>
          <Link to="/kyc" className="view-all-link">View All</Link>
        </div>
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.id.substring(0, 8)}</td>
                  <td>{request.userName || 'N/A'}</td>
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
              
              {recentRequests.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-data">No recent requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;