import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalDialog,
  DialogTitle,
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  Sheet,
  Tooltip,
  Chip
} from '@mui/joy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

export default function CodeEditor({
  open,
  onClose,
  selectedNode,
  onSave
}) {
  const [code, setCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const codeWrapperRef = useRef(null);
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const highlightTimeout = useRef(null);
  
  const defaultPythonCode = `# Sample Python function
def process_data(input_data):
    """
    Process the input data and return a result
    Args:
        input_data: The data to be processed
    Returns:
        Processed data
    """
    # TODO: Implement your data processing logic here
    result = input_data
    
    # Sample transformation
    if isinstance(input_data, dict):
        result = {k: v * 2 if isinstance(v, (int, float)) else v 
                  for k, v in input_data.items()}
    elif isinstance(input_data, list):
        result = [x * 2 if isinstance(x, (int, float)) else x 
                  for x in input_data]
    
    return result

# Example usage
if __name__ == "__main__":
    sample_data = {"values": [1, 2, 3], "name": "test"}
    processed = process_data(sample_data)
    print(f"Input: {sample_data}")
    print(f"Output: {processed}")
`;

  useEffect(() => {
    // Initialize code from node data if it exists
    if (selectedNode?.data?.code) {
      setCode(selectedNode.data.code);
    } else {
      setCode(defaultPythonCode);
    }
  }, [selectedNode]);

  useEffect(() => {
    // Apply syntax highlighting when modal opens
    if (open) {
      // Clear any existing timeout
      if (highlightTimeout.current) {
        clearTimeout(highlightTimeout.current);
      }
      
      // Use a short timeout to ensure the DOM is ready
      highlightTimeout.current = setTimeout(() => {
        Prism.highlightAll();
        
        // Ensure scrolling is synchronized
        if (textareaRef.current && preRef.current) {
          syncScroll();
        }
      }, 50);
    }
    
    // Cleanup timeout on component unmount
    return () => {
      if (highlightTimeout.current) {
        clearTimeout(highlightTimeout.current);
      }
    };
  }, [open]);
  
  // Also apply highlighting when code changes
  useEffect(() => {
    if (open) {
      // Use a short timeout to ensure the DOM is ready
      if (highlightTimeout.current) {
        clearTimeout(highlightTimeout.current);
      }
      
      highlightTimeout.current = setTimeout(() => {
        Prism.highlightAll();
      }, 10);
    }
  }, [code, open]);
  
  // Synchronize scrolling between textarea and preview
  const syncScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleSave = () => {
    onSave?.(code);
    onClose();
  };
  
  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  // Handle tab key in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insert 4 spaces for tab
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newValue);
      
      // Move cursor to after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: '80%',
          maxWidth: '1000px',
          height: '85%',
          maxHeight: '800px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'lg'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          pl: 3
        }}>
          <DialogTitle sx={{ m: 0, p: 0, fontWeight: 600 }}>Python Code Editor</DialogTitle>
          <IconButton size="sm" variant="plain" color="neutral" onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        {/* Toolbar */}
        <Sheet 
          variant="outlined" 
          sx={{ 
            p: 1.5, 
            mx: 2.5, 
            mt: 2, 
            mb: 1, 
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
              startDecorator={<CodeIcon fontSize="small" />}
            >
              {selectedNode?.data?.label || 'Code Node'}
            </Chip>
            <Typography level="body-sm" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              Python script for data processing
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
        
        {/* Help and Tips */}
        <Box sx={{ px: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Help text */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.tertiary' }} />
            <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
              Write Python code that processes the input data. Your code will run when this node is executed.
              <br />
              Tip: Connect this code node to an output node to see your exact returned output when testing.
            </Typography>
          </Box>
          

        </Box>
        
        {/* Code Editor */}
        <Box 
          ref={codeWrapperRef}
          sx={{
            flex: 1,
            mx: 2.5,
            mb: 2.5,
            mt: 1.5,
            position: 'relative',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 'md',
            overflow: 'hidden',
            minHeight: '350px', // Ensure substantial height
            ':hover': {
              borderColor: 'neutral.outlinedHoverBorder',
            },
            ':focus-within': {
              borderColor: 'primary.500',
              boxShadow: '0 0 0 2px rgba(0, 127, 255, 0.2)',
            }
          }}
        >
          {/* Hidden textarea for editing */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              padding: '16px',
              paddingLeft: '50px', // Space for line numbers
              color: 'rgba(255,255,255,0.01)', // Almost invisible but keeps cursor visible
              caretColor: 'white',
              background: 'transparent',
              fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              overflow: 'auto',
              whiteSpace: 'pre',
              resize: 'none',
              zIndex: 2,
              border: 'none',
              outline: 'none',
              tabSize: 4,
            }}
            spellCheck="false"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            data-gramm="false"
          />
          
          {/* Syntax highlighted display layer */}
          <pre
            ref={preRef}
            aria-hidden="true"
            style={{
              margin: 0,
              padding: '16px',
              paddingLeft: '50px', // Space for line numbers
              background: '#2d2d2d',
              color: '#ccc',
              fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              overflow: 'auto',
              whiteSpace: 'pre',
              tabSize: 4,
              pointerEvents: 'none',
              height: '100%',
              position: 'relative',
            }}
          >
            {/* Line numbers */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40px',
              height: '100%',
              padding: '16px 0',
              background: '#222',
              color: '#666',
              textAlign: 'right',
              userSelect: 'none',
              borderRight: '1px solid #3a3a3a',
              fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: 1.5,
            }}>
              {code.split('\n').map((_, i) => (
                <div key={i} style={{ paddingRight: '8px' }}>{i + 1}</div>
              ))}
            </div>
            <code className="language-python">{code}</code>
          </pre>
        </Box>
        
        {/* Footer */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          justifyContent: 'space-between', 
          p: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.level1',
          mx: -2, // Extend beyond padding
          mb: -2, // Extend to bottom
          mt: 'auto' // Push to bottom
        }}>
          <Typography level="body-sm" color="text.tertiary" sx={{ alignSelf: 'center' }}>
            Press Tab to indent (4 spaces)
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1.5 }}>
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
              sx={{ mr: 2 }} // Adjust for negative margin
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}