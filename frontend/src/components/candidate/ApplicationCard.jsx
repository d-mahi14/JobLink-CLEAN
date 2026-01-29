import { Building, Calendar, FileText } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import Badge from '../shared/Badge';
import { useApplicationStore } from '../../store/applicationStore';

const ApplicationCard = ({ application }) => {
  const { withdrawApplication } = useApplicationStore();

  const handleWithdraw = async () => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      await withdrawApplication(application.id);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="card-title">{application.job_postings?.title}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Building className="w-4 h-4" />
              <span>{application.job_postings?.profiles?.full_name}</span>
            </div>
          </div>
          <Badge status={application.status} />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Applied {formatDate(application.applied_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{application.resumes?.file_name}</span>
          </div>
        </div>

        {application.match_score && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Match Score</span>
              <span className="font-semibold">{application.match_score}%</span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={application.match_score}
              max="100"
            ></progress>
          </div>
        )}

        {application.status === 'pending' && (
          <div className="card-actions justify-end mt-4">
            <button onClick={handleWithdraw} className="btn btn-error btn-outline btn-sm">
              Withdraw Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;