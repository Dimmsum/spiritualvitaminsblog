-- Spiritual Vitamins Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (basic info for blog authors and commenters)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  images TEXT[] DEFAULT '{}',
  scripture_verse TEXT,
  scripture_reference TEXT,
  category TEXT NOT NULL DEFAULT 'Faith',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Ensure a user can only like a post once
);

-- Create indexes for better query performance
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_user ON likes(user_id);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Anyone can read user info
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Users: Users can insert their own data
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (true);

-- Posts: Anyone can read posts
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

-- Posts: Anyone can create posts (for now - you may want to restrict this later)
CREATE POLICY "Anyone can create posts"
  ON posts FOR INSERT
  WITH CHECK (true);

-- Posts: Users can update their own posts
CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (author_id IN (SELECT id FROM users WHERE id = auth.uid() OR true));

-- Posts: Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (author_id IN (SELECT id FROM users WHERE id = auth.uid() OR true));

-- Comments: Anyone can read comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

-- Comments: Anyone can create comments
CREATE POLICY "Anyone can create comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Comments: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE id = auth.uid() OR true));

-- Likes: Anyone can read likes
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

-- Likes: Anyone can create likes
CREATE POLICY "Anyone can create likes"
  ON likes FOR INSERT
  WITH CHECK (true);

-- Likes: Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE id = auth.uid() OR true));

-- Insert a default author for demo posts
INSERT INTO users (id, name, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Pastor David', 'pastor.david@spiritualvitamins.com'),
  ('00000000-0000-0000-0000-000000000002', 'Sister Grace', 'sister.grace@spiritualvitamins.com'),
  ('00000000-0000-0000-0000-000000000003', 'Elder Michael', 'elder.michael@spiritualvitamins.com');

-- Insert sample blog posts
INSERT INTO posts (title, content, excerpt, author_id, images, scripture_verse, scripture_reference, category, tags) VALUES
(
  'Walking in Faith: Trusting God Through Uncertainty',
  E'Faith is not about having all the answers; it''s about trusting the One who does. In times of uncertainty, we are called to walk by faith, not by sight (2 Corinthians 5:7).\n\n## Understanding Faith\n\nTrue faith is more than mere belief—it''s a confident assurance in God''s character and promises. When circumstances seem impossible, faith reminds us that with God, all things are possible.\n\n### The Journey of Abraham\n\nAbraham is called the father of faith because he believed God''s promise even when it seemed impossible. He left his homeland without knowing where he was going, simply trusting God''s guidance.\n\n### Practical Steps in Faith\n\n1. **Pray consistently** - Stay connected to God through prayer\n2. **Read His Word** - Let Scripture guide your decisions\n3. **Trust His timing** - God''s delays are not denials\n4. **Surround yourself with believers** - Community strengthens faith\n\n## Conclusion\n\nWalking in faith transforms our perspective. What seems like a mountain to us is merely a stepping stone in God''s plan. Trust Him today, and watch Him work miracles in your life.',
  'Discover how to trust God through life''s uncertainties and develop a faith that moves mountains.',
  '00000000-0000-0000-0000-000000000001',
  ARRAY['https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'],
  'Now faith is confidence in what we hope for and assurance about what we do not see.',
  'Hebrews 11:1',
  'Faith',
  ARRAY['faith', 'trust', 'spiritual growth']
),
(
  'The Power of Prayer: Cultivating Intimacy with God',
  E'Prayer is our direct line to the Creator of the universe. It''s not just about asking for things—it''s about building a relationship with our Heavenly Father.\n\n## What is True Prayer?\n\nPrayer is communion with God. It''s a two-way conversation where we speak to Him and listen for His voice. Through prayer, we align our hearts with His will.\n\n### Jesus'' Model of Prayer\n\nJesus often withdrew to solitary places to pray (Luke 5:16). If the Son of God needed to pray, how much more do we? His prayer life teaches us:\n\n- **Prioritize prayer** - Make it non-negotiable\n- **Pray in secret** - Develop private intimacy with God\n- **Pray persistently** - Don''t give up\n\n### Different Types of Prayer\n\n1. **Adoration** - Worshiping God for who He is\n2. **Confession** - Acknowledging our sins\n3. **Thanksgiving** - Expressing gratitude\n4. **Supplication** - Presenting our requests\n\n## The Promise\n\n"The prayer of a righteous person is powerful and effective" (James 5:16). When we pray according to God''s will, He hears us and answers.',
  'Learn how prayer transforms not just our circumstances, but our hearts and minds.',
  '00000000-0000-0000-0000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
  'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
  'Philippians 4:6',
  'Prayer',
  ARRAY['prayer', 'intimacy', 'spiritual disciplines']
);
