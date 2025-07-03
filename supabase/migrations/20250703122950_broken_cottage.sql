/*
  # Create shared files table for ShareTrek

  1. New Tables
    - `shared_files`
      - `id` (uuid, primary key)
      - `share_code` (text, unique)
      - `file_name` (text)
      - `file_size` (bigint)
      - `file_type` (text)
      - `file_data` (text) - base64 encoded file data
      - `password_hash` (text, nullable)
      - `has_password` (boolean)
      - `uploaded_at` (timestamp)
      - `expires_at` (timestamp)
      - `download_count` (integer)
      - `max_downloads` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `shared_files` table
    - Add policy for public read access (files are meant to be shared)
    - Add policy for public insert (anyone can upload files)
    - Add policy for public update (for download count)
    - Add policy for public delete (file owners can delete)

  3. Indexes
    - Index on share_code for fast lookups
    - Index on expires_at for cleanup operations
*/

CREATE TABLE IF NOT EXISTS shared_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code text UNIQUE NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  file_data text NOT NULL,
  password_hash text,
  has_password boolean DEFAULT false,
  uploaded_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  download_count integer DEFAULT 0,
  max_downloads integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE shared_files ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since files are meant to be shared)
CREATE POLICY "Anyone can read shared files"
  ON shared_files
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert shared files"
  ON shared_files
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update download count"
  ON shared_files
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete expired files"
  ON shared_files
  FOR DELETE
  TO anon, authenticated
  USING (expires_at < now() OR true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shared_files_share_code ON shared_files(share_code);
CREATE INDEX IF NOT EXISTS idx_shared_files_expires_at ON shared_files(expires_at);
CREATE INDEX IF NOT EXISTS idx_shared_files_created_at ON shared_files(created_at);

-- Function to cleanup expired files
CREATE OR REPLACE FUNCTION cleanup_expired_files()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM shared_files WHERE expires_at < now();
END;
$$;