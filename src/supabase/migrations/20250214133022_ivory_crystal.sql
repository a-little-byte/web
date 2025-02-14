/*
  # Order History Enhancement

  1. New Tables
    - `billing_addresses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `street` (text)
      - `city` (text)
      - `state` (text)
      - `postal_code` (text)
      - `country` (text)
      - `is_default` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `payment_methods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (text)
      - `last_four` (text)
      - `expiry_month` (integer)
      - `expiry_year` (integer)
      - `is_default` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `invoices`
      - `id` (uuid, primary key)
      - `payment_id` (uuid, references payments)
      - `number` (text)
      - `file_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Add policies for user access
*/

-- Billing Addresses
CREATE TABLE IF NOT EXISTS billing_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  street text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE billing_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing addresses"
  ON billing_addresses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own billing addresses"
  ON billing_addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own billing addresses"
  ON billing_addresses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own billing addresses"
  ON billing_addresses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  last_four text NOT NULL,
  expiry_month integer NOT NULL,
  expiry_year integer NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment methods"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON payment_methods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON payment_methods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid REFERENCES payments(id) ON DELETE CASCADE,
  number text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM payments
      JOIN subscriptions ON subscriptions.id = payments.subscription_id
      WHERE payments.id = invoices.payment_id
      AND subscriptions.user_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX idx_billing_addresses_user_id ON billing_addresses(user_id);
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_invoices_payment_id ON invoices(payment_id);

-- Add billing_address_id to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS billing_address_id uuid REFERENCES billing_addresses(id),
ADD COLUMN IF NOT EXISTS payment_method_id uuid REFERENCES payment_methods(id);