/**
 * Candidate Dashboard Page for Job Board Platform
 * 
 * This page provides candidates with an overview of their job applications,
 * saved jobs, and personalized job recommendations.
 */

import React, { useState } from 'react';
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
  Divider,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  Bookmark as BookmarkIcon,
  TrendingUp as TrendingIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Send as ApplyIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,

  Star as StarIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useSearchJobsQuery, useGetCandidateApplicationsQuery, useSubmitApplicationMutation } from '../../services/api';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`candidate-tabpanel-${index}`}
      aria-labelledby={`candidate-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Candidate Dashboard component
 * 
 * @returns JSX element representing the candidate dashboard
 */
const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  // Helper function to safely format dates
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

  // Fetch all available jobs from /api/jobs
  const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useSearchJobsQuery({
    page: 1,
    limit: 20
  });

  // Fix data mapping - backend returns jobs directly in data array
  const availableJobs = jobsData?.data || [];

  // Fetch applications from API with real-time updates
  const { data: applicationsData, isLoading: applicationsLoading, refetch } = useGetCandidateApplicationsQuery({
    page: 1,
    limit: 20
  });

  const applications = applicationsData?.data?.applications || [];
  
  // Submit application mutation
  const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
  
  // Refresh applications when component mounts or when needed
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  // Use real jobs data for saved and recommended jobs (for now, using available jobs)
  // In a real app, these would come from separate API endpoints
  const savedJobs = availableJobs.slice(0, 3); // First 3 jobs as saved
  const recommendedJobs = availableJobs.slice(0, 3); // First 3 jobs as recommended

  // Debug logging to see what data we're getting (remove in production)
  // console.log('Jobs Data:', jobsData);
  // console.log('Available Jobs:', availableJobs);
  // console.log('Jobs Loading:', jobsLoading);
  // console.log('Jobs Error:', jobsError);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBrowseJobs = () => {
    navigate('/jobs');
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const handleApplyJob = async (jobId: string) => {
    console.log('handleApplyJob called with jobId:', jobId);
    
    // Check if user is authenticated and is a candidate
    if (!user) {
      console.log('No user found, redirecting to login');
      toast.error('Please log in to apply for jobs');
      navigate('/login');
      return;
    }

    console.log('User object:', user);
    console.log('User role:', user.role);

    // Check if user is a candidate
    if (user.role !== 'CANDIDATE') {
      console.log('User role:', user.role);
      toast.error('Only candidates can apply for jobs');
      return;
    }

    const targetUrl = `/job/${jobId}/resume-upload`;
    console.log('Navigating to:', targetUrl);
    
    // Navigate to the resume upload page for this specific job
    navigate(targetUrl);
  
    console.log('Navigation completed');
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    // In real app, this would handle logout logic
    console.log('User logged out');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleSettings = () => {
    // Navigate to settings page
    console.log('Navigate to settings');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'primary';
      case 'under review':
        return 'warning';
      case 'shortlisted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Dashboard Header */}
      <Box sx={{ backgroundColor: 'secondary.main', color: 'white', py: 3, mb: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 2, fontSize: 32 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Candidate Dashboard
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                color="inherit"
                startIcon={<SearchIcon />}
                onClick={handleBrowseJobs}
                variant="outlined"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Browse Jobs
              </Button>
              
              <Button
                color="inherit"
                startIcon={<WorkIcon />}
                onClick={() => navigate('/applications')}
                variant="outlined"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                My Applications
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome back, {user?.name || 'Candidate'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your job applications, manage saved positions, and discover new opportunities
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Applications
                    </Typography>
                    <Typography variant="h4" component="div">
                      {applications.length}
                    </Typography>
                  </Box>
                  <WorkIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Saved Jobs
                    </Typography>
                    <Typography variant="h4" component="div">
                      {savedJobs.length}
                    </Typography>
                  </Box>
                  <BookmarkIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Under Review
                    </Typography>
                    <Typography variant="h4" component="div">
                      {applications.filter(app => app.status === 'PENDING' || app.status === 'SHORTLISTED').length}
                    </Typography>
                  </Box>
                  <TrendingIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Skills
                    </Typography>
                    <Typography variant="h6" component="div" noWrap>
                      {user?.skills?.length || 0} Skills
                    </Typography>
                  </Box>
                  <StarIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleBrowseJobs}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Find New Jobs
          </Button>
        </Box>

        {/* Main Content Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="candidate dashboard tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="My Applications" />
            <Tab label="Saved Jobs" />
            <Tab label="Recommended Jobs" />
            <Tab label="All Available Jobs" />
          </Tabs>

          {/* Applications Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {applications.map((application) => (
                <Grid item xs={12} md={6} key={application._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1, mr: 2 }}>
                          {application.job.title}
                        </Typography>
                        <Chip
                          label={application.status}
                          color={getStatusColor(application.status) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar src={application.job?.employer?.image} sx={{ width: 24, height: 24, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {application.job?.company || application.job?.employer?.name || 'Company'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {application.job?.location || 'Location not specified'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <WorkIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {application.job?.type || 'Type not specified'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SalaryIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            ${application.job?.salary?.min?.toLocaleString() || 'N/A'} - ${application.job?.salary?.max?.toLocaleString() || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Applied: {formatDate(application.appliedAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewJob(application._id)}
                      >
                        View Job
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<BookmarkIcon />}
                      >
                        Save
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Saved Jobs Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {savedJobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                        {job.title}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                            <BusinessIcon />
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            {job.company}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.location} {job.remote && '(Remote)'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <WorkIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.type}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SalaryIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            ${job.salary?.min?.toLocaleString() || 'N/A'} - ${job.salary?.max?.toLocaleString() || 'N/A'} {job.salary?.currency || 'USD'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Posted: {formatDate(job.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                                              <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Required Skills:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {job.skills && job.skills.length > 0 ? (
                              job.skills.map((skill: string, index: number) => (
                                <Chip
                                  key={index}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No skills specified
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewJob(job._id)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ApplyIcon />}
                        variant="contained"
                        onClick={() => handleApplyJob(job._id)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Applying...' : 'Apply'}
                      </Button>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Recommended Jobs Tab */}
          <TabPanel value={tabValue} index={2}>
            <Alert severity="info" sx={{ mb: 3 }}>
              These job recommendations are based on your skills, experience, and preferences. 
              Keep your profile updated for better matches!
            </Alert>
            
            <Grid container spacing={3}>
              {recommendedJobs.map((job) => (
                <Grid item xs={12} md={6} key={job._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1, mr: 2 }}>
                          {job.title}
                        </Typography>
                        <Chip
                          label="Recommended"
                          color="success"
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                            <BusinessIcon />
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            {job.company}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.location} {job.remote && '(Remote)'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <WorkIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.type}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SalaryIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            ${job.salary?.min?.toLocaleString() || 'N/A'} - ${job.salary?.max?.toLocaleString() || 'N/A'} {job.salary?.currency || 'USD'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Required Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {job.skills && job.skills.length > 0 ? (
                            job.skills.map((skill: string, index: number) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No skills specified
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Experience Level:
                        </Typography>
                        <Chip
                          label={job.experience || 'Not specified'}
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewJob(job._id)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ApplyIcon />}
                        variant="contained"
                        onClick={() => handleApplyJob(job._id)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Applying...' : 'Apply Now'}
                      </Button>
                      <IconButton size="small" color="primary">
                        <BookmarkIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* All Available Jobs Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                All Available Jobs
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Browse through all active job postings from employers. Find opportunities that match your skills and interests.
              </Typography>
              

            </Box>

            {jobsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Loading jobs...
                </Typography>
              </Box>
            ) : jobsError ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Failed to load jobs
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Error: {jobsError ? 'Request failed' : 'Unknown error occurred'}
                </Typography>
                <Typography variant="body2">
                  Please check your connection and try again later.
                </Typography>
              </Alert>
            ) : availableJobs.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No jobs available at the moment
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  This could mean:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>No jobs have been posted yet</li>
                  <li>All jobs are currently closed</li>
                  <li>There might be a connection issue</li>
                </ul>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Check back later for new opportunities!
                </Typography>
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {availableJobs.map((job) => (
                  <Grid item xs={12} md={6} lg={4} key={job._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                          {job.title}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.company || job.employer?.name || 'Company'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WorkIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.type}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <SalaryIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()} {job.salary?.currency}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Posted: {formatDate(job.createdAt)} ({job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : 'N/A'})
                            </Typography>
                          </Box>
                          {job.remote && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Chip
                                label="Remote"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Required Skills:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {job.skills && job.skills.length > 0 ? (
                              <>
                                {job.skills.slice(0, 3).map((skill: string, index: number) => (
                                  <Chip
                                    key={index}
                                    label={skill}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                  />
                                ))}
                                {job.skills.length > 3 && (
                                  <Chip
                                    label={`+${job.skills.length - 3} more`}
                                    size="small"
                                    variant="outlined"
                                    color="default"
                                  />
                                )}
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No skills specified
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Experience Level:
                          </Typography>
                          <Chip
                            label={job.experience || 'Not specified'}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                      
                      <CardActions sx={{ mt: 'auto' }}>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewJob(job._id)}
                          fullWidth
                          variant="outlined"
                        >
                          View Details
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ApplyIcon />}
                          variant="contained"
                          onClick={() => handleApplyJob(job._id)}
                          disabled={isSubmitting}
                          fullWidth
                        >
                          {isSubmitting ? 'Applying...' : 'Apply Now'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default CandidateDashboard;
