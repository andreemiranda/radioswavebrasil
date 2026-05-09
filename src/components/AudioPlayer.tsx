import React from "react";
import { Play, Pause, Volume2, VolumeX, AlertCircle } from "lucide-react";
import { RadioStation } from "../types";
import { StationImage } from "./StationImage";
import { cn } from "../lib/utils";

interface AudioPlayerProps {
  station: RadioStation;
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  muted: boolean;
  onToggleMute: () => void;
  audioError: boolean;
  onRetry: () => void;
}

/**
 * Fixed Bottom Player for Radio Wave Brasil
 * Theme: bg-brasil-yellow, text-brasil-green, highlights brasil.blue
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  station,
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  muted,
  onToggleMute,
  audioError,
  onRetry
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] animate-in slide-in-from-bottom duration-500">
      {/* Visual progress bar (accentuated for radio live feel) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
        <div 
          className={cn(
            "h-full bg-theme-primary transition-all duration-1000 shadow-accent-glow",
            isPlaying ? "w-full opacity-100" : "w-0 opacity-0"
          )}
          style={{ transitionTimingFunction: 'linear' }}
        />
      </div>

      <div className="bg-theme-surface/90 backdrop-blur-xl text-theme-text-primary px-6 py-4 flex items-center justify-between gap-6 border-t border-theme-border shadow-elevation-3">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 sm:gap-10">
          
          {/* Station Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <StationImage 
              station={station} 
              size={52} 
              className="rounded-xl border border-theme-border shadow-sm transition-all duration-300" 
            />
            <div className="min-w-0">
              <h3 className="text-sm font-display font-bold leading-tight truncate text-theme-text-primary">{station.name}</h3>
              <p className="text-[10px] font-semibold text-theme-text-secondary uppercase tracking-wider mt-1 opacity-60">
                {station.codec} {(station.bitrate && station.bitrate > 0) ? `· ${station.bitrate}kbps` : '· Digital'}
              </p>
              
              {audioError && (
                <div className="flex items-center gap-2 mt-1.5 py-0.5">
                  <AlertCircle size={10} className="text-red-500" />
                  <span className="text-[9px] font-bold uppercase text-red-500">Sinal Fraco</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRetry(); }}
                    className="text-[9px] font-bold uppercase text-theme-primary hover:underline ml-1"
                  >
                    Reconectar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center flex-1 shrink-0">
            <button 
              onClick={onTogglePlay}
              className="w-12 h-12 bg-theme-primary text-white rounded-full flex items-center justify-center shadow-accent-glow hover:scale-105 active:scale-95 transition-all duration-200 outline-none"
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-1" />
              )}
            </button>
          </div>

          {/* Volume & Actions */}
          <div className="hidden md:flex items-center justify-end gap-5 flex-1">
            <div className="flex items-center gap-3 bg-theme-text-primary/5 px-4 py-2 rounded-xl border border-theme-border">
              <button 
                onClick={onToggleMute}
                className="text-theme-text-secondary hover:text-theme-primary transition-colors duration-200"
                title={muted ? "Ativar Áudio" : "Mudo"}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-theme-text-primary/10 rounded-full appearance-none cursor-pointer accent-theme-primary h-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
