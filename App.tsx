
import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  
  // Game Session States
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    neonIntensity: 0.6,
    sensitivity: 1.2,
    showScanlines: true
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    return () => {
      if (internalUrl) {
        URL.revokeObjectURL(internalUrl);
        setInternalUrl(null);
      }
    };
  }, [activeGame]);

  // Sync settings with iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      Object.entries(settings).forEach(([key, value]) => {
        iframeRef.current?.contentWindow?.postMessage({
          type: 'SETTING_CHANGE',
          key,
          value
        }, '*');
      });
    }
  }, [settings, internalUrl, currentPage]);

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

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return (
          <div className="space-y-16 animate-fadeIn">
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden rounded-sm border-2 border-green-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-950/80 to-blue-950/80 z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&q=80" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 z-[-1]" 
                alt="Phonk Aesthetic"
              />
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <span className="inline-block px-4 py-1 bg-yellow-400 text-black text-[10px] font-black italic uppercase tracking-[0.3em] mb-6 animate-pulse skew-x-[-15deg]">
                  STAY PHONK
                </span>
                <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter uppercase phonk-text leading-[0.85] italic">
                  PHONK <br/> <span className="text-green-500">PLAYS</span> <br/> <span className="text-yellow-400">BRB.</span>
                </h1>
                <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto font-bold italic leading-tight uppercase">
                  The ultimate unblocked games portal with the soul of Brazilian Phonk. Pure performance, aggressive style.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setCurrentPage(Page.Library)}
                    className="px-10 py-5 bg-green-600 text-white font-black italic rounded-sm hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105 shadow-xl shadow-green-500/20 skew-x-[-10deg]"
                  >
                    ENTER ARENA
                  </button>
                  <button 
                    onClick={() => setCurrentPage(Page.AILab)}
                    className="px-10 py-5 glass text-white font-black italic rounded-sm hover:bg-white/10 transition-all transform hover:scale-105 border border-green-500/30 skew-x-[-10deg]"
                  >
                    AI WORKSHOP
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-green-400">HEAVIEST HITS</h2>
                <button 
                  onClick={() => setCurrentPage(Page.Library)}
                  className="text-xs font-black italic text-yellow-500 hover:text-white transition-colors tracking-widest"
                >
                  VIEW ALL &rarr;
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
                <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">GAME LIBRARY</h2>
                <p className="text-gray-400 font-bold italic uppercase text-xs">The most aggressive curation on the web.</p>
              </div>
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="SEARCH GAMES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 bg-green-950/20 border-2 border-green-500/20 rounded-sm py-4 px-6 text-white font-black italic focus:outline-none focus:border-yellow-500 transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3 rounded-sm text-xs font-black italic uppercase tracking-widest transition-all whitespace-nowrap skew-x-[-12deg] ${
                    selectedCategory === cat 
                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/30' 
                    : 'bg-white/5 text-gray-500 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} onPlay={handlePlay} />
              ))}
            </div>
          </div>
        );

      case Page.AILab:
        return <AIGameDev />;

      case Page.Play:
        if (!activeGame) return null;
        return (
          <div className="animate-fadeIn max-w-6xl mx-auto flex flex-col items-center">
            <div className="w-full mb-6 flex items-center justify-between">
              <button 
                onClick={() => setCurrentPage(Page.Library)}
                className="flex items-center gap-2 text-green-400 hover:text-yellow-400 transition-colors text-xs font-black italic uppercase tracking-wider"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                EXIT GAME
              </button>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMobileMode(!isMobileMode)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-sm border-2 text-[10px] font-black italic uppercase tracking-widest transition-all skew-x-[-10deg] ${
                    isMobileMode 
                    ? 'bg-blue-600 border-blue-400 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  {isMobileMode ? 'MOBILE VIEW' : 'DESKTOP VIEW'}
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`p-2 rounded-sm border-2 transition-all ${
                    isSettingsOpen 
                    ? 'bg-yellow-500 border-yellow-400 text-black' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-green-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            
            <div className={`relative transition-all duration-500 ease-out ${
              isMobileMode 
              ? 'w-[375px] h-[667px] border-[16px] border-gray-950 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-green-500/20 scale-90 sm:scale-100' 
              : 'w-full aspect-video glass rounded-sm border-2 border-green-500/20 shadow-2xl'
            }`}>
              {settings.showScanlines && (
                <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-10" 
                     style={{backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(34, 197, 94, 0.1), rgba(234, 179, 8, 0.05), rgba(59, 130, 246, 0.1))', backgroundSize: '100% 4px, 6px 100%'}}></div>
              )}
              
              <iframe 
                ref={iframeRef}
                src={internalUrl || activeGame.url} 
                className="w-full h-full border-none"
                title={activeGame.title}
                allow="fullscreen; autoplay; gamepad"
              />

              {isSettingsOpen && (
                <div className="absolute top-4 right-4 z-50 glass p-8 rounded-sm border-2 border-yellow-500/40 w-72 animate-slideInRight shadow-2xl">
                  <h3 className="text-sm font-black text-yellow-400 italic uppercase tracking-widest mb-6 border-b-2 border-white/10 pb-2">CONTROL PANEL</h3>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase italic block mb-3">NEON INTENSITY</label>
                      <input 
                        type="range" 
                        min="0" max="1" step="0.1" 
                        value={settings.neonIntensity}
                        onChange={(e) => updateSetting('neonIntensity', parseFloat(e.target.value))}
                        className="w-full accent-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase italic block mb-3">DRIFT SENSITIVITY</label>
                      <input 
                        type="range" 
                        min="0.5" max="2" step="0.1" 
                        value={settings.sensitivity}
                        onChange={(e) => updateSetting('sensitivity', parseFloat(e.target.value))}
                        className="w-full accent-yellow-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400 uppercase italic">RETRO SCANLINES</span>
                      <button 
                        onClick={() => updateSetting('showScanlines', !settings.showScanlines)}
                        className={`w-12 h-6 rounded-sm transition-colors relative ${settings.showScanlines ? 'bg-green-600' : 'bg-gray-800'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-sm transition-all ${settings.showScanlines ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-full mt-10 py-3 bg-white/5 hover:bg-green-600 text-white text-[10px] font-black italic uppercase rounded-sm border-2 border-white/5 transition-colors skew-x-[-10deg]"
                  >
                    CONFIRM
                  </button>
                </div>
              )}
            </div>

            <div className="mt-10 w-full flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter phonk-text">{activeGame.title}</h1>
                  <span className="bg-green-600 text-white text-[10px] font-black italic px-4 py-1 rounded-sm uppercase skew-x-[-15deg]">BR EDITION</span>
                </div>
                <div className="flex gap-3 mb-8">
                  {activeGame.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black text-green-500 uppercase italic tracking-widest bg-green-950/40 px-3 py-1 border border-green-500/20">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-xl font-bold italic leading-tight max-w-2xl uppercase">
                  {activeGame.description}
                </p>
              </div>
              <div className="w-full md:w-80 glass p-8 rounded-sm border-2 border-green-500/10 h-fit">
                <h3 className="text-sm font-black text-yellow-500 italic uppercase tracking-widest mb-6 border-b-2 border-white/5 pb-2">
                  NEXT CHALLENGES
                </h3>
                <div className="space-y-6">
                  {MOCK_GAMES.filter(g => g.id !== activeGame.id).slice(0, 3).map(g => (
                    <div 
                      key={g.id} 
                      className="flex items-center gap-4 cursor-pointer group"
                      onClick={() => handlePlay(g)}
                    >
                      <div className="w-20 h-14 overflow-hidden rounded-sm border border-white/10">
                        <img src={g.thumbnail} className="w-full h-full object-cover group-hover:scale-125 transition-transform" alt={g.title} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-xs font-black text-gray-300 italic truncate group-hover:text-green-400 transition-colors uppercase">{g.title}</h4>
                        <p className="text-[9px] text-gray-500 font-black italic uppercase">{g.category}</p>
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
    <div className="min-h-screen bg-gray-950 selection:bg-green-500/40">
      <Navbar currentPage={currentPage} onPageChange={(p) => {
        setIsSettingsOpen(false);
        setCurrentPage(p);
      }} />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {renderPage()}
      </main>

      <footer className="glass border-t-2 border-green-500/20 py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-600 rounded-sm flex items-center justify-center skew-x-[-12deg]">
                <span className="text-yellow-400 font-black italic">BRB</span>
              </div>
              <span className="text-2xl font-black italic uppercase tracking-tighter text-white">PHONKPLAYSGAMESBRB</span>
            </div>
            <p className="text-gray-500 font-black italic uppercase text-xs leading-relaxed max-w-sm">
              The premium unblocked games portal. Aggressive design, extreme performance, zero restrictions.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-yellow-500 italic uppercase tracking-[0.3em] mb-8">NAVIGATION</h4>
            <ul className="space-y-4 text-xs font-black italic text-gray-500 uppercase">
              <li><button onClick={() => setCurrentPage(Page.Home)} className="hover:text-green-400 transition-colors">HOME</button></li>
              <li><button onClick={() => setCurrentPage(Page.Library)} className="hover:text-green-400 transition-colors">LIBRARY</button></li>
              <li><button onClick={() => setCurrentPage(Page.AILab)} className="hover:text-green-400 transition-colors">AI LAB</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-yellow-500 italic uppercase tracking-[0.3em] mb-8">CONNECTION</h4>
            <ul className="space-y-4 text-xs font-black italic text-gray-500 uppercase">
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> BRAZIL SERVER</li>
              <li>ZERO LATENCY</li>
              <li>UNBLOCKED 24/7</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[10px] font-black italic uppercase tracking-widest">
            © 2024 PHONKPLAYSGAMESBRB INTERACTIVE. MADE IN BRAZIL.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
