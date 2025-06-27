import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const StatsPage = () => {
  const [urlData, setUrlData] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('urlData')) || {};
    setUrlData(stored);
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        📈 URL Statistics
      </Typography>

      {Object.keys(urlData).length === 0 ? (
        <Typography>No URLs have been shortened yet.</Typography>
      ) : (
        Object.entries(urlData).map(([shortcode, data]) => (
          <Paper key={shortcode} sx={{ p: 3, mb: 4 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              🔗{' '}
              <a
                href={`${window.location.origin}/${shortcode}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${window.location.origin}/${shortcode}`}
              </a>
            </Typography>
            <Typography color="text.secondary">
              Original URL:{' '}
              <a
                href={data.originalURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.originalURL}
              </a>
            </Typography>
            <Typography>Created At: {formatDate(data.createdAt)}</Typography>
            <Typography>Expires At: {formatDate(data.expiresAt)}</Typography>
            <Typography>
              Total Clicks:{' '}
              <Chip label={data.clicks.length} color="primary" />
            </Typography>

            {data.clicks.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1">Click History:</Typography>
                <List>
                  {data.clicks.map((click, idx) => (
                    <ListItem key={idx} alignItems="flex-start" divider>
                      <ListItemText
                        primary={`📅 ${formatDate(click.timestamp)}`}
                        secondary={`Source: ${click.source} | Location: ${click.location}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
};

export default StatsPage;
