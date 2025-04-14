// api/services/projectService.js
import api from '../client';

export const projectService = {
  // Get all projects
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects/');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  // Get a specific project by ID
  getProject: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error);
      throw error;
    }
  },
  
  // Create a new project
  createProject: async (projectData) => {
    try {
      const response = await api.post(
        `/projects/`,
        projectData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  // Update an existing project
  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(
        `/projects/${projectId}/`,
        projectData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${projectId}:`, error);
      throw error;
    }
  },
  
  // Delete a project
  deleteProject: async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
      throw error;
    }
  }
};

export default projectService;