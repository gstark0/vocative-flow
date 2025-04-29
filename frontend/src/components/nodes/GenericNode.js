import React, { useState } from 'react';
import { Handle } from '@xyflow/react';
import { Box, Typography, IconButton, Modal, ModalDialog, DialogTitle } from '@mui/joy';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import BaseNode from './BaseNode';
import { NODE_CONFIG } from '../../config/nodeConfig';

// Helper function to highlight template variables in preview if needed
const highlightVariables = (text, highlightStyle) => {
  if (!text) return null;
  
  // Only process if the text might contain variables
  if (!text.includes('{{')) return text;
  
  // Split by variable pattern {{var}}
  const parts = text.split(/(\{\{[^{}]+\}\})/g);
  
  return parts.map((part, index) => {
    // Check if this part is a variable
    if (part.match(/^\{\{[^{}]+\}\}$/)) {
      return (
        <Box component="span" key={index} sx={highlightStyle}>
          {part}
        </Box>
      );
    }
    return part;
  });
};

const GenericNode = ({ data, isConnectable, selected, nodeType }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  // Get node configuration based on type
  const config = NODE_CONFIG[nodeType];
  if (!config) return null;
  
  // Determine content field based on node type (prompt, code, template, etc.)
  const contentField = 
    nodeType === 'ai_node' ? 'prompt' : 
    nodeType === 'code_node' ? 'code' : 
    nodeType === 'template_node' ? 'template' : '';
  
  // Get content and prepare preview
  const content = data[contentField];
  const hasLongContent = content && content.length > 100;
  const previewText = content 
    ? (hasLongContent ? `${content.slice(0, 30)}...` : content)
    : `No ${contentField} configured`;
  
  // Determine modal title based on node type
  const modalTitle = 
    nodeType === 'ai_node' ? 'Prompt Preview' : 
    nodeType === 'code_node' ? 'Code Preview' : 
    nodeType === 'template_node' ? 'Template Preview' : 'Content Preview';

  // Create styles based on node configuration
  const styles = {
    node: {
      backgroundColor: 'background.surface',
      borderColor: config.colors.border,
      '&:hover': {
        borderColor: config.colors.border,
      }
    },
    handle: {
      background: '#fff',
      border: `2px solid ${config.colors.handle}`
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      p: 1
    },
    iconContainer: {
      bgcolor: config.colors.softBg,
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
    contentPreview: {
      color: 'text.secondary',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      fontSize: 'xs',
      maxHeight: '2.4em',
      lineHeight: '1.2em',
      position: 'relative',
      ...(nodeType === 'code_node' ? { fontFamily: 'code' } : {}),
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
      whiteSpace: 'pre-wrap',
      ...(nodeType === 'code_node' ? { fontFamily: 'code' } : {}),
    },
    variables: {
      color: config.colors.text,
      fontWeight: 600
    }
  };

  return (
    <>
      <BaseNode type={config.type} selected={selected} styles={styles.node}>
        {config.hasTargetHandle && (
          <Handle
            type="target"
            position="left"
            style={styles.handle}
            isConnectable={isConnectable}
          />
        )}
        
        {config.hasSourceHandle && (
          <Handle
            type="source"
            position="right"
            style={styles.handle}
            isConnectable={isConnectable}
          />
        )}
        
        <Box sx={styles.header}>
          <Box sx={styles.iconContainer}>
            {React.cloneElement(config.icon(), { 
              sx: { fontSize: 20 }, 
              color: config.colors.muiColor 
            })}
          </Box>
          <Typography level="title-sm" sx={styles.title}>
            {data.label || config.label}
          </Typography>
          
          {/* Only show settings button for nodes that have editable content */}
          {contentField && (
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
          )}
        </Box>
        
        {/* Only show content area for nodes that have content */}
        {contentField && (
          <Box sx={styles.content}>
            <Box sx={styles.previewContainer}>
              <Typography level="body-xs" sx={styles.contentPreview}>
                {nodeType === 'template_node' 
                  ? highlightVariables(previewText, styles.variables)
                  : previewText}
              </Typography>
              {hasLongContent && (
                <IconButton
                  className="preview-button"
                  size="sm"
                  variant="soft"
                  color="neutral"
                  sx={styles.previewButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowFullContent(true);
                  }}
                >
                  <PreviewOutlinedIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        )}
      </BaseNode>

      {/* Preview modal - only shown when showFullContent is true */}
      {contentField && (
        <Modal 
          open={showFullContent} 
          onClose={() => setShowFullContent(false)}
        >
          <ModalDialog 
            sx={{ 
              width: '60%',
              maxWidth: '800px',
              maxHeight: '80vh'
            }}
          >
            <DialogTitle>{modalTitle}</DialogTitle>
            <Typography 
              level="body-sm" 
              sx={styles.modalContent}
            >
              {nodeType === 'template_node' && content
                ? highlightVariables(content, styles.variables)
                : content || `No ${contentField} configured`}
            </Typography>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
};

export default GenericNode;