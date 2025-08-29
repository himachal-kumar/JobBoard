import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const ResumeUploadPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    {
      label: 'Upload Resume',
      description: 'Select and upload your resume file',
    },
    {
      label: 'Review & Submit',
      description: 'Review your resume and proceed to application',
    },
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid file type (PDF, DOC, or DOCX)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setError(null);
      setSelectedFile(file);
      setActiveStep(1);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadComplete(false);
    setActiveStep(0);
    setError(null);
  };

  const simulateFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsUploading(false);
    setUploadComplete(true);
    toast.success('Resume uploaded successfully!');
  };

    const handleContinueToApplication = () => {
    if (uploadComplete && selectedFile) {
      // Navigate to the job application page with the actual file object
      navigate(`/job/${jobId}/apply`, { 
        state: { 
          resumeFile: selectedFile, // Pass the actual File object, not just the name
          resumeUploaded: true 
        }
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
            Resume Upload
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload your resume to apply for this position
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: File Upload */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Select Resume File
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload your resume in PDF or Word format (max 5MB)
            </Typography>

            {/* File Input */}
            <input
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="resume-upload"
              type="file"
              onChange={handleFileSelect}
            />

            {/* Upload Area */}
            <Paper
              sx={{
                p: 4,
                border: '2px dashed',
                borderColor: 'grey.300',
                backgroundColor: 'grey.50',
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.50',
                },
              }}
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <UploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Click to upload resume
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports PDF, DOC, DOCX files up to 5MB
              </Typography>
            </Paper>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}

        {/* Step 2: File Review and Upload */}
        {activeStep === 1 && selectedFile && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Review & Upload Resume
            </Typography>

            {/* Selected File Display */}
            <Paper sx={{ p: 3, backgroundColor: 'success.50', border: '1px solid', borderColor: 'success.200', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SuccessIcon sx={{ color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleFileRemove} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>

            {/* Upload Progress */}
            {isUploading && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Uploading resume... {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            {/* Upload Complete */}
            {uploadComplete && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Resume uploaded successfully! You can now proceed to the application.
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/candidate-dashboard')}
                startIcon={<ArrowBackIcon />}
              >
                Back to Dashboard
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {!uploadComplete ? (
                  <Button
                    variant="contained"
                    onClick={simulateFileUpload}
                    disabled={isUploading}
                    startIcon={<UploadIcon />}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Resume'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleContinueToApplication}
                    startIcon={<ArrowForwardIcon />}
                  >
                    Continue to Application
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResumeUploadPage;
