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
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/5">
        <div 
          className={cn(
            "h-full bg-brasil-blue transition-all duration-1000 shadow-[0_0_10px_rgba(0,39,118,0.5)]",
            isPlaying ? "w-full opacity-100" : "w-0 opacity-0"
          )}
          style={{ transitionTimingFunction: 'linear' }}
        />
      </div>

      <div className="bg-brasil-yellow text-brasil-green px-6 py-4 flex items-center justify-between gap-6 border-t border-black/5" style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.18), 0 -2px 8px rgba(0,0,0,0.10)' }}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 sm:gap-10">
          
          {/* Station Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <StationImage 
              station={station} 
              size={56} 
              className="rounded-xl border-2 border-brasil-green/10 bg-brasil-green/5 shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgba(0,156,59,0.2)] transition-all duration-300" 
            />
            <div className="min-w-0">
              <h3 className="text-sm font-display font-black leading-tight truncate">{station.name}</h3>
              <p className="text-[10px] font-bold text-brasil-green/60 uppercase tracking-widest mt-0.5">
                {station.codec} {(station.bitrate && station.bitrate > 0) ? `· ${station.bitrate}kbps` : '· Digital'}
              </p>
              
              {audioError && (
                <div className="flex items-center gap-2 mt-1 px-2 py-0.5 bg-brasil-green/10 rounded-md">
                  <AlertCircle size={10} className="text-red-600" />
                  <span className="text-[9px] font-black uppercase text-red-600">Erro no sinal</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRetry(); }}
                    className="text-[9px] font-black uppercase text-brasil-blue underline ml-1"
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
              className="w-14 h-14 bg-brasil-green text-brasil-yellow rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 outline-none ring-offset-2 focus:ring-2 focus:ring-brasil-blue hover:shadow-[0_8px_32px_rgba(0,156,59,0.45)]"
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-1" />
              )}
            </button>
          </div>

          {/* Volume & Actions */}
          <div className="hidden md:flex items-center justify-end gap-5 flex-1">
            <div className="flex items-center gap-3 bg-brasil-green/5 px-4 py-2.5 rounded-2xl">
              <button 
                onClick={onToggleMute}
                className="text-brasil-green/70 hover:text-brasil-green transition-colors duration-200 hover:scale-110 transform"
                title={muted ? "Ativar Áudio" : "Mudo"}
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-brasil-green/20 rounded-full appearance-none cursor-pointer accent-brasil-blue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
