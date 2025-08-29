/**
 * Job Details Page for Job Board Platform
 * 
 * This page displays comprehensive information about a specific job posting
 * including all details, requirements, and application options.
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as CompanyIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  School as EducationIcon,
  Person as PersonIcon,
  ArrowBack as BackIcon,
  Send as ApplyIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Description as DescriptionIcon,
  Done as RequirementsIcon,
  Star as BenefitsIcon,
  Wifi as RemoteIcon,
  Event as DeadlineIcon,
  Done as DoneIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { RootState } from '../store/store';
import { useGetJobByIdQuery } from '../services/api';

/**
 * Job Details component
 * 
 * @returns JSX element representing the job details page
 */
const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  // Get current user from auth state
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Fetch job data
  const { 
    data: jobData, 
    isLoading: jobLoading, 
    error: jobError,
  } = useGetJobByIdQuery(jobId!, {
    skip: !jobId,
    refetchOnMountOrArgChange: true,
  });

  const job = jobData?.data;

  const handleBackToJobs = () => {
    navigate('/jobs');
  };

  const handleApplyNow = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to apply for this job');
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'CANDIDATE') {
      toast.error('Only candidates can apply for jobs');
      return;
    }
    
    navigate(`/job/${jobId}/apply`);
  };

  const handleBookmarkToggle = () => {
    // TODO: Implement bookmark functionality
    toast.info('Bookmark functionality coming soon!');
  };

  const handleShareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title || 'Job Posting',
        text: `Check out this job: ${job?.title} at ${job?.company}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'primary';
      case 'PART_TIME': return 'secondary';
      case 'CONTRACT': return 'warning';
      case 'INTERNSHIP': return 'info';
      default: return 'default';
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'ENTRY': return 'success';
      case 'JUNIOR': return 'info';
      case 'MID': return 'warning';
      case 'SENIOR': return 'error';
      case 'LEAD': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'CLOSED': return 'error';
      case 'DRAFT': return 'warning';
      default: return 'default';
    }
  };

  if (jobLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (jobError || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load job details: {jobError ? 'Request failed' : 'Job not found'}
        </Alert>
        <Button variant="contained" onClick={handleBackToJobs} startIcon={<BackIcon />}>
          Back to Jobs
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
              <WorkIcon sx={{ mr: 2, fontSize: 32 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Job Details
              </Typography>
            </Box>
            
            <Button
              color="inherit"
              onClick={handleBackToJobs}
              startIcon={<BackIcon />}
              sx={{ 
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }}
            >
              Back to Jobs
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column - Job Details */}
          <Grid item xs={12} lg={8}>
            {/* Job Header Card */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      {job.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CompanyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="h6" color="text.secondary">
                        {job.company}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                    <Chip
                      label={job.status}
                      color={getStatusColor(job.status) as any}
                      size="medium"
                      sx={{ fontWeight: 600 }}
                    />
                    {job.remote && (
                      <Chip
                        label="Remote"
                        color="info"
                        size="small"
                        icon={<RemoteIcon />}
                      />
                    )}
                  </Box>
                </Box>

                {/* Quick Info Grid */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Location:</strong> {job.location}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Type:</strong> 
                        <Chip 
                          label={job.type.replace('_', ' ')} 
                          color={getJobTypeColor(job.type) as any}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Experience:</strong> 
                        <Chip 
                          label={job.experience} 
                          color={getExperienceColor(job.experience) as any}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SalaryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Salary:</strong> ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} {job.salary.currency}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {job.deadline && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DeadlineIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ApplyIcon />}
                    onClick={handleApplyNow}
                    disabled={job.status !== 'ACTIVE'}
                    sx={{ minWidth: 150 }}
                  >
                    {job.status === 'ACTIVE' ? 'Apply Now' : 'Job Closed'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<BookmarkIcon />}
                    onClick={handleBookmarkToggle}
                  >
                    Bookmark
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ShareIcon />}
                    onClick={handleShareJob}
                  >
                    Share
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Job Description
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
                  {job.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                    <RequirementsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Requirements
                  </Typography>
                  <List>
                    {job.requirements.map((requirement, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <DoneIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={requirement} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                    <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Responsibilities
                  </Typography>
                  <List>
                    {job.responsibilities.map((responsibility, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <DoneIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={responsibility} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                    <EducationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Required Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        variant="outlined"
                        color="primary"
                        size="medium"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                    <BenefitsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Benefits
                  </Typography>
                  <List>
                    {job.benefits.map((benefit, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <StarIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column - Company Info & Quick Actions */}
          <Grid item xs={12} lg={4}>
            {/* Company Information */}
            <Card sx={{ mb: 4, position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Company Information
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
                  >
                    {job.company.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {job.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.location}
                    </Typography>
                  </Box>
                </Box>

                {/* <Divider sx={{ my: 2 }} /> */}
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Job Type
                    </Typography>
                    <Chip 
                      label={job.type.replace('_', ' ')} 
                      color={getJobTypeColor(job.type) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Experience Level
                    </Typography>
                    <Chip 
                      label={job.experience} 
                      color={getExperienceColor(job.experience) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Salary Range
                    </Typography>
                    <Typography variant="body2">
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {job.salary.currency} per year
                    </Typography>
                  </Box>
                  
                  {job.remote && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Work Arrangement
                      </Typography>
                      <Chip
                        label="Remote Available"
                        color="info"
                        size="small"
                        icon={<RemoteIcon />}
                      />
                    </Box>
                  )}
                  
                  {job.deadline && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Application Deadline
                      </Typography>
                      <Typography variant="body2" color="error.main">
                        {new Date(job.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Quick Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ApplyIcon />}
                    onClick={handleApplyNow}
                    disabled={job.status !== 'ACTIVE'}
                    fullWidth
                  >
                    {job.status === 'ACTIVE' ? 'Apply Now' : 'Job Closed'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<BookmarkIcon />}
                    onClick={handleBookmarkToggle}
                    fullWidth
                  >
                    Save Job
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ShareIcon />}
                    onClick={handleShareJob}
                    fullWidth
                  >
                    Share Job
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default JobDetails;
