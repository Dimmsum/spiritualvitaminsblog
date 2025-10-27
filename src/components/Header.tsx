"use client";

import Link from "next/link";
import {
  Cross,
  BookOpen,
  PenSquare,
  LogIn,
  UserPlus,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b0000] to-[#660000] shadow-lg shadow-red-500/20">
              <Cross className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                Spiritual Vitamins
              </h1>
              <p className="text-xs text-gray-500 font-light">
                Nourishment for the Soul
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-all font-medium"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Blog</span>
            </Link>

            {/* Admin Only - Write Button */}
            {isAdmin && (
              <Link
                href="/create"
                className="flex items-center gap-2 bg-gradient-to-r from-[#8b0000] to-[#660000] text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-red-500/25 transition-all font-medium"
              >
                <PenSquare className="h-4 w-4" />
                <span className="text-sm">Write</span>
              </Link>
            )}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#8b0000] to-[#660000] text-white text-xs font-medium">
                    {(user.user_metadata?.full_name || user.email)
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-all font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="text-sm">Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#8b0000] to-[#660000] text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-red-500/25 transition-all font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="text-sm">Sign Up</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="space-y-1.5">
              <span className="block w-5 h-0.5 bg-gray-700 rounded-full"></span>
              <span className="block w-5 h-0.5 bg-gray-700 rounded-full"></span>
              <span className="block w-5 h-0.5 bg-gray-700 rounded-full"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
