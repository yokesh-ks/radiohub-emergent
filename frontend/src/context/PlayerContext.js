import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const PlayerContext = createContext(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const audioRef = useRef(null);

  // Load favorites and recently played from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('radio-favorites');
    const savedRecent = localStorage.getItem('radio-recently-played');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRecent) {
      setRecentlyPlayed(JSON.parse(savedRecent));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('radio-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save recently played to localStorage
  useEffect(() => {
    localStorage.setItem('radio-recently-played', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleError = () => {
      setIsLoading(false);
      setError('Failed to load station');
      setIsPlaying(false);
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [volume]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playStation = useCallback(async (station) => {
    if (!station) return;
    
    setIsLoading(true);
    setError(null);
    setCurrentStation(station);

    const streamUrl = station.url_resolved || station.url;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = streamUrl;
      
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        
        // Add to recently played (max 20 items)
        setRecentlyPlayed(prev => {
          const filtered = prev.filter(s => s.stationuuid !== station.stationuuid);
          return [station, ...filtered].slice(0, 20);
        });
      } catch (err) {
        setError('Failed to play station');
        setIsPlaying(false);
      }
    }
    setIsLoading(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentStation) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        setError('Failed to resume playback');
      });
    }
  }, [isPlaying, currentStation]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setCurrentStation(null);
  }, []);

  const toggleFavorite = useCallback((station) => {
    setFavorites(prev => {
      const exists = prev.some(s => s.stationuuid === station.stationuuid);
      if (exists) {
        return prev.filter(s => s.stationuuid !== station.stationuuid);
      }
      return [...prev, station];
    });
  }, []);

  const isFavorite = useCallback((stationuuid) => {
    return favorites.some(s => s.stationuuid === stationuuid);
  }, [favorites]);

  const value = {
    currentStation,
    isPlaying,
    isLoading,
    error,
    volume,
    setVolume,
    playStation,
    togglePlay,
    stop,
    recentlyPlayed,
    favorites,
    toggleFavorite,
    isFavorite
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
