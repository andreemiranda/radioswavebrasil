import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center gap-1 p-1 rounded-full bg-black/10 border border-white/5 backdrop-blur-sm group",
        className
      )}
      title={theme === 'dark' ? 'Mudar para Tema Brasil' : 'Mudar para Tema Escuro'}
    >
      <div className={cn(
        "absolute inset-1 w-6 h-6 rounded-full bg-theme-primary transition-all duration-500 ease-[var(--ease-premium)] shadow-sm",
        theme === 'brazil' ? "translate-x-0" : "translate-x-7"
      )} />
      
      <div className={cn(
        "relative z-10 w-6 h-6 flex items-center justify-center transition-colors duration-300",
        theme === 'brazil' ? "text-white" : "text-white/40 group-hover:text-white"
      )}>
        <Sun size={14} />
      </div>
      
      <div className={cn(
        "relative z-10 w-6 h-6 flex items-center justify-center transition-colors duration-300",
        theme === 'dark' ? "text-theme-header" : "text-white/40 group-hover:text-white"
      )}>
        <Moon size={14} />
      </div>
    </button>
  );
};
