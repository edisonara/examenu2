import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Avatar, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  IconButton
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box display="flex" alignItems="center">
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  mr: 2,
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold">
                  Welcome, {user.name}!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email} {user.isOAuth && `• Signed in with ${user.provider}`}
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<ExitToAppIcon />}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" component="h2" fontWeight="bold">
              Your Tasks
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/tasks/new')}
            >
              New Task
            </Button>
          </Box>

          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <List>
              {/* Sample tasks - Replace with actual task data */}
              <ListItem 
                component="div"
                divider
                onClick={() => navigate('/tasks/1')}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' } 
                }}
              >
                <ListItemText 
                  primary="Complete project documentation"
                  secondary="Due tomorrow"
                />
              </ListItem>
              <ListItem 
                component="div"
                divider
                onClick={() => navigate('/tasks/2')}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' } 
                }}
              >
                <ListItemText 
                  primary="Review pull requests"
                  secondary="3 pending"
                />
              </ListItem>
              <ListItem 
                component="div"
                onClick={() => navigate('/tasks/3')}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' } 
                }}
              >
                <ListItemText 
                  primary="Team meeting"
                  secondary="In 2 hours"
                />
              </ListItem>
            </List>
          </Paper>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
