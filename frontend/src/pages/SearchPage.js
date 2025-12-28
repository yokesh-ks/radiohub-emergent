import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, Radio } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import StationCard from '../components/StationCard';
import SearchInput from '../components/SearchInput';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
      setStations([]);
      setSearched(false);
    }
  };

  useEffect(() => {
    const fetchStations = async () => {
      if (!query) {
        setStations([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      setSearched(true);
      try {
        const response = await axios.get(`${API}/stations/search`, {
          params: { name: query, limit: 50 }
        });
        setStations(response.data.stations || []);
      } catch (error) {
        console.error('Search failed:', error);
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [query]);

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-8" data-testid="search-page">
      <div className="max-w-7xl mx-auto pt-12">
        {/* Search Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <Search className="w-6 h-6 text-primary" />
            <h1 className="font-heading font-bold text-2xl">Search Stations</h1>
          </motion.div>
          <SearchInput defaultValue={query} onSearch={handleSearch} large />
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : searched && stations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Radio className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl mb-2">No stations found</h3>
            <p className="text-muted-foreground">
              Try searching for a different station, genre, or country
            </p>
          </motion.div>
        ) : (
          <>
            {stations.length > 0 && (
              <p className="text-muted-foreground mb-6" data-testid="search-results-count">
                Found {stations.length} stations for "{query}"
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" data-testid="search-results-grid">
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
          </>
        )}

        {/* Initial state */}
        {!searched && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">Search for stations</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a station name, genre, or country to find your perfect radio station
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
