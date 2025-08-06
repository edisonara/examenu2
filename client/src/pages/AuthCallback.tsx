import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    if (token) {
      login(token);
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } else if (error) {
      // Redirect to login with error
      navigate(`/login?error=${error}`);
    } else {
      // No token or error, redirect to login
      navigate('/login');
    }
  }, [token, error, login, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="textSecondary" mt={3}>
          Authenticating...
        </Typography>
      </Box>
    </Container>
  );
};

export default AuthCallback;
