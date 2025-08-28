import React from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface ApplicationStatusTrackerProps {
  status: string;
  appliedAt: Date;
  reviewedAt?: Date;
  employerNotes?: string;
}

const ApplicationStatusTracker: React.FC<ApplicationStatusTrackerProps> = ({
  status,
  appliedAt,
  reviewedAt,
  employerNotes,
}) => {
  const getStatusSteps = () => {
    const steps = [
      {
        label: 'Applied',
        description: 'Your application has been submitted',
        icon: <PersonIcon />,
        completed: true,
        active: false,
      },
      {
        label: 'Under Review',
        description: 'Employer is reviewing your application',
        icon: <ScheduleIcon />,
        completed: ['REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].includes(status),
        active: status === 'REVIEWING',
      },
      {
        label: 'Shortlisted',
        description: 'You have been shortlisted for this position',
        icon: <WorkIcon />,
        completed: ['SHORTLISTED', 'ACCEPTED'].includes(status),
        active: status === 'SHORTLISTED',
      },
      {
        label: 'Final Decision',
        description: status === 'ACCEPTED' ? 'Congratulations! You got the job!' : 'Application completed',
        icon: status === 'ACCEPTED' ? <CheckIcon /> : <CancelIcon />,
        completed: ['ACCEPTED', 'REJECTED'].includes(status),
        active: ['ACCEPTED', 'REJECTED'].includes(status),
      },
    ];

    return steps;
  };

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

  const steps = getStatusSteps();

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Application Status
      </Typography>

      {/* Current Status */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Current Status:
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
        
        {reviewedAt && (
          <Typography variant="body2" color="text.secondary">
            Last Reviewed: {reviewedAt.toLocaleDateString()}
          </Typography>
        )}
      </Paper>

      {/* Status Timeline */}
      <Stepper orientation="vertical">
        {steps.map((step, index) => (
          <Step key={index} active={step.active} completed={step.completed}>
            <StepLabel
              icon={step.icon}
              sx={{
                '& .MuiStepLabel-iconContainer': {
                  color: step.completed ? 'success.main' : step.active ? 'primary.main' : 'grey.400',
                },
              }}
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {step.description}
              </Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Employer Notes */}
      {employerNotes && (
        <Paper sx={{ p: 2, mt: 3, backgroundColor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'info.main' }}>
            Employer Notes:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {employerNotes}
          </Typography>
        </Paper>
      )}

      {/* Status-specific messages */}
      {status === 'PENDING' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Your application is waiting to be reviewed by the employer. This usually takes 1-3 business days.
        </Alert>
      )}

      {status === 'REVIEWING' && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Your application is currently being reviewed. The employer may contact you soon for next steps.
        </Alert>
      )}

      {status === 'SHORTLISTED' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Congratulations! You've been shortlisted. The employer may contact you for an interview.
        </Alert>
      )}

      {status === 'ACCEPTED' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          🎉 Congratulations! You got the job! The employer will contact you with next steps.
        </Alert>
      )}

      {status === 'REJECTED' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Thank you for your interest. While this position didn't work out, keep applying to other opportunities!
        </Alert>
      )}
    </Box>
  );
};

export default ApplicationStatusTracker;
