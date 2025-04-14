// api/services/flowService.js
import api from '../client';

export const flowService = {
  // Get flow for a project
  getFlow: async (projectId) => {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    try {
      const { data } = await api.get(`/projects/${projectId}/flow/`);
      return data;
    } catch (error) {
      console.error(`Error fetching flow for project ${projectId}:`, error);
      throw error;
    }
  },
  
  // Save flow for a project
  saveFlow: async (projectId, flowData) => {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    try {
      const { data } = await api.post(`/projects/${projectId}/flow/`, flowData);
      return data;
    } catch (error) {
      console.error(`Error saving flow for project ${projectId}:`, error);
      throw error;
    }
  }
};

export default flowService;