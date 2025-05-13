export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      rent_entries: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          due_date: string;
          landlord_name: string | null;
          landlord_contact: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          due_date: string;
          landlord_name?: string | null;
          landlord_contact?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          due_date?: string;
          landlord_name?: string | null;
          landlord_contact?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_history: {
        Row: {
          id: string;
          rent_entry_id: string;
          payment_date: string;
          amount: number;
          payment_method: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          rent_entry_id: string;
          payment_date: string;
          amount: number;
          payment_method?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          rent_entry_id?: string;
          payment_date?: string;
          amount?: number;
          payment_method?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          email_reminder: boolean;
          sms_reminder: boolean;
          reminder_days: number[];
          dark_mode: boolean;
          phone_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_reminder?: boolean;
          sms_reminder?: boolean;
          reminder_days?: number[];
          dark_mode?: boolean;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_reminder?: boolean;
          sms_reminder?: boolean;
          reminder_days?: number[];
          dark_mode?: boolean;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type RentEntry = Database['public']['Tables']['rent_entries']['Row'];
export type PaymentHistory = Database['public']['Tables']['payment_history']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];