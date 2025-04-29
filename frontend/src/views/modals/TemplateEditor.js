import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalDialog,
  DialogTitle,
  Textarea,
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  Sheet,
  Tooltip,
  Chip
} from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CodeIcon from '@mui/icons-material/Code';

export default function TemplateEditor({
  open,
  onClose,
  selectedNode,
  onSave,
  availableVariables
}) {
  const [template, setTemplate] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const textareaRef = useRef(null);
  
  useEffect(() => {
    // Initialize template from node data if it exists
    if (selectedNode?.data?.template) {
      setTemplate(selectedNode.data.template);
      setCharCount(selectedNode.data.template.length);
    } else {
      setTemplate('');
      setCharCount(0);
    }
  }, [selectedNode]);
  
  // Update character count when template changes
  const handleTemplateChange = (e) => {
    const newTemplate = e.target.value;
    setTemplate(newTemplate);
    setCharCount(newTemplate.length);
  };
  
  const handleSave = () => {
    onSave?.(template);
    onClose();
  };
  
  // Copy template to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(template);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };
  
  // Helper function to insert a variable at cursor position
  const insertVariable = (variable) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const variableText = `{{${variable}}}`;
    
    // Get current cursor position
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Use functional form of setState to ensure we're working with latest state
    setTemplate(prevTemplate => 
      prevTemplate.substring(0, start) + 
      variableText + 
      prevTemplate.substring(end)
    );
    
    // Set focus and update cursor position in next tick
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + variableText.length;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 10);
  };
  
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog 
        variant="outlined"
        sx={{ 
          width: '80%', 
          maxWidth: '900px',
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 'lg',
          boxShadow: 'lg',
          height: 'auto'
        }}
      >
        {/* Header with title and close button */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          pl: 3,
          bgcolor: 'background.surface'
        }}>
          <DialogTitle sx={{ m: 0, p: 0, fontWeight: 600 }}>Template Editor</DialogTitle>
          <IconButton size="sm" variant="plain" color="neutral" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        {/* Main content area */}
        <Box sx={{ p: 2.5, flex: '1 1 auto' }}>
          {/* Toolbar */}
          <Sheet 
            variant="outlined" 
            sx={{ 
              p: 1.5, 
              mb: 2,
              borderRadius: 'md',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'background.level1'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip 
                size="sm" 
                variant="soft" 
                color="neutral"
                startDecorator={<DescriptionOutlinedIcon fontSize="small" />}
              >
                {selectedNode?.data?.label || 'Template Node'}
              </Chip>
              <Typography level="body-sm" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                Output formatting template
              </Typography>
            </Box>
            
            <Tooltip title={copySuccess ? "Copied!" : "Copy to clipboard"} placement="top">
              <Button 
                size="sm" 
                variant={copySuccess ? "solid" : "soft"}
                color={copySuccess ? "success" : "neutral"}
                startDecorator={<ContentCopyIcon fontSize="small" />}
                onClick={handleCopy}
              >
                {copySuccess ? "Copied" : "Copy"}
              </Button>
            </Tooltip>
          </Sheet>
          
          {/* Variable buttons */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.8, 
              mb: 1.5 
            }}>
              <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.tertiary' }} />
              <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
                Available variables (click to insert):
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 1,
              maxHeight: availableVariables.length > 10 ? '120px' : 'auto',
              overflowY: availableVariables.length > 10 ? 'auto' : 'visible',
              pr: availableVariables.length > 10 ? 1 : 0,
              pb: 1
            }}>
              {availableVariables.map((variable) => (
                <Button
                  key={variable}
                  size="sm"
                  variant="soft"
                  color="primary"
                  startDecorator={<CodeIcon fontSize="small" />}
                  onClick={() => insertVariable(variable)}
                  sx={{ 
                    borderRadius: 'md',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'primary.softHoverBg',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {`{{${variable}}}`}
                </Button>
              ))}
            </Box>
          </Box>
          
          {/* Text editor area */}
          <Box 
            sx={{ 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'md',
              overflow: 'hidden',
              height: '350px'
            }}
          >
            <Textarea
              value={template}
              onChange={handleTemplateChange}
              placeholder="# Title of your report&#13;&#13;## Introduction&#13;&#13;This report analyzes {{input}} and produces {{result}} ..."
              minRows={14}
              maxRows={14}
              sx={{
                flex: 1,
                border: 'none',
                borderRadius: 0,
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: 1.5,
                padding: '16px',
                '--Textarea-focusedHighlight': 'none',
                '&::before': { display: 'none' },
                '&:focus-within': { boxShadow: 'none' },
                overflow: 'auto',
                height: '100%',
                '&::placeholder': {
                  color: 'text.tertiary',
                  opacity: 0.8
                }
              }}
              slotProps={{
                textarea: {
                  ref: textareaRef,
                  id: 'template-textarea'
                }
              }}
            />
            
            {/* Character count */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 8, 
              right: 8, 
              px: 1,
              py: 0.5, 
              borderRadius: 'sm',
              bgcolor: 'background.level1',
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography level="body-xs" sx={{ color: 'text.tertiary', fontWeight: 500 }}>
                {charCount} characters
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Action buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          justifyContent: 'flex-end', 
          p: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.level1',
          mx: -2,  // Extend to modal edges
          mb: -2,  // Extend to bottom edge
          mt: 'auto' // Push to bottom
        }}>
          <Button 
            variant="plain" 
            color="neutral" 
            onClick={onClose}
            size="md"
          >
            Cancel
          </Button>
          <Button 
            variant="solid" 
            color="primary" 
            startDecorator={<SaveIcon />}
            onClick={handleSave}
            size="md"
            sx={{ mr: 2 }} // Add right margin to account for negative margin
          >
            Save Changes
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}