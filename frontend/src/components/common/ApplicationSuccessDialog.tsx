import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  CheckCircle as CheckCircleIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from '@mui/material';
import { Job } from '../../types/jobBoard';

interface ApplicationSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  job: Job;
  applicationId?: string;
  onViewApplications?: () => void;
  onBackToJobs?: () => void;
}

const ApplicationSuccessDialog: React.FC<ApplicationSuccessDialogProps> = ({
  open,
  onClose,
  job,
  applicationId,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
        </Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'success.main' }}>
          Application Submitted Successfully! 🎉
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <Paper sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Application Details
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {job.title}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {job.company || job.employer?.name || 'Company'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              Applied on {new Date().toLocaleDateString()}
            </Typography>
          </Box>
          
          {applicationId && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Application ID: {applicationId}
              </Typography>
            </Box>
          )}
        </Paper>
        
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          Your application has been sent to the employer. They will review your profile and get back to you soon.
        </Typography>
        
        <Box sx={{ backgroundColor: 'info.50', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
          <Typography variant="body2" color="info.main" sx={{ fontWeight: 500 }}>
            💡 Tip: Keep your profile updated and check your email regularly for updates on your application.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={onBackToJobs}
          sx={{ px: 3, py: 1.5, borderRadius: 2 }}
        >
          Back to Jobs
        </Button>
        <Button
          variant="contained"
          onClick={onViewApplications}
          sx={{ px: 4, py: 1.5, borderRadius: 2 }}
        >
          View My Applications
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationSuccessDialog;
