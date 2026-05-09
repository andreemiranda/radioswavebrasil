import React, { useState, useEffect, useMemo } from 'react';
import { Radio, Search, SlidersHorizontal, Signal, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { radioService } from '../services/radioService';
import { RadioStation } from '../types';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { Footer } from '../components/Footer';
import { FilterPanel } from '../components/FilterPanel';
import { RadioCard } from '../components/RadioCard';
import { Pagination } from '../components/ui/Pagination';
import { RadioCardSkeleton } from '../components/ui/Skeleton';
import { safeSetItem } from '../lib/storage';
import { usePlayer } from '../context/PlayerContext';
import { ThemeToggle } from '../components/ThemeToggle';

const LIMIT = 24;

const Home: React.FC = () => {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<'top' | 'search' | 'favorites'>('top');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  
  // --- PLAYER FROM CONTEXT ---
  const { 
    playing, 
    isPlaying, 
    playStation, 
    toggleFavorite, 
    isFavorite, 
    favorites 
  } = usePlayer();

  // --- PWA INSTALLATION LOGIC ---
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      const dismissed = localStorage.getItem('RadioWaveBR_pwaInstallDismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    const prompt = installPrompt as any;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    safeSetItem('RadioWaveBR_pwaInstallDismissed', 'true', true);
  };

  // --- QUERIES ---
  
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => radioService.getTags(30),
  });
  
  const genres = useMemo(() => {
    if (Array.isArray(tagsData?.data)) {
      return tagsData.data.map(t => t.name);
    }
    return [];
  }, [tagsData]);

  const { 
    data: stationsData, 
    isLoading, 
    isError, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['stations', activeTab, searchQuery, selectedState, selectedGenre, page, favorites],
    queryFn: async () => {
      const offset = (page - 1) * LIMIT;
      
      if (activeTab === 'favorites') return { data: favorites, total: favorites.length, success: true };
      
      if (activeTab === 'search' || selectedState || selectedGenre || searchQuery) {
        return radioService.searchStations({
          name: searchQuery,
          tag: selectedGenre,
          state: selectedState,
          limit: LIMIT,
          offset
        });
      }
      
      return radioService.getBrazilStations(LIMIT, offset);
    },
    placeholderData: (previousData) => previousData,
  });

  // --- HANDLERS ---

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
    setActiveTab('search');
  };

  const handleStateChange = (state: string) => {
    setSelectedState(prev => prev === state ? '' : state);
    setPage(1);
    setActiveTab('search');
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(prev => prev === genre ? '' : genre);
    setPage(1);
    setActiveTab('search');
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRadioPlay = (station: RadioStation) => {
    playStation(station);
  };

  const handleToggleFavorite = (e: React.MouseEvent, station: RadioStation) => {
    e.stopPropagation();
    toggleFavorite(station);
    if (!isFavorite(station.id)) {
      setActiveTab('favorites');
      setPage(1);
    }
  };

  const totalPages = useMemo(() => {
    if (!stationsData || typeof stationsData.total !== 'number') return 0;
    return Math.ceil(stationsData.total / LIMIT);
  }, [stationsData]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-theme-bg text-theme-text-primary font-body selection:bg-theme-primary selection:text-white"
    )}>
      {showInstallBanner && (
        <div className="fixed top-0 left-0 right-0 z-[300] bg-theme-primary text-white px-4 py-3 flex items-center justify-between gap-4 shadow-accent-glow animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="RadioWave" className="w-8 h-8 rounded-lg" />
            <div>
              <p className="text-sm font-black leading-tight">Instalar Radio Wave Brasil</p>
              <p className="text-xs opacity-70 font-medium">Acesso rápido e offline estilo nativo</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-white text-theme-primary text-sm font-black px-5 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-white/20"
            >
              Instalar App
            </button>
            <button
              onClick={handleDismissInstall}
              className="opacity-60 hover:opacity-100 text-xs font-bold px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Dispensar"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-theme-header/98 backdrop-blur-md text-white border-b border-white/5 px-6 py-4 shadow-elevation-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-theme-primary border border-white/5 shadow-sm hover:scale-105 transition-all duration-300 cursor-default">
              <Radio size={22} className="text-theme-primary" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold leading-none tracking-tight">Radio Wave Brasil</h1>
              <span className="text-[9px] text-theme-primary font-bold uppercase tracking-[0.15em] opacity-90 mt-1 block">Premium Stream</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle className="bg-white/5 border-white/5 hover:bg-white/10" />
            
            <div className={cn(
              "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-300",
              isFetching 
                ? "bg-theme-accent/20 border-theme-accent/20 text-theme-accent" 
                : isPlaying 
                  ? "bg-theme-primary/10 border-theme-primary/20 text-theme-primary shadow-sm" 
                  : "bg-white/5 border-white/5 text-white/40"
            )}>
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                isFetching 
                  ? "bg-theme-accent animate-pulse" 
                  : isPlaying 
                    ? "bg-theme-primary animate-pulse" 
                    : "bg-white/20"
              )} />
              {isFetching ? 'Sync' : isPlaying ? 'Tocando' : 'Parado'}
            </div>
            {isError && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => refetch()} 
                className="text-white/60 hover:text-white transition-colors"
              >
                <RefreshCw size={16} />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-8 pb-32">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form className="flex-1 flex gap-2" onSubmit={handleSearch}>
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-secondary/40 group-focus-within:text-theme-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  className="w-full h-12 bg-theme-surface border border-theme-border rounded-xl py-3 pl-12 pr-4 text-theme-text-primary placeholder:text-theme-text-secondary/30 focus:outline-none focus:ring-1 focus:ring-theme-primary/40 focus:border-theme-primary/50 transition-all duration-200 font-medium shadow-sm"
                  placeholder="Nome da rádio ou palavra-chave..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 rounded-xl px-6 font-bold shadow-sm">
                Buscar
              </Button>
            </form>
            
            <Button 
              variant="outline" 
              className={cn(
                "h-12 rounded-xl px-5 border transition-all duration-200",
                showFilters && "bg-theme-primary/5 border-theme-primary/30 text-theme-primary"
              )}
              onClick={() => {
                setShowFilters(!showFilters);
              }}
            >
              <SlidersHorizontal size={18} className="mr-2 opacity-60" />
              <span className="text-sm font-bold">Filtros</span>
            </Button>
          </div>
        </section>

        {showFilters && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <FilterPanel 
              selectedState={selectedState}
              onStateChange={handleStateChange}
              selectedGenre={selectedGenre}
              onGenreChange={handleGenreChange}
              genres={genres}
            />
          </div>
        )}

        <nav className="flex items-center gap-6 border-b border-theme-border mb-8 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'top' as const, label: '🔥 Populares' },
            { id: 'search' as const, label: '🔍 Geral' },
            { id: 'favorites' as const, label: '⭐ Favoritos' }
          ].map(tab => (
            <button 
              key={tab.id}
              className={cn(
                "pb-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 relative whitespace-nowrap outline-none px-1",
                activeTab === tab.id ? "text-theme-primary" : "text-theme-text-secondary hover:text-theme-text-primary"
              )}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-theme-primary rounded-full animate-in zoom-in-x duration-200" />
              )}
            </button>
          ))}
        </nav>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <RadioCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-theme-surface rounded-[2rem] border border-theme-border shadow-card animate-in fade-in zoom-in-95 duration-300">
            <Signal className="mx-auto mb-6 text-theme-text-secondary/20" size={80} />
            <h3 className="text-xl font-display font-black mb-2 text-theme-primary">Conexão Interrompida</h3>
            <p className="text-theme-text-secondary font-semibold mb-6">Não conseguimos sintonizar as rádios agora.</p>
            <Button onClick={() => refetch()} variant="outline" className="border-theme-primary text-theme-primary hover:bg-theme-primary/10">Tentar Novamente</Button>
          </div>
        ) : (stationsData?.data?.length ?? 0) === 0 ? (
          <div className="text-center py-20 bg-theme-surface rounded-[2rem] border border-theme-border shadow-card">
            <Signal className="mx-auto mb-4 text-theme-text-secondary/20" size={60} />
            <p className="text-theme-text-secondary/60 font-bold tracking-widest uppercase text-sm">Nenhuma rádio encontrada.</p>
            {(searchQuery || selectedGenre || selectedState) && (
              <Button 
                variant="ghost" 
                className="mt-4 text-theme-primary font-black uppercase text-xs tracking-widest hover:bg-theme-primary/5" 
                onClick={() => {
                  setSearchQuery('');
                  setSearchInput('');
                  setSelectedState('');
                  setSelectedGenre('');
                  setPage(1);
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.isArray(stationsData?.data) && stationsData.data.map(station => (
                <RadioCard 
                  key={station.id}
                  station={station}
                  isPlaying={isPlaying && playing?.id === station.id}
                  isActive={playing?.id === station.id}
                  isFavorite={isFavorite(station.id)}
                  onPlay={handleRadioPlay}
                  onFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {activeTab !== 'favorites' && totalPages > 1 && (
              <Pagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      <Footer />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
