import React from 'react';
import { Card } from '@mui/joy';

const BaseNode = ({ children, type, selected, styles }) => (
  <Card
    variant="outlined"
    sx={{
      minWidth: '180px',
      border: '1px solid',
      borderRadius: 'md',
      transition: 'all 0.2s',
      borderWidth: selected ? '2px' : '1px',
      boxShadow: selected ? 'md' : 'sm',
      '&:hover': {
        boxShadow: 'md',
        transform: 'translateY(-2px)'
      },
      ...styles
    }}
  >
    {children}
  </Card>
);

export default BaseNode;