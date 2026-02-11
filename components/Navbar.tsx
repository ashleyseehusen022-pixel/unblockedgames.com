
import React from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-green-500/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onPageChange(Page.Home)}
        >
          <div className="w-12 h-10 bg-green-600 rounded-sm flex items-center justify-center phonk-border group-hover:skew-x-[-12deg] transition-transform">
            <span className="text-yellow-400 font-black italic tracking-tighter">BRB</span>
          </div>
          <span className="text-xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-yellow-400 to-blue-500 uppercase">
            PHONKPLAYSGAMESBRB
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { id: Page.Home, label: 'HOME' },
            { id: Page.Library, label: 'LIBRARY' },
            { id: Page.AILab, label: 'AI LAB' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`text-xs font-black italic transition-colors hover:text-green-400 tracking-widest ${
                currentPage === item.id ? 'text-green-400 underline decoration-2 underline-offset-4' : 'text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block px-6 py-2 bg-green-600 hover:bg-yellow-500 hover:text-black text-white rounded-sm text-xs font-black italic transition-all transform active:scale-95 skew-x-[-10deg]">
            BR LOGIN
          </button>
          <div className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
