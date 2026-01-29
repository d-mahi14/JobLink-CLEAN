import { Link } from 'react-router-dom';
import { LogOut, User, Briefcase, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { logout } = useAuthStore();
  const { profile, isAuthenticated, isCandidate, isCompany } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          <Briefcase className="w-6 h-6 mr-2" />
          ResuMatch
        </Link>
      </div>

      <div className="navbar-center absolute left-1/2 -translate-x-1/2 hidden lg:flex">
        {isAuthenticated && (
          <ul className="menu menu-horizontal px-1">
            {isCandidate && (
              <>
                <li><Link to="/candidate/dashboard">Dashboard</Link></li>
                <li><Link to="/candidate/resumes">My Resumes</Link></li>
                <li><Link to="/candidate/jobs">Browse Jobs</Link></li>
                <li><Link to="/candidate/applications">Applications</Link></li>
                <li>      </li>
              </>
            )}
            {isCompany && (
              <>
                <li><Link to="/company/dashboard">Dashboard</Link></li>
                <li><Link to="/company/jobs">My Jobs</Link></li>
                <li><Link to="/company/create-job">Post Job</Link></li>
              </>
            )}
          </ul>
        )}
      </div>

      <div className="navbar-end absolute right-4 top-2">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden ml-auto">
                {profile?.profile_pic ? (
                  <img src={profile.profile_pic} alt="Profile" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{profile?.full_name}</span>
                <span className="text-xs capitalize">{profile?.user_type}</span>
              </li>
              <li>
                <Link to={isCandidate ? '/candidate/profile' : '/company/profile'}>
                  <User className="w-4 h-4" /> Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;