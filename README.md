# 🙏 Spiritual Vitamins

A Christ-centered blog web application built with Next.js, Tailwind CSS, Supabase, and Lucide icons. Share spiritual insights, encouragement, and wisdom to strengthen faith journeys.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)

## ✨ Features

### 📝 Blog Management

- **Create Posts** - Write and publish blog posts with rich text content
- **Image Gallery** - Add multiple images to posts with a beautiful gallery viewer
- **Scripture Integration** - Feature Bible verses with your posts
- **Categories & Tags** - Organize content by categories and tags
- **Real-time Database** - All data stored in Supabase PostgreSQL

### 💬 User Interactions

- **Like Posts** - Express appreciation with an animated like button
- **Comments** - Engage in discussions with a full comment system (requires sign in)
- **Share Content** - Share posts via Facebook, Twitter, Email, or copy link
- **User Authentication** - Secure sign up and login system
- **Role-Based Access** - Admin users can create posts, regular users can comment
- **Responsive Design** - Beautiful experience on all devices

### 🎨 Design

- **Christ-Centered Theme** - Elegant red color scheme (#8b0000)
- **Modern UI** - Clean, professional interface with smooth animations
- **Accessible** - Built with accessibility best practices
- **Dark Mode Ready** - Includes dark mode color variables

### 🔧 Backend & Infrastructure

- **Supabase Backend** - PostgreSQL database with Row Level Security
- **Supabase Auth** - Secure email/password authentication
- **Admin System** - Role-based access control for content management
- **API Routes** - RESTful API endpoints for all operations
- **Real-time Updates** - Data synced across all clients
- **Production Ready** - Deploy to Vercel in minutes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- A Supabase account (free tier works great)

### Installation

1. **Clone or navigate to the project directory:**

```bash
cd spiritualvitamins
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up Supabase:**

Follow the detailed guides:

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Set up database and backend
- **[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)** - Configure authentication and admin access

This includes:

- Creating your Supabase project
- Setting up the database schema
- Creating your admin user
- Configuring environment variables

4. **Create your `.env.local` file:**

```bash
cp .env.local.example .env.local
```

Then add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. **Run the development server:**

```bash
npm run dev
```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
spiritualvitamins/
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── posts/         # Post CRUD operations
│   │   │   ├── comments/      # Comment operations
│   │   │   └── likes/         # Like/unlike operations
│   │   ├── blog/[id]/         # Individual blog post pages
│   │   ├── create/            # Create new post page (admin only)
│   │   ├── login/             # User login page
│   │   ├── signup/            # User registration page
│   │   ├── layout.tsx         # Root layout with Header/Footer
│   │   ├── page.tsx           # Home page with blog listing
│   │   └── globals.css        # Global styles and theme
│   ├── components/
│   │   ├── Header.tsx         # Navigation header with auth
│   │   ├── Footer.tsx         # Footer with scripture
│   │   ├── BlogCard.tsx       # Blog post card component
│   │   ├── ImageGallery.tsx   # Image gallery with lightbox
│   │   ├── LikeButton.tsx     # Like interaction
│   │   ├── ShareButton.tsx    # Share functionality
│   │   └── CommentSection.tsx # Comments system (auth required)
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication state management
│   ├── lib/
│   │   └── supabase/          # Supabase client utilities
│   ├── types/
│   │   └── blog.ts            # TypeScript interfaces
│   └── data/
│       └── mockData.ts        # Legacy sample data
├── supabase/
│   └── schema.sql             # Database schema
├── public/                     # Static assets
├── .env.local.example         # Environment variables template
├── SUPABASE_SETUP.md          # Detailed Supabase setup guide
├── AUTHENTICATION_SETUP.md    # Authentication configuration guide
└── package.json
```

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following tables:

- **users** - Author and commenter information
- **posts** - Blog posts with content, images, and metadata
- **comments** - User comments on posts
- **likes** - Post likes/reactions

See `supabase/schema.sql` for the complete schema with indexes and Row Level Security policies.

## 🔌 API Routes

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/[id]` - Get a single post with comments and likes
- `POST /api/posts` - Create a new post

### Comments

- `POST /api/comments` - Add a comment to a post

### Likes

- `POST /api/likes` - Toggle like on a post
- `GET /api/likes?postId=[id]` - Get like count for a post

## 🎯 Key Components

### Blog Card

Displays blog post previews with:

- Featured image
- Title and excerpt
- Scripture reference
- Author and date
- Like and comment counts
- Category badge

### Blog Detail Page

Full blog post view with:

- Image gallery with lightbox
- Scripture highlight
- Like and share buttons
- Full content with formatting
- Comment section
- Related tags

### Create Post Page

Admin interface for creating posts:

- Rich text editor
- Image URL input with preview
- Scripture verse integration
- Category selection
- Tag management

## 🎨 Customization

### Color Scheme

The main colors are defined in `src/app/globals.css`:

- Primary: `#8b0000` (Dark Red)
- Primary Light: `#b22222` (Fire Brick)
- Primary Dark: `#660000` (Blood Red)
- Accent: `#dc143c` (Crimson)

### Adding New Categories

Update the category list in `src/app/create/page.tsx`:

```typescript
<option value="YourCategory">Your Category</option>
```

## � Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL)
4. Deploy!

See the **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** guide for detailed deployment instructions.

## 📝 Content Management

### Creating Posts

1. Sign in with your admin account (see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md))
2. Click the "Write" button in the header (only visible to admins)
3. Fill in the form with your content
4. Add image URLs (from Unsplash, your own hosting, etc.)
5. Include a scripture verse for spiritual context
6. Publish!

### User Roles

**Admin Users:**

- Can create and publish blog posts
- Access to the `/create` page
- See "Write" button in navigation

**Regular Users:**

- Can sign up and log in
- Can comment on blog posts
- Can like and share posts

**Guests:**

- Can read all blog posts
- Can like posts (no account needed)
- Cannot comment (requires account)

### Managing Content

- View and manage posts in your Supabase dashboard
- Use the SQL Editor for bulk operations
- Set up automated backups
- Monitor analytics and usage

## 🔮 Future Enhancements

- [x] Supabase backend integration
- [x] Real-time database
- [x] API routes for CRUD operations
- [x] User authentication (Supabase Auth)
- [x] Role-based access control
- [ ] Enhanced admin dashboard
- [ ] Email subscriptions
- [ ] File upload for images (Supabase Storage)
- [ ] Password reset functionality
- [ ] User profile pages
- [ ] Search functionality
- [ ] RSS feed
- [ ] Analytics
- [ ] Advanced SEO optimization

## 🛠️ Built With

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Supabase](https://supabase.com/)** - PostgreSQL database and backend
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icons
- **[Geist Font](https://vercel.com/font)** - Modern typography
- **[Vercel](https://vercel.com/)** - Hosting and deployment

## 🤝 Contributing

This project is ready for production use with Supabase! To enhance it further:

1. ✅ Database is already set up with Supabase
2. Add user authentication with Supabase Auth
3. Implement file upload with Supabase Storage
4. Add full-text search functionality
5. Set up email notifications

## 📄 License

This project is open source and available for use in Christian ministry and personal projects.

## 📚 Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase setup guide
- **[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)** - Authentication configuration
- **[README.md](./README.md)** - This file, project overview
- **Database Schema** - See `supabase/schema.sql`

## 🙏 Credits

Built with love for the Kingdom of God. All glory to Jesus Christ.

---

**"Man shall not live by bread alone, but by every word that comes from the mouth of God."** — Matthew 4:4
