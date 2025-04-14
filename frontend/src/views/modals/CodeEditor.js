import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalDialog,
  DialogTitle,
  Box,
  Button,
  IconButton,
  Typography
} from '@mui/joy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css'; // You can choose different themes

export default function CodeEditor({
  open,
  onClose,
  selectedNode,
  onSave
}) {
  const [code, setCode] = useState('');
  const editorRef = useRef(null);
  
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
        // Apply syntax highlighting whenever code changes
        if (open) {
        Prism.highlightAll();
        }
    }, [code, open]);

  const handleSave = () => {
    onSave?.(code);
    onClose();
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
          p: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2 
        }}>
          <DialogTitle level="h3" sx={{ p: 0 }}>
            Python Code Editor
          </DialogTitle>
          <IconButton onClick={onClose} variant="plain">
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={{
          height: 'calc(100% - 80px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {/* Code editor with syntax highlighting */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              border: '1px solid',
              borderColor: 'neutral.outlinedBorder',
              borderRadius: 'md',
              overflow: 'hidden',
              '&:focus-within': {
                borderColor: 'primary.500',
                boxShadow: '0 0 0 3px rgba(144, 202, 249, 0.5)',
              },
            }}
          >
            {/* Hidden textarea for editing */}
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                padding: '16px',
                color: 'transparent',
                background: 'transparent',
                caretColor: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                overflow: 'auto',
                whiteSpace: 'pre',
                resize: 'none',
                zIndex: 1,
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
              aria-hidden="true"
              style={{
                margin: 0,
                padding: '16px',
                background: '#2d2d2d',
                color: '#ccc',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                overflow: 'auto',
                whiteSpace: 'pre',
                tabSize: 4,
                pointerEvents: 'none',
                height: '100%',
              }}
            >
              <code className="language-python">{code}</code>
            </pre>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography level="body-sm" color="neutral.500">
                Press Tab to indent, Shift+Tab to unindent (coming soon)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="plain" color="neutral" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}