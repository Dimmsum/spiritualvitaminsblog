-- Fix Row Level Security Policies for Spiritual Vitamins
-- Run this in Supabase SQL Editor to allow authenticated users to create records

-- ====================
-- USERS TABLE POLICIES
-- ====================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Allow anyone to view user profiles (needed for displaying author info)
CREATE POLICY "Users can view all profiles"
  ON users
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' = email
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = email
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = email
  );

-- ====================
-- POSTS TABLE POLICIES
-- ====================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Authors can update their own posts" ON posts;
DROP POLICY IF EXISTS "Authors can delete their own posts" ON posts;

-- Allow anyone to view posts (public blog)
CREATE POLICY "Anyone can view posts"
  ON posts
  FOR SELECT
  USING (true);

-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authors to update their own posts
CREATE POLICY "Authors can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (
    author_id IN (
      SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Allow authors to delete their own posts
CREATE POLICY "Authors can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (
    author_id IN (
      SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    )
  );

-- ====================
-- COMMENTS TABLE POLICIES
-- ====================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Allow anyone to view comments
CREATE POLICY "Anyone can view comments"
  ON comments
  FOR SELECT
  USING (true);

-- Allow authenticated users to create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    )
  );

-- ====================
-- LIKES TABLE POLICIES
-- ====================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view likes" ON likes;
DROP POLICY IF EXISTS "Authenticated users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;

-- Allow anyone to view likes (for like counts)
CREATE POLICY "Anyone can view likes"
  ON likes
  FOR SELECT
  USING (true);

-- Allow authenticated users to create likes
CREATE POLICY "Authenticated users can create likes"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to delete their own likes (unlike)
CREATE POLICY "Users can delete their own likes"
  ON likes
  FOR DELETE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Display success message
SELECT 'RLS policies updated successfully!' as message;
SELECT 'All authenticated users can now create posts, comments, and likes.' as info;
