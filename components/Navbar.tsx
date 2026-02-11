
import React from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onPageChange(Page.Home)}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center neon-border group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <span className="text-xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 uppercase">
            Nebula Games
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { id: Page.Home, label: 'Home' },
            { id: Page.Library, label: 'Game Library' },
            { id: Page.AILab, label: 'AI Dev Lab' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`text-sm font-semibold transition-colors hover:text-violet-400 ${
                currentPage === item.id ? 'text-violet-400' : 'text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-sm font-bold transition-all transform active:scale-95">
            Log In
          </button>
          <div className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
