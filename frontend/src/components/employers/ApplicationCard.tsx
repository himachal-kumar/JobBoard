import React from 'react';
import { Box, Typography, Paper, Button, Chip, Grid, Divider } from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Description as ResumeIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

interface ApplicationCardProps {
  application: any;
  onStatusUpdate: (applicationId: string, newStatus: string) => void;
  isUpdating?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onStatusUpdate, isUpdating = false }) => {
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

  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {application.candidate?.name || 'Unknown Candidate'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Applied for: {application.job?.title || 'Unknown Job'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {application.job?.company} • {application.job?.location}
          </Typography>
        </Box>
        
        <Chip
          label={application.status || 'Unknown'}
          color={getStatusColor(application.status) as any}
          size="medium"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Application Details */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EmailIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="body2">
              <strong>Email:</strong> {application.candidate?.email || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="body2">
              <strong>Skills:</strong> {application.candidate?.skills?.join(', ') || 'No skills listed'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ScheduleIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="body2">
              <strong>Applied:</strong> {formatDate(application.appliedAt)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ResumeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="body2">
              <strong>Resume:</strong> {application.resume || 'resume.pdf'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SalaryIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="body2">
              <strong>Expected Salary:</strong> {
                application.expectedSalary?.amount 
                  ? `$${application.expectedSalary.amount.toLocaleString()} ${application.expectedSalary.currency || 'USD'}`
                  : 'Not specified'
              }
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ScheduleIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="body2">
              <strong>Availability:</strong> {application.availability ? application.availability.replace('_', ' ') : 'Not specified'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Cover Letter */}
      {application.coverLetter && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Cover Letter
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', backgroundColor: 'grey.50', p: 2, borderRadius: 1 }}>
              {application.coverLetter}
            </Typography>
          </Box>
        </>
      )}

      {/* Additional Notes */}
      {application.notes && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Additional Notes
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', backgroundColor: 'grey.50', p: 2, borderRadius: 1 }}>
              {application.notes}
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          size="medium"
          variant="outlined"
          onClick={() => onStatusUpdate(application._id, 'REVIEWING')}
          disabled={isUpdating || application.status === 'REVIEWING'}
        >
          Review
        </Button>
        <Button
          size="medium"
          variant="outlined"
          onClick={() => onStatusUpdate(application._id, 'SHORTLISTED')}
          disabled={isUpdating || application.status === 'SHORTLISTED'}
        >
          Shortlist
        </Button>
        <Button
          size="medium"
          variant="outlined"
          color="success"
          onClick={() => onStatusUpdate(application._id, 'ACCEPTED')}
          disabled={isUpdating || application.status === 'ACCEPTED'}
        >
          Accept
        </Button>
        <Button
          size="medium"
          variant="outlined"
          color="error"
          onClick={() => onStatusUpdate(application._id, 'REJECTED')}
          disabled={isUpdating || application.status === 'REJECTED'}
        >
          Reject
        </Button>
      </Box>
    </Paper>
  );
};

export default ApplicationCard;
