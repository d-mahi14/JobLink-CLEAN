import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { Briefcase } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <Briefcase className="w-12 h-12 mx-auto text-primary mb-3" />
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Login to your account</p>
          </div>

          <LoginForm />

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="link link-primary font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
