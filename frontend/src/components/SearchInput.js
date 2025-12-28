import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchInput = ({ defaultValue = '', onSearch, large = false }) => {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full"
    >
      <div className={`relative flex items-center ${large ? 'text-2xl sm:text-3xl' : 'text-base'}`}>
        <Search className={`absolute left-4 ${large ? 'w-7 h-7' : 'w-5 h-5'} text-muted-foreground pointer-events-none`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stations, genres, countries..."
          className={`w-full bg-transparent border-b-2 border-muted focus:border-primary outline-none transition-colors duration-300 ${large ? 'py-6 px-14' : 'py-3 px-12'} text-foreground placeholder:text-muted-foreground`}
          data-testid="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className={`absolute right-4 ${large ? 'w-7 h-7' : 'w-5 h-5'} text-muted-foreground hover:text-foreground transition-colors`}
            data-testid="search-clear-btn"
          >
            <X className="w-full h-full" />
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default SearchInput;
