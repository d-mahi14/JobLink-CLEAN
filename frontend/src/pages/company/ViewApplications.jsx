import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useApplicationStore } from '../../store/applicationStore';
import { useJobStore } from '../../store/jobStore';
import ApplicationReviewCard from '../../components/company/ApplicationReviewCard';
import EmptyState from '../../components/shared/EmptyState';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const ViewApplications = () => {
  const { jobId } = useParams();
  const { jobApplications, fetchJobApplications, isLoading } = useApplicationStore();
  const { currentJob, fetchJobById } = useJobStore();

  useEffect(() => {
    fetchJobApplications(jobId);
    fetchJobById(jobId);
  }, [jobId]);

  if (isLoading && jobApplications.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {currentJob?.title || 'Job Applications'}
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage applications for this position
        </p>
      </div>

      {jobApplications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applications yet"
          description="Applications will appear here once candidates start applying"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobApplications.map((application) => (
            <ApplicationReviewCard
              key={application.id}
              application={application}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
