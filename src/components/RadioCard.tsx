import React from 'react';
import { Play, Pause, Star } from 'lucide-react';
import { Card } from './ui/Card';
import { StationImage } from './StationImage';
import { RadioStation } from '../types';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

interface RadioCardProps {
  station: RadioStation;
  isPlaying: boolean;
  isActive: boolean;
  isFavorite: boolean;
  onPlay: (station: RadioStation) => void;
  onFavorite: (e: React.MouseEvent, station: RadioStation) => void;
  index?: number;
}

export const RadioCard: React.FC<RadioCardProps> = ({
  station,
  isPlaying,
  isActive,
  isFavorite,
  onPlay,
  onFavorite,
  index = 0
}) => {
  const { theme } = useTheme();
  const isBrazil = theme === 'brazil';
  return (
    <Card 
      active={isActive}
      style={isBrazil ? { animationDelay: `${index * 0.06}s` } : {}}
      className={cn(
        "flex items-center gap-4 group cursor-pointer h-full animate-in fade-in zoom-in-95 duration-500 transition-all",
        "hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]",
        isBrazil
          ? cn(
              "rounded-2xl border-2",
              isActive 
                ? "bg-white/98 border-[#FFDF00] animate-active-glow" 
                : "bg-white border-transparent shadow-card hover:shadow-card-hover hover:border-[#FFDF00]/40"
            )
          : cn(
              isActive 
                ? "bg-theme-primary/5 border-theme-primary/20 shadow-elevation-1" 
                : "bg-theme-surface border-theme-border shadow-elevation-1 hover:shadow-elevation-2"
            )
      )}
      onClick={() => onPlay(station)}
    >
      <StationImage 
        station={station as any} 
        size={64} 
        className={cn(
          "rounded-2xl shadow-sm transition-all duration-300",
          isBrazil 
            ? "shadow-[0_2px_10px_rgba(0,0,0,0.12)] group-hover:scale-[1.12] group-hover:-rotate-2 group-hover:shadow-[0_6px_20px_rgba(0,156,59,0.30)]" 
            : "group-hover:shadow-md"
        )}
      />
      
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-[15px] font-display font-black truncate mb-0.5",
          isBrazil ? "text-[#009C3B]" : "text-theme-text-primary"
        )} title={station.name}>
          {station.name}
        </h3>
        <div className={cn(
          "flex items-center gap-2 text-[10px] uppercase tracking-wider",
          isBrazil ? "font-black text-[#009C3B]/65" : "font-semibold text-theme-text-secondary opacity-60"
        )}>
          {station.state ? `${station.state} · ` : ''}{station.codec || 'MP3'} · {station.bitrate ? `${station.bitrate}kbps` : 'Auto'}
        </div>
        
        {isActive && isPlaying && (
          <div className="flex items-end gap-0.5 h-3 mt-2.5">
            {isBrazil ? (
              [0, 0.15, 0.3, 0.45, 0.6].map((delay, i) => (
                <span 
                  key={i} 
                  className="w-[3px] bg-[#009C3B] rounded-full" 
                  style={{ 
                    animation: `wave 0.8s infinite ease-in-out`, 
                    animationDelay: `${delay}s`,
                    minHeight: '4px',
                    boxShadow: '0 0 6px rgba(0,156,59,0.5)'
                  }} 
                />
              ))
            ) : (
              [0, 0.2, 0.4, 0.6].map((delay, i) => (
                <span key={i} className="w-1 bg-theme-primary rounded-full animate-[wave_1s_infinite_ease-in-out]" style={{ animationDelay: `${delay}s` }} />
              ))
            )}
          </div>
        )}

        <div className="flex gap-1.5 mt-2.5 overflow-hidden">
          {station.tags?.slice(0, 2).map((t, idx) => (
            <span 
              key={idx} 
              className={cn(
                "text-[9px] px-2 py-0.5 rounded-md font-bold tracking-wider leading-none uppercase transition-all duration-200",
                isBrazil 
                  ? "bg-[#009C3B]/5 text-[#009C3B]/65 border border-[#009C3B]/12 hover:bg-[#009C3B]/14 hover:text-[#009C3B] hover:border-[#009C3B]/28 hover:shadow-[0_2px_8px_rgba(0,156,59,0.15)] hover:-translate-y-px" 
                  : "bg-theme-text-secondary/5 text-theme-text-secondary"
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <button 
          className={cn(
            "p-2 rounded-full transition-all duration-250",
            isFavorite
              ? isBrazil
                ? "bg-[#009C3B] text-[#FFDF00] scale-112 shadow-[0_3px_14px_rgba(0,156,59,0.45)] animate-star-pop"
                : "text-theme-accent scale-110"
              : isBrazil
                ? "text-[#009C3B]/20 hover:text-[#FFDF00] hover:scale-[1.28] hover:rotate-[15deg] hover:shadow-[0_2px_10px_rgba(255,223,0,0.35)]"
                : "text-theme-text-secondary/30 hover:text-theme-accent"
          )}
          onClick={(e) => onFavorite(e, station)}
          title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star size={isBrazil ? 18 : 16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-250",
          isBrazil
            ? isActive
              ? "bg-[#009C3B] text-[#FFDF00] animate-pulse-ring shadow-accent-glow"
              : "bg-[#FFDF00] text-[#009C3B] shadow-[0_4px_16px_rgba(255,223,0,0.45),0_2px_8px_rgba(0,0,0,0.12)] hover:scale-[1.18] hover:shadow-[0_8px_28px_rgba(255,223,0,0.60),0_4px_12px_rgba(0,0,0,0.14)]"
            : isActive
              ? "bg-theme-primary text-white shadow-accent-glow"
              : "bg-theme-surface text-theme-text-secondary border border-theme-border group-hover:border-theme-primary/30 group-hover:text-theme-primary shadow-sm"
        )}>
          {isActive && isPlaying ? (
            <Pause size={isBrazil ? 20 : 18} fill="currentColor" />
          ) : (
            <Play size={isBrazil ? 20 : 18} fill="currentColor" className="ml-0.5" />
          )}
        </div>
      </div>
    </Card>
  );
};
