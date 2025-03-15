import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import { Bar, Line, Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { 
  FaCalendarAlt, FaDownload, FaChartLine, FaChartBar, FaChartPie,
  FaMapMarkerAlt, FaClock, FaExclamationTriangle, FaMobile, FaDesktop,
  FaUser, FaUserTimes, FaUserCheck, FaFilter, FaExchangeAlt
} from 'react-icons/fa';
import '../../styles/Analytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    to: new Date().toISOString().split('T')[0], // today
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    district: 'all',
    gender: 'all',
    ageGroup: 'all',
    deviceType: 'all'
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, filters]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const params = {
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
        ...filters
      };
      
      const response = await analyticsService.getVerificationStats(params);
      setStats(response);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const exportToCsv = () => {
    if (!stats) return;
    
    // Convert daily data to CSV format
    let csvContent = "data:text/csv;charset=utf-8,Date,Total,Approved,Rejected,Pending\n";
    
    stats.dailyTrends.forEach(day => {
      csvContent += `${day.date},${day.total},${day.approved},${day.rejected},${day.pending}\n`;
    });
    
    // Create a link to download the CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kyc-analytics-${dateRange.from}-to-${dateRange.to}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Daily Trends Chart
  const dailyTrendsData = stats ? {
    labels: stats.dailyTrends?.map(day => day.date) || [],
    datasets: [
      {
        label: 'Total Requests',
        data: stats.dailyTrends?.map(day => day.total) || [],
        backgroundColor: 'rgba(52, 152, 219, 0.5)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      },
      {
        label: 'Approved',
        data: stats.dailyTrends?.map(day => day.approved) || [],
        backgroundColor: 'rgba(46, 204, 113, 0.5)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1,
      },
      {
        label: 'Rejected',
        data: stats.dailyTrends?.map(day => day.rejected) || [],
        backgroundColor: 'rgba(231, 76, 60, 0.5)',
        borderColor: 'rgba(231, 76, 60, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: stats.dailyTrends?.map(day => day.pending) || [],
        backgroundColor: 'rgba(243, 156, 18, 0.5)',
        borderColor: 'rgba(243, 156, 18, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  // Verification Types Chart
  const verificationTypesData = stats ? {
    labels: Object.keys(stats.verificationTypes),
    datasets: [
      {
        data: Object.values(stats.verificationTypes),
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)',
          'rgba(155, 89, 182, 0.7)',
          'rgba(26, 188, 156, 0.7)',
          'rgba(149, 165, 166, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  // Conversion Rate Chart (Monthly)
  const conversionRateData = stats ? {
    labels: stats.monthlyConversionRate?.map(month => month.month) || [],
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: stats.monthlyConversionRate?.map(month => month.rate) || [],
        fill: false,
        backgroundColor: 'rgba(26, 188, 156, 0.7)',
        borderColor: 'rgba(26, 188, 156, 1)',
        tension: 0.3,
      },
    ],
  } : null;

  // Chart options
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== undefined) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  // Tab navigation
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'verification':
        return renderVerificationTab();
      case 'geographic':
        return renderGeographicTab();
      case 'demographics':
        return renderDemographicsTab();
      case 'operational':
        return renderOperationalTab();
      case 'fraud':
        return renderFraudTab();
      default:
        return renderOverviewTab();
    }
  };

  // Render tab methods
  const renderOverviewTab = () => {
    if (!stats) return null;
    
    return (
      <>
        {/* Summary Cards */}
        <div className="analytics-summary">
          <div className="summary-card total">
            <h3>Total Requests</h3>
            <p className="summary-value">{stats.totalRequests}</p>
          </div>
          <div className="summary-card approved">
            <h3>Approved</h3>
            <p className="summary-value">{stats.approvedRequests}</p>
            <p className="summary-percentage">
              ({((stats.approvedRequests / stats.totalRequests) * 100).toFixed(1)}%)
            </p>
          </div>
          <div className="summary-card rejected">
            <h3>Rejected</h3>
            <p className="summary-value">{stats.rejectedRequests}</p>
            <p className="summary-percentage">
              ({((stats.rejectedRequests / stats.totalRequests) * 100).toFixed(1)}%)
            </p>
          </div>
          <div className="summary-card pending">
            <h3>Pending</h3>
            <p className="summary-value">{stats.pendingRequests}</p>
            <p className="summary-percentage">
              ({((stats.pendingRequests / stats.totalRequests) * 100).toFixed(1)}%)
            </p>
          </div>
          <div className="summary-card">
            <h3>Avg. Processing Time</h3>
            <p className="summary-value">{stats.avgVerificationTime} min</p>
          </div>
        </div>
        
        {/* Daily Trends Chart */}
        <div className="card chart-card">
          <h2>Daily Verification Trends</h2>
          <div className="chart-container daily-chart">
            {dailyTrendsData && (
              <Bar data={dailyTrendsData} options={chartOptions} />
            )}
          </div>
        </div>
        
        <div className="charts-row">
          {/* Verification Types Chart */}
          <div className="card chart-card">
            <h2>Verification Types</h2>
            <div className="chart-container">
              {verificationTypesData && (
                <Pie data={verificationTypesData} options={chartOptions} />
              )}
            </div>
          </div>
          
          {/* Conversion Rate Chart */}
          <div className="card chart-card">
            <h2>Monthly Conversion Rate</h2>
            <div className="chart-container">
              {conversionRateData && (
                <Line data={conversionRateData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
        
        {/* Key Insights */}
        <div className="card insights-card">
          <h2>Key Insights</h2>
          <ul className="insights-list">
            {stats.insights?.map((insight, index) => (
              <li key={index} className="insight-item">
                <span className="insight-indicator"></span>
                <p>{insight}</p>
              </li>
            )) || (
              <li className="insight-item">
                <span className="insight-indicator"></span>
                <p>No insights available for the selected period</p>
              </li>
            )}
          </ul>
        </div>
      </>
    );
  };
  
  const renderVerificationTab = () => {
    if (!stats) return null;
    
    // Create verification funnel data
    const funnelData = {
      labels: ['Started', 'ID Uploaded', 'ID Verified', 'Liveness Check', 'Completed'],
      datasets: [{
        label: 'Users',
        data: stats.verificationFunnel?.map(step => step.count) || [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)',
          'rgba(52, 152, 219, 0.65)',
          'rgba(52, 152, 219, 0.6)',
          'rgba(52, 152, 219, 0.55)',
          'rgba(52, 152, 219, 0.5)'
        ],
        borderWidth: 1
      }]
    };
    
    // Time per step data
    const timePerStepData = {
      labels: ['ID Upload', 'ID Verification', 'Liveness Check', 'Final Verification'],
      datasets: [{
        label: 'Average Time (seconds)',
        data: stats.stepTimes?.map(step => step.avgTimeSeconds) || [0, 0, 0, 0],
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1
      }]
    };
    
    // Hourly distribution data
    const hourlyDistributionData = {
      labels: Array.from(Array(24).keys()).map(hour => `${hour}:00`),
      datasets: [{
        label: 'Verification Attempts',
        data: stats.hourlyDistribution?.map(hour => hour.count) || Array(24).fill(0),
        backgroundColor: 'rgba(155, 89, 182, 0.7)',
        borderColor: 'rgba(155, 89, 182, 1)',
        borderWidth: 1,
        fill: true,
      }]
    };
    
    return (
      <>
        <h2 className="section-title">Verification Funnel Analysis</h2>
        
        {/* Verification Funnel */}
        <div className="card chart-card">
          <h2>Verification Funnel</h2>
          <div className="chart-container">
            <Bar 
              data={funnelData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    callbacks: {
                      afterLabel: function(context) {
                        const dataset = context.dataset;
                        const currentValue = dataset.data[context.dataIndex];
                        const prevValue = context.dataIndex > 0 ? dataset.data[context.dataIndex - 1] : currentValue;
                        const dropoff = prevValue - currentValue;
                        const dropoffPercentage = prevValue ? ((dropoff / prevValue) * 100).toFixed(1) : 0;
                        return `Dropoff: ${dropoff} (${dropoffPercentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="funnel-stats">
            <div className="funnel-stat">
              <h4>Completion Rate</h4>
              <p className="funnel-value">
                {stats.verificationFunnel && stats.verificationFunnel.length > 0 ? 
                  `${((stats.verificationFunnel[stats.verificationFunnel.length - 1].count / stats.verificationFunnel[0].count) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </p>
            </div>
            <div className="funnel-stat">
              <h4>Biggest Dropoff</h4>
              <p className="funnel-value">{stats.biggestDropoffStep || 'N/A'}</p>
            </div>
            <div className="funnel-stat">
              <h4>Avg. Completion Time</h4>
              <p className="funnel-value">{stats.avgCompletionTime || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="charts-row">
          {/* Time per step */}
          <div className="card chart-card">
            <h2>Time Per Step</h2>
            <div className="chart-container">
              <Bar data={timePerStepData} options={chartOptions} />
            </div>
          </div>
          
          {/* Hourly distribution */}
          <div className="card chart-card">
            <h2>Hourly Distribution</h2>
            <div className="chart-container">
              <Line 
                data={hourlyDistributionData} 
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    x: {
                      title: {
                        display: true,
                        text: 'Hour of Day'
                      }
                    },
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Attempts'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Abandonment Analysis */}
        <div className="card insights-card">
          <h2>Abandonment Analysis</h2>
          <div className="abandonment-info">
            <div className="abandonment-stats">
              <div className="abandonment-stat">
                <h4>Total Abandonment Rate</h4>
                <p className="abandonment-value">{stats.abandonmentRate || '0%'}</p>
              </div>
              <div className="abandonment-stat">
                <h4>Most Common Abandonment Point</h4>
                <p className="abandonment-value">{stats.commonAbandonmentPoint || 'N/A'}</p>
              </div>
            </div>
            <div className="abandonment-reasons">
              <h4>Top Abandonment Reasons</h4>
              <ul className="reasons-list">
                {stats.abandonmentReasons?.map((reason, index) => (
                  <li key={index} className="reason-item">
                    <div className="reason-label">{reason.reason}</div>
                    <div className="reason-bar-container">
                      <div className="reason-bar" style={{ width: `${reason.percentage}%` }}></div>
                      <span className="reason-value">{reason.percentage}%</span>
                    </div>
                  </li>
                )) || (
                  <li>No data available</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  const renderGeographicTab = () => {
    if (!stats) return null;
    
    // Create district distribution data
    const districtData = {
      labels: Object.keys(stats.districtData || {}).slice(0, 10),
      datasets: [{
        label: 'Verification Count',
        data: Object.values(stats.districtData || {}).slice(0, 10),
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1
      }]
    };
    
    // Rural vs Urban data
    const ruralUrbanData = {
      labels: ['Urban', 'Rural'],
      datasets: [{
        data: [stats.urbanCount || 0, stats.ruralCount || 0],
        backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(46, 204, 113, 0.7)'],
        borderWidth: 1
      }]
    };
    
    return (
      <>
        <h2 className="section-title">Geographic Analysis</h2>
        
        {/* Map visualization would go here in a real implementation */}
        <div className="card map-card">
          <h2>Verification Distribution by County</h2>
          <div className="map-placeholder">
            <FaMapMarkerAlt /> 
            <p>Interactive map would be displayed here in production.</p>
            <p>Shows heat map of verification density across Kenya.</p>
          </div>
        </div>
        
        <div className="charts-row">
          {/* Top Districts */}
          <div className="card chart-card">
            <h2>Top Districts</h2>
            <div className="chart-container">
              <Bar 
                data={districtData} 
                options={{
                  ...chartOptions,
                  indexAxis: 'y',
                  scales: {
                    x: {
                      beginAtZero: true,
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          {/* Rural vs Urban */}
          <div className="card chart-card">
            <h2>Rural vs Urban</h2>
            <div className="chart-container">
              <Pie 
                data={ruralUrbanData} 
                options={chartOptions} 
              />
            </div>
          </div>
        </div>
        
        {/* Geographic Insights */}
        <div className="card insights-card">
          <h2>Geographic Insights</h2>
          <ul className="insights-list">
            {stats.geographicInsights?.map((insight, index) => (
              <li key={index} className="insight-item">
                <span className="insight-indicator"></span>
                <p>{insight}</p>
              </li>
            )) || (
              <li className="insight-item">
                <span className="insight-indicator"></span>
                <p>No geographic insights available for the selected period</p>
              </li>
            )}
          </ul>
        </div>
      </>
    );
  };
  
  const renderDemographicsTab = () => {
    if (!stats) return null;
    
    // Age distribution data
    const ageData = {
      labels: Object.keys(stats.ageDistribution || {}),
      datasets: [{
        label: 'Count',
        data: Object.values(stats.ageDistribution || {}),
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)', 
          'rgba(46, 204, 113, 0.7)',
          'rgba(155, 89, 182, 0.7)',
          'rgba(231, 76, 60, 0.7)'
        ],
        borderWidth: 1
      }]
    };
    
    // Gender distribution data
    const genderData = {
      labels: ['Male', 'Female', 'Other'],
      datasets: [{
        label: 'Count',
        data: [
          stats.genderDistribution?.male || 0,
          stats.genderDistribution?.female || 0,
          stats.genderDistribution?.other || 0
        ],
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)', 
          'rgba(231, 76, 60, 0.7)',
          'rgba(155, 89, 182, 0.7)'
        ],
        borderWidth: 1
      }]
    };
    
    // Device type data
    const deviceData = {
      labels: ['Mobile', 'Desktop', 'Tablet'],
      datasets: [{
        label: 'Count',
        data: [
          stats.deviceDistribution?.mobile || 0,
          stats.deviceDistribution?.desktop || 0,
          stats.deviceDistribution?.tablet || 0
        ],
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)', 
          'rgba(46, 204, 113, 0.7)',
          'rgba(155, 89, 182, 0.7)'
        ],
        borderWidth: 1
      }]
    };
    
    return (
      <>
        <h2 className="section-title">Demographic Analysis</h2>
        
        <div className="charts-row">
          {/* Age Distribution */}
          <div className="card chart-card">
            <h2>Age Distribution</h2>
            <div className="chart-container">
              <Bar data={ageData} options={chartOptions} />
            </div>
          </div>
          
          {/* Gender Distribution */}
          <div className="card chart-card">
            <h2>Gender Distribution</h2>
            <div className="chart-container">
              <Pie data={genderData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        <div className="charts-row">
          {/* Device Distribution */}
          <div className="card chart-card">
            <h2>Device Usage</h2>
            <div className="chart-container">
              <Doughnut data={deviceData} options={chartOptions} />
            </div>
          </div>
          
          {/* ID Document Age */}
          <div className="card chart-card">
            <h2>ID Document Age</h2>
            <div className="chart-container">
              <Bar 
                data={{
                  labels: ['0-1 Year', '1-3 Years', '3-5 Years', '5+ Years'],
                  datasets: [{
                    label: 'Count',
                    data: stats.idDocumentAge || [0, 0, 0, 0],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                  }]
                }} 
                options={chartOptions} 
              />
            </div>
          </div>
        </div>
        
        {/* Demographics Insights */}
        <div className="card insights-card">
          <h2>Demographic Insights</h2>
          <div className="key-demographic-stats">
            <div className="demographic-stat">
              <h4>Most Common Age Group</h4>
              <p className="demographic-value">{stats.mostCommonAgeGroup || 'N/A'}</p>
            </div>
            <div className="demographic-stat">
              <h4>Gender Ratio</h4>
              <p className="demographic-value">{stats.genderRatio || 'N/A'}</p>
            </div>
            <div className="demographic-stat">
              <h4>Mobile Usage</h4>
              <p className="demographic-value">
                {stats.deviceDistribution?.mobile && stats.totalRequests ? 
                  `${((stats.deviceDistribution.mobile / stats.totalRequests) * 100).toFixed(1)}%` : 
                  'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  const renderOperationalTab = () => {
    if (!stats) return null;
    
    // Processing time trend
    const processingTimeTrend = {
      labels: stats.processingTimeTrend?.map(item => item.date) || [],
      datasets: [{
        label: 'Average Processing Time (minutes)',
        data: stats.processingTimeTrend?.map(item => item.avgMinutes) || [],
        backgroundColor: 'rgba(46, 204, 113, 0.3)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      }]
    };
    
    return (
      <>
        <h2 className="section-title">Operational Efficiency</h2>
        
        {/* Operational Summary */}
        <div className="analytics-summary">
          <div className="summary-card">
            <h3>Avg. Verification Time</h3>
            <p className="summary-value">{stats.avgVerificationTime} min</p>
          </div>
          <div className="summary-card">
            <h3>Success Rate</h3>
            <p className="summary-value">
              {stats.totalRequests ? 
                `${((stats.approvedRequests / stats.totalRequests) * 100).toFixed(1)}%` : 
                '0%'
              }
            </p>
          </div>
          <div className="summary-card">
            <h3>System Uptime</h3>
            <p className="summary-value">{stats.systemUptime || '99.9%'}</p>
          </div>
          <div className="summary-card">
            <h3>Peak Hour</h3>
            <p className="summary-value">{stats.peakHour || 'N/A'}</p>
          </div>
          <div className="summary-card">
            <h3>Avg. Queue Time</h3>
            <p className="summary-value">{stats.avgQueueTime || 'N/A'}</p>
          </div>
        </div>
        
        {/* Processing Time Trend */}
        <div className="card chart-card">
          <h2>Processing Time Trend</h2>
          <div className="chart-container daily-chart">
            <Line data={processingTimeTrend} options={chartOptions} />
          </div>
        </div>
        
        <div className="charts-row">
          {/* Agent Performance */}
          <div className="card chart-card">
            <h2>Agent Performance</h2>
            <div className="chart-container">
              <Bar 
                data={{
                  labels: stats.agentPerformance?.map(agent => agent.name) || [],
                  datasets: [{
                    label: 'Avg. Review Time (min)',
                    data: stats.agentPerformance?.map(agent => agent.avgTime) || [],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                  }, {
                    label: 'Accuracy (%)',
                    data: stats.agentPerformance?.map(agent => agent.accuracy) || [],
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                  }]
                }}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Time (minutes)'
                      }
                    },
                    y1: {
                      position: 'right',
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Accuracy (%)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* System Performance */}
          <div className="card chart-card">
            <h2>System Performance</h2>
            <div className="chart-container">
              <Line 
                data={{
                  labels: stats.systemPerformance?.map(perf => perf.hour) || [],
                  datasets: [{
                    label: 'Response Time (ms)',
                    data: stats.systemPerformance?.map(perf => perf.responseTime) || [],
                    backgroundColor: 'rgba(231, 76, 60, 0.3)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                  }, {
                    label: 'Requests per Minute',
                    data: stats.systemPerformance?.map(perf => perf.requestsPerMinute) || [],
                    backgroundColor: 'rgba(52, 152, 219, 0.3)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    yAxisID: 'y1'
                  }]
                }}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Response Time (ms)'
                      }
                    },
                    y1: {
                      position: 'right',
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Requests/Min'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Operational Recommendations */}
        <div className="card insights-card">
          <h2>Operational Recommendations</h2>
          <ul className="insights-list">
            {stats.operationalRecommendations?.map((recommendation, index) => (
              <li key={index} className="insight-item">
                <span className="insight-indicator"></span>
                <p>{recommendation}</p>
              </li>
            )) || (
              <li className="insight-item">
                <span className="insight-indicator"></span>
                <p>No operational recommendations available</p>
              </li>
            )}
          </ul>
        </div>
      </>
    );
  };
  
  const renderFraudTab = () => {
    if (!stats) return null;
    
    // Fraud detection stats
    const fraudData = {
      labels: Object.keys(stats.failureReasons || {}),
      datasets: [{
        label: 'Count',
        data: Object.values(stats.failureReasons || {}),
        backgroundColor: [
          'rgba(231, 76, 60, 0.7)',
          'rgba(243, 156, 18, 0.7)',
          'rgba(155, 89, 182, 0.7)',
          'rgba(52, 152, 219, 0.7)',
          'rgba(149, 165, 166, 0.7)'
        ],
        borderWidth: 1
      }]
    };
    
    return (
      <>
        <h2 className="section-title">Fraud Detection & Analysis</h2>
        
        {/* Fraud Summary */}
        <div className="analytics-summary">
          <div className="summary-card rejected">
            <h3>Potential Fraud Attempts</h3>
            <p className="summary-value">{stats.potentialFraudCount || 0}</p>
            <p className="summary-percentage">
              {stats.totalRequests ? 
                `(${((stats.potentialFraudCount || 0) / stats.totalRequests * 100).toFixed(1)}%)` : 
                '(0%)'
              }
            </p>
          </div>
          <div className="summary-card">
            <h3>False Positive Rate</h3>
            <p className="summary-value">{stats.falsePositiveRate || '0%'}</p>
          </div>
          <div className="summary-card">
            <h3>Liveness Check Failures</h3>
            <p className="summary-value">{stats.livenessCheckFailures || 0}</p>
          </div>
          <div className="summary-card">
            <h3>Document Tampering</h3>
            <p className="summary-value">{stats.documentTamperingCount || 0}</p>
          </div>
          <div className="summary-card">
            <h3>Multiple Attempts</h3>
            <p className="summary-value">{stats.multipleAttemptCount || 0}</p>
          </div>
        </div>
        
        {/* Failure Reasons */}
        <div className="card chart-card">
          <h2>Verification Failure Reasons</h2>
          <div className="chart-container daily-chart">
            <Doughnut data={fraudData} options={chartOptions} />
          </div>
        </div>
        
        <div className="charts-row">
          {/* Suspicious Patterns */}
          <div className="card chart-card">
            <h2>Suspicious Pattern Detection</h2>
            <div className="chart-container">
              <Bar 
                data={{
                  labels: stats.suspiciousPatterns?.map(pattern => pattern.type) || [],
                  datasets: [{
                    label: 'Count',
                    data: stats.suspiciousPatterns?.map(pattern => pattern.count) || [],
                    backgroundColor: 'rgba(231, 76, 60, 0.7)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 1
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
          
          {/* Geographic Risk */}
          <div className="card chart-card">
            <h2>Geographic Risk Analysis</h2>
            <div className="chart-container">
              <Bar 
                data={{
                  labels: stats.geographicRisk?.map(risk => risk.location) || [],
                  datasets: [{
                    label: 'Risk Score',
                    data: stats.geographicRisk?.map(risk => risk.riskScore) || [],
                    backgroundColor: 'rgba(243, 156, 18, 0.7)',
                    borderColor: 'rgba(243, 156, 18, 1)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  ...chartOptions,
                  indexAxis: 'y',
                  scales: {
                    x: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Fraud Alerts */}
        <div className="card insights-card alert-card">
          <h2>Fraud Alerts</h2>
          <div className="alert-list">
            {stats.fraudAlerts?.map((alert, index) => (
              <div key={index} className="fraud-alert">
                <div className="alert-header">
                  <div className="alert-title">
                    <FaExclamationTriangle /> {alert.title}
                  </div>
                  <div className="alert-severity" data-severity={alert.severity}>
                    {alert.severity}
                  </div>
                </div>
                <p className="alert-description">{alert.description}</p>
                <div className="alert-footer">
                  <span className="alert-timestamp">{alert.timestamp}</span>
                  <button className="btn btn-sm">View Details</button>
                </div>
              </div>
            )) || (
              <div className="no-alerts">
                <p>No fraud alerts for the selected period</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };
  
  if (loading && !stats) {
    return <div className="loading">Loading analytics data...</div>;
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1 className="page-title">eKYC Analytics</h1>
        <div className="controls-section">
          <div className="date-filter">
            <div className="date-inputs">
              <div className="date-input-group">
                <label htmlFor="from">From</label>
                <div className="date-input-wrapper">
                  <input
                    type="date"
                    id="from"
                    name="from"
                    value={dateRange.from}
                    onChange={handleDateChange}
                    className="form-control"
                  />
                  <span className="date-icon"><FaCalendarAlt /></span>
                </div>
              </div>
              <div className="date-input-group">
                <label htmlFor="to">To</label>
                <div className="date-input-wrapper">
                  <input
                    type="date"
                    id="to"
                    name="to"
                    value={dateRange.to}
                    onChange={handleDateChange}
                    className="form-control"
                  />
                  <span className="date-icon"><FaCalendarAlt /></span>
                </div>
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <button className="btn" onClick={() => setFilters({
              district: 'all',
              gender: 'all',
              ageGroup: 'all',
              deviceType: 'all'
            })}>
              <FaFilter /> Reset Filters
            </button>
            <button className="btn btn-primary" onClick={exportToCsv}>
              <FaDownload /> Export to CSV
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter Bar */}
      <div className="analytics-filters">
        <div className="filter-group">
          <label htmlFor="district">District</label>
          <select 
            id="district" 
            name="district" 
            value={filters.district}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="all">All Districts</option>
            {Object.keys(stats?.districtData || {}).map((district, index) => (
              <option key={index} value={district}>{district}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="gender">Gender</label>
          <select 
            id="gender" 
            name="gender" 
            value={filters.gender}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="ageGroup">Age Group</label>
          <select 
            id="ageGroup" 
            name="ageGroup" 
            value={filters.ageGroup}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="all">All Ages</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46+">46+</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="deviceType">Device</label>
          <select 
            id="deviceType" 
            name="deviceType" 
            value={filters.deviceType}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="all">All Devices</option>
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Tab Navigation */}
      <div className="analytics-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartPie /> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          <FaExchangeAlt /> Verification Funnel
        </button>
        <button 
          className={`tab-button ${activeTab === 'geographic' ? 'active' : ''}`}
          onClick={() => setActiveTab('geographic')}
        >
          <FaMapMarkerAlt /> Geographic
        </button>
        <button 
          className={`tab-button ${activeTab === 'demographics' ? 'active' : ''}`}
          onClick={() => setActiveTab('demographics')}
        >
          <FaUser /> Demographics
        </button>
        <button 
          className={`tab-button ${activeTab === 'operational' ? 'active' : ''}`}
          onClick={() => setActiveTab('operational')}
        >
          <FaClock /> Operational
        </button>
        <button 
          className={`tab-button ${activeTab === 'fraud' ? 'active' : ''}`}
          onClick={() => setActiveTab('fraud')}
        >
          <FaExclamationTriangle /> Fraud Detection
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="analytics-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Analytics;