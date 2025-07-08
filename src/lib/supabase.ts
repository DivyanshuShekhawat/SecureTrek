import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a fallback client if environment variables are missing
let supabase: any;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables not found. Using fallback mode.');
  // Create a mock client for development/fallback
  supabase = {
    from: () => ({
      select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
      update: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      delete: () => Promise.resolve({ error: new Error('Supabase not configured') })
    })
  };
}

export { supabase };
export type Database = {
  public: {
    Tables: {
      shared_files: {
        Row: {
          id: string;
          share_code: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_data: string;
          password_hash: string | null;
          has_password: boolean;
          uploaded_at: string;
          expires_at: string;
          download_count: number;
          max_downloads: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          share_code: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_data: string;
          password_hash?: string | null;
          has_password?: boolean;
          uploaded_at?: string;
          expires_at: string;
          download_count?: number;
          max_downloads?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          share_code?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          file_data?: string;
          password_hash?: string | null;
          has_password?: boolean;
          uploaded_at?: string;
          expires_at?: string;
          download_count?: number;
          max_downloads?: number;
          created_at?: string;
        };
      };
    };
  };
};