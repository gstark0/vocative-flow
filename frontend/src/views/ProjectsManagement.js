import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import CardActions from '@mui/joy/CardActions';
import Grid from '@mui/joy/Grid';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Alert from '@mui/joy/Alert';
import CircularProgress from '@mui/joy/CircularProgress';
import Stack from '@mui/joy/Stack';
import Tooltip from '@mui/joy/Tooltip';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Textarea from '@mui/joy/Textarea';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PaletteIcon from '@mui/icons-material/Palette';

// Services
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import api from '../api/client';

// Common colors for the color picker
const predefinedColors = [
  '#007FFF', // Default blue
  '#FF5722', // Deep Orange
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#673AB7', // Deep Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#03A9F4', // Light Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#8BC34A', // Light Green
  '#CDDC39', // Lime
  '#FFEB3B', // Yellow
  '#FFC107', // Amber
  '#FF9800', // Orange
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

// Project service - simplified for your current setup
const projectService = {
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects/');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  createProject: async (projectData) => {
    try {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', projectData.name);
      formData.append('url_name', projectData.url_name);
      if (projectData.description) {
        formData.append('description', projectData.description);
      }
      formData.append('main_color', projectData.main_color);
      
      // Add logo file if it exists
      if (projectData.logo && projectData.logo instanceof File) {
        formData.append('logo', projectData.logo);
      }
      
      const response = await api.post('/projects/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  deleteProject: async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}/`);
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
  
  checkUrlNameAvailability: async (urlName) => {
    try {
      const response = await api.get(`/projects/check-url-name/`, {
        params: { url_name: urlName }
      });
      return response.data.available;
    } catch (error) {
      // For now, always return true if endpoint doesn't exist
      console.error('Error checking URL name:', error);
      return true;
    }
  }
};

export default function ProjectsManagement() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  
  // States
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    url_name: '',
    description: '',
    main_color: '#007FFF', // Default color
    logo: null
  });
  
  // File upload ref
  const logoInputRef = useRef(null);
  const colorInputRef = useRef(null);
  
  // Preview states
  const [logoPreview, setLogoPreview] = useState(null);
  
  // URL name validation state
  const [urlNameError, setUrlNameError] = useState('');
  const [isUrlNameAvailable, setIsUrlNameAvailable] = useState(null);
  
  // Check URL name availability - simplified
  const checkUrlNameAvailability = async (urlName) => {
    if (!urlName) {
      setIsUrlNameAvailable(null);
      return;
    }
    
    try {
      // For now we'll just do basic validation
      setIsUrlNameAvailable(true);
      setUrlNameError('');
    } catch (err) {
      console.error('Error checking URL name availability:', err);
      setIsUrlNameAvailable(null);
    }
  };
  
  // Handle URL name change with validation
  const handleUrlNameChange = (e) => {
    const value = e.target.value;
    
    // Convert to lowercase and remove spaces and special characters
    const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    setNewProjectData({ ...newProjectData, url_name: sanitizedValue });
    
    // Validate
    if (!sanitizedValue) {
      setUrlNameError('URL name is required');
      setIsUrlNameAvailable(null);
    } else if (sanitizedValue.length < 3) {
      setUrlNameError('URL name must be at least 3 characters');
      setIsUrlNameAvailable(null);
    } else if (sanitizedValue.length > 30) {
      setUrlNameError('URL name must be less than 30 characters');
      setIsUrlNameAvailable(null);
    } else {
      setUrlNameError('');
      // Check availability
      checkUrlNameAvailability(sanitizedValue);
    }
  };
  
  // Handle file selection for logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('File size should not exceed 2MB');
        return;
      }
      
      setNewProjectData({ ...newProjectData, logo: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle color change from input
  const handleColorChange = (e) => {
    setNewProjectData({ ...newProjectData, main_color: e.target.value });
  };
  
  // Handle color selection from predefined colors
  const handleColorSelect = (color) => {
    setNewProjectData({ ...newProjectData, main_color: color });
    if (colorInputRef.current) {
      colorInputRef.current.value = color;
    }
  };
  
  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Fetching projects from the API
      const response = await projectService.getAllProjects();
      setProjects(response);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form when modal closes
  useEffect(() => {
    if (!createModalOpen) {
      setNewProjectData({
        name: '',
        url_name: '',
        description: '',
        main_color: '#007FFF',
        logo: null
      });
      setLogoPreview(null);
      setUrlNameError('');
      setIsUrlNameAvailable(null);
    }
  }, [createModalOpen]);
  
  // Create new project
  const handleCreateProject = async () => {
    // Validate before submitting
    if (!newProjectData.name) {
      setError('Project name is required');
      return;
    }
    
    if (!newProjectData.url_name) {
      setUrlNameError('URL name is required');
      return;
    }
    
    if (urlNameError) {
      return;
    }
    
    try {
      setLoading(true);
      const createdProject = await projectService.createProject(newProjectData);
      setProjects([...projects, createdProject]);
      setCreateModalOpen(false);
      
      // Reset form
      setNewProjectData({
        name: '',
        url_name: '',
        description: '',
        main_color: '#007FFF',
        logo: null
      });
      setLogoPreview(null);
      
      // Navigate to the project editor
      navigate(`/flow/${createdProject.id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete project
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    try {
      setLoading(true);
      await projectService.deleteProject(selectedProject.id);
      setProjects(projects.filter(project => project.id !== selectedProject.id));
      setDeleteModalOpen(false);
      setSelectedProject(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Navigate to project editor
  const handleEditProject = (project) => {
    // Use the correct URL format with /flow/
    navigate(`/flow/${project.id}`);
  };

  // Filter projects by search query
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Sheet sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 3,
          gap: 2
        }}>
          <Typography level="h2">Speech To Text Systems</Typography>
          
          <Button 
            size="md" 
            startDecorator={<AddIcon />} 
            onClick={() => setCreateModalOpen(true)}
          >
            Create New System
          </Button>
        </Box>
        
        {error && (
          <Alert color="danger" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3 
        }}>
          <Input
            placeholder="Search systems..."
            startDecorator={<SearchIcon />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
        </Box>
        
        {loading && projects.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
          </Box>
        ) : filteredProjects.length === 0 ? (
          <Card variant="outlined" sx={{ textAlign: 'center', py: 5 }}>
            <Typography level="body-lg">
              {searchQuery ? 'No systems match your search criteria.' : 'No systems available. Create one to get started.'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                onClick={() => setCreateModalOpen(true)}
                startDecorator={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Create New System
              </Button>
            </Box>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map(project => (
              <Grid key={project.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: 'md',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Show logo if available */}
                    {project.logo ? (
                      <Avatar
                        src={project.logo}
                        alt={project.name}
                        size="lg"
                        sx={{ 
                          borderRadius: 'md',
                          width: 64,
                          height: 64
                        }}
                      />
                    ) : (
                      <Box sx={{ 
                        borderRadius: 'md',
                        width: 64,
                        height: 64,
                        bgcolor: project.main_color || '#007FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                          {project.name.charAt(0).toUpperCase()}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography level="title-md">{project.name}</Typography>
                      
                      {project.description && (
                        <Typography 
                          level="body-sm" 
                          sx={{ 
                            color: 'text.secondary',
                            mt: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {project.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  {project.url_name && (
                    <Typography 
                      level="body-xs" 
                      sx={{ 
                        color: 'text.tertiary',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        px: 2,
                        pb: 2
                      }}
                    >
                      <LinkIcon fontSize="inherit" />
                      flow.vocative.ai/client/{project.url_name}/
                    </Typography>
                  )}
                  
                  {project.main_color && (
                    <Box sx={{ 
                      px: 2, 
                      pb: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1 
                    }}>
                      <Box 
                        sx={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          bgcolor: project.main_color,
                          border: '1px solid',
                          borderColor: 'divider'
                        }} 
                      />
                      <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                        {project.main_color}
                      </Typography>
                    </Box>
                  )}
                  
                  <CardOverflow>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'space-between', gap: 1 }}>
                      <Button
                        size="sm"
                        variant="solid"
                        onClick={() => handleEditProject(project)}
                        startDecorator={<EditIcon />}
                        sx={{ flexGrow: 1 }}
                      >
                        Edit
                      </Button>
                      
                      <IconButton
                        size="sm"
                        variant="soft"
                        color="danger"
                        onClick={() => {
                          setSelectedProject(project);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete system"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </CardOverflow>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      {/* Create Project Modal */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
      <ModalDialog
        aria-labelledby="create-project-modal-title"
        aria-describedby="create-project-modal-description"
        sx={{ 
            maxWidth: '90vw',  // Responsive width
            width: { xs: '100%', sm: '550px', md: '600px' },
            maxHeight: '90vh',  // Limit height
            overflowY: 'auto',  // Add scrolling
            p: { xs: 2, sm: 3 },  // Responsive padding
        }}
        >
          <ModalClose />
          <Typography id="create-project-modal-title" level="h2">
            Create New Speech To Text System
          </Typography>
          <Typography id="create-project-modal-description" level="body-md">
            Configure the basic details for your new system.
          </Typography>
          
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateProject();
            }}
          >
            <Stack spacing={2} sx={{ mt: 3 }}>
              <FormControl required>
                <FormLabel>System Name</FormLabel>
                <Input 
                  autoFocus
                  value={newProjectData.name}
                  onChange={(e) => setNewProjectData({...newProjectData, name: e.target.value})}
                  placeholder="Enter system name"
                />
              </FormControl>
              
              <FormControl required error={!!urlNameError}>
                <FormLabel>
                  URL Name 
                  <Tooltip title="This will be used in the client URL: flow.vocative.ai/client/your-url-name/">
                    <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: '0.9rem', verticalAlign: 'middle' }} />
                  </Tooltip>
                </FormLabel>
                <Input 
                  value={newProjectData.url_name}
                  onChange={handleUrlNameChange}
                  placeholder="your-url-name"
                  startDecorator={<LinkIcon />}
                />
                {urlNameError && <FormHelperText>{urlNameError}</FormHelperText>}
                {!urlNameError && newProjectData.url_name && (
                  <FormHelperText>
                    Client URL: flow.vocative.ai/client/{newProjectData.url_name}/
                  </FormHelperText>
                )}
              </FormControl>
              
              <FormControl>
                <FormLabel>System Logo</FormLabel>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    p: 3,
                    border: '1px dashed',
                    borderColor: 'neutral.400',
                    borderRadius: 'md',
                    bgcolor: 'background.level1',
                  }}
                >
                  {logoPreview ? (
                    <Box sx={{ position: 'relative', width: '100%', maxWidth: 200 }}>
                      <AspectRatio ratio="1" sx={{ mb: 1 }}>
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          style={{ 
                            objectFit: 'contain',
                            borderRadius: 8
                          }}
                        />
                      </AspectRatio>
                      <Button
                        variant="soft"
                        color="danger"
                        size="sm"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={() => {
                          setLogoPreview(null);
                          setNewProjectData({ ...newProjectData, logo: null });
                          if (logoInputRef.current) {
                            logoInputRef.current.value = '';
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'neutral.500' }} />
                      <Typography level="body-sm" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                        Drag & drop a logo image here, or click to select a file
                      </Typography>
                      <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                        Recommended: 512x512px, PNG or JPG, Max 2MB
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    component="label"
                    variant="soft"
                    color="primary"
                    startDecorator={<CloudUploadIcon />}
                  >
                    Upload Logo
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      style={{ display: 'none' }}
                    />
                  </Button>
                </Box>
              </FormControl>
              
              <FormControl>
                <FormLabel>
                  Main Color
                  <Tooltip title="This color will be used for branding in the client interface">
                    <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: '0.9rem', verticalAlign: 'middle' }} />
                  </Tooltip>
                </FormLabel>
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: newProjectData.main_color,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'sm'
                      }}
                    />
                    <Input
                      ref={colorInputRef}
                      type="text"
                      value={newProjectData.main_color}
                      onChange={handleColorChange}
                      startDecorator={
                        <input
                          type="color"
                          value={newProjectData.main_color}
                          onChange={handleColorChange}
                          style={{ 
                            width: '24px', 
                            height: '24px',
                            border: 'none',
                            padding: 0,
                            background: 'none'
                          }}
                        />
                      }
                      slotProps={{
                        input: {
                          sx: {
                            width: '80px',
                          }
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Predefined colors */}
                  <Box sx={{
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mt: 2,
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    {predefinedColors.map(color => (
                      <Box
                        key={color}
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: color,
                          border: newProjectData.main_color === color ? '2px solid' : '1px solid',
                          borderColor: newProjectData.main_color === color ? 'primary.500' : 'divider',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 'sm',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s'
                        }}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </Box>
                </Box>
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="plain" color="neutral" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} disabled={!newProjectData.name || !newProjectData.url_name || !!urlNameError}>
                  Create & Edit
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="delete-project-modal-title"
          aria-describedby="delete-project-modal-description"
        >
          <Typography id="delete-project-modal-title" level="h2">
            Confirm Deletion
          </Typography>
          <Typography id="delete-project-modal-description" level="body-md">
            Are you sure you want to delete the system "{selectedProject?.name}"? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={handleDeleteProject} loading={loading}>
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
}