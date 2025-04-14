import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('access', data.access);
      localStorage.setItem('user_id', data.id);
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('access');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('access');
    return !!token;
  }, []);

  const value = {
    user,
    login,
    logout,
    checkAuth,
    isAuthenticated: checkAuth()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};