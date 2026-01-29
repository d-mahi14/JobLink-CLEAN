import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobStore } from '../../store/jobStore';
import { Briefcase, MapPin, IndianRupee, FileText } from 'lucide-react';

const JobPostForm = ({ initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements?.join('\n') || '',
    location: initialData?.location || '',
    salaryRange: initialData?.salary_range || '',
    status: initialData?.status || 'active',
  });

  const { createJob, updateJob, isLoading } = useJobStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      ...formData,
      requirements: formData.requirements
        .split('\n')
        .filter((r) => r.trim())
        .map((r) => r.trim()),
    };

    try {
      if (initialData) {
        await updateJob(initialData.id, jobData);
      } else {
        await createJob(jobData);
      }
      navigate('/company/jobs');
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Job Title</span>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <Briefcase className="w-4 h-4 opacity-70" />
          <input
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="grow"
          />
        </label>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Job Description</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-32"
          placeholder="Describe the role, responsibilities, and what you're looking for..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        ></textarea>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Requirements (one per line)</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience with React&#10;Strong problem-solving skills"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Location</span>
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <MapPin className="w-4 h-4 opacity-70" />
            <input
              type="text"
              placeholder="e.g. Remote, New York, Hybrid"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="grow"
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Salary Range</span>
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <IndianRupee className="w-4 h-4 opacity-70" />
            <input
              type="text"
              placeholder="e.g. ₹80k - ₹120k"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              className="grow"
            />
          </label>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Status</span>
        </label>
        <select
          className="select select-bordered"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => navigate('/company/jobs')}
          className="btn btn-ghost"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : initialData ? (
            'Update Job'
          ) : (
            'Post Job'
          )}
        </button>
      </div>
    </form>
  );
};

export default JobPostForm;