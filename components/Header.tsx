import React from 'react';
import { UsersIcon, AdjustmentsHorizontalIcon, PuzzlePieceIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-4 sm:px-8 flex flex-wrap justify-between items-center text-sm sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-pink-950/80 border-b border-purple-500/20 shadow-2xl shadow-purple-900/20">
      {/* Logo and Status */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-md opacity-75 animate-pulse"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">A</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              AirTalk
            </h1>
            <div className="flex items-center gap-2 -mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-semibold text-green-400">ONLINE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-full border border-purple-500/30 backdrop-blur-sm">
          <UsersIcon className="w-4 h-4 text-purple-300" />
          <span className="font-bold text-purple-200">640</span>
          <span className="text-xs text-purple-400">online</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 rounded-xl border border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
          <span className="text-purple-200 font-semibold group-hover:text-white transition-colors">Filters</span>
        </button>
        <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600/20 to-rose-600/20 hover:from-pink-600/40 hover:to-rose-600/40 rounded-xl border border-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30">
          <PuzzlePieceIcon className="w-5 h-5 text-pink-300 group-hover:text-pink-200 transition-colors" />
          <span className="text-pink-200 font-semibold group-hover:text-white transition-colors">Games</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
        <a href="#" className="text-purple-300 hover:text-white transition-all duration-300 hover:scale-110 relative group">
          Voice Chat
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#" className="text-purple-300 hover:text-white transition-all duration-300 hover:scale-110 relative group">
          About
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#" className="text-purple-300 hover:text-white transition-all duration-300 hover:scale-110 relative group">
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#" className="text-purple-300 hover:text-white transition-all duration-300 hover:scale-110 relative group">
          Blog
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-orange-400 group-hover:w-full transition-all duration-300"></span>
        </a>
      </nav>
    </header>
  );
};
