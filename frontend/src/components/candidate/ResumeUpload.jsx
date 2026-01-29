import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { useFileUpload } from '../../hooks/useFileUpload';
import { validateFile } from '../../utils/validators';
import toast from 'react-hot-toast';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadResume, resumes } = useResumeStore();
  const { uploadFile, isUploading } = useFileUpload();
  const handleApply = async (jobId, resumeId) => {
    try {
      // Call your Node.js API to apply for the job
      const application = await applicationsAPI.applyForJob(jobId, resumeId);
      
      // You can show the match score in UI or console
      console.log('Match Score:', application.match_score);
      toast.success(`Application submitted! Match Score: ${application.match_score}`);
    } catch (error) {
      console.error('Job application failed:', error);
      toast.error('Failed to apply for the job. Please try again later.');
    }
  };


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if user already has a resume
    if (resumes.length >= 1) {
      toast.error('You can only upload 1 resume. Please delete the existing one first.');
      e.target.value = null;
      return;
    }

    const errors = validateFile(file);
    if (errors.length > 0) {
      toast.error(errors.join(', '));
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      await uploadFile(selectedFile, async (base64) => {
        await uploadResume(base64, selectedFile.name);
      });
      setSelectedFile(null);
      // Reset file input
      document.getElementById('resume-input').value = null;
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    document.getElementById('resume-input').value = null;
  };

  // Don't show upload form if already has a resume
  if (resumes.length >= 1) {
    return (
      <div className="alert alert-info d-flex align-items-center">
        <FileText className="me-2" size={20} />
        <div>
          <strong>Resume limit reached</strong>
          <p className="mb-0 small">You can only upload 1 resume. Delete your existing resume to upload a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <Upload size={20} className="me-2" />
          Upload Your Resume
        </h5>
        
        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Select Resume File (PDF, DOC, DOCX - Max 5MB)
          </label>
          <input
            id="resume-input"
            type="file"
            className="form-control"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
          />
          <div className="form-text">
            Only PDF and Word documents are supported
          </div>
        </div>

        {selectedFile && (
          <div className="alert alert-primary d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FileText size={20} className="me-2" />
              <span className="small">{selectedFile.name}</span>
            </div>
            <button 
              onClick={clearSelection}
              className="btn btn-sm btn-outline-danger"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <button
          onClick={handleUpload}
          className="btn btn-primary w-100"
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Uploading & Analyzing...
            </>
          ) : (
            <>
              <Upload size={16} className="me-2" />
              Upload & Analyze Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;