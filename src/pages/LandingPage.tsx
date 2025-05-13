import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, BellIcon, HistoryIcon, MoonIcon } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="fixed w-full bg-white dark:bg-gray-900 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">RentMate</span>
            </div>
            <div>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="primary">Dashboard</Button>
                </Link>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Never Miss <span className="text-blue-500 dark:text-blue-400">Rent</span> Payments Again
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              RentMate helps you stay on top of your rent payments with timely reminders and easy payment tracking.
            </p>
            <div className="mt-8">
              <Link to={user ? "/dashboard" : "/signup"}>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-8 py-3 text-base"
                >
                  {user ? "Go to Dashboard" : "Get Started - It's Free"}
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transform rotate-2 transition-transform hover:rotate-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Monthly Rent
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  Due in 3 days
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">$1,200</span>
                <div className="mt-4 flex space-x-2">
                  <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                    Edit
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                    Mark as Paid
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-4 -right-4 z-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transform -rotate-3 transition-transform hover:rotate-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upcoming Reminder
                </h3>
                <BellIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Your rent of $1,200 is due in 3 days on May 1st.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Features designed to make rent payments easy
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <BellIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Reminders
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get timely reminders via email and SMS before your rent is due.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <HistoryIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Payment Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your payment history and generate reports for tax purposes.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <MoonIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Dark Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Customize your experience with a beautiful light or dark theme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start managing your rent payments today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of renters who never miss a payment with RentMate.
          </p>
          <Link to={user ? "/dashboard" : "/signup"}>
            <Button 
              variant="secondary"
              size="lg"
              className="px-8 py-3 text-base"
            >
              {user ? "Go to Dashboard" : "Get Started for Free"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <CalendarIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">RentMate</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Help
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} RentMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;