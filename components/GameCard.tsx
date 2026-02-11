
import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  return (
    <div 
      className="group relative glass rounded-sm overflow-hidden cursor-pointer transition-all hover:skew-x-[-1deg] hover:translate-y-[-4px] hover:shadow-[0_10px_30px_rgba(34,197,94,0.2)] border-2 border-green-500/10"
      onClick={() => onPlay(game)}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-125 duration-700 grayscale-[0.5] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-yellow-400 text-black text-[9px] font-black italic px-3 py-1 uppercase tracking-widest skew-x-[-15deg]">
            {game.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-black italic text-gray-100 mb-2 group-hover:text-green-400 transition-colors uppercase tracking-tighter">
          {game.title}
        </h3>
        <p className="text-[11px] font-bold italic text-gray-500 line-clamp-2 leading-tight mb-4 uppercase">
          {game.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {game.tags.map(tag => (
            <span key={tag} className="text-[9px] font-black italic text-green-500/60 uppercase tracking-widest">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-500/40 transition-colors pointer-events-none"></div>
    </div>
  );
};

export default GameCard;
