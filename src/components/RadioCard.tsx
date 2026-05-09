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
        "flex items-center gap-4 group cursor-pointer h-full animate-in fade-in zoom-in-95 duration-500 transition-all",
        "hover:shadow-elevation-2 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]",
        isActive 
          ? "bg-theme-primary/5 border-theme-primary/20 shadow-elevation-1" 
          : "bg-theme-surface border-theme-border shadow-elevation-1"
      )}
      onClick={() => onPlay(station)}
    >
      <StationImage 
        station={station as any} 
        size={64} 
        className="rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300" 
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-display font-bold text-theme-text-primary truncate mb-0.5" title={station.name}>
          {station.name}
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-theme-text-secondary uppercase tracking-wider opacity-60">
          {station.state ? `${station.state} · ` : ''}{station.codec || 'MP3'} · {station.bitrate ? `${station.bitrate}kbps` : 'Auto'}
        </div>
        
        {isActive && isPlaying && (
          <div className="flex items-end gap-0.5 h-3 mt-2.5">
            {[0, 0.2, 0.4, 0.6].map((delay, i) => (
              <span key={i} className="w-1 bg-theme-primary rounded-full animate-[wave_1s_infinite_ease-in-out]" style={{ animationDelay: `${delay}s` }} />
            ))}
          </div>
        )}

        <div className="flex gap-1.5 mt-2.5 overflow-hidden">
          {station.tags?.slice(0, 2).map((t, idx) => (
            <span key={idx} className="text-[9px] bg-theme-text-secondary/5 text-theme-text-secondary px-2 py-0.5 rounded-md font-bold tracking-wider leading-none uppercase">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <button 
          className={cn(
            "p-2 rounded-full transition-all duration-200",
            isFavorite
              ? "text-theme-accent scale-110"
              : "text-theme-text-secondary/30 hover:text-theme-accent"
          )}
          onClick={(e) => onFavorite(e, station)}
          title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
          isActive
            ? "bg-theme-primary text-white shadow-accent-glow"
            : "bg-theme-surface text-theme-text-secondary border border-theme-border group-hover:border-theme-primary/30 group-hover:text-theme-primary"
        )}>
          {isActive && isPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" className="ml-0.5" />
          )}
        </div>
      </div>
    </Card>
  );
};
