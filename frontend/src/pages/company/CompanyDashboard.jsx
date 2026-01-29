import { useEffect } from 'react';
import { Briefcase, Users, CheckCircle, Eye } from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import { useJobStore } from '../../store/jobStore';
import { useApplicationStore } from '../../store/applicationStore';
import JobPostCard from '../../components/company/JobPostCard';
import { Link } from 'react-router-dom';

const CompanyDashboard = () => {
  const { myJobs, fetchMyJobs } = useJobStore();
  const { jobApplications } = useApplicationStore();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const stats = {
    activeJobs: myJobs.filter((j) => j.status === 'active').length,
    totalJobs: myJobs.length,
    shortlisted: jobApplications.filter((a) => a.status === 'shortlisted').length,
    positions: myJobs.filter((j) => j.status === 'active').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your job postings and applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
          color="primary"
        />
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={Eye}
          color="secondary"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={CheckCircle}
          color="accent"
        />
        <StatCard
          title="Open Positions"
          value={stats.positions}
          icon={Users}
          color="success"
        />
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title">Recent Job Postings</h2>
            <Link to="/company/jobs" className="btn btn-sm btn-ghost">
              View All
            </Link>
          </div>

          {myJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No job postings yet</p>
              <Link to="/company/create-job" className="btn btn-primary btn-sm mt-4">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myJobs.slice(0, 4).map((job) => (
                <JobPostCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;