import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { kycService } from '../../services/api';
import { 
  FaArrowLeft, FaCheck, FaTimes, FaHourglass, FaDownload, 
  FaFileAlt, FaPlay, FaPause, FaEnvelope, FaPhone, 
  FaIdCard, FaSearchPlus, FaSearchMinus, FaRedo, FaInfo,
  FaHistory, FaFileImage, FaUserCheck, FaCalendarAlt,
  FaBuilding, FaMapMarkerAlt
} from 'react-icons/fa';
import '../../styles/KYC.css';

// Liveness Video Player Component
const LivenessVideoPlayer = ({ frames }) => {
  const [playing, setPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const playerRef = useRef(null);
  const animationRef = useRef(null);
  
  // Reset current frame index when frames change
  useEffect(() => {
    setCurrentFrameIndex(0);
    setPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [frames]);
  
  // Handle play/pause toggle
  const togglePlayback = () => {
    if (frames.length === 0) return;
    
    setPlaying(!playing);
    if (!playing) {
      // Start playback
      let lastTimestamp = null;
      const frameInterval = 250; // milliseconds between frames (adjust for speed)
      
      const animate = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = timestamp - lastTimestamp;
        
        if (elapsed > frameInterval) {
          lastTimestamp = timestamp;
          setCurrentFrameIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % frames.length;
            return nextIndex;
          });
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Stop playback
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };
  
  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <div className="liveness-video-player">
      {frames.length > 0 ? (
        <>
          <div className="video-container" ref={playerRef}>
            <img 
              src={frames[currentFrameIndex].imageUrl} 
              alt={`Liveness Frame ${currentFrameIndex + 1}`} 
              className="current-frame"
            />
            <div className="video-controls">
              <button 
                className="play-button" 
                onClick={togglePlayback}
                title={playing ? "Pause" : "Play"}
              >
                {playing ? <FaPause /> : <FaPlay />}
              </button>
              <div className="frame-counter">
                Frame {currentFrameIndex + 1} of {frames.length}
              </div>
            </div>
          </div>
          <div className="timeline">
            {frames.map((frame, index) => (
              <div 
                key={index}
                className={`timeline-marker ${index === currentFrameIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentFrameIndex(index);
                  if (playing) {
                    setPlaying(false);
                    if (animationRef.current) {
                      cancelAnimationFrame(animationRef.current);
                    }
                  }
                }}
                title={`Frame ${index + 1}: ${new Date(frame.timestamp).toLocaleTimeString()}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="no-frames-message">No frames available for playback</div>
      )}
    </div>
  );
};

// Format date with time
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    full: date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    })
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

const VerificationStatusCard = ({ status, updatedAt, remarks }) => {
  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return (
          <div className="status-badge status-approved">
            <FaCheck className="status-icon" />
            <span className="status-text">Approved</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="status-badge status-rejected">
            <FaTimes className="status-icon" /> 
            <span className="status-text">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="status-badge status-pending">
            <FaHourglass className="status-icon" /> 
            <span className="status-text">Pending</span>
          </div>
        );
    }
  };

  return (
    <div className="details-card verification-status-card">
      <div className="card-header">
        <h2><FaInfo /> Verification Status</h2>
      </div>
      <div className="card-content">
        <div className="verification-status">
          {getStatusBadge(status)}
        </div>
        
        {updatedAt && status !== 'pending' && (
          <div className="verification-date">
            <FaCalendarAlt className="info-icon" />
            <div className="date-info">
              <div className="date-label">Last Updated</div>
              <div className="date-value">{formatDateTime(updatedAt).full}</div>
            </div>
          </div>
        )}
        
        {remarks && (
          <div className="verification-remarks">
            <h3>Reviewer Remarks</h3>
            <div className="remarks-content">
              {remarks}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OverviewTab = ({ kycData }) => (
  <div className="overview-tab">
    <div className="details-card applicant-info-card">
      <div className="card-header">
        <h2>Applicant Information</h2>
      </div>
      <div className="card-content">
        <div className="applicant-profile">
          <div className="applicant-avatar">{getInitials(kycData.userName)}</div>
          <div className="applicant-details">
            <h3>{kycData.userName || 'Unknown User'}</h3>
            <div className="contact-info">
              {kycData.userEmail && (
                <div className="info-item">
                  <FaEnvelope className="info-icon" /> 
                  <span>{kycData.userEmail}</span>
                </div>
              )}
              {kycData.userPhone && (
                <div className="info-item">
                  <FaPhone className="info-icon" /> 
                  <span>{kycData.userPhone}</span>
                </div>
              )}
              <div className="info-item">
                <FaCalendarAlt className="info-icon" /> 
                <span>Submitted on {formatDateTime(kycData.createdAt).full}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="identity-details">
          <h3>ID Information</h3>
          <div className="identity-grid">
            <div className="identity-item">
              <div className="item-label">ID Number</div>
              <div className="item-value">{kycData.nationalId?.idNumber || 'N/A'}</div>
            </div>
            <div className="identity-item">
              <div className="item-label">Full Name</div>
              <div className="item-value highlight">{kycData.nationalId?.fullName || 'N/A'}</div>
            </div>
            <div className="identity-item">
              <div className="item-label">Date of Birth</div>
              <div className="item-value">
                {kycData.nationalId?.dateOfBirth 
                  ? formatDateTime(kycData.nationalId.dateOfBirth).date 
                  : 'N/A'}
              </div>
            </div>
            <div className="identity-item">
              <div className="item-label">Gender</div>
              <div className="item-value">{kycData.nationalId?.gender || 'N/A'}</div>
            </div>
            <div className="identity-item">
              <div className="item-label">District of Birth</div>
              <div className="item-value">
                {kycData.nationalId?.districtOfBirth || 'N/A'}
              </div>
            </div>
            <div className="identity-item">
              <div className="item-label">Date of Issue</div>
              <div className="item-value">
                {kycData.nationalId?.dateOfIssue 
                  ? formatDateTime(kycData.nationalId.dateOfIssue).date 
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DocumentsTab = ({ documents = [], nationalId = {} }) => {
  const [selectedDocument, setSelectedDocument] = useState(documents[0] || null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  return (
    <div className="documents-tab">
      <div className="document-viewer-section">
        <div className="document-preview">
          {selectedDocument ? (
            <>
              <div className="document-image-container">
                <img 
                  src={selectedDocument.imageUrl} 
                  alt={selectedDocument.documentType} 
                  className="document-preview-image"
                  style={{ 
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                />
              </div>
              <div className="document-controls">
                <button className="document-control-button" onClick={handleZoomIn} title="Zoom In">
                  <FaSearchPlus />
                </button>
                <button className="document-control-button" onClick={handleZoomOut} title="Zoom Out">
                  <FaSearchMinus />
                </button>
                <button className="document-control-button" onClick={handleRotate} title="Rotate">
                  <FaRedo />
                </button>
                <a 
                  href={selectedDocument.imageUrl} 
                  download
                  className="document-control-button"
                  title="Download"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDownload />
                </a>
              </div>
            </>
          ) : (
            <div className="no-document-selected">
              <FaFileAlt className="no-document-icon" />
              <p>No document selected</p>
            </div>
          )}
        </div>
        
        <div className="document-thumbnails">
          {documents.map((doc, index) => (
            <div 
              key={index}
              className={`document-thumbnail ${selectedDocument === doc ? 'active' : ''}`}
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="thumbnail-image-container">
                <img src={doc.imageUrl} alt={doc.documentType} />
              </div>
              <span className="thumbnail-label">{doc.documentType}</span>
            </div>
          ))}
          
          {documents.length === 0 && (
            <div className="no-documents-message">
              No documents available
            </div>
          )}
        </div>
      </div>
      
      <div className="document-details-section">
        <div className="details-card">
          <div className="card-header">
            <h2>
              <FaFileImage /> 
              {selectedDocument ? selectedDocument.documentType : 'Document Details'}
            </h2>
          </div>
          <div className="card-content">
            {selectedDocument ? (
              <div className="document-meta">
                <div className="meta-item">
                  <div className="meta-label">Document Type</div>
                  <div className="meta-value">{selectedDocument.documentType}</div>
                </div>
                {nationalId && nationalId.extractedText && (
                  <div className="extracted-text-section">
                    <h3>Extracted Text</h3>
                    <div className="extracted-text-container">
                      <pre className="extracted-text">{nationalId.extractedText}</pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-document-details">
                <p>Select a document to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VerificationTab = ({ livenessCheck = {} }) => (
  <div className="verification-tab">
    <div className="details-card liveness-card">
      <div className="card-header">
        <h2><FaUserCheck /> Liveness Check</h2>
        {livenessCheck.status && (
          <div className={`liveness-status ${livenessCheck.status}`}>
            {livenessCheck.status === 'passed' ? 'Passed' : 'Failed'}
          </div>
        )}
      </div>
      <div className="card-content">
        {livenessCheck.confidence && (
          <div className="confidence-meter">
            <div className="confidence-label">Confidence Score</div>
            <div className="confidence-bar-container">
              <div 
                className="confidence-bar" 
                style={{ width: `${livenessCheck.confidence * 100}%` }}
              ></div>
            </div>
            <div className="confidence-value">
              {(livenessCheck.confidence * 100).toFixed(2)}%
            </div>
          </div>
        )}
        
        <div className="liveness-video-section">
          <h3>Liveness Video</h3>
          <LivenessVideoPlayer frames={livenessCheck?.frames || []} />
        </div>
        
        <div className="liveness-frames-section">
          <h3>Individual Frames</h3>
          <div className="liveness-frames-grid">
            {livenessCheck?.frames?.map((frame, index) => (
              <div key={index} className="liveness-frame-card">
                <img 
                  src={frame.imageUrl} 
                  alt={`Liveness Frame ${index + 1}`} 
                  className="liveness-frame"
                />
                <div className="frame-timestamp">
                  Frame {index + 1} • {formatDateTime(frame.timestamp).time}
                </div>
              </div>
            ))}
            
            {(!livenessCheck?.frames || livenessCheck.frames.length === 0) && (
              <div className="no-frames-available">
                <p>No liveness frames available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const KYCDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchKycDetails();
  }, [id]);

  const fetchKycDetails = async () => {
    setLoading(true);
    try {
      const response = await kycService.getById(id);
      setKycData(response);
      setRemarks(response.remarks || '');
    } catch (err) {
      setError('Failed to load KYC details');
      console.error('Error fetching KYC details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    setUpdating(true);
    try {
      await kycService.updateStatus(id, status, remarks);
      setUpdateSuccess(true);
      setKycData({ ...kycData, status });
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate('/kyc');
      }, 2000);
    } catch (err) {
      setError('Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  // Get progress steps
  const getProgressSteps = () => {
    const steps = [
      { name: 'Information', completed: true },
      { name: 'Documents', completed: !!kycData.documents?.length },
      { name: 'Liveness', completed: !!kycData.livenessCheck },
      { name: 'Verification', completed: kycData.status !== 'pending' }
    ];
    
    return steps;
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewTab kycData={kycData} />;
      case 'documents':
        return <DocumentsTab documents={kycData.documents} nationalId={kycData.nationalId} />;
      case 'verification':
        return <VerificationTab livenessCheck={kycData.livenessCheck} />;
      default:
        return <OverviewTab kycData={kycData} />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading verification details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kyc-details-container">
        <div className="error-message">{error}</div>
        <Link to="/kyc" className="back-button">
          <FaArrowLeft /> Back to Verification Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="kyc-details-container">
      {/* Header with breadcrumb and actions */}
      <header className="kyc-details-header">
        <div className="header-content">
          <div className="breadcrumb">
            <Link to="/kyc">Verification Requests</Link> / 
            <span>Request {id.substring(0, 8)}</span>
          </div>
          <h1 className="page-title">Verification Details</h1>
          
          {/* Progress tracker */}
          <div className="progress-tracker">
            {getProgressSteps().map((step, index) => (
              <div 
                key={index} 
                className={`progress-step ${step.completed ? 'completed' : ''}`}
              >
                <div className="step-indicator">
                  {step.completed ? <FaCheck /> : index + 1}
                </div>
                <div className="step-name">{step.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="header-actions">
          <Link to="/kyc" className="back-button">
            <FaArrowLeft /> Back to Requests
          </Link>
          
          {kycData.status === 'pending' && (
            <div className="verification-buttons">
              <button 
                className="reject-button" 
                onClick={() => handleUpdateStatus('rejected')}
                disabled={updating}
              >
                <FaTimes /> Reject
              </button>
              <button 
                className="approve-button" 
                onClick={() => handleUpdateStatus('approved')}
                disabled={updating}
              >
                <FaCheck /> Approve
              </button>
            </div>
          )}
        </div>
      </header>
      
      {updateSuccess && (
        <div className="success-message">
          <FaCheck /> Status updated successfully! Redirecting...
        </div>
      )}
      
      {/* Main content grid layout */}
      <div className="kyc-details-grid">
        {/* Main content area */}
        <div className="kyc-details-main">
          {/* Tabs navigation */}
          <div className="kyc-details-tabs">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button 
              className={`tab-button ${activeTab === 'verification' ? 'active' : ''}`}
              onClick={() => setActiveTab('verification')}
            >
              Verification
            </button>
          </div>
          
          {/* Tab content */}
          <div className="kyc-details-tab-content">
            {renderTabContent()}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="kyc-details-sidebar">
          {/* Verification Status Card */}
          <VerificationStatusCard 
            status={kycData.status} 
            updatedAt={kycData.updatedAt} 
            remarks={kycData.remarks}
          />
          
          {/* Verification Actions */}
          {kycData.status === 'pending' && (
            <div className="details-card verification-actions-card">
              <div className="card-header">
                <h2><FaUserCheck /> Verification Actions</h2>
              </div>
              <div className="card-content">
                <div className="remarks-field">
                  <label htmlFor="remarks">Remarks/Comments:</label>
                  <textarea
                    id="remarks"
                    className="remarks-textarea"
                    rows="4"
                    value={remarks}
                    onChange={handleRemarksChange}
                    placeholder="Add comments or reason for approval/rejection..."
                  ></textarea>
                </div>
                <div className="verification-actions">
                  <button 
                    className="verification-button reject-button" 
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={updating}
                  >
                    <FaTimes /> Reject Verification
                  </button>
                  <button 
                    className="verification-button approve-button" 
                    onClick={() => handleUpdateStatus('approved')}
                    disabled={updating}
                  >
                    <FaCheck /> Approve Verification
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Verification Details Summary */}
          <div className="details-card verification-summary-card">
            <div className="card-header">
              <h2><FaInfo /> Verification Summary</h2>
            </div>
            <div className="card-content">
              <div className="summary-items">
                <div className="summary-item">
                  <div className="summary-label">Verification Type</div>
                  <div className="summary-value">{kycData.verificationType || 'ID Card'}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Submission Date</div>
                  <div className="summary-value">{formatDateTime(kycData.createdAt).date}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Documents Provided</div>
                  <div className="summary-value">{kycData.documents?.length || 0}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Liveness Check</div>
                  <div className="summary-value">
                    {kycData.livenessCheck?.status === 'passed' 
                      ? <span className="check-passed">Passed</span>
                      : <span className="check-failed">Failed or Not Performed</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;