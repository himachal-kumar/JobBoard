/**
 * Applications Page for Job Board Platform
 * 
 * This page displays user's job applications with their current status
 * and allows them to track their application progress.
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  Chip,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Bookmark as BookmarkIcon,
  Visibility as VisibilityIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Description as ResumeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetCandidateApplicationsQuery } from '../../services/api';
import ApplicationStatus from '../../components/common/ApplicationStatus';
import { toast } from 'react-toastify';

interface LocationState {
  applicationSubmitted?: boolean;
  newApplication?: any;
}

/**
 * Applications page component
 * 
 * @returns JSX element representing the applications page
 */
const Applications: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [showNewApplication, setShowNewApplication] = useState(false);
  
  // API query for applications with real-time updates
  const { data: applicationsData, isLoading, refetch } = useGetCandidateApplicationsQuery({
    page: 1,
    limit: 50,
  });
  
  const applications = applicationsData?.data?.applications || [];
  
  // Refresh applications when component mounts or when needed
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  // Show success message and new application when application is submitted
  useEffect(() => {
    if (state?.applicationSubmitted && state?.newApplication) {
      toast.success('Application submitted successfully! Check it out below.');
      setShowNewApplication(true);
      
      // Refresh the applications list to get the real data from backend
      setTimeout(() => {
        refetch();
      }, 1000);
      
      // Clear the state to prevent showing the message again
      window.history.replaceState({}, document.title);
    }
  }, [state?.applicationSubmitted, state?.newApplication, refetch]);

  // Hide the temporary new application once we have real data
  useEffect(() => {
    if (showNewApplication && applications.length > 0) {
      // Check if the new application is now in the real applications list
      const hasRealApplication = applications.some(app => 
        app.job?._id === state?.newApplication?.job?._id
      );
      
      if (hasRealApplication) {
        setShowNewApplication(false);
      }
    }
  }, [applications, showNewApplication, state?.newApplication]);
  
  // Show notification when application status changes
  useEffect(() => {
    if (applications.length > 0) {
      applications.forEach(app => {
        if (app.status === 'ACCEPTED') {
          toast.success(`🎉 Congratulations! Your application for ${app.job?.title} has been accepted!`, {
            autoClose: 8000,
            position: 'top-right'
          });
        } else if (app.status === 'REJECTED') {
          toast.info(`Your application for ${app.job?.title} was not selected. Keep applying!`, {
            autoClose: 6000,
            position: 'top-right'
          });
        } else if (app.status === 'SHORTLISTED') {
          toast.info(`Great news! Your application for ${app.job?.title} has been shortlisted!`, {
            autoClose: 6000,
            position: 'top-right'
          });
        }
      });
    }
  }, [applications]);
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'info';
      case 'reviewing':
        return 'warning';
      case 'shortlisted':
        return 'primary';
      case 'rejected':
        return 'error';
      case 'accepted':
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <BookmarkIcon />;
      case 'reviewing':
        return <VisibilityIcon />;
      case 'shortlisted':
        return <ScheduleIcon />;
      case 'rejected':
        return <SendIcon />;
      case 'accepted':
        return <CheckCircleIcon />;
      default:
        return <BookmarkIcon />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Application Submitted';
      case 'reviewing':
        return 'Under Review';
      case 'shortlisted':
        return 'Shortlisted';
      case 'rejected':
        return 'Rejected';
      case 'accepted':
        return 'Accepted';
      default:
        return 'Unknown Status';
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

  const handleViewJob = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const handleWithdrawApplication = (applicationId: string) => {
    // TODO: Implement withdraw functionality
    console.log('Withdraw application:', applicationId);
    toast.info('Withdraw functionality coming soon!');
  };

  // Render application card component
  const renderApplicationCard = (application: any, isNew: boolean = false) => (
    <Grid item xs={12} key={application._id || `new-${Date.now()}`}>
      <Paper sx={{ 
        p: 3, 
        border: isNew ? '2px solid #4caf50' : '1px solid #e0e0e0',
        backgroundColor: isNew ? '#f8fff8' : 'white'
      }}>
        {isNew && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#4caf50', color: 'white', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              🎉 New Application
            </Typography>
            <Typography variant="body2">
              This application was just submitted successfully!
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {application.job?.title || 'Job Title Not Available'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {application.job?.company || application.job?.employer?.name || 'Company Not Available'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.job?.location || 'Location Not Available'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip
              label={getStatusText(application.status)}
              color={getStatusColor(application.status) as any}
              icon={getStatusIcon(application.status)}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              Applied: {formatDate(application.appliedAt)}
            </Typography>
            {application.reviewedAt && (
              <Typography variant="caption" color="text.secondary">
                Reviewed: {formatDate(application.reviewedAt)}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Application Details */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Resume File
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ResumeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="body2">
                {application.resume || 'resume.pdf'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Job Type
            </Typography>
            <Typography variant="body2">
              {application.job?.type ? application.job.type.replace('_', ' ') : 'Not specified'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Expected Salary
            </Typography>
            <Typography variant="body2">
              {application.expectedSalary?.amount 
                ? `$${application.expectedSalary.amount.toLocaleString()} ${application.expectedSalary.currency || 'USD'}`
                : 'Not specified'
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Availability
            </Typography>
            <Typography variant="body2">
              {application.availability ? application.availability.replace('_', ' ') : 'Not specified'}
            </Typography>
          </Grid>

          {application.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Additional Notes
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {application.notes}
              </Typography>
            </Grid>
          )}

          {/* Employer Feedback */}
          {application.employerNotes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1, fontWeight: 600 }}>
                📝 Feedback from Employer
              </Typography>
              <Typography variant="body2" sx={{ 
                whiteSpace: 'pre-wrap', 
                backgroundColor: 'primary.50', 
                p: 2, 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'primary.200'
              }}>
                {application.employerNotes}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Cover Letter
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {application.coverLetter || 'No cover letter provided'}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleViewJob(application.job?._id || '')}
            startIcon={<VisibilityIcon />}
          >
            View Job
          </Button>
          
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleWithdrawApplication(application._id)}
            startIcon={<SendIcon />}
          >
            Withdraw
          </Button>
        </Box>
      </Paper>
    </Grid>
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            My Applications
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Track the status of your job applications and manage your submissions
        </Typography>
      </Box>

      {/* Success Message for New Application */}
      {state?.applicationSubmitted && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={() => window.history.replaceState({}, document.title)}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            🎉 Application Submitted Successfully!
          </Typography>
          <Typography variant="body2">
            Your application has been submitted and is now under review. You can track its progress below.
          </Typography>
        </Alert>
      )}

      {/* Applications List */}
      {applications.length === 0 && !showNewApplication ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            No Applications Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't submitted any job applications yet. Start browsing jobs and apply to positions that interest you!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/jobs')}
            startIcon={<WorkIcon />}
          >
            Browse Jobs
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Show new application first if available */}
          {showNewApplication && state?.newApplication && (
            renderApplicationCard(state.newApplication, true)
          )}
          
          {/* Show existing applications */}
          {applications.map((application) => (
            renderApplicationCard(application, false)
          ))}
        </Grid>
      )}

      {/* Back to Dashboard Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/candidate-dashboard')}
          startIcon={<WorkIcon />}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Applications;
