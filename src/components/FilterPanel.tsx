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
    <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04)]">
      {/* States Filter */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Estado (UF)</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStateChange('')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border",
              selectedState === '' 
                ? "bg-brasil-blue text-white border-brasil-blue shadow-[0_2px_12px_rgba(0,39,118,0.35)] scale-105" 
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700 hover:border-brasil-blue/30 hover:shadow-sm hover:-translate-y-0.5"
            )}
          >
            Todos
          </button>
          {BR_STATES.map(uf => (
            <button
              key={uf}
              onClick={() => onStateChange(uf === selectedState ? '' : uf)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border",
                selectedState === uf 
                  ? "bg-brasil-blue text-white border-brasil-blue shadow-[0_2px_12px_rgba(0,39,118,0.35)] scale-105" 
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700 hover:border-brasil-blue/30 hover:shadow-sm hover:-translate-y-0.5"
              )}
            >
              {uf}
            </button>
          ))}
        </div>
      </div>

      {/* Genres Filter (Popular Tags) */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Gênero</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onGenreChange('')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border",
              selectedGenre === '' 
                ? "bg-brasil-blue text-white border-brasil-blue shadow-[0_2px_16px_rgba(0,39,118,0.35)] scale-105" 
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:border-brasil-blue/30 hover:shadow-md hover:-translate-y-0.5"
            )}
          >
            Mistura
          </button>
          {genres.slice(0, 15).map(genre => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre === selectedGenre ? '' : genre)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border capitalize",
                selectedGenre === genre 
                  ? "bg-brasil-blue text-white border-brasil-blue shadow-[0_2px_16px_rgba(0,39,118,0.35)] scale-105" 
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700 hover:border-brasil-blue/30 hover:shadow-md hover:-translate-y-0.5"
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
