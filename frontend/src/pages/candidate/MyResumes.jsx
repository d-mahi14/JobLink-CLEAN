import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import ResumeCard from '../../components/candidate/ResumeCard';
import ResumeUpload from '../../components/candidate/ResumeUpload';
import EmptyState from '../../components/shared/EmptyState';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const MyResumes = () => {
  const { resumes, fetchMyResumes, isLoading } = useResumeStore();

  useEffect(() => {
    fetchMyResumes();
  }, []);

  if (isLoading && resumes.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <p className="text-gray-500 mt-1">Manage your uploaded resumes</p>
      </div>

      <ResumeUpload />

      {resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes uploaded"
          description="Upload your first resume to start applying for jobs"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResumes;