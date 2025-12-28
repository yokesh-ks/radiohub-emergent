import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GenreTag = ({ genre, count, index = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/genre/${encodeURIComponent(genre)}`);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="glass-card px-4 py-2 rounded-full text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
      data-testid={`genre-tag-${genre}`}
    >
      {genre}
      {count && <span className="ml-2 text-xs text-muted-foreground">{count}</span>}
    </motion.button>
  );
};

export default GenreTag;
