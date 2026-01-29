import { useEffect } from 'react';
import { FileText, Send, Eye, TrendingUp } from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import { useResumeStore } from '../../store/resumeStore';
import { useApplicationStore } from '../../store/applicationStore';
import ApplicationCard from '../../components/candidate/ApplicationCard';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
  const { resumes, fetchMyResumes } = useResumeStore();
  const { myApplications, fetchMyApplications } = useApplicationStore();

  useEffect(() => {
    fetchMyResumes();
    fetchMyApplications();
  }, []);

  const stats = {
    resumes: resumes.length,
    applications: myApplications.length,
    shortlisted: myApplications.filter((a) => a.status === 'shortlisted').length,
    interviews: myApplications.filter((a) => a.status === 'accepted').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Resumes"
          value={stats.resumes}
          icon={FileText}
          color="primary"
        />
        <StatCard
          title="Applications"
          value={stats.applications}
          icon={Send}
          color="secondary"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={Eye}
          color="accent"
        />
        <StatCard
          title="Interviews"
          value={stats.interviews}
          icon={TrendingUp}
          color="success"
        />
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title">Recent Applications</h2>
            <Link to="/candidate/applications" className="btn btn-sm btn-ghost">
              View All
            </Link>
          </div>

          {myApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No applications yet</p>
              <Link to="/candidate/jobs" className="btn btn-primary btn-sm mt-4">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myApplications.slice(0, 4).map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;