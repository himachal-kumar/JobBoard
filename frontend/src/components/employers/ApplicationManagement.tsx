import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

interface Application {
  id: string;
  candidate: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    skills?: string[];
    mobile?: string;
    company?: string;
    position?: string;
  };
  job: {
    title: string;
    company: string;
  };
  status: string;
  appliedAt: Date;
  coverLetter: string;
  resume: string;
  expectedSalary?: number;
  notes?: string;
}

interface ApplicationManagementProps {
  application: Application;
  onStatusUpdate: (applicationId: string, newStatus: string, notes?: string) => void;
}

const ApplicationManagement: React.FC<ApplicationManagementProps> = ({
  application,
  onStatusUpdate,
}) => {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(application.status);
  const [employerNotes, setEmployerNotes] = useState(application.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(application.id, newStatus, employerNotes);
      setStatusDialogOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewResume = () => {
    // In a real app, this would open the resume file
    window.open(application.resume, '_blank');
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      {/* Application Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {application.candidate.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Applied for: {application.job.title} at {application.job.company}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Applied: {application.appliedAt.toLocaleDateString()}
          </Typography>
        </Box>
        
        <Chip
          label={getStatusText(application.status)}
          color={getStatusColor(application.status) as any}
          variant="filled"
        />
      </Box>

      {/* Candidate Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Candidate Information
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
            <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              {application.candidate.email}
            </Typography>
          </Box>
          
          {application.candidate.mobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
              <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                Mobile: {application.candidate.mobile}
              </Typography>
            </Box>
          )}
          
          {application.candidate.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
              <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                Phone: {application.candidate.phone}
              </Typography>
            </Box>
          )}
          
          {application.candidate.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
              <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                Location: {application.candidate.location}
              </Typography>
            </Box>
          )}
          
          {application.candidate.company && (
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
              <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                Company: {application.candidate.company}
              </Typography>
            </Box>
          )}
          
          {application.candidate.position && (
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
              <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                Position: {application.candidate.position}
              </Typography>
            </Box>
          )}
        </Box>

        {application.candidate.skills && application.candidate.skills.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Skills:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {application.candidate.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Application Details */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Application Details
        </Typography>
        
        {application.expectedSalary && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Expected Salary: ${application.expectedSalary.toLocaleString()}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Cover Letter:
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="body2">
              {application.coverLetter}
            </Typography>
          </Paper>
        </Box>

        {application.notes && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Candidate Notes:
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: 'info.50' }}>
              <Typography variant="body2">
                {application.notes}
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<WorkIcon />}
          onClick={handleViewResume}
        >
          View Resume
        </Button>
        
        <Button
          variant="contained"
          onClick={() => setStatusDialogOpen(true)}
        >
          Update Status
        </Button>
      </Box>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="New Status"
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="REVIEWING">Under Review</MenuItem>
                <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
                <MenuItem value="ACCEPTED">Accepted</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Employer Notes (Optional)"
              multiline
              rows={4}
              value={employerNotes}
              onChange={(e) => setEmployerNotes(e.target.value)}
              placeholder="Add any notes about this candidate..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ApplicationManagement;
