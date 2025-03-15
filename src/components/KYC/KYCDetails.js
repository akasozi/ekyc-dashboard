import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { kycService } from '../../services/api';
import { FaArrowLeft, FaCheck, FaTimes, FaHourglass, FaDownload, FaFileAlt, FaPlay, FaPause } from 'react-icons/fa';
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

const KYCDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
    return <div className="loading">Loading KYC details...</div>;
  }

  if (error) {
    return (
      <div className="kyc-details">
        <div className="error-message">{error}</div>
        <Link to="/kyc" className="back-button">
          <FaArrowLeft /> Back to KYC List
        </Link>
      </div>
    );
  }

  return (
    <div className="kyc-details">
      <div className="kyc-details-header">
        <h1 className="page-title">KYC Verification Details</h1>
        <Link to="/kyc" className="back-button">
          <FaArrowLeft /> Back to KYC List
        </Link>
      </div>
      
      {updateSuccess && (
        <div className="alert alert-success">
          Status updated successfully! Redirecting...
        </div>
      )}
      
      {/* Status Card */}
      <div className="card status-card">
        <div className="detail-row">
          <div className="detail-label">Current Status:</div>
          <div className="detail-value">
            {getStatusBadge(kycData.status)}
          </div>
        </div>
        {kycData.status !== 'pending' && (
          <div className="detail-row">
            <div className="detail-label">Updated At:</div>
            <div className="detail-value">
              {new Date(kycData.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
        {kycData.remarks && (
          <div className="detail-row">
            <div className="detail-label">Remarks:</div>
            <div className="detail-value">{kycData.remarks}</div>
          </div>
        )}
      </div>
      
      {/* User Information */}
      <div className="card detail-section">
        <h2>User Information</h2>
        <div className="detail-row">
          <div className="detail-label">Full Name:</div>
          <div className="detail-value">{kycData.userName || 'N/A'}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Email:</div>
          <div className="detail-value">{kycData.userEmail || 'N/A'}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Phone Number:</div>
          <div className="detail-value">{kycData.userPhone || 'N/A'}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Submission Date:</div>
          <div className="detail-value">
            {new Date(kycData.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* National ID Information */}
      <div className="card detail-section">
        <h2>National ID Information</h2>
        <div className="detail-row">
          <div className="detail-label">ID Number:</div>
          <div className="detail-value">{kycData.nationalId?.idNumber || 'N/A'}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Serial Number:</div>
          <div className="detail-value">{kycData.nationalId?.serialNumber || 'N/A'}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Full Name:</div>
          <div className="detail-value">{kycData.nationalId?.fullName || 'N/A'}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Date of Birth:</div>
          <div className="detail-value">
            {kycData.nationalId?.dateOfBirth ? new Date(kycData.nationalId.dateOfBirth).toLocaleDateString() : 'N/A'}
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Gender:</div>
          <div className="detail-value">{kycData.nationalId?.gender || 'N/A'}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">District of Birth:</div>
          <div className="detail-value">{kycData.nationalId?.districtOfBirth || 'N/A'}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Place of Issue:</div>
          <div className="detail-value">{kycData.nationalId?.placeOfIssue || 'N/A'}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Date of Issue:</div>
          <div className="detail-value">
            {kycData.nationalId?.dateOfIssue ? new Date(kycData.nationalId.dateOfIssue).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>
      
      {/* OCR Extracted Text */}
      <div className="card detail-section">
        <h2>OCR Extracted Text</h2>
        <div className="extracted-text-container">
          <pre className="extracted-text">{kycData.nationalId?.extractedText || 'No extracted text available'}</pre>
        </div>
      </div>
      
      {/* Document Images */}
      <div className="card detail-section">
        <h2>Document Images</h2>
        <div className="documents-grid">
          {kycData.documents && kycData.documents.map((doc, index) => (
            <div key={index} className="document-card">
              {doc.imageUrl ? (
                <img 
                  src={doc.imageUrl} 
                  alt={doc.documentType} 
                  className="document-image"
                />
              ) : (
                <div className="loading-image">
                  <FaFileAlt /> Document Preview Unavailable
                </div>
              )}
              <div className="document-details">
                <h3 className="document-title">{doc.documentType}</h3>
                <a 
                  href={doc.imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-sm"
                  download
                >
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          ))}
          
          {(!kycData.documents || kycData.documents.length === 0) && (
            <div className="no-data">No document images available</div>
          )}
        </div>
      </div>
      
      {/* Liveness Check Results */}
      <div className="card detail-section">
        <h2>Liveness Check</h2>
        <div className="detail-row">
          <div className="detail-label">Status:</div>
          <div className="detail-value">
            {kycData.livenessCheck?.status === 'passed' 
              ? <span className="badge badge-success">Passed</span>
              : <span className="badge badge-danger">Failed</span>}
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Confidence:</div>
          <div className="detail-value">{kycData.livenessCheck?.confidence 
            ? `${(kycData.livenessCheck.confidence * 100).toFixed(2)}%` 
            : 'N/A'}</div>
        </div>
        
        <h3>Liveness Video</h3>
        <LivenessVideoPlayer frames={kycData.livenessCheck?.frames || []} />
        
        <h3>Individual Frames</h3>
        <div className="liveness-frames-grid">
          {kycData.livenessCheck?.frames?.map((frame, index) => (
            <div key={index} className="liveness-frame-card">
              <img 
                src={frame.imageUrl} 
                alt={`Liveness Frame ${index + 1}`} 
                className="liveness-frame"
              />
              <div className="frame-timestamp">
                Timestamp: {new Date(frame.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {(!kycData.livenessCheck?.frames || kycData.livenessCheck.frames.length === 0) && (
            <div className="no-data">No liveness frames available</div>
          )}
        </div>
      </div>
      
      {/* Verification Actions */}
      {kycData.status === 'pending' && (
        <div className="card detail-section">
          <h2>Verification Actions</h2>
          <div className="remarks-field">
            <label htmlFor="remarks">Remarks/Comments:</label>
            <textarea
              id="remarks"
              className="form-control"
              rows="4"
              value={remarks}
              onChange={handleRemarksChange}
              placeholder="Add comments or reason for approval/rejection..."
            ></textarea>
          </div>
          <div className="verification-actions">
            <button 
              className="btn btn-danger" 
              onClick={() => handleUpdateStatus('rejected')}
              disabled={updating}
            >
              <FaTimes /> Reject Verification
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => handleUpdateStatus('approved')}
              disabled={updating}
            >
              <FaCheck /> Approve Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCDetails;