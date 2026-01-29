import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    userType: 'candidate',
  });
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-body">
      <div className="form-control">
        <label className="label">
          <span className="label-text">I am a</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`btn ${formData.userType === 'candidate' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFormData({ ...formData, userType: 'candidate' })}
          >
            <User className="w-4 h-4 mr-2" />
            Candidate
          </button>
          <button
            type="button"
            className={`btn ${formData.userType === 'company' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFormData({ ...formData, userType: 'company' })}
          >
            <Building className="w-4 h-4 mr-2" />
            Company
          </button>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Full Name / Company Name</span>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <User className="w-4 h-4 opacity-70" />
          <input
            type="text"
            placeholder="John Doe / ABC Corp"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            className="grow"
          />
        </label>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <Mail className="w-4 h-4 opacity-70" />
          <input
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="grow"
          />
        </label>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <Lock className="w-4 h-4 opacity-70" />
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
            className="grow"
          />
        </label>
        <label className="label">
          <span className="label-text-alt">Minimum 6 characters</span>
        </label>
      </div>

      <div className="form-control mt-6">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? <span className="loading loading-spinner"></span> : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
