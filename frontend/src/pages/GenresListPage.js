import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import GenreTag from '../components/GenreTag';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GenresListPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${API}/tags`, { params: { limit: 100 } });
        setGenres(response.data.tags || []);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-8" data-testid="genres-list-page">
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
              <h1 className="font-heading font-bold text-2xl">All Genres</h1>
              <p className="text-muted-foreground text-sm">{genres.length} genres available</p>
            </div>
          </div>
        </motion.div>

        {/* Genres */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-3" data-testid="all-genres-list">
            {genres.map((tag, i) => (
              <GenreTag 
                key={tag.name} 
                genre={tag.name} 
                count={tag.stationcount} 
                index={i} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenresListPage;
