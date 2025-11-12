import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-4xl text-center mt-12 relative">
      {/* Decorative top border */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-8"></div>

      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl"></div>

        {/* Content */}
        <div className="relative bg-gradient-to-br from-indigo-950/30 via-purple-950/30 to-pink-950/30 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Talk To Strangers
          </h2>

          <p className="text-purple-200 leading-relaxed text-lg mb-3">
            Tired of endless scrolling and shallow interactions?
          </p>

          <p className="text-purple-300/80 leading-relaxed max-w-3xl mx-auto">
            <span className="font-semibold text-purple-200">AirTalk</span> lets you connect instantly with strangers around the world through real-time voice conversations.
            No registration, no profiles, no distractions — just your voice and someone else's.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-cyan-300 font-bold text-sm">Global Connections</h3>
              <p className="text-cyan-400/70 text-xs">Talk to anyone worldwide</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-purple-300 font-bold text-sm">100% Anonymous</h3>
              <p className="text-purple-400/70 text-xs">No registration required</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-500/20">
              <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-pink-300 font-bold text-sm">Instant Connect</h3>
              <p className="text-pink-400/70 text-xs">Start chatting in seconds</p>
            </div>
          </div>

          {/* Bottom links */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-purple-500/20 text-sm">
            <a href="#" className="text-purple-400 hover:text-purple-200 transition-colors">Terms</a>
            <span className="text-purple-600">•</span>
            <a href="#" className="text-purple-400 hover:text-purple-200 transition-colors">Privacy</a>
            <span className="text-purple-600">•</span>
            <a href="#" className="text-purple-400 hover:text-purple-200 transition-colors">Safety</a>
            <span className="text-purple-600">•</span>
            <a href="#" className="text-purple-400 hover:text-purple-200 transition-colors">Support</a>
          </div>

          <p className="mt-4 text-purple-500/60 text-xs">
            © 2025 AirTalk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
