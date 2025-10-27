"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Send, LogIn } from "lucide-react";
import { Comment } from "@/types/blog";
import { useAuth } from "@/contexts/AuthContext";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function CommentSection({
  postId,
  comments: initialComments,
}: CommentSectionProps) {
  const { user, loading } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userName: user.user_metadata?.full_name || user.email,
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const newCommentData = await response.json();
      setComments([newCommentData, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMs = now.getTime() - commentDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return commentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {loading ? (
        <div className="mb-8 bg-gray-50 rounded-lg p-6 text-center text-gray-500">
          Loading...
        </div>
      ) : user ? (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-gray-50 rounded-lg p-6"
        >
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Share Your Thoughts
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Posting as {user.user_metadata?.full_name || user.email}
            </p>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-[#8b0000] text-white px-6 py-2 rounded-lg hover:bg-[#660000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
          </button>
        </form>
      ) : (
        <div className="mb-8 bg-gray-50 rounded-lg p-6 text-center">
          <LogIn className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            You must be signed in to leave a comment
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/login"
              className="px-6 py-2 bg-[#8b0000] text-white rounded-lg hover:bg-[#660000] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-white text-[#8b0000] border-2 border-[#8b0000] rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[#8b0000] flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {comment.user.name}
                    </h4>
                    <time className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </time>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
