import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon, CheckCircleIcon, CalendarIcon } from 'lucide-react';
import Card, { CardContent, CardFooter } from './Card';
import Button from './Button';
import { formatCurrency } from '../lib/utils';
import type { RentEntry } from '../types/supabase';

interface RentCardProps {
  rentEntry: RentEntry;
  isPaid?: boolean;
  onMarkAsPaid?: () => void;
}

const RentCard: React.FC<RentCardProps> = ({ rentEntry, isPaid = false, onMarkAsPaid }) => {
  const navigate = useNavigate();
  
  // Calculate days remaining until due date
  const dueDate = new Date(rentEntry.due_date);
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Format due date
  const formattedDueDate = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Status calculation
  let status = 'upcoming';
  if (isPaid) {
    status = 'paid';
  } else if (diffDays < 0) {
    status = 'overdue';
  } else if (diffDays <= 3) {
    status = 'duesoon';
  }
  
  const getStatusStyles = () => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'duesoon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'overdue':
        return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
      case 'duesoon':
        return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
      default:
        return `Due in ${diffDays} days`;
    }
  };
  
  const handleEdit = () => {
    navigate(`/edit-rent/${rentEntry.id}`);
  };

  return (
    <Card className="mb-4 transition-all duration-200">
      <CardContent>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {rentEntry.landlord_name || 'Monthly Rent'}
            </h3>
            <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
              <CalendarIcon size={16} className="mr-1" />
              <span>Due {formattedDueDate}</span>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
            {status === 'paid' && <CheckCircleIcon size={14} className="mr-1" />}
            {status === 'overdue' && <AlertCircleIcon size={14} className="mr-1" />}
            {getStatusText()}
          </span>
        </div>
        
        <div className="mt-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(rentEntry.amount)}</span>
          {rentEntry.notes && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {rentEntry.notes}
            </p>
          )}
        </div>
      </CardContent>
      
      {!isPaid && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onMarkAsPaid}
          >
            Mark as Paid
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RentCard;