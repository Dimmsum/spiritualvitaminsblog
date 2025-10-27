"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Calendar, User } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 border border-gray-200/50 hover:border-gray-300/50 hover:-translate-y-1">
      {/* Featured Image */}
      {post.images && post.images.length > 0 && (
        <Link href={`/blog/${post.id}`}>
          <div className="relative h-56 w-full overflow-hidden bg-gray-100">
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>
      )}

      <div className="p-6 md:p-8">
        {/* Category & Date */}
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#8b0000]/5 text-[#8b0000] font-medium text-xs tracking-wide border border-[#8b0000]/10">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 font-light">
            <Calendar className="h-3.5 w-3.5" />
            <time className="text-xs">{formatDate(post.createdAt)}</time>
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.id}`}>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-[#8b0000] transition-colors line-clamp-2 tracking-tight leading-tight">
            {post.title}
          </h2>
        </Link>

        {/* Scripture Reference */}
        {post.scripture && (
          <div className="bg-gradient-to-br from-red-50/80 to-orange-50/50 rounded-2xl border border-[#8b0000]/10 p-4 mb-4">
            <p className="text-gray-700 text-sm leading-relaxed font-light italic line-clamp-2">
              &ldquo;{post.scripture.verse}&rdquo;
            </p>
            <p className="text-gray-500 text-xs mt-2 font-medium">
              {post.scripture.reference}
            </p>
          </div>
        )}

        {/* Excerpt */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed font-light">
          {post.excerpt}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#8b0000] to-[#660000] text-white text-sm font-medium">
            {post.author.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {post.author.name}
          </span>
        </div>

        {/* Interaction Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-gray-500 hover:text-[#8b0000] transition-colors cursor-pointer group/like">
              <Heart className="h-4 w-4 group-hover/like:fill-[#8b0000] transition-all" />
              <span className="text-sm font-medium">{post.likes.length}</span>
            </span>
            <span className="flex items-center gap-2 text-gray-500 hover:text-[#8b0000] transition-colors cursor-pointer">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {post.comments.length}
              </span>
            </span>
          </div>
          <button className="flex items-center gap-2 text-gray-400 hover:text-[#8b0000] transition-colors group/share">
            <Share2 className="h-4 w-4 group-hover/share:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
}
