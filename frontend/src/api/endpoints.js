import api from './client';

// Group endpoints by feature
export const endpoints = {
  // Flow endpoints
  flow: {
    get: (projectId) => api.get(`/projects/${projectId}/flow/`),
    save: (projectId, data) => api.post(`/projects/${projectId}/flow/`, data),
  },
  
  // Projects endpoints
  projects: {
    list: () => api.get('/projects/'),
    get: (id) => api.get(`/projects/${id}/`),
    create: (data) => api.post('/projects/', data),
    update: (id, data) => api.put(`/projects/${id}/`, data),
    delete: (id) => api.delete(`/projects/${id}/`),
  }
};