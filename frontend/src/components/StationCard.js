import React from 'react';
import { Play, Pause, Heart, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { usePlayer } from '../context/PlayerContext';
import { motion } from 'framer-motion';

const StationCard = ({ station, size = 'default' }) => {
  const { playStation, currentStation, isPlaying, togglePlay, toggleFavorite, isFavorite } = usePlayer();
  
  const isCurrentStation = currentStation?.stationuuid === station.stationuuid;
  const isThisPlaying = isCurrentStation && isPlaying;

  const handlePlay = () => {
    if (isCurrentStation) {
      togglePlay();
    } else {
      playStation(station);
    }
  };

  const sizeClasses = {
    default: 'p-4',
    large: 'p-6',
    small: 'p-3'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`glass-card rounded-2xl ${sizeClasses[size]} group cursor-pointer transition-all duration-300 hover:border-primary/50`}
      onClick={handlePlay}
      data-testid={`station-card-${station.stationuuid}`}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-muted">
        {station.favicon ? (
          <img 
            src={station.favicon}
            alt={station.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`absolute inset-0 ${station.favicon ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/10 to-muted`}
        >
          <Radio className="w-12 h-12 text-primary/60" />
        </div>
        
        {/* Play overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {isThisPlaying ? (
            <div className="flex gap-1 items-end h-8">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 bg-primary rounded-full"
                  animate={{ height: ['40%', '100%', '40%'] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : (
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              data-testid={`station-play-btn-${station.stationuuid}`}
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
          )}
        </div>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(station);
          }}
          data-testid={`station-favorite-btn-${station.stationuuid}`}
        >
          <Heart className={`w-4 h-4 ${isFavorite(station.stationuuid) ? 'fill-primary text-primary' : 'text-white'}`} />
        </Button>
      </div>

      <h3 className="font-heading font-semibold text-foreground truncate mb-1" data-testid={`station-name-${station.stationuuid}`}>
        {station.name}
      </h3>
      <p className="text-sm text-muted-foreground truncate">
        {station.country || 'Unknown'} {station.tags && `• ${station.tags.split(',')[0]}`}
      </p>
      {station.bitrate > 0 && (
        <p className="text-xs text-muted-foreground/60 mt-1">
          {station.bitrate} kbps
        </p>
      )}
    </motion.div>
  );
};

export default StationCard;
