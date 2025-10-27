"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  isLiked?: boolean;
}

export default function LikeButton({
  postId,
  initialLikes,
  isLiked = false,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    // Optimistic UI update
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;
    setLiked(newLiked);
    setLikes(newLikes);

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: `temp-user-${Math.random()}`, // Temporary user ID for demo
          userName: "Anonymous",
        }),
      });

      if (!response.ok) {
        // Revert on error
        setLiked(!newLiked);
        setLikes(liked ? likes - 1 : likes + 1);
        throw new Error("Failed to toggle like");
      }

      const data = await response.json();
      console.log(`${data.liked ? "Liked" : "Unliked"} post ${postId}`);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        liked
          ? "bg-[#8b0000] text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${isAnimating ? "scale-110" : "scale-100"}`}
    >
      <Heart
        className={`h-5 w-5 transition-all ${liked ? "fill-current" : ""} ${
          isAnimating ? "animate-bounce" : ""
        }`}
      />
      <span className="font-medium">{likes}</span>
    </button>
  );
}
