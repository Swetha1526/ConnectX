import React from 'react';
import { Sparkles, MessageCircle, Heart, Users, Zap } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-dark-bg">
      {/* Left Feature Showcase Banner (hidden on mobile/small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 p-12 flex-col justify-between overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Logo & Slogan */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <span className="text-3xl font-black text-white tracking-tight font-heading">
                ConnectX
              </span>
              <p className="text-xs text-brand-200 font-medium">Real-Time Social Network</p>
            </div>
          </div>
        </div>

        {/* Floating Feature Highlight Cards */}
        <div className="relative z-10 my-auto space-y-4 max-w-md">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center gap-4 transform hover:translate-x-2 transition-transform shadow-lg">
            <div className="p-2.5 rounded-xl bg-brand-500/30 text-brand-300">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Instant Real-Time Chat</h4>
              <p className="text-xs text-brand-200">Powered by Socket.io with live typing and online presence</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center gap-4 transform hover:translate-x-2 transition-transform shadow-lg">
            <div className="p-2.5 rounded-xl bg-pink-500/30 text-pink-300">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Interactive Social Feed</h4>
              <p className="text-xs text-brand-200">Share multimedia posts, react instantly, and leave rich comments</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center gap-4 transform hover:translate-x-2 transition-transform shadow-lg">
            <div className="p-2.5 rounded-xl bg-indigo-500/30 text-indigo-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Grow Your Network</h4>
              <p className="text-xs text-brand-200">Follow tech creators, explore popular stories, and build community</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-brand-300/80">
          GUVI Major Project 2 • Full-Stack Production Architecture
        </div>
      </div>

      {/* Right Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center sm:text-left space-y-1.5">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold brand-gradient-text font-heading">
                ConnectX
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
