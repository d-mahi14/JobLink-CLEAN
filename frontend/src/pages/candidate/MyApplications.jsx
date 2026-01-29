import { useEffect } from 'react';
import { Send } from 'lucide-react';
import { useApplicationStore } from '../../store/applicationStore';
import ApplicationCard from '../../components/candidate/ApplicationCard';
import EmptyState from '../../components/shared/EmptyState';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const { myApplications, fetchMyApplications, isLoading } = useApplicationStore();

  useEffect(() => {
    fetchMyApplications();
  }, []);

  if (isLoading && myApplications.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-gray-500 mt-1">
          Track all your job applications in one place
        </p>
      </div>

      {myApplications.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No applications yet"
          description="Start applying to jobs to see your applications here"
          action={
            <Link to="/candidate/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
