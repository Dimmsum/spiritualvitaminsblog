"use client";

import { Heart, BookOpen, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200/50 mt-20">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* About */}
          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-4 flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b0000] to-[#660000]">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span>About Spiritual Vitamins</span>
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 font-light">
              Daily nourishment for your soul. We share Christ-centered
              insights, encouragement, and spiritual wisdom to strengthen your
              faith journey.
            </p>
          </div>

          {/* Scripture */}
          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-4">
              Today&apos;s Verse
            </h3>
            <blockquote className="text-sm font-light border-l-2 border-[#8b0000] pl-4 bg-gradient-to-r from-red-50/50 to-transparent py-3 rounded-r-lg">
              <p className="italic text-gray-700 leading-relaxed">
                &ldquo;I am the vine; you are the branches. If you remain in me
                and I in you, you will bear much fruit.&rdquo;
              </p>
              <footer className="text-xs text-gray-500 mt-2 font-medium">
                John 15:5
              </footer>
            </blockquote>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#8b0000]" />
              <span>Stay Connected</span>
            </h3>
            <p className="text-sm mb-4 text-gray-600 font-light">
              Subscribe to receive daily spiritual encouragement in your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b0000]/20 focus:border-[#8b0000] transition-all"
              />
              <button className="bg-gradient-to-r from-[#8b0000] to-[#660000] text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all text-sm font-medium whitespace-nowrap">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200/50 mt-12 pt-8 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-gray-600 font-light">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-[#8b0000] fill-current" />
            <span>for the Kingdom of God</span>
          </p>
          <p className="text-gray-400 mt-3 text-xs font-light">
            © {currentYear} Spiritual Vitamins. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
