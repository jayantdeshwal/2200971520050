import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Divider
} from '@mui/material';
import { useLogger } from '../context/LoggerContext';
import { isValidURL, isValidShortcode, isPositiveInteger } from '../utils/validator';

const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 8); // random 6-char
};

const ShortenerPage = () => {
  const [forms, setForms] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const { log } = useLogger();

  const handleChange = (index, field, value) => {
    const updated = [...forms];
    updated[index][field] = value;
    setForms(updated);
  };

  const addForm = () => {
    if (forms.length < 5) {
      setForms([...forms, { longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const validateAndShorten = () => {
    const newResults = [];

    let existingShortcodes = {};
    try {
      existingShortcodes = JSON.parse(localStorage.getItem('urlData')) || {};
    } catch {
      existingShortcodes = {};
    }

    const updatedData = { ...existingShortcodes };

    for (let i = 0; i < forms.length; i++) {
      const { longUrl, validity, shortcode } = forms[i];

      if (!isValidURL(longUrl)) {
        log('ERROR', 'Invalid URL submitted', { longUrl });
        alert(`Form ${i + 1}: Invalid URL`);
        return;
      }

      const validPeriod = validity ? parseInt(validity) : 30;
      if (validity && !isPositiveInteger(validity)) {
        log('ERROR', 'Invalid validity period', { validity });
        alert(`Form ${i + 1}: Validity must be a positive number`);
        return;
      }

      let finalShort = shortcode || generateRandomCode();
      if (!isValidShortcode(finalShort)) {
        log('ERROR', 'Invalid shortcode', { shortcode: finalShort });
        alert(`Form ${i + 1}: Invalid shortcode format`);
        return;
      }

      if (updatedData[finalShort]) {
        log('ERROR', 'Shortcode already exists', { shortcode: finalShort });
        alert(`Form ${i + 1}: Shortcode "${finalShort}" already exists`);
        return;
      }

      const now = new Date();
      const expiry = new Date(now.getTime() + validPeriod * 60000);
      const newEntry = {
        originalURL: longUrl,
        shortcode: finalShort,
        createdAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
        clicks: [],
      };

      updatedData[finalShort] = newEntry;
      newResults.push(newEntry);

      log('CREATE', 'Short URL created', newEntry);
    }

    localStorage.setItem('urlData', JSON.stringify(updatedData));
    setResults(newResults);
    setForms([{ longUrl: '', validity: '', shortcode: '' }]); // Reset form
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        🚀 URL Shortener
      </Typography>

      {forms.map((form, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }} elevation={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Long URL"
                value={form.longUrl}
                onChange={(e) => handleChange(index, 'longUrl', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Validity (min)"
                value={form.validity}
                onChange={(e) => handleChange(index, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Custom Shortcode (optional)"
                value={form.shortcode}
                onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={addForm}
        disabled={forms.length >= 5}
        sx={{ mr: 2 }}
      >
        + Add More (max 5)
      </Button>

      <Button
        variant="contained"
        color="success"
        onClick={validateAndShorten}
      >
        Shorten URLs
      </Button>

      {results.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5">Shortened URLs</Typography>
          {results.map((r, i) => (
            <Box key={i} sx={{ my: 2 }}>
              <Typography>
                🔗 Short URL:{" "}
                <a href={`${window.location.origin}/${r.shortcode}`} target="_blank" rel="noopener noreferrer">
                  {`${window.location.origin}/${r.shortcode}`}
                </a>
              </Typography>
              <Typography>⏰ Expires At: {new Date(r.expiresAt).toLocaleString()}</Typography>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default ShortenerPage;
