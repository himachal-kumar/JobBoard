import React, { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeShowcase from '../components/common/ThemeShowcase';
import SkeletonShowcase from '../components/common/SkeletonShowcase';
import { useTheme } from '../contexts/ThemeContext';

const ThemeDemo: React.FC = () => {
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          className="gradient-text"
        >
          Theme System Demo
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Experience the power of our comprehensive theme system and skeleton loaders
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/jobs')}
          >
            Back to Jobs
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </Box>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            maxWidth: 600, 
            mx: 'auto',
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
            border: `1px solid ${themeMode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)'}`,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Current Theme: {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page demonstrates all the theme features including typography, colors, components, 
            animations, skeleton loaders, and more. Use the theme toggle in the header to switch between light and dark modes.
          </Typography>
        </Paper>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Theme Components" />
          <Tab label="Skeleton Loaders" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && <ThemeShowcase />}
      {activeTab === 1 && <SkeletonShowcase />}
    </Container>
  );
};

export default ThemeDemo;
