
import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  return (
    <div 
      className="group relative glass rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/10 border border-white/5"
      onClick={() => onPlay(game)}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-violet-600/80 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white">
            {game.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-100 mb-1 group-hover:text-violet-400 transition-colors">
          {game.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">
          {game.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {game.tags.map(tag => (
            <span key={tag} className="text-[10px] text-gray-500 border border-white/10 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-violet-500/30 rounded-xl transition-colors pointer-events-none"></div>
    </div>
  );
};

export default GameCard;
