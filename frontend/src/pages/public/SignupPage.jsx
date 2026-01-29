import { Link } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import { Briefcase } from 'lucide-react';

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <Briefcase className="w-12 h-12 mx-auto text-primary mb-3" />
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="text-gray-500 mt-2">Join ResuMatch today</p>
          </div>

          <SignupForm />

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;