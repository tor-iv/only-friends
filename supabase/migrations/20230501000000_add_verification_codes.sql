-- Create verification_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT NOT NULL,
  code TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS verification_codes_phone_number_idx ON verification_codes(phone_number);

-- Add RLS policies
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage verification codes
CREATE POLICY "Service role can manage verification codes"
  ON verification_codes
  USING (true);

-- Allow authenticated users to see their own verification codes
CREATE POLICY "Users can view their own verification codes"
  ON verification_codes FOR SELECT
  USING (auth.uid() IS NOT NULL AND phone_number = (
    SELECT phone_number FROM auth.users WHERE id = auth.uid()
  ));
