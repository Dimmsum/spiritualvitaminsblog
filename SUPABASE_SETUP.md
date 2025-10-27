# Supabase Setup Guide

This guide will help you set up Supabase as the backend for your Spiritual Vitamins blog application.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Node.js 18+ installed
- The Spiritual Vitamins project set up locally

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Spiritual Vitamins (or your preferred name)
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: Choose the region closest to your target audience
   - **Pricing Plan**: Free tier is perfect for getting started
4. Click "Create new project"
5. Wait a few minutes for your database to be set up

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys > anon public**: A long string starting with `eyJ...`

## Step 3: Set Up Environment Variables

1. In your project root, create a file called `.env.local`:

```bash
# Copy the template
cp .env.local.example .env.local
```

2. Open `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with the ones you copied from Step 2.

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, click on the **SQL Editor** icon in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` in your project
4. Copy the entire contents of the file
5. Paste it into the Supabase SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see a success message: "Success. No rows returned"

This creates all the necessary tables, indexes, and security policies.

## Step 5: Verify the Setup

1. In your Supabase dashboard, click on the **Table Editor** icon
2. You should now see the following tables:
   - `users`
   - `posts`
   - `comments`
   - `likes`
3. The `users` and `posts` tables should have some sample data already inserted

## Step 6: Test Locally

1. Make sure your `.env.local` file is configured correctly
2. Restart your Next.js development server:

```bash
npm run dev
```

3. Visit `http://localhost:3000`
4. You should see the sample blog posts loaded from Supabase
5. Try creating a new post at `http://localhost:3000/create`
6. Try liking a post and leaving a comment

## Step 7: Deploy to Vercel

### A. Push Your Code to GitHub

```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

### B. Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click **Add New... > Project**
3. Import your GitHub repository
4. Configure your project:

   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. Add Environment Variables:

   - Click **Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL` with your Supabase URL
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon key
   - Add `NEXT_PUBLIC_SITE_URL` with your Vercel URL (e.g., `https://your-app.vercel.app`)

6. Click **Deploy**
7. Wait for the deployment to complete (usually 2-3 minutes)
8. Visit your live site!

## Troubleshooting

### Issue: "Failed to fetch posts"

**Solution**: Check that your environment variables are set correctly:

- Verify `.env.local` exists and has the correct values
- Restart your development server after changing env variables
- Make sure the Supabase project is not paused (free tier projects pause after 7 days of inactivity)

### Issue: "Row Level Security policy violation"

**Solution**: The schema.sql file includes RLS policies. If you're having permission issues:

1. Go to your Supabase dashboard
2. Click **Authentication > Policies**
3. Make sure the policies allow public access for read operations
4. For production, you may want to implement proper authentication

### Issue: Images not loading

**Solution**: Make sure your `next.config.ts` has the image domain configured:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
},
```

### Issue: "Connection refused" or CORS errors

**Solution**:

- Check that your `NEXT_PUBLIC_SUPABASE_URL` doesn't have a trailing slash
- Verify you're using the correct anon key (not the service role key)
- Make sure your Supabase project is active

## Database Management

### Viewing Data

1. Go to Supabase Dashboard > **Table Editor**
2. Select a table to view/edit data
3. You can manually add, edit, or delete rows

### Backup Your Data

1. Go to Supabase Dashboard > **Database** > **Backups**
2. Free tier includes daily backups for 7 days
3. You can also export data via SQL Editor

### Running Queries

1. Go to **SQL Editor**
2. Write custom queries to analyze or modify your data
3. Example: Get all posts with comment counts

```sql
SELECT
  posts.title,
  COUNT(comments.id) as comment_count
FROM posts
LEFT JOIN comments ON posts.id = comments.post_id
GROUP BY posts.id, posts.title
ORDER BY comment_count DESC;
```

## Next Steps

### Add Authentication

For a production app, you should add user authentication:

1. Enable Email/Password auth in Supabase Dashboard > **Authentication**
2. Install NextAuth.js: `npm install next-auth`
3. Update RLS policies to require authentication for creating/deleting posts
4. Add user profiles and permissions

### Add Image Upload

Currently, images use URLs. To add direct uploads:

1. Enable Storage in Supabase Dashboard
2. Create a bucket for blog images
3. Update the create post form to upload files
4. Use Supabase Storage URLs instead of external URLs

### Add Search Functionality

Supabase supports full-text search:

```sql
-- Add search to posts
ALTER TABLE posts ADD COLUMN search_vector tsvector;

CREATE INDEX posts_search_idx ON posts USING gin(search_vector);

-- Update search vector
UPDATE posts SET search_vector =
  to_tsvector('english', title || ' ' || content || ' ' || excerpt);
```

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the Vercel deployment logs
3. Check Supabase logs in Dashboard > **Logs**
4. Review this guide and the troubleshooting section

---

**May your blog be a blessing to many!** 🙏
