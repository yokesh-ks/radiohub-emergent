import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Music, Languages, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import StationCard from '../components/StationCard';
import SearchInput from '../components/SearchInput';
import GenreCard from '../components/GenreCard';
import LanguageCard from '../components/LanguageCard';
import { Button } from '../components/ui/button';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Genre data with illustrations
const FEATURED_GENRES = [
  { name: 'pop', image: 'https://images.pexels.com/photos/8512644/pexels-photo-8512644.jpeg' },
  { name: 'rock', image: 'https://images.pexels.com/photos/1047796/pexels-photo-1047796.jpeg' },
  { name: 'jazz', image: 'https://images.pexels.com/photos/14351047/pexels-photo-14351047.jpeg' },
  { name: 'classical', image: 'https://images.unsplash.com/photo-1685954154829-5ebdf5956824?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBtdXNpYyUyMG9yY2hlc3RyYSUyMHZpb2xpbnxlbnwwfHx8fDE3NjY5MTc5NDF8MA&ixlib=rb-4.1.0&q=85' },
  { name: 'electronic', image: 'https://images.unsplash.com/photo-1616709062048-788acece6a51?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBkaiUyMG5lb258ZW58MHx8fHwxNzY2OTE3OTQzfDA&ixlib=rb-4.1.0&q=85' },
  { name: 'hiphop', image: 'https://images.unsplash.com/photo-1565970460548-9a073fd8e6ea?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjB1cmJhbiUyMGdyYWZmaXRpfGVufDB8fHx8MTc2NjkxNzk1NHww&ixlib=rb-4.1.0&q=85' },
  { name: 'news', image: 'https://images.pexels.com/photos/19126179/pexels-photo-19126179.jpeg' },
  { name: 'talk', image: 'https://images.unsplash.com/photo-1709846485906-30b28e7ed651?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMHN0dWRpb3xlbnwwfHx8fDE3NjY5MTc5NzR8MA&ixlib=rb-4.1.0&q=85' },
  { name: 'ambient', image: 'https://images.unsplash.com/photo-1762609765700-24549bf7d66e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxhbWJpZW50JTIwbmF0dXJlJTIwZm9nJTIwZm9yZXN0fGVufDB8fHx8MTc2NjkxNzk1OXww&ixlib=rb-4.1.0&q=85' },
  { name: 'country', image: 'https://images.pexels.com/photos/1154182/pexels-photo-1154182.jpeg' },
  { name: 'latin', image: 'https://images.unsplash.com/photo-1585873587499-4c2b179c6c51?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxsYXRpbiUyMHNhbHNhJTIwZGFuY2UlMjBjb2xvcmZ1bHxlbnwwfHx8fDE3NjY5MTc5NjR8MA&ixlib=rb-4.1.0&q=85' },
  { name: 'metal', image: 'https://images.unsplash.com/photo-1542577731-7f6eabdf59ef?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxoZWF2eSUyMG1ldGFsJTIwY29uY2VydCUyMGRhcmt8ZW58MHx8fHwxNzY2OTE3OTcyfDA&ixlib=rb-4.1.0&q=85' },
];

// Language data with illustrations
const FEATURED_LANGUAGES = [
  { name: 'english', image: 'https://images.pexels.com/photos/2725634/pexels-photo-2725634.jpeg' },
  { name: 'spanish', image: 'https://images.pexels.com/photos/29864855/pexels-photo-29864855.jpeg' },
  { name: 'german', image: 'https://images.pexels.com/photos/109629/pexels-photo-109629.jpeg' },
  { name: 'french', image: 'https://images.unsplash.com/photo-1730995971969-6a17ab5885e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxmcmFuY2UlMjBwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDB8fHx8MTc2NjkxODM4Nnww&ixlib=rb-4.1.0&q=85' },
  { name: 'portuguese', image: 'https://images.pexels.com/photos/8880071/pexels-photo-8880071.jpeg' },
  { name: 'russian', image: 'https://images.pexels.com/photos/2887633/pexels-photo-2887633.jpeg' },
  { name: 'japanese', image: 'https://images.pexels.com/photos/7210062/pexels-photo-7210062.jpeg' },
  { name: 'hindi', image: 'https://images.pexels.com/photos/34453343/pexels-photo-34453343.jpeg' },
  { name: 'arabic', image: 'https://images.pexels.com/photos/6118470/pexels-photo-6118470.jpeg' },
  { name: 'chinese', image: 'https://images.pexels.com/photos/4445240/pexels-photo-4445240.jpeg' },
];

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

      {/* Genres with Illustrations */}
      <section className="px-4 sm:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-semibold text-lg">Browse by Genre</h2>
            </div>
            <Link to="/genres" data-testid="view-all-genres">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" data-testid="genre-cards-grid">
            {FEATURED_GENRES.map((genre, i) => (
              <GenreCard key={genre.name} genre={genre.name} image={genre.image} index={i} />
            ))}
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

      {/* Languages with Illustrations */}
      <section className="px-4 sm:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-semibold text-lg">Explore by Language</h2>
            </div>
            <Link to="/languages" data-testid="view-all-languages">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" data-testid="language-cards-grid">
            {FEATURED_LANGUAGES.map((lang, i) => (
              <LanguageCard key={lang.name} language={lang.name} image={lang.image} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
