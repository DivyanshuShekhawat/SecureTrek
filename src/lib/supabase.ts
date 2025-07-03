import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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