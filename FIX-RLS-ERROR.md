# Fix RLS (Row Level Security) Error

## The Problem

You're getting this error:

```
new row violates row-level security policy (USING expression) for table "users"
```

This happens because Supabase's Row Level Security (RLS) is blocking the API from creating records in the database.

## The Solution

### Step 1: Run the RLS Fix Script

1. **Go to Supabase Dashboard**

   - Navigate to https://supabase.com/dashboard
   - Select your project: `spiritualvitamins`

2. **Open SQL Editor**

   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Fix Script**

   - Open `fix-rls-policies.sql` in your project
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify Success**
   - You should see: "RLS policies updated successfully!"

### Step 2: Test Creating a Post

1. Make sure you're signed in to your app
2. Go to `/create` (you must be an admin)
3. Fill out the form and try creating a post
4. It should work now! 🎉

## What the Fix Does

The script updates your database policies to:

✅ **Users Table:**

- Anyone can view profiles (needed for showing authors)
- Authenticated users can create their own profile
- Users can update their own profile

✅ **Posts Table:**

- Anyone can view posts (public blog)
- Authenticated users can create posts
- Authors can edit/delete their own posts

✅ **Comments Table:**

- Anyone can view comments
- Authenticated users can comment
- Users can edit/delete their own comments

✅ **Likes Table:**

- Anyone can view likes (for counts)
- Authenticated users can like posts
- Users can unlike their own likes

## Still Having Issues?

If you still get errors:

1. **Make sure you're signed in** - The app requires authentication to create posts
2. **Check your admin status** - Only admins (flawlesslee.rrl@gmail.com) can create posts
3. **Clear browser cache** - Sometimes old auth tokens cause issues
4. **Check Supabase logs** - Go to Supabase Dashboard → Logs to see detailed errors

## Next Steps

After fixing RLS, you should be able to:

- ✅ Create new blog posts
- ✅ Add comments
- ✅ Like posts
- ✅ View all content

The app will automatically create user profiles when needed!
