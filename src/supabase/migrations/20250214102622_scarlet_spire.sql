/*
  # Add subscription and payment tables

  1. New Tables
    - subscriptions
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - service_id (uuid, foreign key)
      - status (text)
      - current_period_start (timestamptz)
      - current_period_end (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - payments
      - id (uuid, primary key)
      - subscription_id (uuid, foreign key)
      - amount (numeric)
      - status (text)
      - payment_method (text)
      - created_at (timestamptz)

  2. Indexes
    - Add indexes for foreign keys and frequently queried columns
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_service_id ON subscriptions(service_id);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text NOT NULL,
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);