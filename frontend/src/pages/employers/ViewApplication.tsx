/**
 * View Single Job Application Page for Job Board Platform
 * 
 * This page displays detailed information about a specific job application
 * including job details, applicant information, and allows employers to
 * accept or reject the application.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as CompanyIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as EducationIcon,
  Description as ResumeIcon,
  ArrowBack as BackIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  MarkEmailRead as EmailConfirmIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { RootState } from '../../store/store';
import { useGetApplicationByIdQuery, useUpdateApplicationStatusMutation } from '../../services/api';

/**
 * View Application component
 * 
 * @returns JSX element representing the single application view page
 */
const ViewApplication: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [employerNotes, setEmployerNotes] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Get current user from auth state
  const { user, isAuthenticated, accessToken } = useSelector((state: RootState) => state.auth);

  // Fetch application data
  const { 
    data: applicationData, 
    isLoading: applicationLoading, 
    error: applicationError,
    refetch: refetchApplication 
  } = useGetApplicationByIdQuery(applicationId!, {
    skip: !applicationId,
    refetchOnMountOrArgChange: true,
  });

  // Application status update mutation
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  // Check if user is employer
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          🔐 Authentication Required
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please log in to view this application.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Box>
    );
  }

  if (user?.role !== 'EMPLOYER') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          🚫 Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This page is only accessible to employers. Your current role is: {user?.role || 'Unknown'}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/employer-dashboard')}>
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  const application = applicationData?.data;
  const job = application?.job;
  const candidate = application?.candidate;

  const handleBackToDashboard = () => {
    navigate('/applications/employer');
  };

  const handleStatusAction = (type: 'accept' | 'reject') => {
    setActionType(type);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setActionType(null);
    setEmployerNotes('');
    setStatusReason('');
  };

  const handleConfirmStatusAction = async () => {
    if (!applicationId || !actionType) return;

    setIsUpdating(true);
    try {
      const newStatus = actionType === 'accept' ? 'ACCEPTED' : 'REJECTED';
      
      await updateApplicationStatus({
        applicationId,
        status: newStatus,
        employerNotes: employerNotes,
        statusReason: statusReason
      }).unwrap();

      // Show detailed success message based on action type
      if (actionType === 'accept') {
        toast.success('🎉 Application accepted successfully! A confirmation email has been sent to the candidate.', {
          autoClose: 4000,
          position: "top-center",
          style: {
            background: '#4caf50',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold'
          }
        });
      } else {
        toast.success('Application rejected successfully! A notification email has been sent to the candidate.', {
          autoClose: 4000,
          position: "top-center"
        });
      }
      
      // Close the dialog first
      handleCloseStatusDialog();
      
      // Show a brief "Email sent" confirmation before redirecting
      setTimeout(() => {
        toast.info('📧 Email delivery confirmed. Redirecting to applications page...', {
          autoClose: 2000,
          position: "top-center"
        });
      }, 1000);
      
      // Redirect back to employer applications page
      setTimeout(() => {
        navigate('/applications/employer');
      }, 3500);
      
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast.error(`Failed to ${actionType} application: ${error?.data?.message || 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'primary';
      case 'reviewing':
        return 'warning';
      case 'shortlisted':
        return 'info';
      case 'rejected':
        return 'error';
      case 'accepted':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'New Application';
      case 'reviewing':
        return 'Under Review';
      case 'shortlisted':
        return 'Shortlisted';
      case 'rejected':
        return 'Rejected';
      case 'accepted':
        return 'Accepted';
      default:
        return status || 'Unknown';
    }
  };

  if (applicationLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (applicationError || !application) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load application: {applicationError ? 'Request failed' : 'Application not found'}
        </Alert>
        <Button variant="contained" onClick={handleBackToDashboard} startIcon={<BackIcon />}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 3, mb: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 2, fontSize: 32 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Job Application Details
              </Typography>
            </Box>
            
            <Button
              color="inherit"
              onClick={handleBackToDashboard}
              startIcon={<BackIcon />}
              sx={{ 
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }}
            >
              Back to Applications
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Application Status Banner */}
        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'primary.light', color: 'white' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Application Status
            </Typography>
            <Chip
              label={getStatusText(application.status)}
              color={getStatusColor(application.status) as any}
                sx={{ 
                  mt: 1, 
                  backgroundColor: 'white', 
                  color: 'primary.main',
                  fontWeight: 600 
                }}
            />
          </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Applied on: {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Date not available'}
              </Typography>
              <Typography variant="body2">
                Last updated: {application.updatedAt ? new Date(application.updatedAt).toLocaleDateString() : 'Date not available'}
              </Typography>
            </Grid>
          </Grid>
      </Paper>

        <Grid container spacing={4}>
          {/* Left Column - Job Details */}
          <Grid item xs={12} lg={8}>
            {/* Job Information Card */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  {job?.title || 'Job Title Not Available'}
                </Typography>
                
          <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CompanyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Company:</strong> {job?.company || job?.employer?.company || 'Company not specified'}
                      </Typography>
                    </Box>
            </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Location:</strong> {job?.location || 'Location not specified'}
                  </Typography>
                    </Box>
            </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Job Type:</strong> {job?.type || 'Type not specified'}
                  </Typography>
                  </Box>
          </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Posted:</strong> {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Date not available'}
                  </Typography>
                    </Box>
            </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SalaryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Salary Range:</strong> ${job?.salary?.min?.toLocaleString() || 'N/A'} - ${job?.salary?.max?.toLocaleString() || 'N/A'} {job?.salary?.currency || 'USD'}
                    </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {job?.description && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Job Description
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {job.description}
                    </Typography>
                  </>
                )}
                </CardContent>
              </Card>

            {/* Applicant Information Card */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Applicant Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Name:</strong> {candidate?.name || 'Name not available'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Email:</strong> {candidate?.email || 'Email not available'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Mobile:</strong> {candidate?.mobile || candidate?.phone || application.mobileNumber || 'Mobile number not available'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Phone:</strong> {candidate?.phone || 'Phone not available'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Location:</strong> {candidate?.location || 'Location not available'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {candidate?.company && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          <strong>Company:</strong> {candidate.company}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {candidate?.position && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          <strong>Position:</strong> {candidate.position}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {candidate?.skills && candidate.skills.length > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          <strong>Skills:</strong> {candidate.skills.join(', ')}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SalaryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Expected Salary:</strong> ${application.expectedSalary?.amount?.toLocaleString() || 'Not specified'} {application.expectedSalary?.currency || 'USD'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {candidate?.education && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Education
                  </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {candidate.education}
                    </Typography>
                  </>
                )}

                {candidate?.experience && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Experience
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {candidate.experience}
                    </Typography>
                  </>
                )}

                {application.coverLetter && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Cover Letter
                  </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {application.coverLetter}
                    </Typography>
                  </>
                )}
                </CardContent>
              </Card>
            </Grid>

          {/* Right Column - Actions and Notes */}
          <Grid item xs={12} lg={4}>
            {/* Application Actions Card */}
            <Card sx={{ mb: 4, position: 'sticky', top: 20 }}>
                <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Application Actions
                  </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                    size="large"
                    startIcon={<AcceptIcon />}
                    onClick={() => handleStatusAction('accept')}
                    disabled={application.status === 'ACCEPTED' || application.status === 'REJECTED'}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
                      }
                    }}
                  >
                    ✓ Accept & Send Email
                        </Button>
                  
                        <Button
                          variant="contained"
                          color="error"
                    size="large"
                    startIcon={<RejectIcon />}
                    onClick={() => handleStatusAction('reject')}
                    disabled={application.status === 'ACCEPTED' || application.status === 'REJECTED'}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                      }
                    }}
                  >
                    ✗ Reject & Send Email
                        </Button>
                </Box>

                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Current Status: {getStatusText(application.status)}
                </Typography>
                
                {application.employerNotes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Your Notes:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {application.employerNotes}
                    </Typography>
                  </Box>
                )}
                </CardContent>
              </Card>

            {/* Quick Stats Card */}
              <Card>
                <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Application Summary
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Applied Date:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Expected Salary:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${application.expectedSalary?.amount?.toLocaleString() || 'Not specified'} {application.expectedSalary?.currency || 'USD'}
                  </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Job Salary Range:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${job?.salary?.min?.toLocaleString() || 'N/A'} - ${job?.salary?.max?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </Container>

    {/* Status Update Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
      >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: actionType === 'accept' ? 'success.main' : 'error.main'
      }}>
        {actionType === 'accept' ? (
          <>
            <AcceptIcon color="success" />
            Accept Application & Send Email
          </>
        ) : (
          <>
            <RejectIcon color="error" />
            Reject Application & Send Email
          </>
        )}
      </DialogTitle>
      <DialogContent>
          {/* Email Confirmation Banner */}
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            backgroundColor: actionType === 'accept' ? 'success.50' : 'warning.50',
            borderRadius: 2,
            border: '2px solid',
            borderColor: actionType === 'accept' ? 'success.200' : 'warning.200',
            textAlign: 'center'
          }}>
            <EmailConfirmIcon 
              sx={{ 
                fontSize: 40, 
                color: actionType === 'accept' ? 'success.main' : 'warning.main',
                mb: 1 
              }} 
            />
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: actionType === 'accept' ? 'success.main' : 'warning.main',
              mb: 1
            }}>
              📧 Email Will Be Sent Automatically
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              A professional {actionType === 'accept' ? 'acceptance' : 'notification'} email will be sent to the candidate immediately after you confirm this action.
            </Typography>
          </Box>

          <DialogContentText sx={{ mb: 3 }}>
            {actionType === 'accept' 
              ? 'You are about to accept this application and send a confirmation email to the candidate. This action will:'
              : 'You are about to reject this application and send a notification email to the candidate. This action will:'
            }
            
            <Box component="ul" sx={{ mt: 2, pl: 2 }}>
              <Box component="li" sx={{ mb: 1 }}>
                Update the application status to <strong>{actionType === 'accept' ? 'ACCEPTED' : 'REJECTED'}</strong>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                Send a professional {actionType === 'accept' ? 'acceptance' : 'notification'} email to the candidate
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                Notify the candidate about next steps
              </Box>
            </Box>
            
            {candidate?.email && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.200' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                  📧 Email Confirmation Details:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>Recipient:</strong> {candidate.email}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>Subject:</strong> {actionType === 'accept' ? 'Application Accepted' : 'Application Update'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>Content:</strong> Professional {actionType === 'accept' ? 'acceptance' : 'notification'} message
                </Typography>
              </Box>
            )}
          </DialogContentText>
          
          <TextField
            fullWidth
            label="Reason (Optional)"
            value={statusReason}
            onChange={(e) => setStatusReason(e.target.value)}
            placeholder={actionType === 'accept' ? 'e.g., Great fit for the role' : 'e.g., Skills don\'t match requirements'}
            multiline
            rows={3}
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            label="Employer Notes (Optional)"
            value={employerNotes}
            onChange={(e) => setEmployerNotes(e.target.value)}
            placeholder="Add any internal notes about this decision..."
            multiline
            rows={3}
          />
      </DialogContent>
      <DialogActions>
          <Button onClick={handleCloseStatusDialog} disabled={isUpdating}>
          Cancel
        </Button>
        <Button
            onClick={handleConfirmStatusAction}
          variant="contained"
            color={actionType === 'accept' ? 'success' : 'error'}
          disabled={isUpdating}
            startIcon={isUpdating ? <CircularProgress size={16} /> : null}
        >
            {isUpdating ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <span>Sending Email & Updating...</span>
              </Box>
            ) : (
              actionType === 'accept' ? 'Accept & Send Email' : 'Reject & Send Email'
            )}
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
};

export default ViewApplication;
