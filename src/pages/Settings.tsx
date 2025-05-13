import React, { useState, useEffect } from 'react';
import { BellIcon, MailIcon, PhoneIcon, MoonIcon } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card, { CardHeader, CardContent } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isValidPhone } from '../lib/utils';
import type { UserSettings } from '../types/supabase';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailReminder, setEmailReminder] = useState(true);
  const [smsReminder, setSmsReminder] = useState(false);
  const [reminderDays, setReminderDays] = useState<number[]>([3, 1, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSettings(data);
        setPhoneNumber(data.phone_number || '');
        setEmailReminder(data.email_reminder);
        setSmsReminder(data.sms_reminder);
        setReminderDays(data.reminder_days || [3, 1, 0]);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Validate phone number if SMS reminders are enabled
      if (smsReminder && (!phoneNumber || !isValidPhone(phoneNumber))) {
        throw new Error('Please enter a valid phone number for SMS reminders');
      }
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          phone_number: phoneNumber || null,
          email_reminder: emailReminder,
          sms_reminder: smsReminder,
          reminder_days: reminderDays,
          dark_mode: darkMode,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });
      
      if (error) {
        throw error;
      }
      
      setSuccessMessage('Settings saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleReminderDay = (day: number) => {
    const updatedDays = reminderDays.includes(day)
      ? reminderDays.filter(d => d !== day)
      : [...reminderDays, day].sort((a, b) => b - a);
    
    setReminderDays(updatedDays);
  };

  const buildDayLabel = (day: number) => {
    if (day === 0) return 'On due date';
    if (day === 1) return '1 day before';
    return `${day} days before`;
  };

  return (
    <AppLayout title="Settings">
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm">
                {successMessage}
              </div>
            )}
            
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  <BellIcon size={20} className="inline mr-2" />
                  Reminder Settings
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MailIcon size={18} className="mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Email Reminders</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailReminder}
                        onChange={() => setEmailReminder(!emailReminder)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <PhoneIcon size={18} className="mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">SMS Reminders</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsReminder}
                        onChange={() => setSmsReminder(!smsReminder)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {smsReminder && (
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      helperText="Enter your phone number to receive SMS reminders"
                      leftIcon={<PhoneIcon size={18} />}
                    />
                  )}
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Reminder Schedule
                    </h3>
                    <div className="space-y-2">
                      {[3, 2, 1, 0].map((day) => (
                        <div key={day} className="flex items-center">
                          <input
                            id={`day-${day}`}
                            type="checkbox"
                            checked={reminderDays.includes(day)}
                            onChange={() => handleToggleReminderDay(day)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`day-${day}`}
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            {buildDayLabel(day)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  <MoonIcon size={20} className="inline mr-2" />
                  Appearance
                </h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={toggleDarkMode}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                isLoading={isSaving}
              >
                Save Settings
              </Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Settings;