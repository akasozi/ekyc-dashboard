import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, FaCreditCard, FaMoneyBillWave, FaHistory, 
  FaPlus, FaUniversity, FaMobileAlt, FaCopy, FaCheck 
} from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/Billing.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Billing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [creditInfo, setCreditInfo] = useState(null);
  const [usageHistory, setUsageHistory] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  // Mock data for credit packages
  const creditPackages = [
    { id: 1, name: 'Basic', credits: 1000, price: 500 },
    { id: 2, name: 'Standard', credits: 5000, price: 2000, popular: true },
    { id: 3, name: 'Premium', credits: 10000, price: 3500 },
    { id: 4, name: 'Enterprise', credits: 25000, price: 7500 }
  ];

  // Mock reference for bank transfer
  const bankReference = `EKYC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  useEffect(() => {
    // Simulate loading mock data
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network request
      
      // Mock credit info
      setCreditInfo({
        totalPurchased: 10000,
        remaining: 3450,
        usedThisMonth: 1250,
        plan: 'Standard'
      });
      
      // Mock usage history (last 7 days)
      const mockUsageHistory = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        mockUsageHistory.push({
          date: date.toISOString().split('T')[0],
          idVerifications: Math.floor(Math.random() * 15) + 5,
          livenessChecks: Math.floor(Math.random() * 10) + 3,
          textExtractions: Math.floor(Math.random() * 20) + 10,
          totalCredits: 0 // Will calculate below
        });
      }
      
      // Calculate total credits
      mockUsageHistory.forEach(day => {
        day.totalCredits = (day.idVerifications * 5) + (day.livenessChecks * 3) + (day.textExtractions * 2);
      });
      
      setUsageHistory(mockUsageHistory);
      
      // Mock billing history
      setBillingHistory([
        {
          id: 'INV-2023-001',
          date: '2023-09-10',
          amount: 2000,
          status: 'paid',
          method: 'M-PESA',
          reference: '5FGH78JK',
          credits: 5000
        },
        {
          id: 'INV-2023-002',
          date: '2023-08-15',
          amount: 3500,
          status: 'paid',
          method: 'Bank Transfer',
          reference: 'EKYC-7DFG23',
          credits: 10000
        },
        {
          id: 'INV-2023-003',
          date: '2023-07-22',
          amount: 500,
          status: 'paid',
          method: 'M-PESA',
          reference: '3DFR67YH',
          credits: 1000
        }
      ]);
      
      setLoadingData(false);
    };
    
    fetchData();
  }, []);

  // Simulate MPESA payment process
  const handleMpesaPayment = async () => {
    if (!phoneNumber || !selectedPackage) return;
    
    setPaymentProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPaymentProcessing(false);
    setPaymentComplete(true);
    
    // Update credit info after successful payment
    setCreditInfo(prev => ({
      ...prev,
      totalPurchased: prev.totalPurchased + selectedPackage.credits,
      remaining: prev.remaining + selectedPackage.credits
    }));
    
    // Add to billing history
    const newTransaction = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: selectedPackage.price,
      status: 'paid',
      method: 'M-PESA',
      reference: Math.random().toString(36).substr(2, 8).toUpperCase(),
      credits: selectedPackage.credits
    };
    
    setBillingHistory(prev => [newTransaction, ...prev]);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentComplete(false);
      setSelectedPackage(null);
      setPhoneNumber('');
    }, 2000);
  };

  // Simulate bank transfer notification
  const handleBankTransferNotification = () => {
    // Add pending transaction to billing history
    const newTransaction = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: selectedPackage.price,
      status: 'pending',
      method: 'Bank Transfer',
      reference: bankReference,
      credits: selectedPackage.credits
    };
    
    setBillingHistory(prev => [newTransaction, ...prev]);
    setShowPaymentModal(false);
    setSelectedPackage(null);
  };

  // Copy reference to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Chart data for usage history
  const usageChartData = {
    labels: usageHistory.map(day => day.date),
    datasets: [
      {
        label: 'Total Credits Used',
        data: usageHistory.map(day => day.totalCredits),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart data for usage breakdown
  const breakdownChartData = {
    labels: ['ID Verifications', 'Liveness Checks', 'Text Extractions'],
    datasets: [
      {
        label: 'Credits per Operation',
        data: [5, 3, 2],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart data for API call distribution
  const apiCallsChartData = {
    labels: usageHistory.map(day => day.date),
    datasets: [
      {
        label: 'ID Verifications',
        data: usageHistory.map(day => day.idVerifications),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Liveness Checks',
        data: usageHistory.map(day => day.livenessChecks),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Text Extractions',
        data: usageHistory.map(day => day.textExtractions),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

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
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'usage':
        return renderUsageHistory();
      case 'billing':
        return renderBillingHistory();
      default:
        return renderOverview();
    }
  };

  // Overview tab content
  const renderOverview = () => {
    if (loadingData) {
      return <div className="loading-container">Loading credit information...</div>;
    }
    
    return (
      <>
        <div className="credit-status-section">
          <div className="credit-status-card primary-card">
            <div className="card-header">
              <h3>Credit Balance</h3>
            </div>
            <div className="credit-balance">
              <span className="credit-amount">{creditInfo.remaining.toLocaleString()}</span>
              <span className="credit-label">credits remaining</span>
            </div>
            
            <div className="credit-progress">
              <div className="progress-bar" 
                style={{ width: `${(creditInfo.remaining / creditInfo.totalPurchased) * 100}%` }}>
              </div>
            </div>
            
            <div className="credit-details">
              <div className="detail-item">
                <span className="detail-label">Total Purchased:</span>
                <span className="detail-value">{creditInfo.totalPurchased.toLocaleString()} credits</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Used This Month:</span>
                <span className="detail-value">{creditInfo.usedThisMonth.toLocaleString()} credits</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Current Plan:</span>
                <span className="detail-value">{creditInfo.plan}</span>
              </div>
            </div>
            
            <div className="credit-actions">
              <button className="btn btn-primary" onClick={() => {
                setSelectedPackage(null);
                setShowPaymentModal(true);
              }}>
                <FaPlus /> Purchase Credits
              </button>
            </div>
          </div>
          
          <div className="info-cards">
            <div className="billing-info-card">
              <div className="card-icon">
                <FaCreditCard />
              </div>
              <div className="card-content">
                <h4>Cost per Operation</h4>
                <div className="info-details">
                  <div className="info-item">
                    <span className="info-label">ID Verification:</span>
                    <span className="info-value">5 credits</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Liveness Check:</span>
                    <span className="info-value">3 credits</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Text Extraction:</span>
                    <span className="info-value">2 credits</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="billing-info-card">
              <div className="card-icon">
                <FaMoneyBillWave />
              </div>
              <div className="card-content">
                <h4>Credit Pricing</h4>
                <div className="info-details">
                  <div className="info-item">
                    <span className="info-label">1,000 credits:</span>
                    <span className="info-value">KES 500</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">5,000 credits:</span>
                    <span className="info-value">KES 2,000</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">10,000 credits:</span>
                    <span className="info-value">KES 3,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-section">
          <div className="chart-card">
            <h3>Credit Usage (Last 7 Days)</h3>
            <div className="chart-container usage-chart">
              <Line 
                data={usageChartData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Daily Credit Consumption'
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          <div className="chart-card">
            <h3>API Calls Distribution</h3>
            <div className="chart-container distribution-chart">
              <Bar 
                data={apiCallsChartData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'API Calls by Type'
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="recent-activity">
          <h3>Recent Transactions</h3>
          <div className="table-responsive">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Credits</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.slice(0, 3).map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.date}</td>
                    <td>KES {transaction.amount.toLocaleString()}</td>
                    <td>{transaction.credits.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="view-all">
            <button className="btn-link" onClick={() => setActiveTab('billing')}>
              View All Transactions
            </button>
          </div>
        </div>
      </>
    );
  };

  // Usage history tab content
  const renderUsageHistory = () => {
    if (loadingData) {
      return <div className="loading-container">Loading usage data...</div>;
    }
    
    // Calculate total credits by type
    const totalIdVerificationCredits = usageHistory.reduce((sum, day) => sum + (day.idVerifications * 5), 0);
    const totalLivenessCredits = usageHistory.reduce((sum, day) => sum + (day.livenessChecks * 3), 0);
    const totalExtractionCredits = usageHistory.reduce((sum, day) => sum + (day.textExtractions * 2), 0);
    const totalCredits = totalIdVerificationCredits + totalLivenessCredits + totalExtractionCredits;
    
    // Data for pie chart
    const usageBreakdownData = {
      labels: ['ID Verifications', 'Liveness Checks', 'Text Extractions'],
      datasets: [
        {
          data: [totalIdVerificationCredits, totalLivenessCredits, totalExtractionCredits],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    return (
      <>
        <div className="usage-summary">
          <div className="summary-card">
            <h3>Total Credits Used</h3>
            <div className="summary-value">{totalCredits.toLocaleString()}</div>
            <div className="summary-period">Last 7 days</div>
          </div>
          
          <div className="summary-card">
            <h3>ID Verifications</h3>
            <div className="summary-value">{usageHistory.reduce((sum, day) => sum + day.idVerifications, 0)}</div>
            <div className="summary-credits">{totalIdVerificationCredits.toLocaleString()} credits</div>
          </div>
          
          <div className="summary-card">
            <h3>Liveness Checks</h3>
            <div className="summary-value">{usageHistory.reduce((sum, day) => sum + day.livenessChecks, 0)}</div>
            <div className="summary-credits">{totalLivenessCredits.toLocaleString()} credits</div>
          </div>
          
          <div className="summary-card">
            <h3>Text Extractions</h3>
            <div className="summary-value">{usageHistory.reduce((sum, day) => sum + day.textExtractions, 0)}</div>
            <div className="summary-credits">{totalExtractionCredits.toLocaleString()} credits</div>
          </div>
        </div>
        
        <div className="chart-section double">
          <div className="chart-card">
            <h3>Usage Breakdown</h3>
            <div className="chart-container">
              <Bar data={breakdownChartData} options={chartOptions} />
            </div>
          </div>
          
          <div className="chart-card">
            <h3>Credit Distribution</h3>
            <div className="chart-container">
              <Bar 
                data={usageBreakdownData} 
                options={{
                  ...chartOptions,
                  indexAxis: 'y'
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="usage-details">
          <h3>Daily Usage Details</h3>
          <div className="table-responsive">
            <table className="usage-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>ID Verifications</th>
                  <th>Liveness Checks</th>
                  <th>Text Extractions</th>
                  <th>Total Credits</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.map((day, index) => (
                  <tr key={index}>
                    <td>{day.date}</td>
                    <td>{day.idVerifications} ({day.idVerifications * 5} credits)</td>
                    <td>{day.livenessChecks} ({day.livenessChecks * 3} credits)</td>
                    <td>{day.textExtractions} ({day.textExtractions * 2} credits)</td>
                    <td>{day.totalCredits}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td>
                    {usageHistory.reduce((sum, day) => sum + day.idVerifications, 0)} 
                    ({totalIdVerificationCredits} credits)
                  </td>
                  <td>
                    {usageHistory.reduce((sum, day) => sum + day.livenessChecks, 0)} 
                    ({totalLivenessCredits} credits)
                  </td>
                  <td>
                    {usageHistory.reduce((sum, day) => sum + day.textExtractions, 0)} 
                    ({totalExtractionCredits} credits)
                  </td>
                  <td><strong>{totalCredits}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </>
    );
  };

  // Billing history tab content
  const renderBillingHistory = () => {
    if (loadingData) {
      return <div className="loading-container">Loading billing history...</div>;
    }
    
    return (
      <>
        <div className="billing-actions">
          <h3>Transaction History</h3>
          <button className="btn btn-primary" onClick={() => {
            setSelectedPackage(null);
            setShowPaymentModal(true);
          }}>
            <FaPlus /> Purchase Credits
          </button>
        </div>
        
        <div className="table-responsive">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Credits</th>
                <th>Payment Method</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.date}</td>
                  <td>KES {transaction.amount.toLocaleString()}</td>
                  <td>{transaction.credits.toLocaleString()}</td>
                  <td>{transaction.method}</td>
                  <td>{transaction.reference}</td>
                  <td>
                    <span className={`status-badge ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="billing-dashboard">
      <h1 className="page-title">Billing & Credits</h1>
      
      {/* Tab Navigation */}
      <div className="billing-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine /> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'usage' ? 'active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          <FaCreditCard /> Usage History
        </button>
        <button 
          className={`tab-button ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          <FaHistory /> Billing History
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <h3>Purchase Credits</h3>
              <button 
                className="close-button"
                onClick={() => {
                  if (!paymentProcessing) {
                    setShowPaymentModal(false);
                    setSelectedPackage(null);
                  }
                }}
              >
                &times;
              </button>
            </div>
            
            {paymentComplete ? (
              <div className="payment-success">
                <div className="success-icon">✓</div>
                <h4>Payment Successful!</h4>
                <p>Your account has been credited with {selectedPackage.credits.toLocaleString()} credits.</p>
              </div>
            ) : (
              <>
                <div className="package-options">
                  {creditPackages.map(pkg => (
                    <div 
                      key={pkg.id} 
                      className={`package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''} ${pkg.popular ? 'popular' : ''}`}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      {pkg.popular && <div className="popular-tag">Popular</div>}
                      <h4>{pkg.name}</h4>
                      <div className="package-credits">{pkg.credits.toLocaleString()} credits</div>
                      <div className="package-price">KES {pkg.price.toLocaleString()}</div>
                      <div className="package-value">KES {(pkg.price / pkg.credits).toFixed(2)} per credit</div>
                    </div>
                  ))}
                </div>
                
                {selectedPackage && (
                  <>
                    <div className="payment-methods">
                      <button 
                        className={`method-button ${paymentMethod === 'mpesa' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('mpesa')}
                      >
                        <FaMobileAlt /> M-PESA
                      </button>
                      <button 
                        className={`method-button ${paymentMethod === 'bank' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('bank')}
                      >
                        <FaUniversity /> Bank Transfer
                      </button>
                    </div>
                    
                    {paymentMethod === 'mpesa' ? (
                      <div className="mpesa-payment">
                        <div className="payment-summary">
                          <div className="summary-row">
                            <span>Package:</span>
                            <span>{selectedPackage.name}</span>
                          </div>
                          <div className="summary-row">
                            <span>Credits:</span>
                            <span>{selectedPackage.credits.toLocaleString()}</span>
                          </div>
                          <div className="summary-row total">
                            <span>Total Amount:</span>
                            <span>KES {selectedPackage.price.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="phone-input">
                          <label htmlFor="phone">M-PESA Phone Number</label>
                          <input 
                            type="text" 
                            id="phone" 
                            placeholder="e.g. 254712345678" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={paymentProcessing}
                          />
                        </div>
                        
                        <button 
                          className="btn btn-primary payment-button"
                          onClick={handleMpesaPayment}
                          disabled={paymentProcessing || !phoneNumber}
                        >
                          {paymentProcessing ? 'Processing...' : 'Pay with M-PESA'}
                        </button>
                        
                        <div className="payment-note">
                          You will receive an STK push notification on your phone to complete the payment.
                        </div>
                      </div>
                    ) : (
                      <div className="bank-transfer">
                        <div className="payment-summary">
                          <div className="summary-row">
                            <span>Package:</span>
                            <span>{selectedPackage.name}</span>
                          </div>
                          <div className="summary-row">
                            <span>Credits:</span>
                            <span>{selectedPackage.credits.toLocaleString()}</span>
                          </div>
                          <div className="summary-row total">
                            <span>Total Amount:</span>
                            <span>KES {selectedPackage.price.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="bank-details">
                          <h4>Bank Transfer Details</h4>
                          
                          <div className="bank-detail">
                            <span className="detail-label">Bank Name:</span>
                            <span className="detail-value">Kenya Commercial Bank</span>
                          </div>
                          
                          <div className="bank-detail">
                            <span className="detail-label">Account Name:</span>
                            <span className="detail-value">eKYC Platform Ltd</span>
                          </div>
                          
                          <div className="bank-detail">
                            <span className="detail-label">Account Number:</span>
                            <span className="detail-value">1234567890</span>
                          </div>
                          
                          <div className="bank-detail">
                            <span className="detail-label">Branch Code:</span>
                            <span className="detail-value">01</span>
                          </div>
                          
                          <div className="bank-detail reference">
                            <span className="detail-label">Reference Number:</span>
                            <span className="detail-value">{bankReference}</span>
                            <button 
                              className="copy-btn" 
                              onClick={() => copyToClipboard(bankReference)}
                              title="Copy to clipboard"
                            >
                              {copied ? <FaCheck /> : <FaCopy />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="important-note">
                          <p>Important: Include the reference number in your transaction description 
                            to ensure proper crediting of your account.</p>
                        </div>
                        
                        <button 
                          className="btn btn-primary payment-button"
                          onClick={handleBankTransferNotification}
                        >
                          I've Completed the Transfer
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;