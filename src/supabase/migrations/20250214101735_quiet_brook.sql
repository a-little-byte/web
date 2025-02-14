/*
  # Add admin role to profiles

  1. Changes
    - Add `role` column to profiles table
    - Add policy for admin access
    - Add default admin user

  2. Security
    - Enable RLS for admin routes
    - Add policies for admin operations
*/

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Policy for admin access
CREATE POLICY "Allow full access to admins"
  ON profiles
  FOR ALL
  TO authenticated
  USING (role = 'admin');

-- Insert default admin (you'll need to sign up with this email first)
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  auth.uid(),
  'admin@cyna.com',
  'Admin User',
  'admin'
FROM auth.users
WHERE email = 'admin@cyna.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- Create services management table with RLS
CREATE TABLE IF NOT EXISTS service_management (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  period text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE service_management ENABLE ROW LEVEL SECURITY;

-- Policy for admin access to services
CREATE POLICY "Allow full access to admins for services"
  ON service_management
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Create home page content management table
CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  content jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Policy for admin access to page content
CREATE POLICY "Allow full access to admins for page content"
  ON page_content
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));