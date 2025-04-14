import React from 'react';
import { 
  Box,
  Typography,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Card,
  Button,
  Divider
} from '@mui/joy';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';

export default function NodeDetailsSidebar({
  visible,
  selectedNode,
  onClose,
  onNodeNameChange,
  openPromptModal,
  openExamplesModal,
  openCodeEditor,
  prompt = ''
}) {
  // Function to render type-specific controls
  const renderNodeTypeControls = () => {
    if (!selectedNode) return null;
    
    const nodeType = selectedNode.type;
    
    switch (nodeType) {
      case 'ai_node':
        return (
          <>
            {/* Prompt Preview */}
            <Card sx={{ mt: 2, p: 2 }}>
              <Typography level="title-md">Prompt Preview</Typography>
              <Typography
                level="body"
                sx={{
                  mt: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {prompt || 'No prompt provided yet'}
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 1 }} 
                onClick={openPromptModal}
                startDecorator={<EditOutlinedIcon />}
              >
                Editor
              </Button>
            </Card>

            {/* Examples */}
            <Card sx={{ mt: 2, p: 2 }}>
              <Typography level="title-md">Examples</Typography>
              <Typography level="body">
                This node has {selectedNode.data.examples?.length || 0} example(s)
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 1 }} 
                onClick={openExamplesModal}
              >
                Manage Examples
              </Button>
            </Card>
          </>
        );
        
      case 'code_node':
        return (
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography level="title-md">Code Editor</Typography>
            <Typography
              level="body"
              sx={{
                mt: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {selectedNode.data.code ? 
                `${selectedNode.data.code.substring(0, 50)}...` : 
                'No code written yet'}
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 1 }} 
              onClick={openCodeEditor}
              startDecorator={<CodeOutlinedIcon />}
            >
              Edit Code
            </Button>
          </Card>
        );
        
      case 'input_node':
        return (
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography level="title-md">Input Configuration</Typography>
            <FormControl sx={{ mt: 1 }}>
              <FormLabel>Input Description</FormLabel>
              <Input 
                placeholder="Describe expected input..."
                value={selectedNode.data.inputDescription || ''}
                onChange={(e) => {
                  // You'll need to implement this handler
                  // onInputDescriptionChange(e.target.value);
                }}
              />
            </FormControl>
          </Card>
        );
        
      case 'output_node':
        return (
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography level="title-md">Output Format</Typography>
            <FormControl sx={{ mt: 1 }}>
              <FormLabel>Output Format</FormLabel>
              <Input 
                placeholder="Specify output format..."
                value={selectedNode.data.outputFormat || ''}
                onChange={(e) => {
                  // You'll need to implement this handler
                  // onOutputFormatChange(e.target.value);
                }}
              />
            </FormControl>
          </Card>
        );
        
      default:
        return (
          <Typography level="body">
            No specific options for this node type.
          </Typography>
        );
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        right: visible ? 0 : '-300px',
        top: 0,
        width: 300,
        height: '100%',
        backgroundColor: 'background.level1',
        padding: 2,
        transition: 'right 0.3s ease',
        boxShadow: visible ? '0px 0px 15px rgba(0, 0, 0, 0.1)' : 'none',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography level="h6">Node Details</Typography>
        <IconButton onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </Box>

      {selectedNode ? (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography level="body2" color="neutral.500">Node Type</Typography>
            <Typography level="body1" fontWeight="bold">
              {selectedNode.type === 'ai_node' ? 'AI Node' : 
               selectedNode.type === 'code_node' ? 'Code Node' :
               selectedNode.type === 'input_node' ? 'Input Node' :
               selectedNode.type === 'output_node' ? 'Output Node' : 
               'Unknown Node Type'}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />
          
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Node Name</FormLabel>
            <Input
              value={selectedNode.data.label}
              onChange={onNodeNameChange}
            />
          </FormControl>

          <Divider sx={{ my: 1 }} />
          
          {/* Node type specific controls */}
          {renderNodeTypeControls()}
        </>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%' 
        }}>
          <Typography color="neutral.500">No node selected</Typography>
        </Box>
      )}
    </Box>
  );
}