import { Briefcase, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <aside>
        <Briefcase className="w-12 h-12 text-primary" />
        <p className="font-bold text-lg">
          ResuMatch
          <br />
          Connecting talent with opportunity
        </p>
        <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a href="https://github.com/d-mahi14/JobLink-Inheritance.git"className="link link-hover">
            <Github className="w-6 h-6" />
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;