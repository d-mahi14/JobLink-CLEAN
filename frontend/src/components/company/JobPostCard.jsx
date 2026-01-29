import { Edit, Trash2, Eye, Users, MapPin } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useJobStore } from '../../store/jobStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { applicationsAPI } from '../../api/applications.api';

const JobPostCard = ({ job }) => {
  const { deleteJob } = useJobStore();
  const navigate = useNavigate();
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    // Fetch application count for this job
    const fetchCount = async () => {
      try {
        const apps = await applicationsAPI.getJobApplications(job.id);
        setApplicationsCount(apps.length);
      } catch (error) {
        console.error('Failed to fetch application count:', error);
      }
    };
    fetchCount();
  }, [job.id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      await deleteJob(job.id);
    }
  };

  const statusColors = {
    active: 'success',
    closed: 'danger',
    draft: 'secondary',
  };

  return (
    <div className="card border shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-1">{job.title}</h5>
            <p className="text-muted small mb-0">
              Posted {formatDate(job.created_at)}
            </p>
          </div>
          <span className={`badge bg-${statusColors[job.status]} text-uppercase`}>
            {job.status}
          </span>
        </div>

        <p className="card-text text-muted small" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {job.description}
        </p>

        <div className="d-flex align-items-center gap-3 mt-3 small text-muted">
          {job.location && (
            <span>
              <MapPin size={14} className="me-1" />
              {job.location}
            </span>
          )}
          <span className="fw-semibold text-primary">
            <Users size={14} className="me-1" />
            {applicationsCount} application{applicationsCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button
            onClick={() => navigate(`/company/applications/${job.id}`)}
            className="btn btn-sm btn-outline-primary flex-fill"
          >
            <Eye size={14} className="me-1" />
            View
          </button>
          <button
            onClick={() => navigate(`/company/edit-job/${job.id}`)}
            className="btn btn-sm btn-outline-info"
          >
            <Edit size={14} />
          </button>
          <button 
            onClick={handleDelete} 
            className="btn btn-sm btn-outline-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostCard;