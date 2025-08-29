/**
 * JobApplicationForm Component for Job Board Platform
 * 
 * This component allows candidates to apply for jobs with resume upload,
 * cover letter, and additional information. It handles file uploads and
 * form validation.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Paper,
  Grid,
  FormHelperText,
  IconButton,
} from '@mui/material';
import ApplicationSuccessDialog from '../common/ApplicationSuccessDialog';
import ResumeUpload from '../common/ResumeUpload';
import {
  Close as CloseIcon,
  Work as WorkIcon,
  Business as CompanyIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Job, JobApplicationFormData } from '../../types/jobBoard';
import { useSubmitApplicationMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

/**
 * Props for the JobApplicationForm component
 */
interface JobApplicationFormProps {
  /** Job to apply for */
  job: Job;
  /** Whether the dialog is open (for dialog mode) */
  open?: boolean;
  /** Function to close the dialog (for dialog mode) */
  onClose?: () => void;
  /** Function to handle form submission (for dialog mode) */
  onSubmit?: (data: JobApplicationFormData) => void;
  /** Function called when application is successfully submitted (for standalone mode) */
  onApplicationSuccess?: (applicationId: string) => void;
  /** Whether to render as standalone form instead of dialog */
  standalone?: boolean;
}

/**
 * Validation schema for job application
 */
const validationSchema = yup.object({
  coverLetter: yup
    .string()
    .required('Cover letter is required')
    .min(100, 'Cover letter must be at least 100 characters')
    .max(2000, 'Cover letter must not exceed 2000 characters'),
  resume: yup
    .mixed()
    .required('Resume is required')
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return false;
      return (value as File).size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Only PDF and Word documents are allowed', (value) => {
      if (!value) return false;
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return allowedTypes.includes((value as File).type);
    }),
  mobileNumber: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid mobile number'),
  expectedSalary: yup
    .number()
    .min(0, 'Expected salary must be positive')
    .max(1000000, 'Expected salary is too high'),
  availability: yup
    .string()
    .optional(),
  additionalNotes: yup
    .string()
    .max(500, 'Additional notes must not exceed 500 characters'),
});

/**
 * JobApplicationForm component
 * 
 * @param job - Job to apply for
 * @param open - Whether the dialog is open
 * @param onClose - Function to close the dialog
 * @param onSubmit - Function to handle form submission
 * @returns JSX element representing the job application form
 */
const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  job,
  open = true,
  onClose,
  onSubmit,
  onApplicationSuccess,
  standalone = false,
}) => {
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<JobApplicationFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      coverLetter: '',
      mobileNumber: '',
      expectedSalary: job.salary.min || 0,
      availability: 'immediate',
      additionalNotes: '',
    },
  });

  /**
   * Handle file selection
   */
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setValue('resume', file);
  };

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (data: JobApplicationFormData) => {
    if (!selectedFile) {
      toast.error('Please select a resume file');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const applicationData = {
        jobId: job._id,
        coverLetter: data.coverLetter,
        resume: selectedFile.name, // In real app, this would be the uploaded file URL
        mobileNumber: data.mobileNumber,
        expectedSalary: data.expectedSalary,
        expectedSalaryCurrency: job.salary.currency || 'USD',
        availability: data.availability || 'NEGOTIABLE',
        notes: data.additionalNotes,
      };

      const result = await submitApplication(applicationData).unwrap();
      
      // Debug logging
      console.log('Application submission result:', result);
      console.log('Application data sent:', applicationData);
      
      // Store the application ID and show success dialog
      const applicationId = result.data?._id || '';
      setSubmittedApplicationId(applicationId);
      setShowSuccessDialog(true);
      
      // Call the appropriate callback based on mode
      if (standalone && onApplicationSuccess) {
        onApplicationSuccess(applicationId);
      } else if (onSubmit) {
        await onSubmit(data);
      }
      
      // Reset form
      reset();
      setSelectedFile(null);
      
      // Close dialog only if not in standalone mode
      if (!standalone && onClose) {
        onClose();
      }
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle dialog close
   */
  const handleClose = () => {
    reset();
    setSelectedFile(null);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Apply for {job.title}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Job Summary */}
        <Paper sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CompanyIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  {job.employer.company || job.employer.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  {job.location} {job.remote && '(Remote)'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  {job.type}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SalaryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Resume Upload */}
          <ResumeUpload
            onResumeSelect={handleFileSelect}
            onResumeRemove={() => {
              setSelectedFile(null);
              setValue('resume', null as any);
            }}
            selectedFile={selectedFile}
            isUploading={uploading}
            uploadProgress={uploadProgress}
            error={errors.resume?.message}
          />

          {/* Mobile Number */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Information
            </Typography>
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Mobile Number"
                  placeholder="Enter your mobile number (e.g., +1 555 123 4567)"
                  variant="outlined"
                  error={Boolean(errors.mobileNumber)}
                  helperText={errors.mobileNumber?.message || "We'll use this to contact you about your application"}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
            />
          </Box>

          {/* Cover Letter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Cover Letter
            </Typography>
            <Controller
              name="coverLetter"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Write a compelling cover letter explaining why you're the perfect fit for this role..."
                  variant="outlined"
                  error={Boolean(errors.coverLetter)}
                  helperText={
                    errors.coverLetter?.message || 
                    `${field.value?.length || 0}/2000 characters`
                  }
                  inputProps={{ maxLength: 2000 }}
                />
              )}
            />
          </Box>

          {/* Additional Information */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Expected Salary
              </Typography>
              <Controller
                name="expectedSalary"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    placeholder="Enter your expected salary"
                    variant="outlined"
                    error={Boolean(errors.expectedSalary)}
                    helperText={errors.expectedSalary?.message}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>{job.salary.currency}</Typography>,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Availability
              </Typography>
              <Controller
                name="availability"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.availability)}>
                    <InputLabel>When can you start?</InputLabel>
                    <Select {...field} label="When can you start?">
                      <MenuItem value="immediate">Immediately</MenuItem>
                      <MenuItem value="2weeks">Within 2 weeks</MenuItem>
                      <MenuItem value="1month">Within 1 month</MenuItem>
                      <MenuItem value="2months">Within 2 months</MenuItem>
                      <MenuItem value="3months">Within 3 months</MenuItem>
                      <MenuItem value="negotiable">Negotiable</MenuItem>
                    </Select>
                    {errors.availability && (
                      <FormHelperText>{errors.availability.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          {/* Additional Notes */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Additional Notes (Optional)
            </Typography>
            <Controller
              name="additionalNotes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Any additional information you'd like to share..."
                  variant="outlined"
                  error={Boolean(errors.additionalNotes)}
                  helperText={
                    errors.additionalNotes?.message || 
                    `${field.value?.length || 0}/500 characters`
                  }
                  inputProps={{ maxLength: 500 }}
                />
              )}
            />
          </Box>

          {/* Upload Progress */}
          {uploading && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Uploading resume... {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          {/* Application Tips */}
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Tip:</strong> Make sure your cover letter is specific to this role and company. 
              Highlight relevant experience and explain why you're interested in this position.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={!isValid || uploading || isSubmitting}
          size="large"
        >
          Submit Application
        </Button>
      </DialogActions>
      
      {/* Success Dialog */}
      <ApplicationSuccessDialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        job={job}
        applicationId={submittedApplicationId}
      />
    </Dialog>
  );
};

export default JobApplicationForm;
