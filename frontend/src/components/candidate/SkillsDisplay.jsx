import { Award, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import toast from 'react-hot-toast';

const SkillsDisplay = ({ resume, editable = true }) => {
  const [skills, setSkills] = useState(resume.analysis_data?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { updateResumeAnalysis } = useResumeStore();

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    setNewSkill('');
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    try {
      await updateResumeAnalysis(resume.id, {
        ...resume.analysis_data,
        skills: skills,
      });
      setIsEditing(false);
      toast.success('Skills updated successfully!');
    } catch (error) {
      console.error('Failed to update skills:', error);
    }
  };

  if (!skills || skills.length === 0) {
    return (
      <div className="alert alert-info small mb-0">
        <Award size={16} className="me-2" />
        No skills extracted yet. Upload your resume to analyze skills.
      </div>
    );
  }

  return (
    <div className="border rounded p-3 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 fw-bold">
          <Award size={18} className="me-2 text-primary" />
          Extracted Skills
        </h6>
        {editable && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-sm btn-outline-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Skills'}
          </button>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="badge bg-primary d-flex align-items-center gap-1"
            style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
          >
            <CheckCircle size={14} />
            {skill}
            {isEditing && (
              <button
                onClick={() => handleRemoveSkill(index)}
                className="btn-close btn-close-white ms-1"
                style={{ fontSize: '0.5rem' }}
                aria-label="Remove"
              ></button>
            )}
          </span>
        ))}
      </div>

      {isEditing && (
        <>
          <div className="input-group input-group-sm mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Add new skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <button
              onClick={handleAddSkill}
              className="btn btn-outline-secondary"
            >
              Add
            </button>
          </div>
          <button
            onClick={handleSave}
            className="btn btn-sm btn-success w-100"
          >
            Save Changes
          </button>
        </>
      )}

      <div className="mt-2">
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          {editable 
            ? 'AI-extracted skills from your resume. You can edit them.'
            : 'Skills identified in candidate\'s resume'
          }
        </small>
      </div>
    </div>
  );
};

export default SkillsDisplay;