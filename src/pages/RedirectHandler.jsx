import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLogger } from '../context/LoggerContext';
import { Box, Typography, CircularProgress } from '@mui/material';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const { log } = useLogger();

  useEffect(() => {
    const urlData = JSON.parse(localStorage.getItem('urlData')) || {};
    const entry = urlData[shortcode];

    if (!entry) {
      log('ERROR', 'Shortcode not found', { shortcode });
      navigate('/'); // or show error page
      return;
    }

    const now = new Date();
    const expiry = new Date(entry.expiresAt);

    if (now > expiry) {
      log('ERROR', 'Shortcode expired', { shortcode });
      alert('This short link has expired.');
      navigate('/');
      return;
    }

    // MOCK GEO LOCATION AND SOURCE
    const clickInfo = {
      timestamp: now.toISOString(),
      source: document.referrer || 'Direct',
      location: 'India (mock)', // Could use geolocation API if allowed
    };

    entry.clicks.push(clickInfo);
    urlData[shortcode] = entry;
    localStorage.setItem('urlData', JSON.stringify(urlData));

    log('CLICK', 'Short link clicked', { shortcode, clickInfo });

    // REDIRECT after short delay
    setTimeout(() => {
      window.location.href = entry.originalURL;
    }, 1000);
  }, [shortcode, log, navigate]);

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Redirecting you to your original link...
      </Typography>
    </Box>
  );
};

export default RedirectHandler;