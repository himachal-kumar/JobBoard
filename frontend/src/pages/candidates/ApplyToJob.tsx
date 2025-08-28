import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  Description as ResumeIcon,
  Work as WorkIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useSubmitApplicationMutation } from '../../services/api';

interface LocationState {
  resumeFile?: string;
  resumeUploaded?: boolean;
}

const ApplyToJob: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [formData, setFormData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: 'NEGOTIABLE',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // API mutation for submitting application
  const [submitApplication, { isLoading: isSubmittingAPI }] = useSubmitApplicationMutation();

  const steps = [
    'Resume Upload',
    'Application Details',
    'Review & Submit'
  ];

  // Check if resume was uploaded
  useEffect(() => {
    if (!state?.resumeUploaded) {
      toast.error('Please upload your resume first');
      navigate(`/job/${jobId}/resume-upload`);
      return;
    }
    setActiveStep(1);
  }, [state, jobId, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (activeStep === 1) {
      // Validate required fields
      if (!formData.coverLetter.trim()) {
        toast.error('Please provide a cover letter');
        return;
      }
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.coverLetter.trim()) {
      toast.error('Please provide a cover letter');
      return;
    }

    if (!jobId) {
      toast.error('Job ID not found');
      return;
    }

    if (!state?.resumeFile) {
      toast.error('Resume file not found. Please upload your resume first.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare application data
      const applicationData = {
        jobId: jobId,
        coverLetter: formData.coverLetter,
        resume: state.resumeFile || 'resume.pdf', // Use the uploaded resume filename
        expectedSalary: formData.expectedSalary ? parseInt(formData.expectedSalary) : undefined,
        expectedSalaryCurrency: 'USD',
        availability: formData.availability,
        notes: formData.notes || undefined,
      };

      console.log('Submitting application data:', applicationData);

      // Submit application using API
      const result = await submitApplication(applicationData).unwrap();
      
      console.log('API Response:', result);
      
      // Backend returns { message, data } structure
      if (result.message && result.data) {
        toast.success('Application submitted successfully!');
        
        // Navigate to applications page to see the submitted application
        navigate('/applications', { 
          state: { 
            applicationSubmitted: true,
            newApplication: result.data 
          } 
        });
      } else {
        toast.error(result.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Application submission error:', error);
      
      // Handle different types of error responses
      let errorMessage = 'Failed to submit application. Please try again.';
      
      // Check for authentication errors
      if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
        toast.error(errorMessage);
        navigate('/login');
        return;
      }
      
      // Check for other error types
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    if (activeStep === 1) {
      return formData.coverLetter.trim().length > 0;
    }
    return true;
  };

  if (!state?.resumeUploaded) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Redirecting to resume upload...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
            Job Application
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete your application for this position
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Resume Upload Confirmation */}
        {activeStep >= 1 && (
          <Alert 
            severity="success" 
            icon={<CheckIcon />}
            sx={{ mb: 3 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Resume Uploaded Successfully
            </Typography>
            <Typography variant="body2">
              File: {state.resumeFile}
            </Typography>
          </Alert>
        )}

        {/* Step 1: Resume Upload (Already completed) */}
        {activeStep === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ResumeIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Resume Upload Complete
            </Typography>
            <Button
              variant="contained"
              onClick={() => setActiveStep(1)}
              startIcon={<WorkIcon />}
            >
              Continue to Application
            </Button>
          </Box>
        )}

        {/* Step 2: Application Details */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Application Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cover Letter *"
                  multiline
                  rows={6}
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                  helperText={`${formData.coverLetter.length}/1000 characters`}
                  inputProps={{ maxLength: 1000 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expected Salary (Optional)"
                  value={formData.expectedSalary}
                  onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                  placeholder="e.g., 80000"
                  type="number"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={formData.availability}
                    label="Availability"
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                  >
                    <MenuItem value="IMMEDIATE">Immediate</MenuItem>
                    <MenuItem value="2_WEEKS">2 Weeks</MenuItem>
                    <MenuItem value="1_MONTH">1 Month</MenuItem>
                    <MenuItem value="3_MONTHS">3 Months</MenuItem>
                    <MenuItem value="NEGOTIABLE">Negotiable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes (Optional)"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional information you'd like to share..."
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/candidate-dashboard')}
                startIcon={<ArrowBackIcon />}
              >
                Back to Dashboard
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canProceedToNext()}
              >
                Review Application
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 3: Review & Submit */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Review Your Application
            </Typography>

            <Paper sx={{ p: 3, backgroundColor: 'grey.50', mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Resume File
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {state.resumeFile}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cover Letter
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {formData.coverLetter}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Expected Salary
                  </Typography>
                  <Typography variant="body1">
                    {formData.expectedSalary ? `$${formData.expectedSalary}` : 'Not specified'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Availability
                  </Typography>
                  <Typography variant="body1">
                    {formData.availability.replace('_', ' ')}
                  </Typography>
                </Grid>

                {formData.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Additional Notes
                    </Typography>
                    <Typography variant="body1">
                      {formData.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
              >
                Back
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting || isSubmittingAPI}
                startIcon={<SendIcon />}
              >
                {isSubmitting || isSubmittingAPI ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Navigation Info */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ApplyToJob;
