import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Divider, 
  CircularProgress,
  Paper,
  Alert,
  Link,
  useTheme,
  alpha
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  maxWidth: 400,
  margin: '0 auto',
  marginTop: theme.spacing(8),
}));

const OAuthButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  padding: theme.spacing(1.5),
  textTransform: 'none',
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '0.9375rem',
  width: '100%',
  justifyContent: 'flex-start',
  paddingLeft: theme.spacing(3),
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get('error'));
  const token = searchParams.get('token');

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);
    
    try {
      // The actual redirect will be handled by the OAuth provider
      // This is just for the loading state
      window.location.href = `/api/auth/oauth/${provider}`;
    } catch (err) {
      console.error('OAuth error:', err);
      setError('Failed to initiate OAuth login. Please try again.');
      setLoading(false);
    }
  };

  // Handle OAuth callback with token
  React.useEffect(() => {
    if (token) {
      const handleToken = async () => {
        try {
          setLoading(true);
          await login(token);
          navigate('/dashboard');
        } catch (err) {
          console.error('Login error:', err);
          setError('Failed to complete authentication. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      handleToken();
    }
  }, [token, login, navigate]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography color="textSecondary">Authenticating...</Typography>
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Box mb={4} textAlign="center">
          <Typography 
            component="h1" 
            variant="h4" 
            color="primary" 
            fontWeight="bold" 
            gutterBottom
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Sign in to manage your tasks
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              width: '100%', 
              mb: 3,
              '& .MuiAlert-message': {
                width: '100%',
              }
            }}
            onClose={() => setError(null)}
          >
            {error === 'auth_failed' 
              ? 'Authentication failed. Please try again.' 
              : error}
          </Alert>
        )}

        <Box width="100%" mt={2}>
          <OAuthButton
            variant="outlined"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            startIcon={<GoogleIcon />}
            sx={{ 
              borderColor: 'divider',
              '&:hover': { 
                borderColor: 'text.primary',
                backgroundColor: alpha(theme.palette.primary.main, 0.04)
              },
              mb: 2,
            }}
          >
            Continue with Google
          </OAuthButton>

          <OAuthButton
            variant="outlined"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            startIcon={<GitHubIcon />}
            sx={{ 
              borderColor: 'divider',
              '&:hover': { 
                borderColor: 'text.primary',
                backgroundColor: alpha(theme.palette.grey[900], 0.04)
              },
              mb: 3,
            }}
          >
            Continue with GitHub
          </OAuthButton>
        </Box>

        <Divider sx={{ width: '100%', my: 3 }}>
          <Typography variant="body2" color="textSecondary">OR</Typography>
        </Divider>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/register')}
          disabled={loading}
          sx={{ 
            py: 1.5,
            mb: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          Create an account
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            By continuing, you agree to our{' '}
            <Link href="/terms" color="primary">Terms of Service</Link> and{' '}
            <Link href="/privacy" color="primary">Privacy Policy</Link>.
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Login;
