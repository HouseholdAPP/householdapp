import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownloadIcon, FilterIcon } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card, { CardHeader, CardContent } from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getMonthNames, getCurrentYear, getYearOptions } from '../lib/utils';
import type { PaymentHistory, RentEntry } from '../types/supabase';

const History: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState<(PaymentHistory & { rent_entry?: RentEntry })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const months = ['all', ...getMonthNames()];
  const years = getYearOptions();

  useEffect(() => {
    if (user) {
      fetchPaymentHistory();
    }
  }, [user, selectedMonth, selectedYear]);

  const fetchPaymentHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      let query = supabase
        .from('payment_history')
        .select(`
          *,
          rent_entry:rent_entries(*)
        `)
        .order('payment_date', { ascending: false });
      
      // Apply filters if not 'all'
      if (selectedMonth !== 'all') {
        const monthIndex = months.indexOf(selectedMonth) - 1;
        
        if (monthIndex >= 0) {
          // Filter by month and year
          const startDate = new Date(selectedYear, monthIndex, 1).toISOString();
          const endDate = new Date(selectedYear, monthIndex + 1, 0).toISOString();
          
          query = query
            .gte('payment_date', startDate)
            .lte('payment_date', endDate);
        }
      } else if (selectedYear !== 0) {
        // Filter by year only
        const startDate = new Date(selectedYear, 0, 1).toISOString();
        const endDate = new Date(selectedYear, 11, 31).toISOString();
        
        query = query
          .gte('payment_date', startDate)
          .lte('payment_date', endDate);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Transform the nested rent_entry data
      const transformedData = data.map(payment => ({
        ...payment,
        rent_entry: Array.isArray(payment.rent_entry) && payment.rent_entry.length > 0
          ? payment.rent_entry[0]
          : undefined
      }));
      
      setPayments(transformedData);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (): number => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const handleExport = () => {
    // Generate CSV content
    const headers = ['Payment Date', 'Amount', 'Method', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        new Date(payment.payment_date).toLocaleDateString(),
        payment.amount,
        payment.payment_method || 'Manual',
        `"${payment.notes || ''}"`
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rent-payments-${selectedYear}-${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout title="Payment History">
      <div className="mb-6">
        <Card>
          <CardHeader className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Payment Records
            </h2>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center space-x-2">
                <label htmlFor="month-select" className="text-sm text-gray-500 dark:text-gray-400">
                  <FilterIcon size={16} className="inline mr-1" /> Filter:
                </label>
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month === 'all' ? 'All Months' : month}
                    </option>
                  ))}
                </select>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {payments.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  leftIcon={<DownloadIcon size={16} />}
                >
                  Export
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {payments.length === 0 ? (
                  <EmptyState
                    type="history"
                    onClick={() => navigate('/dashboard')}
                  />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Property
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Method
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {new Date(payment.payment_date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {payment.rent_entry?.landlord_name || 'Monthly Rent'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {formatCurrency(payment.amount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {payment.payment_method || 'Manual'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                {payment.notes || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Total Payments: {payments.length}
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        Total: {formatCurrency(calculateTotal())}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default History;