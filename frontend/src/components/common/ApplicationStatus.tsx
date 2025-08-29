import React from 'react';
import { Box, Typography, Chip, Paper, LinearProgress, Grid } from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Visibility as ReviewIcon,
  Star as StarIcon,
  Cancel as RejectIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

interface ApplicationStatusProps {
  status: string;
  appliedAt: Date;
  reviewedAt?: Date;
  employerNotes?: string;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ 
  status, 
  appliedAt, 
  reviewedAt,
  employerNotes 
}) => {
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
        return 'Application Submitted';
      case 'REVIEWING':
        return 'Under Review';
      case 'SHORTLISTED':
        return 'Shortlisted';
      case 'ACCEPTED':
        return 'Hired';
      case 'REJECTED':
        return 'Not Selected';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <CheckIcon />;
      case 'REVIEWING':
        return <ReviewIcon />;
      case 'SHORTLISTED':
        return <StarIcon />;
      case 'ACCEPTED':
        return <WorkIcon />;
      case 'REJECTED':
        return <RejectIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 25;
      case 'REVIEWING':
        return 50;
      case 'SHORTLISTED':
        return 75;
      case 'ACCEPTED':
        return 100;
      case 'REJECTED':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Your application has been received and is in the queue for review.';
      case 'REVIEWING':
        return 'Your application is currently being reviewed by the hiring team.';
      case 'SHORTLISTED':
        return 'Congratulations! You have been shortlisted for this position.';
      case 'ACCEPTED':
        return 'Excellent! You have been hired for this position.';
      case 'REJECTED':
        return 'Thank you for your interest. This position has been filled by another candidate.';
      default:
        return 'Application status is being processed.';
    }
  };

  return (
    <Paper sx={{ p: 3, backgroundColor: 'grey.50' }}>
      {/* Status Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Application Status
        </Typography>
        <Chip
          label={getStatusText(status)}
          color={getStatusColor(status) as any}
          variant="filled"
          icon={getStatusIcon(status)}
          size="medium"
        />
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Application Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getStatusProgress(status)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={getStatusProgress(status)} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Status Description */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {getStatusDescription(status)}
        </Typography>
      </Box>

      {/* Timeline */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CheckIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              Applied: {appliedAt.toLocaleDateString()}
            </Typography>
          </Box>
        </Grid>
        
        {reviewedAt && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ReviewIcon sx={{ color: 'info.main', mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Reviewed: {reviewedAt.toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Employer Notes */}
      {employerNotes && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
          <Typography variant="subtitle2" color="info.main" sx={{ mb: 1 }}>
            Feedback from Employer:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {employerNotes}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ApplicationStatus;
