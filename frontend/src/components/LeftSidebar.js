import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Sheet, 
  Modal,
  ModalDialog,
  ModalClose,
  List,
  ListItem,
  ListItemContent,
  Checkbox,
  Tooltip,
  IconButton,
  Card,
  Link
} from '@mui/joy';
import { 
  LanguageOutlined,
  InfoOutlined,
  LaunchOutlined,
  ChevronRightOutlined
} from '@mui/icons-material';
import { NODE_TYPES, NODE_CONFIG } from '../config/nodeConfig';

export default function LeftSidebar({ 
  onAddNode, 
  supportedTranscriptLanguages, 
  selectedTranscriptLanguages, 
  onLanguagesChange,
  clientSystemUrl
}) {
  // Map of display names to ISO language codes
  const languageMap = supportedTranscriptLanguages.reduce((acc, lang) => {
    acc[lang.name] = lang.code;
    return acc;
  }, {});
  
  const [selectedLanguages, setSelectedLanguages] = useState(null);
  const [languageError, setLanguageError] = useState(null);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initialSelectedIDsRef = React.useRef(null);
  
  // Open and close the language selection modal
  const openLanguageModal = () => setLanguageModalOpen(true);
  const closeLanguageModal = () => setLanguageModalOpen(false);

  // Handle language toggle with validation
  const handleLanguageToggle = (language) => {
    // Count currently selected languages
    const currentSelectedCount = Object.values(selectedLanguages).filter(Boolean).length;
    
    // If trying to deselect the only selected language, prevent it and show error
    if (selectedLanguages[language] && currentSelectedCount === 1) {
      setLanguageError("At least one language must be selected");
      return;
    }
    
    // Clear any existing error when making a valid selection
    if (languageError) setLanguageError(null);
    
    // Update the selection state
    setSelectedLanguages(prev => ({
      ...prev,
      [language]: !prev[language]
    }));
  };

  // Initialize language selection from props - only runs once when props are available
  useEffect(() => {
    if (!supportedTranscriptLanguages || !selectedTranscriptLanguages || supportedTranscriptLanguages.length === 0) return;
    if (isInitialized) return; // Skip if already initialized
    
    // Create initial selection state
    const initialSelection = {};
    supportedTranscriptLanguages.forEach(lang => {
      initialSelection[lang.name] = selectedTranscriptLanguages.some(sel => sel.language.code === lang.code);
    });
    
    // Store initial selection
    setSelectedLanguages(initialSelection);
    
    // Calculate initial IDs for reference (don't send to server yet)
    const initialIDs = supportedTranscriptLanguages
      .filter(lang => initialSelection[lang.name])
      .map(lang => lang.id);
      
    // If no languages are selected, default to first available language
    if (initialIDs.length === 0 && supportedTranscriptLanguages.length > 0) {
      const defaultLang = supportedTranscriptLanguages[0].name;
      initialSelection[defaultLang] = true;
      initialIDs.push(supportedTranscriptLanguages[0].id);
      setSelectedLanguages(initialSelection);
    }
    
    // Store reference but don't trigger update
    initialSelectedIDsRef.current = initialIDs;
    setIsInitialized(true);
  }, [supportedTranscriptLanguages, selectedTranscriptLanguages, isInitialized]);

  // Handle changes to selection after initialization
  useEffect(() => {
    // Skip if component isn't initialized yet or selectedLanguages isn't set
    if (!isInitialized || !selectedLanguages) return;
    
    const currentIDs = getSelectedLanguageIDs();
    
    // Skip if we don't have a reference point yet
    if (initialSelectedIDsRef.current === null) {
      initialSelectedIDsRef.current = currentIDs;
      return;
    }
    
    // Compare with initial selection to see if there's been a change
    const initial = initialSelectedIDsRef.current;
    const hasChanged =
      currentIDs.length !== initial.length ||
      currentIDs.slice().sort().join(',') !== initial.slice().sort().join(',');
    
    // Only update if there's been a user-initiated change and we have at least one language
    if (hasChanged && currentIDs.length > 0) {
      onLanguagesChange(currentIDs);
      initialSelectedIDsRef.current = currentIDs; // update reference after change
    }
  }, [selectedLanguages, isInitialized]);
  
  // Get count of selected languages
  const selectedLanguageCount = selectedLanguages 
    ? Object.values(selectedLanguages).filter(Boolean).length 
    : 0;

  const getSelectedLanguageIDs = () => {
    if (!selectedLanguages) return [];
    return Object.entries(selectedLanguages)
      .filter(([name, isSelected]) => isSelected)
      .map(([name]) => supportedTranscriptLanguages.find(lang => lang.name === name)?.id)
      .filter(Boolean); // Filter out any undefined values
  };

  // Only include the nodes we want to show
  const nodeTypesToShow = [NODE_TYPES.AI, NODE_TYPES.CODE, NODE_TYPES.TEMPLATE];
  
  return (
    <Sheet
      variant="outlined"
      sx={{
        width: 320,
        height: '100%',
        borderRadius: 0,
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.surface',
      }}
    >
      {/* Header section */}
      <Box sx={{ 
        px: 3, 
        pt: 3,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography level="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Workflow Builder
        </Typography>
        <Typography level="body-md" sx={{ color: 'text.secondary' }}>
          Build your AI processing workflow
        </Typography>
      </Box>
      
      {/* Node selection area */}
      <Box sx={{ 
        px: 3, 
        py: 3, 
        flex: 1,
        overflowY: 'auto'
      }}>
        <Typography level="title-sm" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Add Processing Nodes
        </Typography>
        
        {/* Node cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {nodeTypesToShow.map(nodeType => {
            const config = NODE_CONFIG[nodeType];
            
            return (
              <Card
                key={nodeType}
                variant="outlined"
                onClick={() => onAddNode(nodeType)}
                sx={{ 
                  p: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  borderColor: config.colors.border,
                  borderLeftWidth: '4px',
                  '&:hover': {
                    boxShadow: 'md',
                    transform: 'translateY(-2px)',
                    borderLeftColor: config.colors.border
                  }
                }}
              >
                <Box sx={{ 
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: config.colors.softBg,
                      borderRadius: 'sm',
                      mr: 2,
                      color: config.colors.text,
                      flexShrink: 0
                    }}
                  >
                    {React.cloneElement(config.icon(), { fontSize: 'small' })}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-md" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {config.label} Node
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                      {config.description.split('.')[0]}.
                    </Typography>
                  </Box>
                  
                  <ChevronRightOutlined sx={{ 
                    color: 'text.tertiary', 
                    alignSelf: 'center', 
                    ml: 1.5, 
                    opacity: 0.7 
                  }} />
                </Box>
              </Card>
            );
          })}
        </Box>
      </Box>
      
      {/* Footer section */}
      <Box sx={{ 
        px: 3, 
        py: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {/* Language selection trigger */}
        <Card
          variant="outlined"
          sx={{
            p: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'background.level1' }
          }}
          onClick={openLanguageModal}
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LanguageOutlined sx={{ color: 'primary.500' }} />
              <Box>
                <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                  {selectedLanguageCount} language{selectedLanguageCount !== 1 ? 's' : ''} selected
                </Typography>
                <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                  Click to modify languages
                </Typography>
              </Box>
            </Box>
            
            <Tooltip title="Select languages for transcription" placement="top">
              <InfoOutlined fontSize="small" sx={{ color: 'text.tertiary' }} />
            </Tooltip>
          </Box>
          
          {languageError && (
            <Typography level="body-xs" color="danger" sx={{ mt: 1.5 }}>
              {languageError}
            </Typography>
          )}
        </Card>
        
        {/* Client System Button */}
        <Link
          href={window.location.origin + '/client/' + clientSystemUrl}
          target="_blank"
          underline="none"
          sx={{ width: '100%' }}
        >
          <Button
            fullWidth
            variant="solid"
            color="primary"
            size="lg"
            endDecorator={<LaunchOutlined />}
            sx={{ 
              py: 1.5,
              fontWeight: 600
            }}
          >
            Go to Client System
          </Button>
        </Link>
      </Box>
      
      {/* Language selection modal */}
      <Modal open={languageModalOpen} onClose={closeLanguageModal}>
        <ModalDialog 
          size="md"
          sx={{ 
            maxWidth: 480, 
            borderRadius: 'md',
            p: 3
          }}
        >
          <ModalClose />
          <Typography level="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Select Languages
          </Typography>
          <Typography level="body-md" sx={{ mb: 3, color: 'text.secondary' }}>
            Choose which languages your workflow will support
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <List sx={{ '--ListItem-paddingY': '0.75rem', maxHeight: '400px', overflow: 'auto' }}>
            {selectedLanguages && Object.keys(languageMap).map((language) => (
              <ListItem key={language}>
                <Checkbox
                  checked={selectedLanguages[language] || false}
                  disabled={selectedLanguages[language] && selectedLanguageCount === 1}
                  onChange={() => handleLanguageToggle(language)}
                  label={language}
                  overlay
                  sx={{ fontWeight: 500 }}
                />
                <ListItemContent>
                  <Typography level="body-sm" sx={{ ml: 'auto', color: 'text.tertiary' }}>
                    {languageMap[language]}
                  </Typography>
                </ListItemContent>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="plain" 
              color="neutral" 
              onClick={closeLanguageModal}
              size="lg"
            >
              Cancel
            </Button>
            <Button 
              variant="solid" 
              color="primary" 
              onClick={closeLanguageModal}
              size="lg"
            >
              Confirm
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
}