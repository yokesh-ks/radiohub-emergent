import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LanguageCard = ({ language, image, index = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/language/${encodeURIComponent(language)}`);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="relative group overflow-hidden rounded-2xl aspect-[4/3] w-full"
      data-testid={`language-card-${language}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={language}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-end p-4">
        <div className="text-left">
          <h3 className="font-heading font-bold text-lg text-white capitalize group-hover:text-primary transition-colors">
            {language}
          </h3>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300" />
    </motion.button>
  );
};

export default LanguageCard;
