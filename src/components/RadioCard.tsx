import React from 'react';
import { Play, Pause, Star } from 'lucide-react';
import { Card } from './ui/Card';
import { StationImage } from './StationImage';
import { RadioStation } from '../types';
import { cn } from '../lib/utils';

interface RadioCardProps {
  station: RadioStation;
  isPlaying: boolean;
  isActive: boolean;
  isFavorite: boolean;
  onPlay: (station: RadioStation) => void;
  onFavorite: (e: React.MouseEvent, station: RadioStation) => void;
}

export const RadioCard: React.FC<RadioCardProps> = ({
  station,
  isPlaying,
  isActive,
  isFavorite,
  onPlay,
  onFavorite
}) => {
  return (
    <Card 
      active={isActive}
      className={cn(
        "flex items-center gap-4 group cursor-pointer h-full animate-in fade-in zoom-in-95 duration-500",
        isActive ? "bg-brasil-white/95" : "bg-brasil-white"
      )}
      onClick={() => onPlay(station)}
    >
      <StationImage 
        station={station as any} 
        size={64} 
        className="rounded-2xl shadow-md group-hover:scale-110 group-hover:shadow-[0_4px_16px_rgba(0,156,59,0.25)] transition-all duration-300" 
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-display font-black text-brasil-green truncate mb-0.5" title={station.name}>
          {station.name}
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-black text-brasil-blue uppercase tracking-tight opacity-70">
          {station.state ? `${station.state} · ` : ''}{station.codec || 'MP3'} · {station.bitrate ? `${station.bitrate}kbps` : 'Auto'}
        </div>
        
        {isActive && isPlaying && (
          <div className="flex items-end gap-0.5 h-3 mt-2">
            {[0, 0.2, 0.4, 0.6].map((delay, i) => (
              <span key={i} className="w-1 bg-brasil-green rounded-full animate-[wave_1s_infinite_ease-in-out]" style={{ animationDelay: `${delay}s` }} />
            ))}
          </div>
        )}

        <div className="flex gap-1.5 mt-2.5 overflow-hidden">
          {station.tags?.slice(0, 2).map((t, idx) => (
            <span key={idx} className="text-[10px] bg-brasil-green/5 text-brasil-green/60 px-2 py-0.5 rounded-md font-black tracking-wide leading-none uppercase transition-all duration-200 hover:bg-brasil-green/10 hover:text-brasil-green hover:shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button 
          className={cn(
            "p-2 rounded-full transition-all duration-300 transform",
            "hover:scale-125 hover:rotate-12",
            isFavorite
              ? "text-brasil-yellow bg-brasil-green shadow-[0_2px_12px_rgba(0,156,59,0.4)] scale-110"
              : "text-brasil-green/20 hover:bg-brasil-green/5 hover:text-brasil-yellow hover:shadow-[0_2px_8px_rgba(255,223,0,0.3)]"
          )}
          onClick={(e) => onFavorite(e, station)}
          title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "animate-in zoom-in-50 duration-300" : ""} />
        </button>
        
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
          "group-hover:shadow-[0_4px_16px_rgba(0,156,59,0.35)]",
          isActive
            ? "bg-brasil-green text-brasil-yellow shadow-inner animate-pulse-ring"
            : "bg-brasil-yellow text-brasil-green group-hover:scale-115 shadow-md group-hover:shadow-[0_4px_20px_rgba(255,223,0,0.5)]"
        )}>
          {isActive && isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" className="ml-0.5" />
          )}
        </div>
      </div>
    </Card>
  );
};
