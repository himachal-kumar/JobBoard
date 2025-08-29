import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  Grid, 
  Divider, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Description as ResumeIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ApplicationCardProps {
  application: any;
  onStatusUpdate: (applicationId: string, newStatus: string, notes?: string) => void;
  isUpdating?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onStatusUpdate, 
  isUpdating = false 
}) => {
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [employerNotes, setEmployerNotes] = useState(application.employerNotes || '');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const navigate = useNavigate();

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
        return 'Hired';
      case 'REJECTED':
        return 'Not Selected';
      default:
        return status;
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

  const handleStatusUpdate = (status: string) => {
    setSelectedStatus(status);
    setNotesDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    onStatusUpdate(application._id, selectedStatus, employerNotes);
    setNotesDialogOpen(false);
  };

  const handleResumeDownload = () => {
    // In a real app, this would download the actual file
    // For now, we'll show a message
    alert(`Downloading resume: ${application.resume}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ScheduleIcon />;
      case 'REVIEWING':
        return <ViewIcon />;
      case 'SHORTLISTED':
        return <WorkIcon />;
      case 'ACCEPTED':
        return <CheckCircleIcon />;
      case 'REJECTED':
        return <CancelIcon />;
      default:
        return null;
    }
  };

  return (
    <>
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        border: '2px solid',
        borderColor: application.status === 'PENDING' ? 'primary.main' : 
                    application.status === 'REVIEWING' ? 'warning.main' :
                    application.status === 'SHORTLISTED' ? 'info.main' :
                    application.status === 'ACCEPTED' ? 'success.main' :
                    application.status === 'REJECTED' ? 'error.main' : 'grey.300',
        backgroundColor: application.status === 'PENDING' ? 'primary.50' :
                       application.status === 'REVIEWING' ? 'warning.50' :
                       application.status === 'SHORTLISTED' ? 'info.50' :
                       application.status === 'ACCEPTED' ? 'success.50' :
                       application.status === 'REJECTED' ? 'error.50' : 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        }
      }}>
        {/* Status Banner */}
        <Box sx={{ 
          mb: 2, 
          p: 1.5, 
          backgroundColor: getStatusColor(application.status) === 'primary' ? 'primary.main' :
                         getStatusColor(application.status) === 'warning' ? 'warning.main' :
                         getStatusColor(application.status) === 'info' ? 'info.main' :
                         getStatusColor(application.status) === 'success' ? 'success.main' :
                         getStatusColor(application.status) === 'error' ? 'error.main' : 'grey.500',
          color: 'white',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {getStatusText(application.status)}
          </Typography>
          <Typography variant="caption">
            Applied: {formatDate(application.appliedAt)}
          </Typography>
        </Box>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {application.candidate?.name || 'Unknown Candidate'}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: 'primary.main' }}>
              Applied for: {application.job?.title || 'Unknown Job'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.job?.company} • {application.job?.location}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip
              label={getStatusText(application.status)}
              color={getStatusColor(application.status) as any}
              size="medium"
              sx={{ fontWeight: 600 }}
            />
            {application.reviewedAt && (
              <Typography variant="caption" color="text.secondary">
                Reviewed: {formatDate(application.reviewedAt)}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Application Details */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, backgroundColor: 'grey.50', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Candidate Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmailIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2">
                  <strong>Email:</strong> {application.candidate?.email || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2">
                  <strong>Mobile:</strong> {application.candidate?.mobile || application.candidate?.phone || application.mobileNumber || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2">
                  <strong>Phone:</strong> {application.candidate?.phone || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2">
                  <strong>Location:</strong> {application.candidate?.location || 'N/A'}
                </Typography>
              </Box>
              
              {application.candidate?.company && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2">
                    <strong>Company:</strong> {application.candidate.company}
                  </Typography>
                </Box>
              )}
              
              {application.candidate?.position && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2">
                    <strong>Position:</strong> {application.candidate.position}
                  </Typography>
                </Box>
              )}
              
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
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, backgroundColor: 'grey.50', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Application Details
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ResumeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2">
                  <strong>Resume:</strong> {application.resume || 'resume.pdf'}
                </Typography>
                <Tooltip title="Download Resume">
                  <IconButton size="small" onClick={handleResumeDownload}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
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
            </Paper>
          </Grid>
        </Grid>

        {/* Cover Letter */}
        {application.coverLetter && (
          <>
            <Divider sx={{ my: 2 }} />
            <Paper sx={{ p: 3, mb: 3, backgroundColor: 'blue.50', border: '1px solid', borderColor: 'blue.200' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'blue.700' }}>
                📝 Cover Letter
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {application.coverLetter}
              </Typography>
            </Paper>
          </>
        )}

        {/* Additional Notes */}
        {application.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Paper sx={{ p: 3, mb: 3, backgroundColor: 'green.50', border: '1px solid', borderColor: 'green.200' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'green.700' }}>
                💬 Candidate Notes
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {application.notes}
              </Typography>
            </Paper>
          </>
        )}

        {/* Employer Notes */}
        {application.employerNotes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Paper sx={{ p: 3, mb: 3, backgroundColor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                📋 Your Notes
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {application.employerNotes}
              </Typography>
            </Paper>
          </>
        )}

        {/* Status History */}
        <Divider sx={{ my: 2 }} />
        <Paper sx={{ p: 3, mb: 3, backgroundColor: 'purple.50', border: '1px solid', borderColor: 'purple.200' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'purple.700' }}>
            📊 Status Timeline
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`Applied: ${formatDate(application.appliedAt)}`}
              color="primary"
              variant="outlined"
              size="small"
              icon={<ScheduleIcon />}
            />
            {application.reviewedAt && (
              <Chip
                label={`Reviewed: ${formatDate(application.reviewedAt)}`}
                color="info"
                variant="outlined"
                size="small"
                icon={<ViewIcon />}
              />
            )}
            <Chip
              label={`Current: ${getStatusText(application.status)}`}
              color={getStatusColor(application.status) as any}
              size="small"
              icon={getStatusIcon(application.status)}
            />
          </Box>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Paper sx={{ p: 3, backgroundColor: 'grey.50', border: '1px solid', borderColor: 'grey.300' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            🚀 Take Action
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {/* View Application Button - Always visible */}
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<ViewIcon />}
              onClick={() => {
                console.log('=== View Application Button Click ===');
                console.log('Application being passed:', application);
                console.log('Application ID:', application._id);
                console.log('Job Title:', application.job?.title);
                console.log('Candidate Name:', application.candidate?.name);
                
                navigate(`/application/${application._id}`, { 
                  state: { applicationData: application } 
                });
              }}
              sx={{ minWidth: 'auto' }}
            >
              View Application
            </Button>
            
            {/* Status-based Action Buttons */}
            {application.status === 'PENDING' && (
              <Button
                variant="contained"
                color="warning"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleStatusUpdate('REVIEWING')}
                disabled={isUpdating}
                sx={{ minWidth: 'auto' }}
              >
                Start Review
              </Button>
            )}
            
            {application.status === 'REVIEWING' && (
              <>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleStatusUpdate('SHORTLISTED')}
                  disabled={isUpdating}
                  sx={{ minWidth: 'auto' }}
                >
                  Shortlist
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={() => handleStatusUpdate('REJECTED')}
                  disabled={isUpdating}
                  sx={{ minWidth: 'auto' }}
                >
                  Reject
                </Button>
              </>
            )}
            
            {application.status === 'SHORTLISTED' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleStatusUpdate('ACCEPTED')}
                  disabled={isUpdating}
                  sx={{ minWidth: 'auto' }}
                >
                  Hire Candidate
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={() => handleStatusUpdate('REJECTED')}
                  disabled={isUpdating}
                  sx={{ minWidth: 'auto' }}
                >
                  Reject
                </Button>
              </>
            )}
            
            {application.status === 'ACCEPTED' && (
              <Chip
                label="Hired Successfully!"
                color="success"
                icon={<CheckCircleIcon />}
                sx={{ fontWeight: 600 }}
              />
            )}
            
            {application.status === 'REJECTED' && (
              <Chip
                label="Application Rejected"
                color="error"
                icon={<CancelIcon />}
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Paper>
      </Paper>

      {/* Status Update Dialog */}
      <Dialog open={notesDialogOpen} onClose={() => setNotesDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Application Status to: {getStatusText(selectedStatus)}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add notes about this candidate (optional):
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Add your feedback, notes, or reasons for this status change..."
              value={employerNotes}
              onChange={(e) => setEmployerNotes(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmStatusUpdate} variant="contained" color="primary">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplicationCard;
