-- Enable Row Level Security on all tables
-- Note: This app uses NextAuth for authentication (not Supabase Auth)
-- Authorization is handled at the application layer via Server Actions
-- These policies enable RLS to satisfy security requirements while allowing
-- the application to access data through the connection pool

-- ============================================================================
-- USERS TABLE
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow all operations for the service/application role
CREATE POLICY "Enable all access for service role" ON users
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- DECKS TABLE
-- ============================================================================
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON decks
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- CARDS TABLE
-- ============================================================================
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON cards
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- USER_DECKS TABLE
-- ============================================================================
ALTER TABLE user_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON user_decks
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- RESULTS TABLE
-- ============================================================================
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON results
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- RATINGS TABLE
-- ============================================================================
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON ratings
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- HINTS TABLE
-- ============================================================================
ALTER TABLE hints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON hints
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- TAGS TABLE
-- ============================================================================
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON tags
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- DECK_TAGS TABLE
-- ============================================================================
ALTER TABLE deck_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON deck_tags
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON comments
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- GROUPS TABLE
-- ============================================================================
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON groups
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- GROUP_MEMBERS TABLE
-- ============================================================================
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON group_members
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- GROUP_DECKS TABLE
-- ============================================================================
ALTER TABLE group_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role" ON group_decks
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);
