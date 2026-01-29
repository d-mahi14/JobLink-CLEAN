import { useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJobStore } from '../../store/jobStore';
import JobPostCard from '../../components/company/JobPostCard';
import EmptyState from '../../components/shared/EmptyState';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const MyJobPostings = () => {
  const { myJobs, fetchMyJobs, isLoading } = useJobStore();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  if (isLoading && myJobs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Job Postings</h1>
          <p className="text-gray-500 mt-1">Manage all your job listings</p>
        </div>
        <Link to="/company/create-job" className="btn btn-primary">
          Post New Job
        </Link>
      </div>

      {myJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job postings yet"
          description="Create your first job posting to start receiving applications"
          action={
            <Link to="/company/create-job" className="btn btn-primary">
              Post Your First Job
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myJobs.map((job) => (
            <JobPostCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobPostings;
