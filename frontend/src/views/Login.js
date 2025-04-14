// src/components/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Divider,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  Alert,
} from '@mui/joy';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.level1',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 4,
          mx: 2,
        }}
      >
        {/* Logo and Title */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography level="h2" sx={{ mb: 1 }}>
            Welcome back
          </Typography>
          <Typography level="body-sm" color="neutral">
            Enter your credentials to continue
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            color="danger" 
            variant="soft"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="your@email.com"
              startDecorator={<EmailRoundedIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                '--Input-decoratorChildHeight': '45px',
              }}
            />
          </FormControl>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              startDecorator={<LockRoundedIcon />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                '--Input-decoratorChildHeight': '45px',
              }}
            />
          </FormControl>

          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
          >
            Sign in
          </Button>
        </form>

        {/* Optional: Social Login */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <Divider>
            <Typography level="body-sm" color="neutral">
              or continue with
            </Typography>
          </Divider>
        </Box>

        <Button
          variant="outlined"
          color="neutral"
          fullWidth
          startDecorator={<GoogleIcon />}
          sx={{ mb: 2 }}
        >
          Continue with Google
        </Button>

        {/* Footer Links */}
        <Box sx={{ 
          mt: 3,
          display: 'flex', 
          justifyContent: 'center',
          gap: 2,
        }}>
          <Link level="body-sm" component="button">
            Forgot password?
          </Link>
          <Typography level="body-sm" color="neutral">•</Typography>
          <Link level="body-sm" component="button">
            Create account
          </Link>
        </Box>
      </Card>
    </Box>
  );
}
