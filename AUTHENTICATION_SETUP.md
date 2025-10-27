# Authentication Setup Guide

## Overview

The Spiritual Vitamins blog now includes a complete authentication system with role-based access control:

- **Admin Users**: Can create, edit, and publish blog posts
- **Regular Users**: Can comment on blog posts after signing up/logging in
- **Guests**: Can only read blog posts

## Setting Up Your Admin Account

### Step 1: Create Admin User in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** → **Users** in the sidebar
4. Click **Add user** → **Create new user**
5. Fill in the details:

   - **Email**: `admin@spiritualvitamins.com` (or your preferred admin email)
   - **Password**: Choose a strong password
   - **Auto Confirm User**: ✅ **Enable this** (skip email confirmation)

6. Click **Create user**

### Step 2: Set Admin Role (Method 1 - Recommended)

After creating the user, you need to add the admin role to their metadata:

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Find your admin user and click on it
3. Scroll down to **User Metadata** section
4. Click **Edit** (pencil icon)
5. Add the following JSON:

```json
{
  "role": "admin",
  "full_name": "Admin User"
}
```

6. Click **Save**

### Step 3: Verify Admin Access

1. Go to your application (local or deployed)
2. Click **Sign In**
3. Enter your admin credentials
4. You should now see:

   - A **"Write"** button in the header (admin only feature)
   - Your name displayed in the header
   - A **Sign Out** option

5. Click **Write** to create a new blog post

## Alternative Admin Setup Methods

### Method 2: Using SQL

If you prefer, you can set the admin role using SQL in Supabase:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query (replace the email with your admin email):

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin", "full_name": "Admin User"}'::jsonb
WHERE email = 'admin@spiritualvitamins.com';
```

### Method 3: Hardcoded Email (Currently Used)

The application also recognizes `admin@spiritualvitamins.com` as an admin by default. This is hardcoded in the `AuthContext.tsx` file:

```typescript
const isAdmin =
  user?.email === "admin@spiritualvitamins.com" ||
  user?.user_metadata?.role === "admin";
```

To use a different email as admin without setting metadata:

1. Open `src/contexts/AuthContext.tsx`
2. Change the email in the `isAdmin` check:

```typescript
const isAdmin =
  user?.email === "YOUR_EMAIL@example.com" ||
  user?.user_metadata?.role === "admin";
```

## User Registration Flow

### For Admin

1. Sign up at `/signup` or use the Supabase Dashboard (recommended)
2. Set role to 'admin' via user metadata (see Step 2 above)
3. Sign in
4. Access the "Write" button to create posts

### For Regular Users

1. Sign up at `/signup`
2. Confirm email (if email confirmation is enabled)
3. Sign in
4. Leave comments on blog posts

## Security Features

### Authentication

- **Supabase Auth**: Secure authentication with email/password
- **Session Management**: Persistent sessions across page refreshes
- **Auto Sign Out**: Secure sign out functionality

### Authorization

- **Route Protection**: Create post page redirects non-admin users
- **Client-Side Guards**: UI elements hidden based on user role
- **Server-Side Validation**: API routes should validate permissions (recommended enhancement)

## Recommended Enhancements

### 1. Update Row Level Security Policies

Update your Supabase RLS policies to enforce server-side authorization:

```sql
-- Only admins can create posts
CREATE POLICY "Only admins can create posts" ON posts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'email' = 'admin@spiritualvitamins.com' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Only authenticated users can create comments
CREATE POLICY "Authenticated users can create comments" ON comments
FOR INSERT
TO authenticated
WITH CHECK (true);
```

Run these in your Supabase SQL Editor.

### 2. Add Email Confirmation

For production, enable email confirmation:

1. Go to **Authentication** → **Settings** in Supabase
2. Enable **Confirm email**
3. Configure your email templates

### 3. Add Password Reset

Implement password reset functionality using Supabase's built-in methods:

```typescript
const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: "https://yourdomain.com/reset-password",
});
```

## Troubleshooting

### "Access Denied" on /create page

**Problem**: Can't access create post page even after signing in

**Solutions**:

1. Verify you're signed in (check if your name appears in header)
2. Confirm your user has admin role:
   - Check email is `admin@spiritualvitamins.com`, OR
   - Check user_metadata has `"role": "admin"` in Supabase Dashboard
3. Clear browser cache and sign in again
4. Check browser console for errors

### Comments not working

**Problem**: Can't submit comments

**Solutions**:

1. Make sure you're signed in
2. Check if the comment form shows your name (indicates auth is working)
3. Verify the /api/comments endpoint is accessible
4. Check browser console for API errors

### Sign up not working

**Problem**: Can't create new account

**Solutions**:

1. Check if email is already registered
2. Ensure password is at least 6 characters
3. Verify Supabase project is active
4. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env

## Next Steps

1. ✅ Set up your admin account
2. ✅ Sign in and test creating a post
3. ✅ Create a regular user and test commenting
4. 📝 Update RLS policies for production security
5. 📧 Enable email confirmation for user signups
6. 🔒 Add password reset functionality
7. 👥 Consider adding more admin management features

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Supabase logs in Dashboard → Logs
3. Verify environment variables are set correctly
4. Ensure Supabase project is not paused

---

**Important**: Never commit your admin password or .env file to version control!
