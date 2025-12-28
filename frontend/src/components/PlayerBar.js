import React from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Heart, Loader2 } from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { usePlayer } from '../context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';

const PlayerBar = () => {
  const { 
    currentStation, 
    isPlaying, 
    isLoading,
    togglePlay, 
    volume, 
    setVolume,
    toggleFavorite,
    isFavorite
  } = usePlayer();

  if (!currentStation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50"
        data-testid="player-bar"
      >
        {/* Tracing beam */}
        <div className="h-[2px] w-full overflow-hidden bg-muted">
          <div className="tracing-beam w-full" />
        </div>
        
        <div className="glass px-4 sm:px-8 py-4 h-24">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Station info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {currentStation.favicon ? (
                  <img 
                    src={currentStation.favicon} 
                    alt={currentStation.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`absolute inset-0 ${currentStation.favicon ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20`}
                >
                  <Radio className="w-6 h-6 text-primary" />
                </div>
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="flex gap-[2px] items-end h-4">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-[3px] bg-primary rounded-full"
                          animate={{ height: ['40%', '100%', '40%'] }}
                          transition={{ 
                            duration: 0.5, 
                            repeat: Infinity, 
                            delay: i * 0.1 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="font-heading font-semibold text-foreground truncate" data-testid="current-station-name">
                  {currentStation.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentStation.country} {currentStation.tags && `• ${currentStation.tags.split(',')[0]}`}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(currentStation)}
                className="text-muted-foreground hover:text-primary"
                data-testid="player-favorite-btn"
              >
                <Heart 
                  className={`w-5 h-5 ${isFavorite(currentStation.stationuuid) ? 'fill-primary text-primary' : ''}`} 
                />
              </Button>
              
              <Button
                size="lg"
                onClick={togglePlay}
                disabled={isLoading}
                className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="player-play-pause-btn"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-3 w-36">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                className="text-muted-foreground hover:text-foreground"
                data-testid="player-volume-btn"
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([val]) => setVolume(val / 100)}
                className="flex-1"
                data-testid="player-volume-slider"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlayerBar;
