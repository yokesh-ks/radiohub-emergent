import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Languages, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import LanguageCard from '../components/LanguageCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LanguagesListPage = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${API}/languages`, { params: { limit: 100 } });
        // Filter to get languages that have station count > 100 for better UX
        const filteredLanguages = (response.data.languages || [])
          .filter(lang => lang.stationcount > 50)
          .slice(0, 30);
        setLanguages(filteredLanguages);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-8" data-testid="languages-list-page">
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
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Languages className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl">All Languages</h1>
              <p className="text-muted-foreground text-sm">{languages.length} languages available</p>
            </div>
          </div>
        </motion.div>

        {/* Languages Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" data-testid="all-languages-grid">
            {languages.map((lang, i) => (
              <LanguageCard 
                key={lang.name} 
                language={lang.name} 
                index={i}
                stationCount={lang.stationcount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguagesListPage;
