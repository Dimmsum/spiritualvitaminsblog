"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, X, Plus, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Faith",
    tags: "",
    scriptureVerse: "",
    scriptureReference: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="p-4 bg-red-50 rounded-full inline-block mb-4">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            Only administrators can create new posts. Please sign in with an
            admin account.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          authorName: user?.user_metadata?.full_name || user?.email || "Admin",
          images,
          scripture: formData.scriptureVerse
            ? {
                verse: formData.scriptureVerse,
                reference: formData.scriptureReference,
              }
            : undefined,
          category: formData.category,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      alert("Post created successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl]);
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-[#8b0000] hover:text-[#660000] mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-2">
            Share spiritual insights and encouragement with the community
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
              placeholder="Enter an inspiring title"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              required
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent resize-none"
              placeholder="Brief summary of your post"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
            >
              <option value="Faith">Faith</option>
              <option value="Prayer">Prayer</option>
              <option value="Grace">Grace</option>
              <option value="Peace">Peace</option>
              <option value="Love">Love</option>
              <option value="Hope">Hope</option>
              <option value="Worship">Worship</option>
              <option value="Scripture Study">Scripture Study</option>
            </select>
          </div>

          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Featured Scripture (Optional)
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="scriptureVerse"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verse Text
                </label>
                <textarea
                  id="scriptureVerse"
                  value={formData.scriptureVerse}
                  onChange={(e) =>
                    setFormData({ ...formData, scriptureVerse: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent resize-none"
                  placeholder="Enter the verse text"
                />
              </div>
              <div>
                <label
                  htmlFor="scriptureReference"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reference
                </label>
                <input
                  type="text"
                  id="scriptureReference"
                  value={formData.scriptureReference}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scriptureReference: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
                  placeholder="e.g., John 3:16"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Optional)
            </label>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
                  placeholder="Enter image URL (e.g., https://...)"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-[#8b0000] text-white rounded-lg hover:bg-[#660000] transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>
                  You can use URLs from Unsplash, Pexels, or your own hosted
                  images
                </span>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content *
            </label>
            <textarea
              id="content"
              required
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent resize-none font-mono text-sm"
              placeholder="Write your post content here..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Tip: Use ## for headings and ### for subheadings
            </p>
          </div>

          <div className="mb-8">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags (Optional)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
              placeholder="faith, prayer, encouragement (comma separated)"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="px-8 py-3 bg-[#8b0000] text-white rounded-lg hover:bg-[#660000] transition-colors font-medium"
            >
              Publish Post
            </button>
            <Link
              href="/"
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
