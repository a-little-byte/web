/*
  # Add hero carousel management

  1. New Tables
    - `hero_carousel`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `button_text` (text)
      - `button_link` (text)
      - `order` (integer)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `hero_carousel` table
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS hero_carousel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  button_text text,
  button_link text,
  "order" integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_carousel ENABLE ROW LEVEL SECURITY;

-- Policy for admin access to hero carousel
CREATE POLICY "Allow full access to admins for hero carousel"
  ON hero_carousel
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Insert some default carousel items
INSERT INTO hero_carousel (title, description, image_url, button_text, button_link, "order") VALUES
('Enterprise Security Made Simple', 'Protect your business with enterprise-grade cybersecurity solutions. Our comprehensive suite of tools keeps your data safe.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', 'Explore Solutions', '/solutions', 1),
('24/7 Security Operations Center', 'Our expert team monitors your infrastructure around the clock, ensuring immediate response to any threats.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31', 'Learn More', '/solutions#soc', 2),
('Advanced Threat Protection', 'Stay ahead of cyber threats with our cutting-edge security technology and threat intelligence.', 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f', 'Get Started', '/register', 3);