import React from 'react';
import { cn } from '../lib/utils';

export const BR_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface FilterPanelProps {
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedState,
  onStateChange,
  selectedGenre,
  onGenreChange,
  genres
}) => {
  return (
    <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500 bg-theme-surface p-6 rounded-[2rem] border border-theme-border shadow-player">
      {/* States Filter */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-theme-text-secondary/60 mb-4 ml-1">Estado (UF)</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStateChange('')}
            className={cn(
              "px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border",
              selectedState === '' 
                ? "bg-theme-primary text-white border-theme-primary shadow-sm" 
                : "bg-theme-bg text-theme-text-secondary border-theme-border hover:bg-theme-primary/5 hover:text-theme-primary hover:border-theme-primary/20"
            )}
          >
            Todos
          </button>
          {BR_STATES.map(uf => (
            <button
              key={uf}
              onClick={() => onStateChange(uf === selectedState ? '' : uf)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border",
                selectedState === uf 
                  ? "bg-theme-primary text-white border-theme-primary shadow-sm" 
                  : "bg-theme-bg text-theme-text-secondary border-theme-border hover:bg-theme-primary/5 hover:text-theme-primary hover:border-theme-primary/20"
              )}
            >
              {uf}
            </button>
          ))}
        </div>
      </div>

      {/* Genres Filter (Popular Tags) */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-theme-text-secondary/60 mb-4 ml-1">Gênero</h4>
        <div className="flex flex-wrap gap-2">
          {genres.slice(0, 15).map(genre => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre === selectedGenre ? '' : genre)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border capitalize",
                selectedGenre === genre 
                  ? "bg-theme-accent text-theme-header border-theme-accent shadow-sm" 
                  : "bg-theme-bg text-theme-text-secondary border-theme-border hover:bg-theme-accent/5 hover:text-theme-header hover:border-theme-accent/20"
              )}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
