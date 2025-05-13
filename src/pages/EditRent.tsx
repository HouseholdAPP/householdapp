import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DollarSignIcon, CalendarIcon, UserIcon, PhoneIcon, FileTextIcon } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Card, { CardContent, CardFooter } from '../components/Card';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDateForInput } from '../lib/utils';

const EditRent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(formatDateForInput(new Date()));
  const [landlordName, setLandlordName] = useState('');
  const [landlordContact, setLandlordContact] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && id) {
      fetchRentEntry(id);
    }
  }, [user, id]);

  const fetchRentEntry = async (entryId: string) => {
    try {
      const { data, error } = await supabase
        .from('rent_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', user?.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setAmount(data.amount.toString());
        setDueDate(formatDateForInput(new Date(data.due_date)));
        setLandlordName(data.landlord_name || '');
        setLandlordContact(data.landlord_contact || '');
        setNotes(data.notes || '');
      }
    } catch (error) {
      console.error('Error fetching rent entry:', error);
      setError('Failed to load rent entry');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) {
      navigate('/login');
      return;
    }
    
    if (!amount || !dueDate) {
      setError('Amount and due date are required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const amountValue = parseFloat(amount);
      
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      const { error: updateError } = await supabase
        .from('rent_entries')
        .update({
          amount: amountValue,
          due_date: dueDate,
          landlord_name: landlordName || null,
          landlord_contact: landlordContact || null,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update rent entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this rent entry?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('rent_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) {
        throw error;
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting rent entry:', error);
      setError('Failed to delete rent entry');
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AppLayout title="Edit Rent">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Edit Rent">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <Input
                label="Rent Amount ($)"
                type="number"
                min="0"
                step="1"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                leftIcon={<DollarSignIcon size={18} />}
                required
              />
              
              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                leftIcon={<CalendarIcon size={18} />}
                required
              />
              
              <Input
                label="Landlord Name (Optional)"
                type="text"
                placeholder="John Doe"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                leftIcon={<UserIcon size={18} />}
              />
              
              <Input
                label="Landlord Contact (Optional)"
                type="text"
                placeholder="Phone or Email"
                value={landlordContact}
                onChange={(e) => setLandlordContact(e.target.value)}
                leftIcon={<PhoneIcon size={18} />}
              />
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-gray-500 dark:text-gray-400">
                    <FileTextIcon size={18} />
                  </div>
                  <textarea
                    placeholder="Any additional information..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button 
              variant="danger" 
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Update Rent
          </Button>
        </CardFooter>
      </Card>
    </AppLayout>
  );
};

export default EditRent;