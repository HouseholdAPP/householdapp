/*
  # RentMate Database Schema

  1. New Tables
    - `rent_entries` - Stores rent information for users
    - `payment_history` - Tracks user payments
    - `user_settings` - Stores user preferences for reminders and app settings
  
  2. Security
    - Enables Row Level Security (RLS) on all tables
    - Creates policies to protect user data
    - Ensures users can only access their own data
*/

-- Create rent_entries table
CREATE TABLE IF NOT EXISTS rent_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  due_date date NOT NULL,
  landlord_name text,
  landlord_contact text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rent_entry_id uuid NOT NULL REFERENCES rent_entries(id) ON DELETE CASCADE,
  payment_date timestamptz NOT NULL,
  amount numeric NOT NULL,
  payment_method text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_reminder boolean DEFAULT true,
  sms_reminder boolean DEFAULT false,
  reminder_days integer[] DEFAULT ARRAY[3, 1, 0],
  dark_mode boolean DEFAULT false,
  phone_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE rent_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Policies for rent_entries
CREATE POLICY "Users can view their own rent entries"
  ON rent_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rent entries"
  ON rent_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rent entries"
  ON rent_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rent entries"
  ON rent_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for payment_history
CREATE POLICY "Users can view their own payment history"
  ON payment_history
  FOR SELECT
  USING (
    rent_entry_id IN (
      SELECT id FROM rent_entries WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own payment history"
  ON payment_history
  FOR INSERT
  WITH CHECK (
    rent_entry_id IN (
      SELECT id FROM rent_entries WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own payment history"
  ON payment_history
  FOR UPDATE
  USING (
    rent_entry_id IN (
      SELECT id FROM rent_entries WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    rent_entry_id IN (
      SELECT id FROM rent_entries WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own payment history"
  ON payment_history
  FOR DELETE
  USING (
    rent_entry_id IN (
      SELECT id FROM rent_entries WHERE user_id = auth.uid()
    )
  );

-- Policies for user_settings
CREATE POLICY "Users can view their own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings"
  ON user_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rent_entries_user_id ON rent_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_rent_entries_due_date ON rent_entries(due_date);
CREATE INDEX IF NOT EXISTS idx_payment_history_rent_entry_id ON payment_history(rent_entry_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_payment_date ON payment_history(payment_date);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);