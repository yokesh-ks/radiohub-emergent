import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Radio, Heart, Clock, Home, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
    { path: '/recent', icon: Clock, label: 'Recent' },
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="navbar-logo">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:glow-lime transition-shadow duration-300">
              <Radio className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl hidden sm:block">
              Radio<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path || 
                (path !== '/' && location.pathname.startsWith(path));
              
              return (
                <Link
                  key={path}
                  to={path}
                  data-testid={`nav-${label.toLowerCase()}`}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
