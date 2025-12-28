import React from 'react';
import { Heart, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StationCard from '../components/StationCard';
import { Button } from '../components/ui/button';
import { usePlayer } from '../context/PlayerContext';

const FavoritesPage = () => {
  const { favorites } = usePlayer();

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-8" data-testid="favorites-page">
      <div className="max-w-7xl mx-auto pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl">Favorites</h1>
            <p className="text-muted-foreground text-sm">{favorites.length} saved stations</p>
          </div>
        </motion.div>

        {/* Stations */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Radio className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">No favorites yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Start exploring and save your favorite stations by clicking the heart icon
            </p>
            <Link to="/">
              <Button className="rounded-full" data-testid="explore-stations-btn">
                Explore Stations
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" data-testid="favorites-grid">
            {favorites.map((station, i) => (
              <motion.div
                key={station.stationuuid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <StationCard station={station} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
