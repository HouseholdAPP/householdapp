import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';
import Button from '../components/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <h1 className="text-9xl font-bold text-blue-500 dark:text-blue-400">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Page Not Found</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button
              variant="primary"
              leftIcon={<HomeIcon size={18} />}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;