import React from 'react';
import { HomeIcon, AlertCircleIcon, CalendarIcon, PlusCircleIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  type: 'rent' | 'payment' | 'history' | 'general';
  title?: string;
  description?: string;
  actionText?: string;
  onClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onClick,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'rent':
        return <HomeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />;
      case 'payment':
        return <CalendarIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />;
      case 'history':
        return <AlertCircleIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />;
      default:
        return <PlusCircleIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'rent':
        return 'No rent entries yet';
      case 'payment':
        return 'No payments recorded';
      case 'history':
        return 'No payment history';
      default:
        return 'Nothing here yet';
    }
  };

  const getDefaultDescription = () => {
    switch (type) {
      case 'rent':
        return 'Add your first rent entry to get started tracking your payments.';
      case 'payment':
        return 'Track your rent payments to see your payment history.';
      case 'history':
        return 'Your payment history will appear here once you have made payments.';
      default:
        return 'Create your first entry to get started.';
    }
  };

  const getDefaultActionText = () => {
    switch (type) {
      case 'rent':
        return 'Add Rent Entry';
      case 'payment':
        return 'Make a Payment';
      case 'history':
        return 'Go to Dashboard';
      default:
        return 'Get Started';
    }
  };

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {title || getDefaultTitle()}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        {description || getDefaultDescription()}
      </p>
      {onClick && (
        <div className="mt-6">
          <Button
            onClick={onClick}
            variant="primary"
          >
            {actionText || getDefaultActionText()}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;