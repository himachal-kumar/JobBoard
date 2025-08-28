import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';

interface ApplicationStatusProps {
  status: string;
  appliedAt: Date;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ status, appliedAt }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'primary';
      case 'REVIEWING':
        return 'warning';
      case 'SHORTLISTED':
        return 'info';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'New Application';
      case 'REVIEWING':
        return 'Under Review';
      case 'SHORTLISTED':
        return 'Shortlisted';
      case 'ACCEPTED':
        return 'Accepted';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Status:
        </Typography>
        <Chip
          label={getStatusText(status)}
          color={getStatusColor(status) as any}
          variant="filled"
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary">
        Applied: {appliedAt.toLocaleDateString()}
      </Typography>
    </Paper>
  );
};

export default ApplicationStatus;
