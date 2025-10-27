"use client";

import { useState } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Link as LinkIcon,
  Mail,
} from "lucide-react";

interface ShareButtonProps {
  postId: string;
  title: string;
  excerpt: string;
}

export default function ShareButton({
  postId,
  title,
  excerpt,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const postUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${postId}`
      : "";

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(`${excerpt}\n\nRead more: ${postUrl}`)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: string) => {
    if (platform === "copy") {
      copyToClipboard();
    } else {
      window.open(
        shareLinks[platform as keyof typeof shareLinks],
        "_blank",
        "width=600,height=400"
      );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Share2 className="h-5 w-5" />
        <span className="font-medium">Share</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Share Menu */}
          <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-20 min-w-[200px]">
            <button
              onClick={() => handleShare("facebook")}
              className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Facebook</span>
            </button>

            <button
              onClick={() => handleShare("twitter")}
              className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <Twitter className="h-5 w-5 text-sky-500" />
              <span>Twitter</span>
            </button>

            <button
              onClick={() => handleShare("email")}
              className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <Mail className="h-5 w-5 text-gray-600" />
              <span>Email</span>
            </button>

            <div className="border-t border-gray-200 my-2" />

            <button
              onClick={() => handleShare("copy")}
              className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <LinkIcon className="h-5 w-5 text-[#8b0000]" />
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
