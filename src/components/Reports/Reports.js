import React, { useState, useEffect } from 'react';
import { FaDownload, FaEye, FaChartBar, FaBuilding, FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaFilter, FaCalendarAlt, FaExclamationTriangle, FaShieldAlt, FaLink, FaServer } from 'react-icons/fa';
import { Bar, Pie, Line } from 'react-chartjs-2';
import '../../styles/Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState({});
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(true);

  const ministries = [
    { id: 'all', name: 'All Ministries & Agencies', code: 'ALL' },
    { id: 1, name: 'Ministry of Education', code: 'MOE' },
    { id: 2, name: 'Ministry of Health', code: 'MOH' },
    { id: 3, name: 'Kenya Revenue Authority', code: 'KRA' },
    { id: 4, name: 'National Social Security Fund', code: 'NSSF' },
    { id: 5, name: 'Ministry of Interior and National Administration', code: 'MINA' }
  ];

  useEffect(() => {
    fetchReportData();
  }, [selectedMinistry, dateRange, reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        overview: {
          totalMinistries: 5,
          totalStaff: 12900,
          completedVerifications: 8660,
          pendingVerifications: 2890,
          failedVerifications: 1350,
          verificationRate: 67.1,
          avgCompletionTime: 3.2,
          ghostWorkersDetected: 145
        },
        ministryBreakdown: [
          {
            id: 1,
            name: 'Ministry of Education',
            code: 'MOE',
            totalStaff: 2450,
            completed: 1890,
            pending: 380,
            failed: 180,
            verificationRate: 77.1,
            lastUpdated: '2024-08-30'
          },
          {
            id: 2,
            name: 'Ministry of Health',
            code: 'MOH',
            totalStaff: 3200,
            completed: 2100,
            pending: 750,
            failed: 350,
            verificationRate: 65.6,
            lastUpdated: '2024-08-30'
          },
          {
            id: 3,
            name: 'Kenya Revenue Authority',
            code: 'KRA',
            totalStaff: 1800,
            completed: 1650,
            pending: 120,
            failed: 30,
            verificationRate: 91.7,
            lastUpdated: '2024-08-30'
          },
          {
            id: 4,
            name: 'National Social Security Fund',
            code: 'NSSF',
            totalStaff: 950,
            completed: 820,
            pending: 90,
            failed: 40,
            verificationRate: 86.3,
            lastUpdated: '2024-08-30'
          },
          {
            id: 5,
            name: 'Ministry of Interior and National Administration',
            code: 'MINA',
            totalStaff: 4500,
            completed: 3200,
            pending: 550,
            failed: 750,
            verificationRate: 71.1,
            lastUpdated: '2024-08-30'
          }
        ],
        verificationTrends: [
          { date: '2024-08-01', completed: 125, failed: 15 },
          { date: '2024-08-02', completed: 210, failed: 22 },
          { date: '2024-08-03', completed: 185, failed: 18 },
          { date: '2024-08-04', completed: 165, failed: 20 },
          { date: '2024-08-05', completed: 195, failed: 25 },
          { date: '2024-08-06', completed: 245, failed: 30 },
          { date: '2024-08-07', completed: 220, failed: 28 }
        ],
        failureReasons: {
          'Poor Image Quality': 35,
          'Document Not Clear': 28,
          'Liveness Check Failed': 22,
          'Invalid Document': 15
        },
        systemIntegrations: {
          kra: { status: 'online', lastSync: '2024-08-30T14:30:00Z', successRate: 98.5, avgResponseTime: 1.2 },
          iprs: { status: 'online', lastSync: '2024-08-30T14:32:00Z', successRate: 99.1, avgResponseTime: 0.8 },
          ecitizen: { status: 'maintenance', lastSync: '2024-08-30T12:15:00Z', successRate: 85.2, avgResponseTime: 2.5 },
          nssf: { status: 'online', lastSync: '2024-08-30T14:28:00Z', successRate: 96.7, avgResponseTime: 1.8 }
        },
        ghostWorkerIndicators: {
          totalFlagged: 145,
          highRisk: 45,
          mediumRisk: 67,
          lowRisk: 33,
          verified: 8515,
          categories: {
            'Identity Mismatch': 38,
            'Tax Record Issues': 42,
            'NSSF Inconsistencies': 28,
            'Multiple Employment': 15,
            'Biometric Conflicts': 12,
            'Digital Footprint Missing': 10
          }
        },
        crossSystemVerification: [
          { staffId: 1, nationalId: '12345678', iprsStatus: 'verified', kraStatus: 'verified', nssfStatus: 'verified', ecitizenStatus: 'verified', riskScore: 0, riskLevel: 'low' },
          { staffId: 3, nationalId: '34567890', iprsStatus: 'verified', kraStatus: 'failed', nssfStatus: 'warning', ecitizenStatus: 'verified', riskScore: 75, riskLevel: 'high' },
          { staffId: 15, nationalId: '87654321', iprsStatus: 'failed', kraStatus: 'verified', nssfStatus: 'verified', ecitizenStatus: 'pending', riskScore: 60, riskLevel: 'medium' }
        ]
      };
      
      setReportData(mockData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    const data = getExportData();
    
    if (format === 'csv') {
      const csvContent = [
        ['Ministry', 'Total Staff', 'Completed', 'Pending', 'Failed', 'Verification Rate %', 'Last Updated'],
        ...data.map(row => [
          row.name,
          row.totalStaff,
          row.completed,
          row.pending,
          row.failed,
          row.verificationRate,
          row.lastUpdated
        ])
      ].map(row => row.join(',')).join('\n');
      
      downloadFile(csvContent, `ekyc_report_${Date.now()}.csv`, 'text/csv');
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, `ekyc_report_${Date.now()}.json`, 'application/json');
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getExportData = () => {
    return reportData.ministryBreakdown || [];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return '✅';
      case 'failed': return '❌';
      case 'warning': return '⚠️';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getCompletionChartData = () => {
    if (!reportData.ministryBreakdown) return { labels: [], datasets: [] };
    
    return {
      labels: reportData.ministryBreakdown.map(m => m.code),
      datasets: [
        {
          label: 'Completed',
          data: reportData.ministryBreakdown.map(m => m.completed),
          backgroundColor: '#2ecc71',
          borderRadius: 6
        },
        {
          label: 'Pending',
          data: reportData.ministryBreakdown.map(m => m.pending),
          backgroundColor: '#f39c12',
          borderRadius: 6
        },
        {
          label: 'Failed',
          data: reportData.ministryBreakdown.map(m => m.failed),
          backgroundColor: '#e74c3c',
          borderRadius: 6
        }
      ]
    };
  };

  const getVerificationRateData = () => {
    if (!reportData.ministryBreakdown) return { labels: [], datasets: [] };
    
    return {
      labels: reportData.ministryBreakdown.map(m => m.name),
      datasets: [{
        data: reportData.ministryBreakdown.map(m => m.verificationRate),
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#f39c12',
          '#e74c3c',
          '#9b59b6'
        ],
        borderWidth: 0
      }]
    };
  };

  const getTrendData = () => {
    if (!reportData.verificationTrends) return { labels: [], datasets: [] };
    
    return {
      labels: reportData.verificationTrends.map(t => new Date(t.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Completed Verifications',
          data: reportData.verificationTrends.map(t => t.completed),
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Failed Verifications',
          data: reportData.verificationTrends.map(t => t.failed),
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  if (loading) {
    return <div className="loading">Loading report data...</div>;
  }

  return (
    <div className="reports">
      <header className="page-header">
        <h1 className="page-title">eKYC Verification Reports</h1>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => exportReport('csv')}>
            <FaDownload /> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={() => exportReport('json')}>
            <FaDownload /> Export JSON
          </button>
        </div>
      </header>

      <div className="report-controls">
        <div className="control-group">
          <label><FaBuilding /> Ministry/Agency:</label>
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="control-select"
          >
            {ministries.map(ministry => (
              <option key={ministry.id} value={ministry.id}>
                {ministry.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label><FaCalendarAlt /> Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="control-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        <div className="control-group">
          <label><FaChartBar /> Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="control-select"
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed</option>
            <option value="trends">Trends</option>
          </select>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card total">
          <FaUsers className="summary-icon" />
          <div className="summary-content">
            <div className="summary-value">{reportData.overview?.totalStaff?.toLocaleString()}</div>
            <div className="summary-label">Total Staff</div>
          </div>
        </div>

        <div className="summary-card completed">
          <FaCheckCircle className="summary-icon" />
          <div className="summary-content">
            <div className="summary-value">{reportData.overview?.completedVerifications?.toLocaleString()}</div>
            <div className="summary-label">Completed Verifications</div>
          </div>
        </div>

        <div className="summary-card pending">
          <FaClock className="summary-icon" />
          <div className="summary-content">
            <div className="summary-value">{reportData.overview?.pendingVerifications?.toLocaleString()}</div>
            <div className="summary-label">Pending Verifications</div>
          </div>
        </div>

        <div className="summary-card failed">
          <FaTimesCircle className="summary-icon" />
          <div className="summary-content">
            <div className="summary-value">{reportData.overview?.failedVerifications?.toLocaleString()}</div>
            <div className="summary-label">Failed Verifications</div>
          </div>
        </div>

        <div className="summary-card rate">
          <FaChartBar className="summary-icon" />
          <div className="summary-content">
            <div className="summary-value">{reportData.overview?.verificationRate}%</div>
            <div className="summary-label">Completion Rate</div>
          </div>
        </div>

        <div className="summary-card ghost-workers">
          <FaExclamationTriangle className="summary-icon" />
          <div className="summary-content">
            <div className="summary-value">{reportData.ghostWorkerIndicators?.totalFlagged}</div>
            <div className="summary-label">Flagged as Ghost Workers</div>
          </div>
        </div>
      </div>

      {/* System Integration Health */}
      <div className="integration-health-section">
        <div className="section-header">
          <h2><FaServer /> System Integration Health</h2>
          <div className="last-updated">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <div className="integration-grid">
          {reportData.systemIntegrations && Object.entries(reportData.systemIntegrations).map(([system, data]) => (
            <div key={system} className={`integration-card ${data.status}`}>
              <div className="integration-header">
                <div className="system-info">
                  <h4>{system.toUpperCase()}</h4>
                  <span className={`status-indicator ${data.status}`}>
                    {data.status === 'online' ? '🟢' : data.status === 'maintenance' ? '🟡' : '🔴'} 
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </span>
                </div>
                <div className="sync-time">
                  Last sync: {new Date(data.lastSync).toLocaleTimeString()}
                </div>
              </div>
              
              <div className="integration-metrics">
                <div className="metric-item">
                  <span className="metric-label">Success Rate</span>
                  <span className="metric-value">{data.successRate}%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Avg Response</span>
                  <span className="metric-value">{data.avgResponseTime}s</span>
                </div>
              </div>
              
              <div className="success-rate-bar">
                <div 
                  className="success-rate-fill"
                  style={{ width: `${data.successRate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Verification Status by Ministry</h3>
          </div>
          <div className="chart-container">
            <Bar 
              data={getCompletionChartData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Verification Rate by Ministry</h3>
          </div>
          <div className="chart-container">
            <Pie 
              data={getVerificationRateData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
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

        <div className="chart-card">
          <div className="chart-header">
            <h3>Ghost Worker Risk Categories</h3>
          </div>
          <div className="chart-container">
            <Bar 
              data={{
                labels: Object.keys(reportData.ghostWorkerIndicators?.categories || {}),
                datasets: [{
                  data: Object.values(reportData.ghostWorkerIndicators?.categories || {}),
                  backgroundColor: [
                    '#e74c3c',
                    '#f39c12', 
                    '#9b59b6',
                    '#34495e',
                    '#e67e22',
                    '#95a5a6'
                  ],
                  borderRadius: 6,
                  maxBarThickness: 40
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card wide">
          <div className="chart-header">
            <h3>Cross-System Verification Status</h3>
            <div className="chart-legend">
              <span className="legend-item verified">✅ Verified</span>
              <span className="legend-item warning">⚠️ Warning</span>
              <span className="legend-item failed">❌ Failed</span>
              <span className="legend-item pending">⏳ Pending</span>
            </div>
          </div>
          <div className="verification-matrix">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>National ID</th>
                  <th>IPRS</th>
                  <th>KRA</th>
                  <th>NSSF</th>
                  <th>eCitizen</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {reportData.crossSystemVerification?.slice(0, 10).map(staff => (
                  <tr key={staff.staffId} className={`risk-${staff.riskLevel}`}>
                    <td>{staff.staffId}</td>
                    <td>{staff.nationalId}</td>
                    <td><span className={`status-icon ${staff.iprsStatus}`}>{getStatusIcon(staff.iprsStatus)}</span></td>
                    <td><span className={`status-icon ${staff.kraStatus}`}>{getStatusIcon(staff.kraStatus)}</span></td>
                    <td><span className={`status-icon ${staff.nssfStatus}`}>{getStatusIcon(staff.nssfStatus)}</span></td>
                    <td><span className={`status-icon ${staff.ecitizenStatus}`}>{getStatusIcon(staff.ecitizenStatus)}</span></td>
                    <td>
                      <div className="risk-score">
                        <span className={`score-value ${staff.riskLevel}`}>{staff.riskScore}</span>
                        <div className="score-bar">
                          <div 
                            className={`score-fill ${staff.riskLevel}`}
                            style={{ width: `${staff.riskScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`risk-badge ${staff.riskLevel}`}>
                        {staff.riskLevel.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="report-tables">
        <div className="table-card">
          <div className="table-header">
            <h3>Ministry Performance Summary</h3>
            <div className="table-actions">
              <button className="btn-table-action">
                <FaEye /> View Details
              </button>
            </div>
          </div>
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Ministry/Agency</th>
                  <th>Total Staff</th>
                  <th>Completed</th>
                  <th>Pending</th>
                  <th>Failed</th>
                  <th>Rate</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {reportData.ministryBreakdown?.map(ministry => (
                  <tr key={ministry.id}>
                    <td>
                      <div className="ministry-cell">
                        <strong>{ministry.name}</strong>
                        <span className="ministry-code">({ministry.code})</span>
                      </div>
                    </td>
                    <td>{ministry.totalStaff.toLocaleString()}</td>
                    <td>
                      <span className="status-badge completed">
                        {ministry.completed.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge pending">
                        {ministry.pending.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge failed">
                        {ministry.failed.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div className="rate-cell">
                        <span className="rate-value">{ministry.verificationRate}%</span>
                        <div className="rate-bar">
                          <div 
                            className="rate-fill"
                            style={{ width: `${ministry.verificationRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>{new Date(ministry.lastUpdated).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="insights-card">
          <div className="insights-header">
            <h3>Key Insights</h3>
          </div>
          <div className="insights-content">
            <div className="insight-item">
              <div className="insight-icon success">
                <FaCheckCircle />
              </div>
              <div className="insight-text">
                <strong>KRA leads</strong> with the highest verification rate at 91.7%
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon warning">
                <FaExclamationTriangle />
              </div>
              <div className="insight-text">
                <strong>{reportData.ghostWorkerIndicators?.totalFlagged} staff flagged</strong> as potential ghost workers - {reportData.ghostWorkerIndicators?.highRisk} high risk
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon integration">
                <FaLink />
              </div>
              <div className="insight-text">
                <strong>System integrations</strong> running at 95% average uptime across KRA, IPRS, NSSF, and eCitizen
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon security">
                <FaShieldAlt />
              </div>
              <div className="insight-text">
                <strong>Cross-verification</strong> identified {reportData.ghostWorkerIndicators?.categories?.['Identity Mismatch']} identity mismatches requiring investigation
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon primary">
                <FaChartBar />
              </div>
              <div className="insight-text">
                <strong>Overall verification rate</strong> stands at {reportData.overview?.verificationRate}% with backend integration
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;