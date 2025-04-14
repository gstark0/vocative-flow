import React from 'react';
import { Handle } from '@xyflow/react';
import { Box, Typography, IconButton } from '@mui/joy';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BaseNode from './BaseNode';

export const styles = {
    node: {
      backgroundColor: 'background.surface',
      borderColor: 'info.500',
      '&:hover': {
        borderColor: 'info.600',
      }
    },
    handle: {
      background: '#fff',
      border: '2px solid #00aaff'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      p: 1
    },
    iconContainer: {
        bgcolor: 'neutral.softBg',
        p: 1,
        borderRadius: 'sm',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32, 
        height: 32,
      },
    title: {
      flex: 1
    },
    content: {
      p: 1,
      borderTop: '1px solid',
      borderColor: 'divider'
    },
    codeText: {
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      fontFamily: 'code'
    }
  };

const CodeNode = ({ data, isConnectable, selected }) => (
  <BaseNode type="code" selected={selected} styles={styles.node}>
    <Handle
      type="target"
      position="left"
      style={styles.handle}
      isConnectable={isConnectable}
    />
    <Handle
      type="source"
      position="right"
      style={styles.handle}
      isConnectable={isConnectable}
    />
    
    <Box sx={styles.header}>
      <Box sx={styles.iconContainer}>
        <CodeOutlinedIcon color="info" />
      </Box>
      <Typography level="title-sm" sx={styles.title}>
        {data.label}
      </Typography>
      <IconButton 
        variant="plain" 
        color="neutral" 
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          data.onSettings?.(data);
        }}
      >
        <SettingsOutlinedIcon />
      </IconButton>
    </Box>
    
    <Box sx={styles.content}>
      <Typography level="body-xs" sx={styles.codeText}>
        {data.code || 'No code configured'}
      </Typography>
    </Box>
  </BaseNode>
);

export default CodeNode;