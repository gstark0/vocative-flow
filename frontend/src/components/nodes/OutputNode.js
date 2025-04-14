import React from 'react';
import { Handle } from '@xyflow/react';
import { Box, Typography } from '@mui/joy';
import OutputOutlinedIcon from '@mui/icons-material/OutputOutlined';
import BaseNode from './BaseNode';

export const styles = {
    node: {
      backgroundColor: 'background.surface',
      borderColor: 'success.500',
      '&:hover': {
        borderColor: 'success.600',
      }
    },
    handle: {
      background: '#fff',
      border: '2px solid #33cc33'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      p: 1
    },
    iconContainer: {
      bgcolor: 'success.softBg',
      p: 1,
      borderRadius: 'sm',
      display: 'flex',
      alignItems: 'center'
    },
    title: {
      flex: 1
    }
  };

const OutputNode = ({ data, isConnectable, selected }) => (
  <BaseNode type="output" selected={selected} styles={styles.node}>
    <Handle
      type="target"
      position="left"
      style={styles.handle}
      isConnectable={isConnectable}
    />
    
    <Box sx={styles.header}>
      <Box sx={styles.iconContainer}>
        <OutputOutlinedIcon color="success" />
      </Box>
      <Typography level="title-sm" sx={styles.title}>
        {data.label}
      </Typography>
    </Box>
  </BaseNode>
);

export default OutputNode;