import { FileText, Download, Trash2, Calendar, Award } from 'lucide-react';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { useResumeStore } from '../../store/resumeStore';
import SkillsDisplay from './SkillsDisplay';

const ResumeCard = ({ resume }) => {
  const { deleteResume } = useResumeStore();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resume? This will also remove all extracted skills.')) {
      await deleteResume(resume.id);
    }
  };

  return (
    <div className="card border shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white p-3 rounded">
              <FileText size={24} />
            </div>
            <div>
              <h5 className="card-title mb-1">{resume.file_name}</h5>
              <p className="text-muted small mb-0">
                {formatFileSize(resume.file_size)}
              </p>
            </div>
          </div>
          {resume.analysis_data?.score && (
            <div 
              className="position-relative d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold"
              style={{ width: '60px', height: '60px' }}
            >
              {resume.analysis_data.score}%
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2 text-muted small mb-3">
          <Calendar size={14} />
          <span>Uploaded {formatDate(resume.created_at)}</span>
        </div>

        {/* Skills Display */}
        <SkillsDisplay resume={resume} editable={true} />

        <div className="d-flex gap-2 mt-3">
          <a 
            href={resume.resume_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary flex-fill"
          >
            <Download size={14} className="me-1" />
            Download
          </a>
          <button 
            onClick={handleDelete} 
            className="btn btn-sm btn-outline-danger"
          >
            <Trash2 size={14} className="me-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;