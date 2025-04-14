import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/joy/CssBaseline';
import { useEffect } from 'react';
import Dashboard from './views/Dashboard';
import ProjectsManagement from './views/ProjectsManagement';
import Login from './views/Login';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { initializeApi } from './api/client';

const vocativeTheme = extendTheme({
  // Your theme customizations
});

// Separated into its own component to access auth context
function AuthenticatedApp() {
  const { logout, isAuthenticated } = useAuth();
  
  useEffect(() => {
    initializeApi(logout);
  }, [logout]);
  
  return <AppRoutes isAuthenticated={isAuthenticated} />;
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes({ isAuthenticated }) {
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/projects" replace /> : <Login />}
      />
      
      {/* Projects Management Page */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsManagement />
          </ProtectedRoute>
        }
      />
      
      {/* Flow Editor Dashboard with projectId parameter */}
      <Route
        path="/flow/:id"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect root to projects management */}
      <Route 
        path="/" 
        element={<Navigate to="/projects" replace />} 
      />
      
      {/* Catch all - redirect to projects management */}
      <Route 
        path="*" 
        element={<Navigate to="/projects" replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CssVarsProvider theme={vocativeTheme}>
          <CssBaseline />
          <AuthenticatedApp />
        </CssVarsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;