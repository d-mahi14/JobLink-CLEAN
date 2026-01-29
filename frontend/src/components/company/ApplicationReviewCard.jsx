import { User, FileText, Calendar, Download, Award } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useApplicationStore } from '../../store/applicationStore';
import { useState } from 'react';

const ApplicationReviewCard = ({ application }) => {
  if (!application) return null;

  const [status, setStatus] = useState(application.status);
  const [matchScore, setMatchScore] = useState(application.match_score ?? '');
  const [isUpdating, setIsUpdating] = useState(false);

  const { updateApplicationStatus } = useApplicationStore();

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(
        application.id,
        status,
        matchScore === '' ? null : Number(matchScore)
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const statusColors = {
    pending: 'warning',
    reviewed: 'info',
    shortlisted: 'success',
    rejected: 'danger',
    accepted: 'primary',
  };

  return (
    <div className="card border shadow-sm">
      <div className="card-body">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex gap-3 align-items-center">
            {application.profiles?.profile_pic ? (
              <img
                src={application.profiles.profile_pic}
                alt="Candidate"
                className="rounded-circle"
                style={{ width: 60, height: 60, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                style={{ width: 60, height: 60 }}
              >
                <User size={28} />
              </div>
            )}

            <div>
              <h5 className="mb-1 fw-bold">
                {application.profiles?.full_name}
              </h5>
              <p className="mb-0 small text-muted">
                {application.profiles?.email}
              </p>
            </div>
          </div>

          <span className={`badge bg-${statusColors[status]} text-uppercase`}>
            {status}
          </span>
        </div>

        {/* Meta info */}
        <div className="row g-2 small text-muted mb-3">
          <div className="col-md-6">
            <Calendar size={14} className="me-2" />
            Applied {formatDate(application.applied_at)}
          </div>
          <div className="col-md-6">
            <FileText size={14} className="me-2" />
            {application.resumes?.file_name}
          </div>
        </div>

        {/* Skills */}
        {application.resumes?.analysis_data?.skills && (
          <div className="mb-3">
            <h6 className="fw-bold mb-2">
              <Award size={16} className="me-2" />
              Extracted Skills
            </h6>
            <div className="d-flex flex-wrap gap-1">
              {application.resumes.analysis_data.skills.map((skill, idx) => (
                <span key={idx} className="badge bg-light text-dark border">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Match score */}
        {matchScore !== '' && (
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <small className="fw-semibold">Match Score</small>
              <small className="fw-bold text-primary">{matchScore}%</small>
            </div>
            <div className="progress" style={{ height: 8 }}>
              <div
                className="progress-bar bg-primary"
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>
        )}

        <hr />

        {/* Actions */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Update Status</label>
            <select
              className="form-select form-select-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">
              Match Score (0–100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="form-control form-control-sm"
              value={matchScore}
              onChange={(e) => setMatchScore(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <a
            href={application.resumes?.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-secondary"
          >
            {console.log("Resume URL:", application.resumes?.resume_url)}
            <Download size={16} className="me-1" />
            Download Resume
          </a>

          <button
            className="btn btn-sm btn-primary"
            onClick={handleUpdateStatus}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating…' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReviewCard;
