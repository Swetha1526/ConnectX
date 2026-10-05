import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-heading">
        404
      </h1>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-heading">
        Page Not Found
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
        The link you followed may be broken, or the page may have been removed. Let's get you back home.
      </p>

      <Button
        variant="primary"
        size="md"
        icon={Home}
        onClick={() => navigate('/')}
        className="mt-2"
      >
        Back to Home Feed
      </Button>
    </div>
  );
};

export default NotFound;
