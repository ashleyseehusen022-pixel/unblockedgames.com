
import React, { useState, useRef } from 'react';
import { generateGameCode } from '../services/geminiService';
import { AIGenResult } from '../types';

const AIGameDev: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIGenResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const gameData = await generateGameCode(prompt);
      setResult(gameData);
    } catch (err: any) {
      setError(err.message || 'Failed to generate game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const examples = [
    "Simple Snake game with neon visuals",
    "Ping Pong with a computer opponent",
    "Bubble shooter style game",
    "Dodge the falling blocks",
    "Color matching puzzle"
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400 uppercase tracking-tighter">
          AI Game Dev Lab
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Describe the game you want to play, and our AI will build the code and host it for you instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl border-white/5">
            <label className="block text-sm font-semibold text-gray-300 mb-2">What should we build?</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A space shooter where I am a triangle and enemies are circles..."
              className="w-full h-32 bg-gray-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none mb-4"
            />
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Coding...
                </>
              ) : 'Generate Game'}
            </button>

            {error && <p className="mt-4 text-red-400 text-sm font-medium">{error}</p>}
          </div>

          <div className="glass p-6 rounded-2xl border-white/5">
            <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Quick Templates
            </h4>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7">
          <div className="glass h-[600px] rounded-2xl overflow-hidden border-white/5 relative flex flex-col">
            <div className="bg-gray-900 px-6 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Game Preview</span>
              {result && (
                <button 
                  onClick={() => setResult(null)}
                  className="text-[10px] text-gray-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-gray-950 flex items-center justify-center">
              {result ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={result.code}
                  className="w-full h-full border-none"
                  title="AI Generated Game"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/></svg>
                  </div>
                  <h3 className="text-gray-400 font-semibold mb-2">Game Output Awaiting Logic</h3>
                  <p className="text-gray-600 text-sm max-w-xs mx-auto">
                    Your generated game will appear here once you hit "Generate Game".
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {result && (
            <div className="mt-4 glass p-4 rounded-xl border-white/5">
              <h4 className="text-sm font-bold text-violet-400 mb-1 uppercase tracking-wider">How to play</h4>
              <p className="text-gray-400 text-sm">{result.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIGameDev;
