import React from 'react';
import { Handle } from '@xyflow/react';
import { Box, Typography } from '@mui/joy';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import BaseNode from './BaseNode';

const styles = {
    node: {
      backgroundColor: 'background.surface',
      borderColor: 'primary.500',
      '&:hover': {
        borderColor: 'primary.600',
      }
    },
    handle: {
      background: '#fff',
      border: '2px solid #3399ff'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      p: 1
    },
    iconContainer: {
      bgcolor: 'primary.softBg',
      p: 1,
      borderRadius: 'sm',
      display: 'flex',
      alignItems: 'center'
    },
    title: {
      flex: 1
    },
    footer: {
      p: 1,
      borderTop: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }
  };

const InputNode = ({ data, isConnectable, selected }) => (
  <BaseNode type="input" selected={selected} styles={styles.node}>
    <Handle
      type="source"
      position="right"
      style={styles.handle}
      isConnectable={isConnectable}
    />
    
    <Box sx={styles.header}>
      <Box sx={styles.iconContainer}>
        <InputOutlinedIcon color="primary" />
      </Box>
      <Typography level="title-sm" sx={styles.title}>
        {data.label}
      </Typography>
    </Box>
  </BaseNode>
);

export default InputNode;