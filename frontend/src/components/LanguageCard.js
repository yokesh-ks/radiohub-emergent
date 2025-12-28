import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Language data with native text and colors
const LANGUAGE_DATA = {
  english: { native: 'Hello', flag: ['#002868', '#BF0A30', '#FFFFFF'], accent: '#BF0A30' },
  spanish: { native: 'Hola', flag: ['#AA151B', '#F1BF00', '#AA151B'], accent: '#F1BF00' },
  german: { native: 'Hallo', flag: ['#000000', '#DD0000', '#FFCE00'], accent: '#FFCE00' },
  french: { native: 'Bonjour', flag: ['#002395', '#FFFFFF', '#ED2939'], accent: '#ED2939' },
  portuguese: { native: 'Olá', flag: ['#006600', '#FFCC00', '#FF0000'], accent: '#FFCC00' },
  russian: { native: 'Привет', flag: ['#FFFFFF', '#0039A6', '#D52B1E'], accent: '#D52B1E' },
  japanese: { native: 'こんにちは', flag: ['#FFFFFF', '#BC002D', '#FFFFFF'], accent: '#BC002D' },
  hindi: { native: 'नमस्ते', flag: ['#FF9933', '#FFFFFF', '#138808'], accent: '#FF9933' },
  arabic: { native: 'مرحبا', flag: ['#007A3D', '#FFFFFF', '#CE1126'], accent: '#CE1126' },
  chinese: { native: '你好', flag: ['#DE2910', '#FFDE00', '#DE2910'], accent: '#FFDE00' },
};

const LanguageCard = ({ language, index = 0 }) => {
  const navigate = useNavigate();
  const data = LANGUAGE_DATA[language] || { native: language, flag: ['#333', '#555', '#777'], accent: '#a8dc4b' };

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
      className="relative group overflow-hidden rounded-2xl aspect-[4/3] w-full bg-card border border-border hover:border-primary/50 transition-all duration-300"
      data-testid={`language-card-${language}`}
    >
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${data.flag[0]} 0%, ${data.flag[1]} 50%, ${data.flag[2]} 100%)`
        }}
      />
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id={`grid-${language}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill={data.accent} />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grid-${language})`} />
        </svg>
      </div>

      {/* Floating accent orb */}
      <motion.div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
        style={{ backgroundColor: data.accent }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Native greeting - large */}
        <motion.span 
          className="text-2xl sm:text-3xl font-bold mb-2 opacity-40 group-hover:opacity-70 transition-opacity"
          style={{ color: data.accent }}
        >
          {data.native}
        </motion.span>
        
        {/* Language name */}
        <h3 className="font-heading font-bold text-lg text-foreground capitalize group-hover:text-primary transition-colors">
          {language}
        </h3>

        {/* Accent line */}
        <motion.div 
          className="h-0.5 mt-2 rounded-full"
          style={{ backgroundColor: data.accent }}
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          transition={{ delay: index * 0.05 + 0.2 }}
        />
      </div>

      {/* Corner accent */}
      <div 
        className="absolute bottom-0 left-0 w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${data.accent} 50%)`
        }}
      />

      {/* Soundwave animation on hover */}
      <div className="absolute bottom-3 right-3 flex items-end gap-0.5 h-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full"
            style={{ backgroundColor: data.accent }}
            animate={{ height: ['40%', '100%', '40%'] }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.button>
  );
};

export default LanguageCard;
