-- Enable Row Level Security on Prisma's internal migrations table
-- This table is managed by Prisma and only accessed by the application via migrations

ALTER TABLE _prisma_migrations ENABLE ROW LEVEL SECURITY;

-- Allow all operations for the service/application role
-- This table is internal to Prisma and not exposed via APIs
CREATE POLICY "Enable all access for service role" ON _prisma_migrations
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);
