import BlogCard from "@/components/BlogCard";
import { BookOpen, Sparkles } from "lucide-react";
import { BlogPost } from "@/types/blog";

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/posts`,
      {
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch posts");
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,0,0,0.03),transparent_50%)]" />

        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-[#8b0000] to-[#660000] shadow-lg shadow-red-500/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              Spiritual Vitamins
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
              Daily nourishment for your soul. Discover Christ-centered
              insights, encouragement, and wisdom to strengthen your faith
              journey.
            </p>
            <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-900/5">
              <div className="flex items-center gap-2 text-gray-700">
                <BookOpen className="h-5 w-5 text-[#8b0000]" />
                <span className="text-base font-medium italic">
                  &ldquo;Man shall not live by bread alone, but by every word
                  that comes from the mouth of God.&rdquo;
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium">— Matthew 4:4</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2">
              Latest Posts
            </h2>
            <p className="text-gray-500 font-light">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gray-100">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-light">
              No posts yet. Be the first to share spiritual encouragement!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Scripture */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.03),transparent_70%)]" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#8b0000]/5 border border-[#8b0000]/10">
              <span className="text-sm font-medium text-[#8b0000]">
                Featured Verse
              </span>
            </div>
            <blockquote className="text-3xl md:text-4xl text-gray-900 font-light leading-relaxed mb-8 tracking-tight">
              &ldquo;Trust in the Lord with all your heart and lean not on your
              own understanding; in all your ways submit to him, and he will
              make your paths straight.&rdquo;
            </blockquote>
            <cite className="text-lg text-gray-600 font-medium not-italic">
              Proverbs 3:5-6
            </cite>
          </div>
        </div>
      </section>
    </div>
  );
}
