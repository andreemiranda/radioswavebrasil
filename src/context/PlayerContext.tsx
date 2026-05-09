import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { RadioStation } from '../types';
import { safeSetItem } from '../lib/storage';

interface PlayerContextType {
  playing: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  audioError: boolean;
  favorites: RadioStation[];
  playStation: (station: RadioStation) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFavorite: (station: RadioStation) => void;
  isFavorite: (id: string) => boolean;
  retry: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('RadioWaveBR_volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasRestoredRef = useRef(false);

  // --- FAVORITES STATE ---
  const [favorites, setFavorites] = useState<RadioStation[]>(() => {
    const saved = localStorage.getItem('RadioWaveBR_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    
    const hEnded = () => setIsPlaying(false);
    const hPlay = () => setIsPlaying(true);
    const hPause = () => setIsPlaying(false);
    const hCanPlay = () => setAudioError(false);
    const hError = () => {
      if (playingRef.current) {
        setAudioError(true);
        setIsPlaying(false);
      }
    };

    audio.addEventListener('ended', hEnded);
    audio.addEventListener('play', hPlay);
    audio.addEventListener('pause', hPause);
    audio.addEventListener('canplay', hCanPlay);
    audio.addEventListener('error', hError);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('ended', hEnded);
      audio.removeEventListener('play', hPlay);
      audio.removeEventListener('pause', hPause);
      audio.removeEventListener('canplay', hCanPlay);
      audio.removeEventListener('error', hError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    if (playing) {
      safeSetItem('RadioWaveBR_lastStation', JSON.stringify(playing));
    }
  }, [playing]);

  useEffect(() => {
    safeSetItem('RadioWaveBR_volume', String(volume));
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  useEffect(() => {
    safeSetItem('RadioWaveBR_muted', String(muted));
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    safeSetItem('RadioWaveBR_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Restore playback on mount
  useEffect(() => {
    if (hasRestoredRef.current || !audioRef.current) return;
    hasRestoredRef.current = true;

    if (playing) {
      audioRef.current.src = getStreamUrl(playing.streamUrl);
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          console.info('[RadioWave] Autoplay blocked or failed. Waiting for interaction.');
          setIsPlaying(false);
        });
    }
  }, [playing]);

  // --- MEDIA SESSION API ---
  useEffect(() => {
    if (!('mediaSession' in navigator) || !playing) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: playing.name,
        artist: playing.country || 'Brasil',
        album: (playing.tags && playing.tags.length > 0) ? playing.tags.join(', ') : 'Rádio Online',
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

  // --- AUTO-FAVORITE LOGIC ---
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (playing && isPlaying) {
      timer = setTimeout(() => {
        setFavorites(prev => {
          const isFav = prev.some(s => s.id === playing.id);
          if (!isFav) {
            return [...prev, playing];
          }
          return prev;
        });
      }, 60000); 
    }

    return () => clearTimeout(timer);
  }, [playing, isPlaying]);

  // --- ACTIONS ---
  const getStreamUrl = (url: string, retryFlag = false) => {
    let src = url;
    // @ts-ignore
    const proxyUrl = import.meta.env.VITE_AUDIO_PROXY_URL;
    
    if (proxyUrl && window.location.protocol === 'https:' && src.startsWith('http:')) {
      src = `${proxyUrl}?url=${encodeURIComponent(src)}${retryFlag ? `&retry=${Date.now()}` : ''}`;
    }
    return src;
  };

  const playStation = (station: RadioStation) => {
    if (playing?.id === station.id) {
      togglePlay();
    } else {
      setPlaying(station);
      setAudioError(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = getStreamUrl(station.streamUrl);
        audioRef.current.load();
        audioRef.current.volume = muted ? 0 : volume;
        audioRef.current.muted = muted;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((e) => {
            if (e.name !== 'AbortError') {
              setAudioError(true);
              setIsPlaying(false);
            }
          });
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !playing) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setAudioError(true));
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const toggleFavorite = (station: RadioStation) => {
    setFavorites(prev => {
      const isFav = prev.some(s => s.id === station.id);
      if (isFav) {
        return prev.filter(s => s.id !== station.id);
      } else {
        return [...prev, station];
      }
    });
  };

  const isFavorite = (id: string) => favorites.some(s => s.id === id);

  const retry = () => {
    if (playing && audioRef.current) {
      setAudioError(false);
      audioRef.current.pause();
      audioRef.current.src = getStreamUrl(playing.streamUrl, true);
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch(() => setAudioError(true));
    }
  };

  return (
    <PlayerContext.Provider value={{
      playing,
      isPlaying,
      volume,
      muted,
      audioError,
      favorites,
      playStation,
      togglePlay,
      setVolume,
      toggleMute,
      toggleFavorite,
      isFavorite,
      retry
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
