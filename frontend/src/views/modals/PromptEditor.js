// PromptEditor.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalDialog,
  DialogTitle,
  Textarea,
  Box,
  Button
} from '@mui/joy';

export default function PromptEditor({ 
  open, 
  onClose,
  selectedNode,
  onSave 
}) {
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    // Initialize prompt from node data if it exists
    if (selectedNode?.data?.prompt) {
      setPrompt(selectedNode.data.prompt);
    } else {
      setPrompt('');
    }
  }, [selectedNode]);

  const handleSave = () => {
    onSave?.(prompt);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: '60%', height: '80%' }}>
        <DialogTitle>Prompt Editor</DialogTitle>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          minRows={15}
          placeholder="Write your detailed prompt here..."
          sx={{ width: '100%', height: '100%' }}
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="plain" color="neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}