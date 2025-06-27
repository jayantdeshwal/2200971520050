import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';
import RedirectHandler from './pages/RedirectHandler';
import { CssBaseline } from '@mui/material';
import { LoggerProvider } from './context/LoggerContext';

function App() {
  return (
    <LoggerProvider>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/:shortcode" element={<RedirectHandler />} />
      </Routes>
    </LoggerProvider>
  );
}

export default App;
