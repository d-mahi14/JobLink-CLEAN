import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Send, 
  User,
  PlusCircle,
  Building2 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { isCandidate, isCompany } = useAuth();

  const candidateLinks = [
    { to: '/candidate/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/candidate/resumes', icon: FileText, label: 'My Resumes' },
    { to: '/candidate/jobs', icon: Briefcase, label: 'Browse Jobs' },
    { to: '/candidate/applications', icon: Send, label: 'My Applications' },
    { to: '/candidate/profile', icon: User, label: 'Profile' },
  ];

  const companyLinks = [
    { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/company/jobs', icon: Briefcase, label: 'My Jobs' },
    { to: '/company/create-job', icon: PlusCircle, label: 'Post New Job' },
    { to: '/company/profile', icon: Building2, label: 'Company Profile' },
  ];

  const links = isCandidate ? candidateLinks : companyLinks;

  return (
    <aside className="w-64 bg-base-200 min-h-screen p-4 hidden lg:block">
      <ul className="menu menu-lg">
        {links.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={location.pathname === to ? 'active' : ''}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;