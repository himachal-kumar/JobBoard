/**
 * Standalone Job Application Form Component
 * 
 * This component allows candidates to apply for jobs without the dialog wrapper.
 * It's designed to be used directly in pages like ApplyToJob.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Paper,
  Grid,
  FormHelperText,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Work as WorkIcon,
  Business as CompanyIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Job } from '../../types/jobBoard';
import { useSubmitApplicationMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

/**
 * Props for the StandaloneJobApplicationForm component
 */
interface StandaloneJobApplicationFormProps {
  /** Job to apply for */
  job: Job;
  /** Function called when application is successfully submitted */
  onApplicationSuccess: (applicationId: string) => void;
}

/**
 * Form data interface for job application
 */
interface JobApplicationFormData {
  coverLetter: string;
  resume: File;
  expectedSalary?: number;
  availability?: string;
  additionalNotes?: string;
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
 * StandaloneJobApplicationForm component
 */
const StandaloneJobApplicationForm: React.FC<StandaloneJobApplicationFormProps> = ({
  job,
  onApplicationSuccess,
}) => {
  const { isCandidate } = useAuth();
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      expectedSalary: job.salary?.min || 0,
      availability: 'immediate',
      additionalNotes: '',
    },
  });

  /**
   * Handle file selection
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue('resume', file);
    }
  };

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (data: JobApplicationFormData) => {
    try {
      // Check if user is candidate
      if (!isCandidate) {
        toast.error('Only candidates can apply for jobs');
        return;
      }

      // Handle file upload simulation
      if (selectedFile) {
        setUploading(true);
        setUploadProgress(0);
        
        // Simulate file upload
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(i);
        }
        
        setUploading(false);
      }

      // Submit application to backend
      const applicationData = {
        jobId: job._id,
        coverLetter: data.coverLetter,
        resume: 'resume-url', // In real app, this would be the uploaded file URL
        expectedSalary: data.expectedSalary,
        expectedSalaryCurrency: 'USD',
        availability: data.availability || 'NEGOTIABLE',
        notes: data.additionalNotes,
      };

      const result = await submitApplication(applicationData).unwrap();
      
      // Get the application ID and call success callback
      const applicationId = result.data?._id || result.data?.id || '';
      onApplicationSuccess(applicationId);
      
      // Reset form
      reset();
      setSelectedFile(null);
      
      toast.success('Application submitted successfully!');
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error?.data?.message || 'Failed to submit application. Please try again.');
    }
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Get file type icon
   */
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return '📄';
    if (['doc', 'docx'].includes(extension || '')) return '📝';
    return '📎';
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Job Summary */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Job Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {job.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CompanyIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {job.company}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {job.location}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SalaryIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()} {job.salary?.currency}
              </Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Chip label={job.type} size="small" color="primary" variant="outlined" />
            </Box>
            <Box sx={{ mb: 1 }}>
              <Chip label={job.experience} size="small" color="secondary" variant="outlined" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Cover Letter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Cover Letter *
        </Typography>
        <Controller
          name="coverLetter"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              rows={6}
              fullWidth
              placeholder="Write a compelling cover letter explaining why you're the perfect fit for this position..."
              error={!!errors.coverLetter}
              helperText={errors.coverLetter?.message}
            />
          )}
        />
      </Box>

      {/* Resume Upload */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Resume *
        </Typography>
        <input
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          id="resume-upload"
          type="file"
          onChange={handleFileSelect}
        />
        <label htmlFor="resume-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
          >
            Choose Resume File
          </Button>
        </label>
        
        {selectedFile && (
          <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FileIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(selectedFile.size)} • {getFileIcon(selectedFile.name)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
        
        {errors.resume && (
          <FormHelperText error>{errors.resume.message}</FormHelperText>
        )}
      </Box>

      {/* Expected Salary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Expected Salary (Optional)
        </Typography>
        <Controller
          name="expectedSalary"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              placeholder="Enter your expected salary"
              error={!!errors.expectedSalary}
              helperText={errors.expectedSalary?.message}
            />
          )}
        />
      </Box>

      {/* Availability */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Availability
        </Typography>
        <Controller
          name="availability"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>When can you start?</InputLabel>
              <Select {...field} label="When can you start?">
                <MenuItem value="immediate">Immediately</MenuItem>
                <MenuItem value="2-weeks">Within 2 weeks</MenuItem>
                <MenuItem value="1-month">Within 1 month</MenuItem>
                <MenuItem value="negotiable">Negotiable</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/* Additional Notes */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Additional Notes (Optional)
        </Typography>
        <Controller
          name="additionalNotes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              rows={3}
              fullWidth
              placeholder="Any additional information you'd like to share..."
              error={!!errors.additionalNotes}
              helperText={errors.additionalNotes?.message}
            />
          )}
        />
      </Box>

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Uploading resume... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!isValid || isLoading || uploading}
          sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
        >
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </Box>
    </Box>
  );
};

export default StandaloneJobApplicationForm;
