import { MapPin, IndianRupee , Building, Calendar, Send } from 'lucide-react';
import { formatDate, truncateText } from '../../utils/formatters';
import { useState } from 'react';
import { useApplicationStore } from '../../store/applicationStore';
import { useResumeStore } from '../../store/resumeStore';

const JobCard = ({ job }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const { applyForJob } = useApplicationStore();
  const { resumes } = useResumeStore();

  const handleApply = async () => {
    if (!selectedResumeId) {
      alert('Please select a resume');
      return;
    }

    try {
      await applyForJob(job.id, selectedResumeId);
      setShowApplyModal(false);
    } catch (error) {
      console.error('Application failed:', error);
    }
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="card-body">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="card-title text-xl">{job.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Building className="w-4 h-4" />
                <span>{job.profiles?.full_name || 'Company'}</span>
              </div>
            </div>
            {job.profiles?.profile_pic && (
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img src={job.profiles.profile_pic} alt="Company" />
                </div>
              </div>
            )}
          </div>

          <p className="text-gray-600 mt-3">{truncateText(job.description, 150)}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            {job.location && (
              <div className="badge badge-outline">
                <MapPin className="w-3 h-3 mr-1" />
                {job.location}
              </div>
            )}
            {job.salary_range && (
              <div className="badge badge-outline">
                <IndianRupee className="w-3 h-3 mr-1" />
                {job.salary_range}
              </div>
            )}
            <div className="badge badge-ghost">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(job.created_at)}
            </div>
          </div>

          <div className="card-actions justify-end mt-4">
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Send className="w-4 h-4 mr-1" />
              Quick Apply
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Apply for {job.title}</h3>
            <div className="py-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Select a resume</span>
                </div>
                <select
                  className="select select-bordered"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                >
                  <option value="">Choose resume...</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.file_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowApplyModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleApply}>
                Submit Application
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowApplyModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default JobCard;
