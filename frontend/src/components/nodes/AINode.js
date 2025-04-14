import React, { useState } from 'react';
import { Handle } from '@xyflow/react';
import { Box, Typography, IconButton, Modal, ModalDialog, DialogTitle } from '@mui/joy';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import BaseNode from './BaseNode';

const styles = {
  node: {
    backgroundColor: 'background.surface',
    borderColor: 'warning.500',
    '&:hover': {
      borderColor: 'warning.600',
    }
  },
  handle: {
    background: '#fff',
    border: '2px solid #ffaa00'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    p: 1
  },
  iconContainer: {
    bgcolor: 'warning.softBg',
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
    borderColor: 'divider',
    position: 'relative',
  },
  promptPreview: {
    color: 'text.secondary',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontSize: 'xs',
    maxHeight: '2.4em',
    lineHeight: '1.2em',
    position: 'relative',
  },
  previewButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    opacity: 0,
    transition: 'opacity 0.2s',
    backgroundColor: 'background.surface',
    boxShadow: 'sm',
    '&:hover': {
      backgroundColor: 'background.level1',
    }
  },
  previewContainer: {
    '&:hover': {
      '& .preview-button': {
        opacity: 1
      }
    }
  },
  modalContent: {
    maxHeight: '60vh',
    overflowY: 'auto',
    p: 2,
    whiteSpace: 'pre-wrap'
  }
};

const AINode = ({ data, isConnectable, selected }) => {
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  
  const hasLongPrompt = data.prompt && data.prompt.length > 100;
  const previewText = data.prompt 
    ? (hasLongPrompt ? `${data.prompt.slice(0, 30)}...` : data.prompt)
    : 'No prompt configured';

  return (
    <>
      <BaseNode type="ai" selected={selected} styles={styles.node}>
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
            <SmartToyOutlinedIcon color="warning" sx={{ fontSize: 20 }} />
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
          <Box sx={styles.previewContainer}>
            <Typography level="body-xs" sx={styles.promptPreview}>
              {previewText}
            </Typography>
            {hasLongPrompt && (
              <IconButton
                className="preview-button"
                size="sm"
                variant="soft"
                color="neutral"
                sx={styles.previewButton}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowFullPrompt(true);
                }}
              >
                <PreviewOutlinedIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </BaseNode>

      <Modal 
        open={showFullPrompt} 
        onClose={() => setShowFullPrompt(false)}
      >
        <ModalDialog 
          sx={{ 
            width: '60%',
            maxWidth: '800px',
            maxHeight: '80vh'
          }}
        >
          <DialogTitle>Prompt Preview</DialogTitle>
          <Typography 
            level="body-sm" 
            sx={styles.modalContent}
          >
            {data.prompt || 'No prompt configured'}
          </Typography>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default AINode;