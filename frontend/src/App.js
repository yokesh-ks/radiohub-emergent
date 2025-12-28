import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import RecentPage from './pages/RecentPage';
import GenrePage from './pages/GenrePage';
import CountryPage from './pages/CountryPage';
import LanguagePage from './pages/LanguagePage';
import GenresListPage from './pages/GenresListPage';
import CountriesListPage from './pages/CountriesListPage';
import LanguagesListPage from './pages/LanguagesListPage';
import './App.css';

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          {/* Noise overlay */}
          <div className="noise-overlay" />
          
          <Navbar />
          
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/recent" element={<RecentPage />} />
              <Route path="/genre/:genre" element={<GenrePage />} />
              <Route path="/country/:country" element={<CountryPage />} />
              <Route path="/language/:language" element={<LanguagePage />} />
              <Route path="/genres" element={<GenresListPage />} />
              <Route path="/countries" element={<CountriesListPage />} />
              <Route path="/languages" element={<LanguagesListPage />} />
            </Routes>
          </main>
          
          <PlayerBar />
          <Toaster />
        </div>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
