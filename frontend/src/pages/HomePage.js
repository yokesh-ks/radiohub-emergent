import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Music, Globe, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import StationCard from '../components/StationCard';
import SearchInput from '../components/SearchInput';
import GenreTag from '../components/GenreTag';
import { Button } from '../components/ui/button';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FEATURED_GENRES = ['pop', 'rock', 'jazz', 'classical', 'electronic', 'hiphop', 'news', 'talk', 'ambient', 'country', 'latin', 'metal'];

const HomePage = () => {
  const [topStations, setTopStations] = useState([]);
  const [trendingStations, setTrendingStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, trendingRes] = await Promise.all([
          axios.get(`${API}/stations/topvote`, { params: { limit: 12 } }),
          axios.get(`${API}/stations/topclick`, { params: { limit: 8 } })
        ]);
        setTopStations(topRes.data.stations || []);
        setTrendingStations(trendingRes.data.stations || []);
      } catch (error) {
        console.error('Failed to fetch stations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pb-32" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overline mb-4"
          >
            30,000+ Live Radio Stations
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6"
          >
            Discover Radio from{' '}
            <span className="text-primary">Around the World</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Stream live radio stations from every corner of the globe. 
            Find your perfect station by genre, country, or mood.
          </motion.p>
          
          <div className="max-w-2xl mx-auto">
            <SearchInput large />
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="px-4 sm:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Music className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-semibold text-lg">Browse by Genre</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {FEATURED_GENRES.map((genre, i) => (
              <GenreTag key={genre} genre={genre} index={i} />
            ))}
            <Link to="/genres" data-testid="view-all-genres">
              <Button variant="outline" className="rounded-full">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Voted */}
      <section className="px-4 sm:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-semibold text-lg">Top Rated Stations</h2>
            </div>
            <Link to="/top" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="view-all-top">
              View all
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" data-testid="top-stations-grid">
              {topStations.slice(0, 6).map((station) => (
                <StationCard key={station.stationuuid} station={station} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Now - Bento Grid */}
      <section className="px-4 sm:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h2 className="font-heading font-semibold text-lg">Trending Now</h2>
            </div>
            <Link to="/trending" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="view-all-trending">
              View all
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="trending-stations-grid">
              {trendingStations.slice(0, 4).map((station, i) => (
                <motion.div
                  key={station.stationuuid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                >
                  <StationCard station={station} size={i === 0 ? 'large' : 'default'} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Countries */}
      <section className="px-4 sm:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-semibold text-lg">Explore by Country</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {['United States', 'United Kingdom', 'Germany', 'France', 'Brazil', 'Japan', 'India', 'Australia'].map((country, i) => (
              <Link 
                key={country} 
                to={`/country/${encodeURIComponent(country)}`}
                data-testid={`country-tag-${country.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card px-4 py-2 rounded-full text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                >
                  {country}
                </motion.div>
              </Link>
            ))}
            <Link to="/countries" data-testid="view-all-countries">
              <Button variant="outline" className="rounded-full">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
