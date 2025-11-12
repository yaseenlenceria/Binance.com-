import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-2xl text-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Talk To Strangers</h2>
      <p className="text-gray-400 leading-relaxed">
        Tired of endless scrolling and shallow interactions?
      </p>
      <p className="text-gray-400 leading-relaxed mt-2">
        AirTALK lets you connect instantly with strangers around the world through real-time, voice-only conversations.
        No registration, no profiles, no distractions - just your voice and someone else's.
      </p>
    </footer>
  );
};
