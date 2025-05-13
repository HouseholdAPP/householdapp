import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSignIcon, CalendarIcon, UserIcon, PhoneIcon, FileTextIcon } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Card, { CardContent, CardFooter } from '../components/Card';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDateForInput } from '../lib/utils';

const AddRent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(formatDateForInput(new Date()));
  const [landlordName, setLandlordName] = useState('');
  const [landlordContact, setLandlordContact] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
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
      
      const { error: insertError } = await supabase
        .from('rent_entries')
        .insert({
          user_id: user.id,
          amount: amountValue,
          due_date: dueDate,
          landlord_name: landlordName || null,
          landlord_contact: landlordContact || null,
          notes: notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      
      if (insertError) {
        throw insertError;
      }
      
      // Create or update user settings with default values if they don't exist
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          email_reminder: true,
          sms_reminder: false,
          reminder_days: [3, 1, 0],
          dark_mode: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });
      
      if (settingsError) {
        console.error('Error updating settings:', settingsError);
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to add rent entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <AppLayout title="Add Rent">
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
          <Button 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Save Rent Entry
          </Button>
        </CardFooter>
      </Card>
    </AppLayout>
  );
};

export default AddRent;