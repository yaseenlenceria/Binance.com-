import React from 'react';
import { UsersIcon, AdjustmentsHorizontalIcon, PuzzlePieceIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#00051d] w-full py-3 px-4 sm:px-6 flex flex-wrap justify-between items-center text-sm sticky top-0 z-20 gap-y-2">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="font-semibold text-green-400">ONLINE</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <UsersIcon className="w-5 h-5" />
          <span>640</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          <span>FILTERS</span>
        </button>
        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
          <PuzzlePieceIcon className="w-5 h-5" />
          <span>GAME</span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-6 text-gray-400 font-medium">
        <a href="#" className="hover:text-white transition-colors">Voice Chat</a>
        <a href="#" className="hover:text-white transition-colors">About Us</a>
        <a href="#" className="hover:text-white transition-colors">Contact Us</a>
        <a href="#" className="hover:text-white transition-colors">Blog</a>
      </div>
    </header>
  );
};
