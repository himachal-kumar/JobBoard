import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium', 
  showTooltip = true 
}) => {
  const { themeMode, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
  };

  const icon = themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />;
  const tooltipText = themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  const button = (
    <IconButton
      onClick={handleToggle}
      size={size}
      sx={{
        color: 'inherit',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'rotate(15deg) scale(1.1)',
          backgroundColor: 'action.hover',
        },
      }}
      aria-label={tooltipText}
    >
      {icon}
    </IconButton>
  );

  if (showTooltip) {
    return (
      <Tooltip title={tooltipText} arrow placement="bottom">
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default ThemeToggle;
