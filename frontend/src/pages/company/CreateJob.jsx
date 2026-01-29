import JobPostForm from '../../components/company/JobPostForm';

const CreateJob = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Post a New Job</h1>
        <p className="text-gray-500 mt-1">Fill in the details to create a job posting</p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <JobPostForm />
        </div>
      </div>
    </div>
  );
};

export default CreateJob;