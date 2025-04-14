import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/joy';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

export const SaveIndicator = ({ status, lastSaved, sidebarVisible }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <CircularProgress size="sm" />,
          text: 'Saving...',
          color: 'neutral'
        };
      case 'saved':
        return {
          icon: <CheckCircleOutlinedIcon color="success" />,
          text: `Last saved ${lastSaved ? new Date(lastSaved).toLocaleTimeString() : ''}`,
          color: 'success'
        };
      case 'error':
        return {
          icon: <ErrorOutlineIcon color="danger" />,
          text: 'Save failed',
          color: 'danger'
        };
      case 'pending':
        return {
          icon: <CloudSyncIcon />,
          text: 'Unsaved changes',
          color: 'warning'
        };
      default:
        return null;
    }
  };

  const display = getStatusDisplay();
  if (!display) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        right: sidebarVisible ? 316 : 16, // 300px sidebar + 16px padding
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'background.surface',
        p: 1,
        px: 2,
        borderRadius: 'md',
        boxShadow: 'sm',
        zIndex: 1000,
        transition: 'right 0.3s ease', // Smooth transition when sidebar opens/closes
      }}
    >
      {display.icon}
      <Typography level="body-sm" color={display.color}>
        {display.text}
      </Typography>
    </Box>
  );
};