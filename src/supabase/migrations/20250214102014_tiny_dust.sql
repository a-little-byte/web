/*
  # Initial schema setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - password (text)
      - full_name (text)
      - role (text)
      - email_verified (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - services
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - period (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - page_content
      - id (uuid, primary key)
      - section (text)
      - content (jsonb)
      - updated_at (timestamp)

  2. Default Data
    - Insert default admin user
*/

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text,
  role text DEFAULT 'user',
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  period text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section text NOT NULL,
  content jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);