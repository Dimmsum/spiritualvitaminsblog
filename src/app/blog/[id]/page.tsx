import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import { BlogPost } from "@/types/blog";
import ImageGallery from "@/components/ImageGallery";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import CommentSection from "@/components/CommentSection";

async function getPost(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/posts/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-[#8b0000] hover:text-[#660000] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all posts</span>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <span className="bg-[#8b0000] text-white px-3 py-1 rounded-full text-xs font-medium">
              {post.category}
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <time>{formatDate(post.createdAt)}</time>
            </span>
            <span className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Scripture */}
        {post.scripture && (
          <div className="bg-white rounded-lg p-6 mb-8 border-l-4 border-[#8b0000] shadow-sm">
            <blockquote className="text-lg italic text-gray-700 mb-2">
              &ldquo;{post.scripture.verse}&rdquo;
            </blockquote>
            <cite className="text-sm text-[#8b0000] font-semibold">
              — {post.scripture.reference}
            </cite>
          </div>
        )}

        {/* Image Gallery */}
        {post.images && post.images.length > 0 && (
          <div className="mb-8">
            <ImageGallery images={post.images} title={post.title} />
          </div>
        )}

        {/* Interaction Buttons */}
        <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-200">
          <LikeButton postId={post.id} initialLikes={post.likes.length} />
          <ShareButton
            postId={post.id}
            title={post.title}
            excerpt={post.excerpt}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-[#8b0000] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ol:my-6
              prose-li:text-gray-700 prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-[#8b0000] 
              prose-blockquote:bg-red-50 prose-blockquote:py-3 prose-blockquote:px-4
              prose-blockquote:italic prose-blockquote:text-gray-700"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/\n/g, "<br />")
                .replace(/##/g, "<h2>")
                .replace(/###/g, "<h3>"),
            }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-12">
            <Tag className="h-4 w-4 text-gray-500" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comment Section */}
        <CommentSection postId={post.id} comments={post.comments} />
      </article>
    </div>
  );
}
