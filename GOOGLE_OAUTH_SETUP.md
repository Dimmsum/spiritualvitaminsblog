# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Spiritual Vitamins blog.

## Overview

Google OAuth allows users to sign in using their Google accounts, providing a seamless and secure authentication experience. No password required!

## Prerequisites

- Supabase project set up
- Google Cloud Console account (free)

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### 1.2 Enable Google+ API

1. In the sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

### 1.3 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:

   - Click **Configure Consent Screen**
   - Choose **External** (for public users)
   - Fill in the required fields:
     - **App name**: Spiritual Vitamins
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Click **Save and Continue**
   - Skip the Scopes section (click **Save and Continue**)
   - Skip Test users (click **Save and Continue**)
   - Click **Back to Dashboard**

4. Now create the OAuth client ID:
   - Click **Create Credentials** → **OAuth client ID**
   - **Application type**: Web application
   - **Name**: Spiritual Vitamins Web Client
5. **Configure Authorized redirect URIs**:

   - Click **Add URI** under "Authorized redirect URIs"
   - Add your Supabase callback URL:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
   - Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
   - You can find this in your Supabase Dashboard URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`

6. Click **Create**

7. **Save your credentials**:
   - Copy the **Client ID**
   - Copy the **Client Secret**
   - Keep these safe!

## Step 2: Configure Supabase

### 2.1 Add Google Provider

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list
4. Click to expand Google settings
5. Enable the **Google Enabled** toggle
6. Paste your **Client ID** from Google Cloud Console
7. Paste your **Client Secret** from Google Cloud Console
8. Click **Save**

### 2.2 Configure Redirect URLs (Optional for localhost)

For local development, you may want to add localhost to allowed redirect URLs:

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000
   ```
3. Click **Save**

## Step 3: Update Your Application (Already Done!)

The code has already been updated with:

- `signInWithGoogle()` function in AuthContext
- "Continue with Google" buttons on login and signup pages
- Proper OAuth redirect handling

## Step 4: Test Google OAuth

### Local Testing

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click **Continue with Google**

4. You'll be redirected to Google's sign-in page

5. Choose your Google account

6. Grant permissions to the app

7. You'll be redirected back to your app, now signed in!

### Production Testing

1. Deploy your app to Vercel (or your hosting platform)

2. Add your production URL to Google Cloud Console:

   - Go back to your OAuth client credentials
   - Add your production redirect URI:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```

3. In Supabase, add your production URL to **Redirect URLs**:

   ```
   https://your-domain.vercel.app
   ```

4. Test signing in with Google on your live site!

## Troubleshooting

### "Redirect URI mismatch" Error

**Problem**: Google shows an error about redirect URI not matching

**Solution**:

1. Check that your Supabase callback URL in Google Cloud Console exactly matches:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
2. Make sure there are no trailing slashes
3. Ensure you're using the correct project reference

### OAuth Not Working Locally

**Problem**: OAuth redirect fails on localhost

**Solution**:

1. Make sure `http://localhost:3000` is in your Supabase Redirect URLs
2. Check that the `redirectTo` option in `signInWithGoogle()` matches your current URL
3. Try using `127.0.0.1:3000` instead of `localhost:3000`

### User Email Not Available

**Problem**: `user.email` is null after Google sign-in

**Solution**:

1. This shouldn't happen with Google OAuth
2. Check that you've enabled the email scope in Google Cloud Console
3. The email should be automatically included in the user object

### Can't Find Project Reference

**Problem**: Don't know what YOUR_PROJECT_REF is

**Solution**:

1. Go to Supabase Dashboard
2. Look at the URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`
3. Your project ref is the string after `/project/`
4. Or go to **Settings** → **API** and find it in the Project URL

## Security Best Practices

### 1. Protect Your Client Secret

- Never commit your client secret to version control
- Store it securely in Supabase only
- Rotate it periodically

### 2. Configure OAuth Consent Screen Properly

- Use a privacy policy URL (required for production)
- Add terms of service URL
- Specify which scopes your app needs

### 3. Limit Redirect URIs

- Only add trusted domains to authorized redirect URIs
- Remove localhost from production OAuth credentials
- Use different OAuth clients for dev and production if needed

### 4. Monitor OAuth Usage

- Check Google Cloud Console for API usage
- Review who's signing in via Supabase Dashboard
- Set up alerts for unusual activity

## Advanced Configuration

### Add Additional OAuth Providers

You can add more providers like:

- GitHub
- Facebook
- Twitter
- Discord

Each provider has a similar setup process in Supabase.

### Customize OAuth Flow

You can customize the OAuth experience:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/`,
    scopes: "email profile", // Request specific scopes
    queryParams: {
      access_type: "offline", // Get refresh token
      prompt: "consent", // Force consent screen
    },
  },
});
```

### Handle OAuth Errors

Add better error handling:

```typescript
const handleGoogleSignIn = async () => {
  try {
    const { data, error } = await signInWithGoogle();

    if (error) {
      if (error.message.includes("popup_closed_by_user")) {
        setError("Sign-in was cancelled");
      } else if (error.message.includes("network")) {
        setError("Network error. Please check your connection");
      } else {
        setError(error.message);
      }
    }
  } catch (err) {
    console.error("OAuth error:", err);
    setError("An unexpected error occurred");
  }
};
```

## User Data from Google

When a user signs in with Google, you get:

```typescript
{
  email: "user@gmail.com",
  email_verified: true,
  full_name: "John Doe",
  avatar_url: "https://lh3.googleusercontent.com/...",
  provider_id: "123456789",
  // ... other fields
}
```

This data is available in `user.user_metadata` in your app.

## Frequently Asked Questions

### Q: Do I need a verified domain for OAuth?

**A**: For development and testing, no. For production with many users, Google may require domain verification.

### Q: How many users can sign in with Google?

**A**: Unlimited! Google OAuth is free for any number of users.

### Q: Can I disable email/password auth after adding Google?

**A**: Yes, but it's recommended to keep multiple auth methods for user convenience.

### Q: Will existing users lose their accounts?

**A**: No, users who signed up with email/password can continue using that method. Google OAuth is an additional option.

### Q: How do I make someone admin who signs in with Google?

**A**: After they sign in once, go to Supabase Dashboard → Authentication → Users, find their user, and add `{"role": "admin"}` to their user metadata.

## Next Steps

1. ✅ Set up Google OAuth credentials
2. ✅ Configure Supabase provider
3. ✅ Test local sign-in
4. 📝 Add production redirect URLs before deploying
5. 🎨 Customize OAuth consent screen with branding
6. 🔒 Set up privacy policy and terms of service
7. 📊 Monitor OAuth usage and user signups

---

**That's it!** Your users can now sign in with their Google accounts in one click. 🎉

Need help? Check the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google) for more details.
