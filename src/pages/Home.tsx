import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Radio, Search, SlidersHorizontal, Signal, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { radioService } from '../services/radioService';
import { RadioStation } from '../types';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { Footer } from '../components/Footer';
import { AudioPlayer } from '../components/AudioPlayer';
import { FilterPanel } from '../components/FilterPanel';
import { RadioCard } from '../components/RadioCard';
import { Pagination } from '../components/ui/Pagination';
import { RadioCardSkeleton } from '../components/ui/Skeleton';
import { safeSetItem } from '../lib/storage';

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
  
  // --- PLAYER STATE ---
  const [playing, setPlaying] = useState<RadioStation | null>(() => {
    try {
      const saved = localStorage.getItem('RadioWaveBR_lastStation');
      return saved ? (JSON.parse(saved) as RadioStation) : null;
    } catch {
      return null;
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState<boolean>(() => {
    return localStorage.getItem('RadioWaveBR_muted') === 'true';
  });
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('RadioWaveBR_volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasRestoredRef = useRef(false);

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
    // PWA dismissal é funcional/opcional, requer consentimento segundo o prompt
    safeSetItem('RadioWaveBR_pwaInstallDismissed', 'true', true);
  };

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    if (playing) {
      safeSetItem('RadioWaveBR_lastStation', JSON.stringify(playing));
    }
  }, [playing]);

  useEffect(() => {
    safeSetItem('RadioWaveBR_volume', String(volume));
  }, [volume]);

  useEffect(() => {
    safeSetItem('RadioWaveBR_muted', String(muted));
  }, [muted]);

  // Restore playback on mount
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    if (playing && audioRef.current) {
      audioRef.current.src = playing.streamUrl;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          console.info('[RadioWave] Autoplay blocked or failed. Waiting for interaction.');
          setIsPlaying(false);
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- MEDIA SESSION API ---
  useEffect(() => {
    if (!('mediaSession' in navigator) || !playing) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: playing.name,
        artist: playing.country || 'Brasil',
        album: playing.tags || 'Rádio Online',
        artwork: [
          {
            src: playing.favicon && playing.favicon.startsWith('http')
              ? playing.favicon
              : '/og-image.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(console.error);
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });

      navigator.mediaSession.setActionHandler('stop', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
    } catch (error) {
      console.error('MediaSession Error:', error);
    }

    return () => {
      // Cleanup handlers
      ['play', 'pause', 'stop'].forEach(action => {
        try { navigator.mediaSession.setActionHandler(action as any, null); } catch (_) {}
      });
    };
  }, [playing]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  // --- FAVORITES STATE ---
  const [favorites, setFavorites] = useState<RadioStation[]>(() => {
    const saved = localStorage.getItem('RadioWaveBR_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // --- AUTO-FAVORITE LOGIC ---
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (playing && isPlaying) {
      // Se ouvir por 60 segundos (1 minuto) contínuos, adiciona aos favoritos automaticamente
      timer = setTimeout(() => {
        setFavorites(prev => {
          const isFav = prev.some(s => s.id === playing.id);
          if (!isFav) {
            console.log(`[RadioWave] Auto-favoritando: ${playing.name} (audição prolongada)`);
            return [...prev, playing];
          }
          return prev;
        });
      }, 60000); 
    }

    return () => clearTimeout(timer);
  }, [playing, isPlaying]);

  useEffect(() => {
    safeSetItem('RadioWaveBR_favorites', JSON.stringify(favorites));
  }, [favorites]);

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
    queryKey: ['stations', activeTab, searchQuery, selectedState, selectedGenre, page],
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

  const handlePlay = (station: RadioStation) => {
    if (playing?.id === station.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setAudioError(true));
      }
    } else {
      setPlaying(station);
      setIsPlaying(false);
      setAudioError(false);
    }
  };

  const toggleFavorite = (e: React.MouseEvent, station: RadioStation) => {
    e.stopPropagation();

    setFavorites(prev => {
      const isFav = prev.some(s => s.id === station.id);

      if (isFav) {
        return prev.filter(s => s.id !== station.id);
      } else {
        setActiveTab('favorites');
        setPage(1);
        return [...prev, station];
      }
    });
  };

  const isFavorite = (id: string) => favorites.some(s => s.id === id);

  const handleRetry = () => {
    if (playing && audioRef.current) {
      setAudioError(false);
      let src = playing.streamUrl;
      const proxyUrl = import.meta.env.VITE_AUDIO_PROXY_URL;
      
      if (proxyUrl && window.location.protocol === 'https:' && src.startsWith('http:')) {
        src = `${proxyUrl}?url=${encodeURIComponent(src)}&retry=${Date.now()}`;
      }
      audioRef.current.pause();
      audioRef.current.src = src;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch(() => setAudioError(true));
    }
  };

  // --- AUDIO LOGIC ---
  useEffect(() => {
    if (playing && audioRef.current) {
      let src = playing.streamUrl;
      const proxyUrl = import.meta.env.VITE_AUDIO_PROXY_URL;

      if (proxyUrl && window.location.protocol === 'https:' && src.startsWith('http:')) {
        src = `${proxyUrl}?url=${encodeURIComponent(src)}`;
      }
      
      const currentSrc = audioRef.current.src;
      const absoluteSrc = new URL(src, window.location.href).href;

      if (currentSrc !== absoluteSrc) {
        setAudioError(false);
        setIsPlaying(false);
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
        audioRef.current.src = src;
        
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioError(false);
          })
          .catch((e) => {
            if (e.name !== 'AbortError') {
              setAudioError(true);
              setIsPlaying(false);
            }
          });
      } else if (!isPlaying && !audioError) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setAudioError(true));
      }
    }
  }, [playing]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const totalPages = useMemo(() => {
    if (!stationsData || typeof stationsData.total !== 'number') return 0;
    return Math.ceil(stationsData.total / LIMIT);
  }, [stationsData]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-brasil-light text-slate-800 font-body selection:bg-brasil-yellow selection:text-brasil-green",
      playing ? "pb-[88px]" : ""
    )}>
      {showInstallBanner && (
        <div className="fixed top-0 left-0 right-0 z-[300] bg-brasil-green text-white px-4 py-3 flex items-center justify-between gap-4 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <img src="/icon-192x192.png" alt="RadioWave" className="w-8 h-8 rounded-lg" />
            <div>
              <p className="text-sm font-black leading-tight">Instalar Radio Wave Brasil</p>
              <p className="text-xs text-white/70 font-medium">Adicionar à tela inicial — acesso rápido e offline</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-brasil-yellow text-brasil-green text-xs font-black px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={handleDismissInstall}
              className="text-white/60 hover:text-white text-xs font-bold px-2 py-1.5"
              title="Dispensar"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <audio 
        ref={audioRef} 
        crossOrigin="anonymous" 
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
        x-webkit-airplay="allow"
        onCanPlay={() => setAudioError(false)}
        onError={() => {
          if (playing) {
            setAudioError(true);
            setIsPlaying(false);
          }
        }}
      />

      <header className="sticky top-0 z-50 bg-brasil-green text-brasil-white border-b border-black/5 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brasil-yellow rounded-xl flex items-center justify-center text-brasil-green shadow-[0_2px_16px_rgba(255,223,0,0.5)] hover:shadow-[0_4px_24px_rgba(255,223,0,0.7)] hover:scale-110 transition-all duration-300 cursor-default">
              <Radio size={24} />
            </div>
            <div>
              <h1 className="text-xl font-display font-black leading-none tracking-tight">Radio Wave Brasil</h1>
              <span className="text-[10px] text-brasil-yellow font-black uppercase tracking-[0.2em] opacity-80">Brasil ao vivo</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all duration-300",
              isFetching 
                ? "bg-brasil-yellow/20 border-brasil-yellow/20 text-brasil-yellow" 
                : isPlaying 
                  ? "bg-brasil-white/20 border-brasil-white/20 text-brasil-white shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
                  : "bg-red-500/20 border-red-500/20 text-white/80"
            )}>
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                isFetching 
                  ? "bg-brasil-yellow animate-pulse" 
                  : isPlaying 
                    ? "bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" 
                    : "bg-red-500"
              )} />
              {isFetching ? 'Atualizando...' : isPlaying ? 'Online' : 'Offline'}
            </div>
            {isError && (
              <Button variant="ghost" size="icon" onClick={() => refetch()} className="text-red-200 hover:bg-white/10">
                <RefreshCw size={18} />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-8 pb-4">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form className="flex-1 flex gap-2" onSubmit={handleSearch}>
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brasil-green transition-colors" size={18} />
                <input 
                  type="text" 
                  className="w-full h-14 bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brasil-green/25 focus:border-brasil-green focus:shadow-[0_0_0_4px_rgba(0,156,59,0.08)] transition-all duration-300 font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                  placeholder="Nome da rádio ou palavra-chave..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 rounded-2xl px-8 shadow-lg">
                Buscar
              </Button>
            </form>
            
            <Button 
              variant={showFilters ? "primary" : "ghost"} 
              size="lg" 
              className={cn(
                "h-14 rounded-2xl px-6 border transition-all duration-200",
                showFilters
                  ? "border-transparent shadow-[0_4px_20px_rgba(0,156,59,0.25)]"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5"
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Filtros
            </Button>
          </div>
        </section>

        {showFilters && (
          <FilterPanel 
            selectedState={selectedState}
            onStateChange={handleStateChange}
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
            genres={genres}
          />
        )}

        <nav className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'top' as const, label: '🔥 Populares' },
            { id: 'search' as const, label: '🔍 Geral' },
            { id: 'favorites' as const, label: '⭐ Favoritos' }
          ].map(tab => (
            <button 
              key={tab.id}
              className={cn(
                "pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 relative whitespace-nowrap outline-none",
                "hover:scale-105",
                activeTab === tab.id ? "text-brasil-blue" : "text-slate-400 hover:text-slate-600"
              )}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-brasil-blue rounded-t-full shadow-[0_-4px_12px_rgba(0,39,118,0.4)] animate-in zoom-in-x duration-300" />
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
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.07)] animate-in fade-in zoom-in-95 duration-300">
            <Signal className="mx-auto mb-6 text-slate-200" size={80} />
            <h3 className="text-xl font-display font-black mb-2 text-brasil-green">Ops! Algum problema ocorreu</h3>
            <p className="text-slate-500 font-semibold mb-6">Não conseguimos conectar com as antenas agora.</p>
            <Button onClick={() => refetch()} variant="outline" className="border-brasil-green text-brasil-green hover:bg-brasil-green/5">Tentar Novamente</Button>
          </div>
        ) : (stationsData?.data?.length ?? 0) === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-200 shadow-[0_4_24px_rgba(0,0,0,0.07)]">
            <Signal className="mx-auto mb-4 text-slate-200" size={60} />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Nenhuma rádio encontrada.</p>
            {(searchQuery || selectedGenre || selectedState) && (
              <Button 
                variant="ghost" 
                className="mt-4 text-brasil-blue font-black uppercase text-xs tracking-widest hover:bg-brasil-blue/5" 
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
                  isPlaying={isPlaying}
                  isActive={playing?.id === station.id}
                  isFavorite={isFavorite(station.id)}
                  onPlay={handlePlay}
                  onFavorite={toggleFavorite}
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

      {playing && (
        <AudioPlayer 
          station={playing as any}
          isPlaying={isPlaying}
          onTogglePlay={() => handlePlay(playing)}
          volume={volume}
          onVolumeChange={setVolume}
          muted={muted}
          onToggleMute={() => setMuted(!muted)}
          audioError={audioError}
          onRetry={handleRetry}
        />
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
