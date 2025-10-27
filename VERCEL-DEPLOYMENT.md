# Vercel Deployment Guide for Spiritual Vitamins

## Prerequisites
- GitHub repository connected to Vercel
- Supabase project set up

## Environment Variables

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://qblpjpsgtuiiotegnmtq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibHBqcHNndHVpaW90ZWdubXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDQwMDUsImV4cCI6MjA3NzA4MDAwNX0.69DGxt99vztOq4zmMeU6GQbvxaATA3xRc3pdwjgwDT4
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

**Important:** Replace `https://your-app-name.vercel.app` with your actual Vercel deployment URL after the first deployment.

## Deployment Steps

### 1. Initial Deployment

```bash
# Push your code to GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Add the environment variables (see above)
6. Click **"Deploy"**

### 3. Update NEXT_PUBLIC_SITE_URL

After your first deployment:

1. Copy your Vercel deployment URL (e.g., `https://spiritualvitamins.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_SITE_URL` with your actual URL
4. Redeploy the application

### 4. Configure Supabase

Make sure your Supabase database has:

✅ **Tables created** (users, posts, comments, likes)
✅ **RLS policies enabled** (run `fix-rls-policies.sql`)
✅ **Authentication enabled** (Email/Password + Google OAuth if needed)

## Troubleshooting

### Posts Not Displaying

**Problem:** Blog posts don't show up on the deployed site.

**Solution:**
1. Check that `NEXT_PUBLIC_SITE_URL` is set correctly in Vercel
2. Verify Supabase connection by checking Vercel logs
3. Ensure RLS policies are properly configured
4. Check that posts exist in your Supabase database

**Debug Steps:**
```bash
# Check Vercel logs
vercel logs [deployment-url]
```

### 401/403 Errors

**Problem:** Getting unauthorized errors when creating posts or comments.

**Solution:**
1. Run the `fix-rls-policies.sql` script in Supabase SQL Editor
2. Verify you're signed in as an admin
3. Check that environment variables are set in Vercel

### Build Errors

**Problem:** Deployment fails during build.

**Solution:**
1. Check Vercel build logs for specific errors
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript types are correct
4. Run `npm run build` locally to catch errors

## Post-Deployment Checklist

- [ ] Verify home page loads
- [ ] Test blog post creation (as admin)
- [ ] Test blog post viewing
- [ ] Test likes functionality
- [ ] Test comments functionality
- [ ] Test authentication (sign up/login)
- [ ] Test Google OAuth (if configured)
- [ ] Test delete post functionality
- [ ] Check mobile responsiveness

## Continuous Deployment

Vercel automatically redeploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main
# Vercel will automatically deploy
```

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## Performance Optimization

For better performance on Vercel:

1. **Enable Edge Functions** - Already configured with Next.js 15
2. **Image Optimization** - Use Next.js Image component (already implemented)
3. **ISR (Incremental Static Regeneration)** - Consider for blog posts
4. **CDN Caching** - Automatic with Vercel

## Monitoring

Monitor your application:

1. **Vercel Analytics** - Enable in project settings
2. **Supabase Logs** - Check database queries
3. **Error Tracking** - Consider adding Sentry

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review environment variables
4. Verify RLS policies are correct
