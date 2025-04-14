import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalDialog,
  DialogTitle,
  Box,
  Typography,
  Input,
  Textarea,
  Button,
  IconButton,
  Divider,
  Card,
  AspectRatio,
  Chip
} from '@mui/joy';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function ExamplesEditor({
  open,
  onClose,
  selectedNode,
  onUpdateExamples
}) {
  const [examples, setExamples] = useState([]);
  const [selectedExample, setSelectedExample] = useState(null);
  const [exampleName, setExampleName] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const [exampleOutput, setExampleOutput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  useEffect(() => {
    if (selectedNode?.data?.examples) {
      setExamples(selectedNode.data.examples);
    } else {
      setExamples([]);
    }
  }, [selectedNode]);

  // Handle panel animations
  const showPanel = () => {
    setIsPanelVisible(true);
    // Small delay to trigger animation after panel is rendered
    setTimeout(() => setIsAdding(true), 50);
  };

  const hidePanel = () => {
    setIsAdding(false);
    // Wait for slide out animation before removing panel
    setTimeout(() => setIsPanelVisible(false), 300);
  };

  const resetForm = () => {
    setSelectedExample(null);
    setExampleName('');
    setExampleInput('');
    setExampleOutput('');
    hidePanel();
  };

  const handleAddExample = () => {
    if (!exampleName || !exampleInput || !exampleOutput) {
      return;
    }

    const newExample = {
      name: exampleName,
      input: exampleInput,
      output: exampleOutput
    };

    const updatedExamples = [...examples, newExample];
    setExamples(updatedExamples);
    onUpdateExamples?.(updatedExamples);
    resetForm();
  };

  const handleEditExample = (index) => {
    const example = examples[index];
    setSelectedExample(index);
    setExampleName(example.name);
    setExampleInput(example.input);
    setExampleOutput(example.output);
    showPanel();
  };

  const handleUpdateExample = () => {
    if (selectedExample === null) return;

    const updatedExamples = [...examples];
    updatedExamples[selectedExample] = {
      name: exampleName,
      input: exampleInput,
      output: exampleOutput
    };

    setExamples(updatedExamples);
    onUpdateExamples?.(updatedExamples);
    resetForm();
  };

  const handleDeleteExample = (index) => {
    const updatedExamples = examples.filter((_, i) => i !== index);
    setExamples(updatedExamples);
    onUpdateExamples?.(updatedExamples);
    if (selectedExample === index) {
      resetForm();
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
            Examples Library
          </DialogTitle>
          <IconButton onClick={onClose} variant="plain">
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={{ 
          display: 'flex',
          gap: 3,
          height: 'calc(100% - 60px)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Examples List */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
            overflow: 'hidden',
            flex: 1
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography level="title-lg">
                {examples.length} Example{examples.length !== 1 ? 's' : ''}
              </Typography>
              <Button 
                startDecorator={<AddIcon />}
                onClick={showPanel}
                size="sm"
              >
                Add Example
              </Button>
            </Box>

            <Box sx={{ 
              flex: 1,
              overflowY: 'auto',
              pr: 1
            }}>
              {examples.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {examples.map((example, index) => (
                    <Card
                      key={index}
                      variant="outlined"
                      sx={{ 
                        '--Card-padding': '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.500',
                          boxShadow: 'sm'
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1
                      }}>
                        <Typography level="title-md">
                          {example.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="sm"
                            variant="plain"
                            color="neutral"
                            onClick={() => handleEditExample(index)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="plain"
                            color="danger"
                            onClick={() => handleDeleteExample(index)}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip size="sm" variant="soft">Input: {example.input.length} chars</Chip>
                        <Chip size="sm" variant="soft">Output: {example.output.length} chars</Chip>
                      </Box>
                      <Typography level="body-sm" sx={{ 
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {example.input}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: 2,
                    color: 'text.secondary'
                  }}
                >
                  <Typography level="body-lg">No examples yet</Typography>
                  <Button 
                    startDecorator={<AddIcon />}
                    onClick={showPanel}
                  >
                    Add Your First Example
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Sliding Form Panel */}
          {isPanelVisible && (
            <Box
              sx={{
                width: '50%',
                height: '100%',
                position: 'absolute',
                right: 0,
                top: 0,
                backgroundColor: 'background.surface',
                boxShadow: 'lg',
                transform: isAdding ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                borderRadius: 'lg',
                display: 'flex',
                flexDirection: 'column',
                p: 3
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography level="title-lg">
                  {selectedExample !== null ? 'Edit Example' : 'New Example'}
                </Typography>
                <IconButton 
                  onClick={resetForm}
                  variant="outlined"
                  size="sm"
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                flex: 1,
                overflowY: 'auto',
                pr: 1
              }}>
                <Input
                  placeholder="Example Name"
                  value={exampleName}
                  onChange={(e) => setExampleName(e.target.value)}
                  size="lg"
                />
                <Textarea
                  placeholder="Input"
                  minRows={4}
                  value={exampleInput}
                  onChange={(e) => setExampleInput(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Textarea
                  placeholder="Output"
                  minRows={4}
                  value={exampleOutput}
                  onChange={(e) => setExampleOutput(e.target.value)}
                  sx={{ flex: 1 }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                {selectedExample !== null ? (
                  <Button 
                    size="lg"
                    onClick={handleUpdateExample}
                    disabled={!exampleName || !exampleInput || !exampleOutput}
                  >
                    Update Example
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    onClick={handleAddExample}
                    disabled={!exampleName || !exampleInput || !exampleOutput}
                  >
                    Add Example
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </ModalDialog>
    </Modal>
  );
}