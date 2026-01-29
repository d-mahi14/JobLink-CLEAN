import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Award, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary">
        <div className="hero-content text-center text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Match Your Resume to Your Dream Job
            </h1>
            <p className="text-xl mb-8">
              AI-powered resume analysis and job matching platform connecting talented
              candidates with top companies
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signup" className="btn btn-lg bg-white text-primary hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                For Job Seekers
              </Link>
              <Link to="/signup" className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-primary">
                <Briefcase className="w-5 h-5 mr-2" />
                For Employers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="bg-primary text-white p-4 rounded-full mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="card-title">Upload Resume</h3>
                <p>Upload your resume and get instant AI-powered analysis</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="bg-secondary text-white p-4 rounded-full mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="card-title">Get Matched</h3>
                <p>Our AI matches you with relevant job opportunities</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="bg-accent text-white p-4 rounded-full mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="card-title">Land Your Dream Job</h3>
                <p>Apply with confidence and track your applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of job seekers and employers using ResuMatch
          </p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create Free Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
