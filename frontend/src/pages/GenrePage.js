import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Music, ArrowLeft, Loader2, Radio } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import StationCard from '../components/StationCard';
import { Button } from '../components/ui/button';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GenrePage = () => {
  const { genre } = useParams();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/stations/bytag/${genre}`, {
          params: { limit: 50 }
        });
        setStations(response.data.stations || []);
      } catch (error) {
        console.error('Failed to fetch stations:', error);
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [genre]);

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-8" data-testid="genre-page">
      <div className="max-w-7xl mx-auto pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl capitalize" data-testid="genre-title">{genre}</h1>
              <p className="text-muted-foreground text-sm">{stations.length} stations</p>
            </div>
          </div>
        </motion.div>

        {/* Stations */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : stations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Radio className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl mb-2">No stations found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any stations for this genre
            </p>
            <Link to="/">
              <Button className="rounded-full">Browse Other Genres</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" data-testid="genre-stations-grid">
            {stations.map((station, i) => (
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

export default GenrePage;
