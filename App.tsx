
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import GameCard from './components/GameCard';
import AIGameDev from './components/AIGameDev';
import { Game, Page } from './types';
import { MOCK_GAMES, CATEGORIES } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [internalUrl, setInternalUrl] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup internal URL when active game changes
    return () => {
      if (internalUrl) {
        URL.revokeObjectURL(internalUrl);
        setInternalUrl(null);
      }
    };
  }, [activeGame]);

  const filteredGames = useMemo(() => {
    return MOCK_GAMES.filter(game => {
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePlay = (game: Game) => {
    if (game.isInternal && game.internalCode) {
      const blob = new Blob([game.internalCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setInternalUrl(url);
    } else {
      setInternalUrl(null);
    }
    setActiveGame(game);
    setCurrentPage(Page.Play);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return (
          <div className="space-y-16 animate-fadeIn">
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-indigo-900/40 z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 z-[-1]" 
                alt="Hero"
              />
              <div className="relative z-10 text-center px-4 max-w-3xl">
                <span className="inline-block px-3 py-1 bg-violet-600/30 border border-violet-500/50 rounded-full text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 animate-bounce">
                  New Action Clones Added
                </span>
                <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase neon-text leading-tight">
                  Play Without <br/> <span className="text-violet-500">Limits.</span>
                </h1>
                <p className="text-xl text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
                  The ultimate hub for unblocked games and AI-powered game development. Discover, play, and build in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setCurrentPage(Page.Library)}
                    className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-violet-400 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-white/10"
                  >
                    Explore Library
                  </button>
                  <button 
                    onClick={() => setCurrentPage(Page.AILab)}
                    className="px-8 py-4 glass text-white font-bold rounded-xl hover:bg-white/10 transition-all transform hover:-translate-y-1 border border-white/20"
                  >
                    Build with AI
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Featured Hits</h2>
                <button 
                  onClick={() => setCurrentPage(Page.Library)}
                  className="text-sm font-bold text-violet-400 hover:text-white transition-colors"
                >
                  View All &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_GAMES.slice(0, 3).map(game => (
                  <GameCard key={game.id} game={game} onPlay={handlePlay} />
                ))}
              </div>
            </section>
          </div>
        );

      case Page.Library:
        return (
          <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Game Library</h2>
                <p className="text-gray-400">Discover hundreds of hand-picked, unblocked web games.</p>
              </div>
              <div className="relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input 
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 bg-gray-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                    : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} onPlay={handlePlay} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-gray-500 text-lg">No games found matching your search.</p>
              </div>
            )}
          </div>
        );

      case Page.AILab:
        return <AIGameDev />;

      case Page.Play:
        if (!activeGame) return null;
        return (
          <div className="animate-fadeIn max-w-6xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <button 
                onClick={() => setCurrentPage(Page.Library)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Back to Library
              </button>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                Playing: <span className="text-violet-400 font-bold">{activeGame.title}</span>
              </div>
            </div>
            
            <div className="glass rounded-3xl overflow-hidden border-white/5 aspect-video bg-black relative shadow-2xl shadow-violet-500/10">
              <iframe 
                src={internalUrl || activeGame.url} 
                className="w-full h-full border-none"
                title={activeGame.title}
                allow="fullscreen; autoplay; gamepad"
              />
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{activeGame.title}</h1>
                <div className="flex gap-2 mb-6">
                  {activeGame.tags.map(tag => (
                    <span key={tag} className="text-xs font-bold text-violet-400 bg-violet-400/10 px-3 py-1 rounded-full border border-violet-400/20">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {activeGame.description}
                </p>
              </div>
              <div className="w-full md:w-80 glass p-6 rounded-2xl border-white/5 h-fit">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>
                  Related Games
                </h3>
                <div className="space-y-4">
                  {MOCK_GAMES.filter(g => g.id !== activeGame.id).slice(0, 3).map(g => (
                    <div 
                      key={g.id} 
                      className="flex items-center gap-4 cursor-pointer group"
                      onClick={() => handlePlay(g)}
                    >
                      <img src={g.thumbnail} className="w-16 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform" alt={g.title} />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-bold text-gray-300 truncate group-hover:text-violet-400 transition-colors">{g.title}</h4>
                        <p className="text-[10px] text-gray-500 uppercase">{g.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 selection:bg-violet-500/30">
      <Navbar currentPage={currentPage} onPageChange={(p) => setCurrentPage(p)} />
      
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {renderPage()}
      </main>

      <footer className="glass border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-violet-600 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <span className="text-lg font-black uppercase tracking-tighter text-white">Nebula Games</span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm">
              The premium unblocked gaming experience. High performance, zero lag, and AI-powered innovation. Built for gamers, by gamers.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={() => setCurrentPage(Page.Home)} className="hover:text-violet-400 transition-colors">Home</button></li>
              <li><button onClick={() => setCurrentPage(Page.Library)} className="hover:text-violet-400 transition-colors">Library</button></li>
              <li><button onClick={() => setCurrentPage(Page.AILab)} className="hover:text-violet-400 transition-colors">AI Lab</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">Connect</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="hover:text-violet-400 transition-colors cursor-pointer">Discord Community</li>
              <li className="hover:text-violet-400 transition-colors cursor-pointer">Twitter / X</li>
              <li className="hover:text-violet-400 transition-colors cursor-pointer">GitHub Dev</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">
            © 2024 Nebula Interactive. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-gray-600">
            <span className="cursor-pointer hover:text-white">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
