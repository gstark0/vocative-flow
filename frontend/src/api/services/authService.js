import api from '../client';

export const authService = {
    login: async (email, password) => {
      const { data } = await api.post('/token/', { email, password });
      return data;
    },
    
    logout: () => {
      localStorage.removeItem('access');
    }
  };