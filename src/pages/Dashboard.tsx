import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import RentCard from '../components/RentCard';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { RentEntry, PaymentHistory } from '../types/supabase';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rentEntries, setRentEntries] = useState<RentEntry[]>([]);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRentEntries();
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchRentEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('rent_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setRentEntries(data || []);
    } catch (error) {
      console.error('Error fetching rent entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .order('payment_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const handleAddRent = () => {
    navigate('/add-rent');
  };

  const handleMarkAsPaid = async (rentEntryId: string) => {
    if (!user) return;
    
    try {
      const rentEntry = rentEntries.find(entry => entry.id === rentEntryId);
      
      if (!rentEntry) return;
      
      // Create payment record
      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert({
          rent_entry_id: rentEntryId,
          payment_date: new Date().toISOString(),
          amount: rentEntry.amount,
          payment_method: 'manual',
          notes: 'Marked as paid via dashboard',
        });
      
      if (paymentError) {
        throw paymentError;
      }
      
      // Refresh data
      fetchPaymentHistory();
      fetchRentEntries();
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  // Check if a rent entry is paid based on payment history
  const isRentPaid = (rentEntryId: string): boolean => {
    return payments.some(payment => payment.rent_entry_id === rentEntryId);
  };

  return (
    <AppLayout title="Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Upcoming Rent</h2>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleAddRent}
          leftIcon={<PlusIcon size={16} />}
        >
          Add Rent
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {rentEntries.length === 0 ? (
            <EmptyState 
              type="rent"
              onClick={handleAddRent}
            />
          ) : (
            <div>
              {rentEntries.map(entry => (
                <RentCard 
                  key={entry.id}
                  rentEntry={entry}
                  isPaid={isRentPaid(entry.id)}
                  onMarkAsPaid={() => handleMarkAsPaid(entry.id)}
                />
              ))}
            </div>
          )}
          
          {payments.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Recent Payments
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Method
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {payments.slice(0, 3).map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            ${payment.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {payment.payment_method || 'Manual'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {payments.length > 3 && (
                  <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={() => navigate('/history')} 
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      View all payments
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default Dashboard;