import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee } from 'lucide-react';
import { useJobStore } from '../../store/jobStore';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { fetchJobById, currentJob, updateJob, isLoading } = useJobStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary_range: '',
    status: 'active',
  });

  useEffect(() => {
    fetchJobById(jobId);
  }, [jobId]);

  useEffect(() => {
    if (currentJob) {
      setFormData({
        title: currentJob.title || '',
        description: currentJob.description || '',
        requirements: currentJob.requirements?.join('\n') || '',
        location: currentJob.location || '',
        salary_range: currentJob.salary_range || '',
        status: currentJob.status || 'active',
      });
    }
  }, [currentJob]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateJob(jobId, {
      ...formData,
      requirements: formData.requirements
        .split('\n')
        .filter(Boolean),
    });

    navigate('/company/jobs');
  };

  if (isLoading || !currentJob) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Job</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div className="form-control">
          <label className="label">Job Title</label>
          <div className="input input-bordered flex items-center gap-2">
            <Briefcase className="w-4 h-4 opacity-60" />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="grow"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="form-control">
          <label className="label">Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered h-32"
            placeholder="Describe the role, responsibilities, and what you're looking for..."
          />
        </div>

        {/* Requirements */}
        <div className="form-control">
          <label className="label">Requirements (one per line)</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="textarea textarea-bordered h-28"
            placeholder={`Bachelor's degree in Computer Science
3+ years experience with React
Strong problem-solving skills`}
          />
        </div>

        {/* Location & Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">Location</label>
            <div className="input input-bordered flex items-center gap-2">
              <MapPin className="w-4 h-4 opacity-60" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote, New York, Hybrid"
                className="grow"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">Salary Range</label>
            <div className="input input-bordered flex items-center gap-2">
              <IndianRupee className="w-4 h-4 opacity-60" />
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g. ₹80k - ₹120k"
                className="grow"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="form-control">
          <label className="label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Update Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
