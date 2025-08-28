/**
 * PostJob Page for Job Board Platform
 * 
 * This page allows employers to create and post new job openings
 * with comprehensive job details and requirements.
 */

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  School as EducationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { JobType, ExperienceLevel } from '../../types/jobBoard';
import { useCreateJobMutation, useMeQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

/**
 * PostJob page component
 * 
 * @returns JSX element representing the post job page
 */
const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { isEmployer, isAuthenticated } = useAuth();
  const [createJob, { isLoading }] = useCreateJobMutation();
  const { data: userData, isLoading: userLoading, error: userError } = useMeQuery();
  const [activeStep, setActiveStep] = useState(0);

  // Authentication check
  React.useEffect(() => {
    console.log('PostJob - Auth check:', { isAuthenticated, isEmployer, userData });
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    if (isAuthenticated && !isEmployer) {
      console.log('User is not an employer, redirecting to dashboard');
      navigate('/candidate-dashboard');
      return;
    }
  }, [isAuthenticated, isEmployer, navigate, userData]);

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading user data...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show error if user data failed to load
  if (userError || !userData?.data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load user data. Please try logging in again.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Container>
    );
  }
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: '',
    location: '',
    skills: [] as string[],
    experienceLevel: '',
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: 'USD',
    isRemote: false,
    category: '',
    benefits: [] as string[],
    deadline: '',
    requirements: '',
    responsibilities: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available options
  const jobTypes: { value: JobType; label: string }[] = [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
  ];

  const experienceLevels: { value: ExperienceLevel; label: string }[] = [
    { value: 'ENTRY', label: 'Entry Level' },
    { value: 'JUNIOR', label: 'Junior' },
    { value: 'MID', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior' },
    { value: 'LEAD', label: 'Lead' },
  ];

  const categories = [
    'Technology', 'Healthcare', 'Marketing', 'Design', 'Data & Analytics',
    'Finance', 'Education', 'Sales', 'Customer Service', 'Engineering',
    'Human Resources', 'Legal', 'Manufacturing', 'Retail', 'Consulting'
  ];

  const availableSkills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'SQL',
    'AWS', 'Docker', 'Machine Learning', 'UI/UX Design', 'Project Management',
    'Marketing', 'Sales', 'Customer Service', 'Data Analysis', 'DevOps',
    'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'Agile',
    'Scrum', 'Leadership', 'Communication', 'Problem Solving'
  ];

  const commonBenefits = [
    'Health Insurance', 'Dental Coverage', 'Vision Coverage', '401k',
    'Flexible PTO', 'Remote Work', 'Professional Development', 'Stock Options',
    'Performance Bonus', 'Gym Membership', 'Free Lunch', 'Transportation',
    'Childcare', 'Pet Insurance', 'Mental Health Support'
  ];

  const steps = [
    'Basic Information',
    'Requirements & Skills',
    'Compensation & Benefits',
    'Review & Submit'
  ];

  /**
   * Handle form field changes
   */
  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Handle skill selection
   */
  const handleSkillToggle = (skill: string) => {
    const currentSkills = formData.skills;
    if (currentSkills.includes(skill)) {
      handleFieldChange('skills', currentSkills.filter(s => s !== skill));
    } else {
      handleFieldChange('skills', [...currentSkills, skill]);
    }
  };

  /**
   * Handle benefit selection
   */
  const handleBenefitToggle = (benefit: string) => {
    const currentBenefits = formData.benefits;
    if (currentBenefits.includes(benefit)) {
      handleFieldChange('benefits', currentBenefits.filter(b => b !== benefit));
    } else {
      handleFieldChange('benefits', [...currentBenefits, benefit]);
    }
  };

  /**
   * Validate current step
   */
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.description.trim()) newErrors.description = 'Job description is required';
        if (!formData.jobType || formData.jobType === '') newErrors.jobType = 'Job type is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.category || formData.category === '') newErrors.category = 'Category is required';
        break;
      case 1: // Requirements & Skills
        if (!formData.experienceLevel || formData.experienceLevel === '') newErrors.experienceLevel = 'Experience level is required';
        if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
        if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
        if (!formData.responsibilities.trim()) newErrors.responsibilities = 'Responsibilities are required';
        break;
      case 2: // Compensation & Benefits
        if (formData.salaryMin <= 0) newErrors.salaryMin = 'Minimum salary must be greater than 0';
        if (formData.salaryMax <= formData.salaryMin) newErrors.salaryMax = 'Maximum salary must be greater than minimum';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle next step
   */
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  /**
   * Handle previous step
   */
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      try {
        // Check if user is employer
        if (!isEmployer) {
          toast.error('Only employers can post jobs');
          return;
        }

        // Validate required fields before submission
        if (!formData.jobType || formData.jobType === '') {
          toast.error('Job type is required');
          return;
        }
        
        if (!formData.experienceLevel || formData.experienceLevel === '') {
          toast.error('Experience level is required');
          return;
        }

        if (!formData.title.trim()) {
          toast.error('Job title is required');
          return;
        }

        if (!formData.description.trim()) {
          toast.error('Job description is required');
          return;
        }

        if (!formData.location.trim()) {
          toast.error('Job location is required');
          return;
        }

        // Transform data to match backend API
        const jobData = {
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements.split('\n').filter(req => req.trim()),
          responsibilities: formData.responsibilities.split('\n').filter(resp => resp.trim()),
          company: userData?.data?.company || 'Company not specified',
          location: formData.location,
          type: formData.jobType,
          experience: formData.experienceLevel,
          salaryMin: formData.salaryMin,
          salaryMax: formData.salaryMax,
          salaryCurrency: formData.salaryCurrency,
          skills: formData.skills,
          benefits: formData.benefits,
          remote: formData.isRemote,
          deadline: formData.deadline || undefined,
        };

        console.log('Submitting job data:', jobData);
        console.log('User data for job creation:', userData);
        console.log('Authentication state:', { isAuthenticated, isEmployer });

        const result = await createJob(jobData).unwrap();
        console.log('Job created successfully:', result);
        toast.success('Job posted successfully! Redirecting to dashboard...');
        
        // Navigate to employer dashboard
        navigate('/employer-dashboard');
      } catch (error: any) {
        console.error('Job creation error:', error);
        
        // Handle different types of errors
        if (error?.status === 401) {
          toast.error('Authentication failed. Please log in again.');
          navigate('/login');
        } else if (error?.status === 403) {
          toast.error('Access denied. Only employers can post jobs.');
          navigate('/candidate-dashboard');
        } else if (error?.data?.message) {
          toast.error(`Job creation failed: ${error.data.message}`);
        } else {
          toast.error('Failed to post job. Please try again.');
        }
      }
    }
  };

  /**
   * Render step content
   */
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                placeholder="e.g., Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                error={Boolean(errors.title)}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={Boolean(errors.jobType)}>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={formData.jobType}
                  onChange={(e) => handleFieldChange('jobType', e.target.value)}
                  label="Job Type"
                >
                  {jobTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.jobType && <FormHelperText>{errors.jobType}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={Boolean(errors.category)}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                placeholder="e.g., San Francisco, CA or Remote"
                value={formData.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                error={Boolean(errors.location)}
                helperText={errors.location}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isRemote}
                    onChange={(e) => handleFieldChange('isRemote', e.target.checked)}
                    color="primary"
                  />
                }
                label="Remote work available"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Description"
                placeholder="Describe the role, responsibilities, and requirements..."
                multiline
                rows={6}
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                error={Boolean(errors.description)}
                helperText={errors.description}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={Boolean(errors.experienceLevel)}>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={formData.experienceLevel}
                  onChange={(e) => handleFieldChange('experienceLevel', e.target.value)}
                  label="Experience Level"
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.experienceLevel && <FormHelperText>{errors.experienceLevel}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Application Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleFieldChange('deadline', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Required Skills
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select the skills required for this position:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onClick={() => handleSkillToggle(skill)}
                    color={formData.skills.includes(skill) ? "primary" : "default"}
                    variant={formData.skills.includes(skill) ? "filled" : "outlined"}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
              {errors.skills && (
                <FormHelperText error>{errors.skills}</FormHelperText>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements & Qualifications"
                placeholder="List the requirements, qualifications, and experience needed..."
                multiline
                rows={4}
                value={formData.requirements}
                onChange={(e) => handleFieldChange('requirements', e.target.value)}
                error={Boolean(errors.requirements)}
                helperText={errors.requirements}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Responsibilities & Duties"
                placeholder="Describe the main responsibilities and duties of this role..."
                multiline
                rows={4}
                value={formData.responsibilities}
                onChange={(e) => handleFieldChange('responsibilities', e.target.value)}
                error={Boolean(errors.responsibilities)}
                helperText={errors.responsibilities}
                required
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Salary Range
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={formData.salaryCurrency}
                      onChange={(e) => handleFieldChange('salaryCurrency', e.target.value)}
                      label="Currency"
                    >
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                      <MenuItem value="GBP">GBP (£)</MenuItem>
                      <MenuItem value="INR">INR (₹)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Minimum Salary"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleFieldChange('salaryMin', Number(e.target.value))}
                    error={Boolean(errors.salaryMin)}
                    helperText={errors.salaryMin}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Maximum Salary"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleFieldChange('salaryMax', Number(e.target.value))}
                    error={Boolean(errors.salaryMax)}
                    helperText={errors.salaryMax}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Benefits & Perks
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select the benefits offered with this position:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {commonBenefits.map((benefit) => (
                  <Chip
                    key={benefit}
                    label={benefit}
                    onClick={() => handleBenefitToggle(benefit)}
                    color={formData.benefits.includes(benefit) ? "primary" : "default"}
                    variant={formData.benefits.includes(benefit) ? "filled" : "outlined"}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Review Your Job Posting
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
                  {formData.title}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {jobTypes.find(t => t.value === formData.jobType)?.label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {formData.location} {formData.isRemote && '(Remote)'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <EducationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {experienceLevels.find(e => e.value === formData.experienceLevel)?.label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <SalaryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {formData.salaryCurrency} {formData.salaryMin.toLocaleString()} - {formData.salaryMax.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {formData.description}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Required Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formData.skills.map((skill) => (
                      <Chip key={skill} label={skill} size="small" />
                    ))}
                  </Box>
                </Box>
                
                {formData.benefits.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Benefits:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {formData.benefits.map((benefit) => (
                        <Chip key={benefit} label={benefit} size="small" color="success" />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review all the information above. Once you submit, the job will be posted and visible to candidates.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Check if user is loading or not an employer */}
      {userLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : !isEmployer ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" color="error" sx={{ mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Only employers can post jobs. Please log in with an employer account.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
            Post a New Job Opening
          </Typography>
          
          {/* Stepper */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
          
          {/* Step Content */}
          <Paper sx={{ p: 4, mb: 4 }}>
            {renderStepContent(activeStep)}
          </Paper>
          
          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  size="large"
                  disabled={isLoading}
                >
                  {isLoading ? 'Posting...' : 'Post Job'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  size="large"
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default PostJob;
