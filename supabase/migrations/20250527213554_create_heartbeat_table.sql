-- Create heartbeat table for keeping database active
CREATE TABLE IF NOT EXISTS heartbeat (
                                         id SERIAL PRIMARY KEY,
                                         pinged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

-- Add an index on pinged_at for efficient cleanup queries
CREATE INDEX IF NOT EXISTS idx_heartbeat_pinged_at ON heartbeat(pinged_at DESC);

-- Add RLS policy (optional, but good practice)
ALTER TABLE heartbeat ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage heartbeat records
CREATE POLICY "Service role can manage heartbeat" ON heartbeat
  FOR ALL USING (auth.role() = 'service_role');

-- Optional: Allow anon users to read (if you want to use anon key for pings)
CREATE POLICY "Allow anon read heartbeat" ON heartbeat
  FOR SELECT USING (true);
