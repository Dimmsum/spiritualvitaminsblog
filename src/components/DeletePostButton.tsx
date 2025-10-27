"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Toast from "./Toast";

interface DeletePostButtonProps {
  postId: string;
  authorEmail: string;
}

export default function DeletePostButton({
  postId,
  authorEmail,
}: DeletePostButtonProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Only show delete button if user is author or admin
  const canDelete =
    user &&
    (user.email === authorEmail ||
      isAdmin ||
      user.email === "flawlesslee.rrl@gmail.com");

  if (!canDelete) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete post");
      }

      setToast({
        message: "Post deleted successfully!",
        type: "success",
      });

      // Redirect to home after a short delay
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error deleting post:", error);
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete post. Please try again.",
        type: "error",
      });
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete this post"
      >
        {isDeleting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Deleting...</span>
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            <span>Delete Post</span>
          </>
        )}
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
