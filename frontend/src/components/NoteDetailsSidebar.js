import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Input,
  Card,
  Button,
  Sheet,
  Chip,
  Stack,
  Divider,
  Tooltip
} from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { NODE_TYPES, NODE_CONFIG } from '../config/nodeConfig';

export default function NodeDetailsSidebar({
  visible,
  selectedNode,
  onClose,
  onNodeNameChange,
  selectedNodeInputs,
  selectedNodeOutputs,
  openPromptModal,
  openExamplesModal,
  openTemplateEditor,
  openCodeEditor,
  prompt = ''
}) {
  // Get node type info from the centralized configuration
  const getNodeInfo = (nodeType) => {
    const config = NODE_CONFIG[nodeType] || {
      type: 'unknown',
      label: 'Unknown Node',
      colors: { 
        border: '#888888', 
        softBg: 'rgba(136, 136, 136, 0.1)',
        text: '#888888'
      },
      icon: () => <SettingsIcon />,
      description: 'Node type not recognized.'
    };
    
    return {
      title: config.label,
      icon: config.icon(),
      color: config.colors.muiColor || 'neutral',
      description: config.description,
      // Additional properties used in styles
      borderColor: config.colors.border,
      softBg: config.colors.softBg,
      textColor: config.colors.text
    };
  };

  // Get the appropriate node content based on node type
  const renderNodeContent = () => {
    if (!selectedNode) return null;
    
    const nodeType = selectedNode.type;
    
    switch (nodeType) {
      case NODE_TYPES.AI:
        return (
          <Stack spacing={2.5}>
            {/* Prompt Section */}
            <Card variant="outlined" sx={{ 
              p: 0, 
              boxShadow: 'none', 
              overflow: 'hidden',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: 'sm' }
            }}>
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography level="title-sm">Prompt Template</Typography>
                <Chip
                  variant="soft"
                  color={prompt ? 'success' : 'neutral'}
                  size="sm"
                >
                  {prompt ? 'Configured' : 'Not Set'}
                </Chip>
              </Box>
              
              <Divider />
              
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.level1',
                height: '80px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {prompt ? (
                  <>
                    <Typography
                      level="body-xs"
                      sx={{
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {prompt}
                    </Typography>
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '30px',
                      background: 'linear-gradient(to bottom, transparent, var(--joy-palette-background-level1))'
                    }} />
                  </>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%' 
                  }}>
                    <Typography level="body-sm" color="text.tertiary">
                      No prompt configured yet
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ p: 2, pt: 1.5 }}>
                <Button
                  variant="soft"
                  color="neutral"
                  startDecorator={<EditIcon />}
                  size="sm"
                  onClick={openPromptModal}
                  fullWidth
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': { 
                      bgcolor: 'background.level2',
                    } 
                  }}
                >
                  Edit Prompt
                </Button>
              </Box>
            </Card>
            
            {/* Examples Section */}
            <Card variant="outlined" sx={{ 
              p: 0, 
              boxShadow: 'none',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: 'sm' }
            }}>
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography level="title-sm">Example Inputs/Outputs</Typography>
                <Chip
                  variant="soft"
                  color={(selectedNode.data.examples?.length || 0) > 0 ? 'success' : 'neutral'}
                  size="sm"
                >
                  {selectedNode.data.examples?.length || 0} Examples
                </Chip>
              </Box>
              
              <Divider />
              
              <Box sx={{ p: 2 }}>
                <Button
                  variant="soft"
                  color="neutral"
                  startDecorator={<FormatListBulletedIcon />}
                  size="sm"
                  onClick={openExamplesModal}
                  fullWidth
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': { 
                      bgcolor: 'background.level2',
                    } 
                  }}
                >
                  Manage Examples
                </Button>
              </Box>
            </Card>
            
            {/* Settings Section */}
            <Card variant="outlined" sx={{ 
              p: 0, 
              boxShadow: 'none',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: 'sm' }
            }}>
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography level="title-sm">Advanced Settings</Typography>
              </Box>
              
              <Divider />
              
              <Box sx={{ p: 2 }}>
                <Button
                  variant="soft"
                  color="neutral"
                  startDecorator={<SettingsIcon />}
                  size="sm"
                  fullWidth
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': { 
                      bgcolor: 'background.level2',
                    } 
                  }}
                >
                  Configure
                </Button>
              </Box>
            </Card>
          </Stack>
        );
        
      case NODE_TYPES.CODE:
        return (
          <Stack spacing={2.5}>
            <Card variant="outlined" sx={{ 
              p: 0, 
              boxShadow: 'none',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: 'sm' }
            }}>
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography level="title-sm">Code Editor</Typography>
                <Chip
                  variant="soft"
                  color={selectedNode.data.code ? 'success' : 'neutral'}
                  size="sm"
                >
                  {selectedNode.data.code ? 'Code Added' : 'Empty'}
                </Chip>
              </Box>
              
              <Divider />
              
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.level1',
                height: '80px',
                overflow: 'hidden',
                position: 'relative',
                fontFamily: 'monospace'
              }}>
                {selectedNode.data.code ? (
                  <>
                    <Typography
                      level="body-xs"
                      sx={{
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {selectedNode.data.code}
                    </Typography>
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '30px',
                      background: 'linear-gradient(to bottom, transparent, var(--joy-palette-background-level1))'
                    }} />
                  </>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%' 
                  }}>
                    <Typography level="body-sm" color="text.tertiary">
                      No code added yet
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ p: 2, pt: 1.5 }}>
                <Button
                  variant="soft"
                  color="neutral"
                  startDecorator={<CodeIcon />}
                  size="sm"
                  onClick={openCodeEditor}
                  fullWidth
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': { 
                      bgcolor: 'background.level2',
                    } 
                  }}
                >
                  Edit Code
                </Button>
              </Box>
            </Card>
          </Stack>
        );

      case NODE_TYPES.TEMPLATE:
        return (
          <Stack spacing={2.5}>
            {/* Template Section */}
            <Card variant="outlined" sx={{ 
              p: 0, 
              boxShadow: 'none', 
              overflow: 'hidden',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: 'sm' }
            }}>
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography level="title-sm">Template</Typography>
                <Chip
                  variant="soft"
                  color={selectedNode.data.template ? 'success' : 'neutral'}
                  size="sm"
                >
                  {selectedNode.data.template ? 'Configured' : 'Not Set'}
                </Chip>
              </Box>
              
              <Divider />
              
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.level1',
                height: '80px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {selectedNode.data.template ? (
                  <>
                    <Typography
                      level="body-xs"
                      sx={{
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {selectedNode.data.template}
                    </Typography>
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '30px',
                      background: 'linear-gradient(to bottom, transparent, var(--joy-palette-background-level1))'
                    }} />
                  </>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%' 
                  }}>
                    <Typography level="body-sm" color="text.tertiary">
                      No template configured yet
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ p: 2, pt: 1.5 }}>
                <Button
                  variant="soft"
                  color="neutral"
                  startDecorator={<EditIcon />}
                  size="sm"
                  onClick={openTemplateEditor}
                  fullWidth
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': { 
                      bgcolor: 'background.level2',
                    } 
                  }}
                >
                  Edit Template
                </Button>
              </Box>
            </Card>
            
            {/* Variables Section */}
            <Card variant="outlined" sx={{ 
              p: 0, 
              boxShadow: 'none',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: 'sm' }
            }}>
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography level="title-sm">Available Variables</Typography>
              </Box>
              
              <Divider />
              
              <Box sx={{ p: 2 }}>
                <Typography level="body-sm" sx={{ mb: 1.5, color: 'text.secondary' }}>
                  Use these variables in your template:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip size="sm" variant="soft" color="info">input</Chip>
                  <Chip size="sm" variant="soft" color="info">result</Chip>
                  <Chip size="sm" variant="soft" color="info">date</Chip>
                  <Chip size="sm" variant="soft" color="info">time</Chip>
                </Box>
              </Box>
            </Card>
          </Stack>
        );
        
      case NODE_TYPES.INPUT:
        return (
          <Stack spacing={2.5}>
            <Card variant="outlined" sx={{ 
              p: 0, 
              boxShadow: 'none',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: 'sm' }
            }}>
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography level="title-sm">Input Information</Typography>
              </Box>
              
              <Divider />
              
              <Box sx={{ p: 2 }}>
                <Typography level="body-sm" sx={{ mb: 2, color: 'text.secondary' }}>
                  This is the starting point of your workflow. All transcripts are provided to the proceeding node(s) as a list.
                </Typography>
              </Box>
            </Card>
          </Stack>
        );
        
      case NODE_TYPES.OUTPUT:
        return (
          <Stack spacing={2.5}>
            <Card variant="outlined" sx={{ 
              p: 0, 
              boxShadow: 'none',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: 'sm' }
            }}>
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography level="title-sm">Output Information</Typography>
              </Box>
              
              <Divider />
              
              <Box sx={{ p: 2 }}>
                <Typography level="body-sm" sx={{ mb: 2, color: 'text.secondary' }}>
                  This is the endpoint of your workflow. Processed data will be available here for export or integration.
                </Typography>
                
                <Typography level="body-sm" fontWeight="lg" sx={{ mb: 1 }}>
                  Available Outputs:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip size="sm" variant="soft" color="neutral">API</Chip>
                  <Chip size="sm" variant="soft" color="neutral">Webhook</Chip>
                  <Chip size="sm" variant="soft" color="neutral">Storage</Chip>
                </Box>
              </Box>
            </Card>
          </Stack>
        );
        
      default:
        return (
          <Typography level="body-sm" sx={{ p: 2, color: 'text.secondary' }}>
            No specific options for this node type.
          </Typography>
        );
    }
  };

  // Get node info from configuration
  const nodeInfo = selectedNode ? getNodeInfo(selectedNode.type) : null;

  return (
    <Sheet
      variant="outlined"
      sx={{
        position: 'fixed',
        right: visible ? 0 : '-340px',
        top: 0,
        width: 340,
        height: '100%',
        transition: 'right 0.3s ease',
        boxShadow: visible ? 'rgba(0, 0, 0, 0.1) -2px 0px 10px' : 'none',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.surface',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        bgcolor: 'background.surface',
        zIndex: 10
      }}>
        <Typography level="title-lg">Node Details</Typography>
        <IconButton
          onClick={onClose}
          variant="plain"
          size="sm"
          color="neutral"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      {selectedNode && nodeInfo ? (
        <Box sx={{ p: 2.5, pt: 2 }}>
          {/* Node Header Card */}
          <Card 
            variant="outlined" 
            sx={{ 
              mb: 2.5, 
              p: 0, 
              boxShadow: 'none', 
              overflow: 'hidden',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: 'sm' }
            }}
          >
            {/* Color indicator bar - now using the exact color from config */}
            <Box 
              sx={{ 
                height: 4, 
                width: '100%',
                bgcolor: nodeInfo.borderColor, // Direct color value
                opacity: 0.9,
                display: 'block',
                borderBottom: '1px solid',
                borderColor: nodeInfo.borderColor
              }} 
            />
            
            {/* Content area */}
            <Box sx={{ p: 2 }}>
              {/* Header with Icon and Type */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1.5 
              }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 'md',
                    bgcolor: nodeInfo.softBg, // Direct color value
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5,
                    color: nodeInfo.textColor, // Direct color value
                    flexShrink: 0
                  }}
                >
                  {nodeInfo.icon}
                </Box>
                
                <Box>
                  <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                    {nodeInfo.title}
                  </Typography>
                  
                  {/* Node Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {(selectedNode.type !== NODE_TYPES.INPUT && selectedNode.type !== NODE_TYPES.OUTPUT) ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 'calc(100% - 24px)',
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between', 
                            backgroundColor: 'background.level1',
                            borderRadius: 'md',
                            px: 1.5,
                            py: 0.5,
                            mt: 0.5
                          }}
                        >
                          <Input
                            value={selectedNode.data.label}
                            onChange={onNodeNameChange}
                            size="sm"
                            variant="plain"
                            placeholder="Node name"
                            sx={{
                              '--Input-focusedInset': '0px',
                              '--Input-focusedThickness': '0px',
                              '--Input-paddingInline': '0px',
                              '--Input-paddingBlock': '0px',
                              '--Input-radius': '0px',
                              '--Input-placeholderOpacity': '0.5',
                              bgcolor: 'transparent',
                              fontWeight: 'md',
                              boxShadow: 'none',
                              '&::before': { display: 'none' },
                              '&:focus-within': { boxShadow: 'none' }
                            }}
                          />
                          <EditIcon fontSize="small" sx={{ color: 'text.tertiary', opacity: 0.7, ml: 1 }} />
                        </Box>
                      </Box>
                    ) : (
                      <Typography level="title-md" fontWeight="lg" sx={{ mt: 0.5 }}>
                        {selectedNode.data.label}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
              
              {/* Description */}
              <Typography level="body-sm" sx={{ color: 'text.secondary', my: 1.5 }}>
                {nodeInfo.description}
              </Typography>
              
              {/* Connection Stats */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mt: 1, 
                  pt: 1.5, 
                  borderTop: '1px solid', 
                  borderTopColor: 'divider' 
                }}
              >
                {selectedNode.type !== NODE_TYPES.INPUT && (
                  <Tooltip title="Number of source connections" placement="top">
                    <Chip
                      variant="outlined"
                      color="neutral"
                      size="sm"
                      startDecorator={<ArrowBackIcon fontSize="small" />}
                      sx={{ flex: 1, justifyContent: 'center' }}
                    >
                      {selectedNodeInputs.length} Inputs
                    </Chip>
                  </Tooltip>
                )}
                
                {selectedNode.type !== NODE_TYPES.OUTPUT && (
                  <Tooltip title="Number of target connections" placement="top">
                    <Chip
                      variant="outlined"
                      color="neutral"
                      size="sm"
                      startDecorator={<ArrowForwardIcon fontSize="small" />}
                      sx={{ flex: 1, justifyContent: 'center' }}
                    >
                      {selectedNodeOutputs.length} Outputs
                    </Chip>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Card>
          
          {/* Node specific controls */}
          {renderNodeContent()}
        </Box>
      ) : (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '100%',
          p: 3,
          textAlign: 'center'
        }}>
          <Typography level="body-lg" color="text.tertiary" sx={{ mb: 1 }}>
            No node selected
          </Typography>
          <Typography level="body-sm" color="text.tertiary">
            Click on a node in the workflow to view and edit its details
          </Typography>
        </Box>
      )}
    </Sheet>
  );
}