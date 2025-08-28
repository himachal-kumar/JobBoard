/**
 * Employer Dashboard Page for Job Board Platform
 * 
 * This page provides employers with an overview of their job postings,
 * applications received, and key metrics for managing their hiring process.
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Alert,

  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Work as WorkIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as CompanyIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../store/store';
import { useGetEmployerJobsQuery, useGetEmployerApplicationsQuery, useUpdateApplicationStatusMutation, useDeleteJobMutation, useCloseJobMutation, useReopenJobMutation } from '../../services/api';
import ApplicationCard from '../../components/employers/ApplicationCard';

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
      id={`employer-tabpanel-${index}`}
      aria-labelledby={`employer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Employer Dashboard component
 * 
 * @returns JSX element representing the employer dashboard
 */
const EmployerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  // Fetch employer jobs from API - fetch all jobs without pagination limit
  const { data: jobsData, isLoading: jobsLoading, error: jobsError, refetch: refetchJobs } = useGetEmployerJobsQuery({
    page: 1,
    limit: 1000 // Increased limit to fetch all jobs
  });

  // Job management mutations
  const [deleteJob] = useDeleteJobMutation();
  const [closeJob] = useCloseJobMutation();
  const [reopenJob] = useReopenJobMutation();

  // Debug logging for jobs data
  React.useEffect(() => {
    console.log('EmployerDashboard - Jobs data:', jobsData);
    console.log('EmployerDashboard - Jobs loading:', jobsLoading);
    console.log('EmployerDashboard - Jobs error:', jobsError);
    console.log('EmployerDashboard - Job postings:', jobsData?.data || []);
  }, [jobsData, jobsLoading, jobsError]);

  const jobPostings = jobsData?.data || [];
  
  // Debug logging for jobs
  console.log('Employer Dashboard - Jobs Data:', jobsData);
  console.log('Employer Dashboard - Job Postings:', jobPostings);
  console.log('Employer Dashboard - Jobs Loading:', jobsLoading);
  console.log('Employer Dashboard - Jobs Error:', jobsError);

  // Fetch employer applications from API with real-time updates
  const { data: applicationsData, isLoading: applicationsLoading, refetch } = useGetEmployerApplicationsQuery({
    page: 1,
    limit: 1000 // Increased limit to fetch all applications
  });

  const recentApplications = applicationsData?.data?.applications || [];
  
  // Application status update mutation
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();
  
  // Refresh applications when component mounts or when needed
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  // Refresh jobs when component mounts
  React.useEffect(() => {
    refetchJobs();
  }, [refetchJobs]);

  // Debug logging for applications
  console.log('Employer Dashboard - Applications Data:', applicationsData);
  console.log('Employer Dashboard - Recent Applications:', recentApplications);
  console.log('Employer Dashboard - Applications Loading:', applicationsLoading);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePostJob = () => {
    navigate('/post-job');
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const handleViewApplications = (jobId: string) => {
    // Switch to applications tab and filter by job
    setTabValue(1);
    // You could also set a filter state here to show only applications for this job
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      await deleteJob(jobToDelete).unwrap();
      toast.success('Job deleted successfully!');
      refetchJobs(); // Refresh the jobs list
      setDeleteConfirmOpen(false);
      setJobToDelete(null);
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error(error?.data?.message || 'Failed to delete job');
    }
  };

  const cancelDeleteJob = () => {
    setDeleteConfirmOpen(false);
    setJobToDelete(null);
  };

  const handleCloseJob = async (jobId: string) => {
    try {
      await closeJob(jobId).unwrap();
      toast.success('Job closed successfully!');
      refetchJobs(); // Refresh the jobs list
    } catch (error: any) {
      console.error('Error closing job:', error);
      toast.error(error?.data?.message || 'Failed to close job');
    }
  };

  const handleReopenJob = async (jobId: string) => {
    try {
      await reopenJob(jobId).unwrap();
      toast.success('Job reopened successfully!');
      refetchJobs(); // Refresh the jobs list
    } catch (error: any) {
      console.error('Error reopening job:', error);
      toast.error(error?.data?.message || 'Failed to reopen job');
    }
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

  const handleApplicationStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus({ applicationId, status: newStatus }).unwrap();
      toast.success(`Application status updated to ${newStatus}`);
      refetch(); // Refresh applications data
    } catch (error: any) {
      toast.error(`Failed to update status: ${error?.data?.message || 'Unknown error'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'closed':
        return 'default';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'primary';
      case 'reviewing':
        return 'warning';
      case 'shortlisted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'accepted':
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getApplicationStatusText = (status: string) => {
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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Dashboard Header */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 3, mb: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CompanyIcon sx={{ mr: 2, fontSize: 32 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Employer Dashboard
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                color="inherit"
                startIcon={<WorkIcon />}
                onClick={() => navigate('/jobs')}
                variant="outlined"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Browse Jobs
              </Button>
              
              <Button
                color="inherit"
                startIcon={<AddIcon />}
                onClick={handlePostJob}
                variant="outlined"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Post Job
              </Button>
              
              <Button
                color="inherit"
                startIcon={<TrendingIcon />}
                onClick={() => refetch()}
                variant="outlined"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Refresh Apps
              </Button>
              
              <Button
                color="inherit"
                startIcon={<TrendingIcon />}
                onClick={() => refetchJobs()}
                variant="outlined"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Refresh Jobs
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome back, {user?.name || 'Employer'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your job postings and review applications from talented candidates
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
                      Active Jobs
                    </Typography>
                    <Typography variant="h4" component="div">
                      {jobPostings.filter(job => job.status === 'ACTIVE').length}
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
                      Total Applications
                    </Typography>
                    <Typography variant="h4" component="div">
                      {jobPostings.reduce((sum, job) => sum + (job.applications?.length || 0), 0)}
                    </Typography>
                  </Box>
                  <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
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
                      This Month
                    </Typography>
                    <Typography variant="h4" component="div">
                      {jobPostings.filter(job => 
                        job.createdAt && new Date(job.createdAt).getMonth() === new Date().getMonth()
                      ).length}
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
                      Company
                    </Typography>
                    <Typography variant="h6" component="div" noWrap>
                      {user?.company || 'Not Set'}
                    </Typography>
                  </Box>
                  <CompanyIcon color="primary" sx={{ fontSize: 40 }} />
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
            startIcon={<AddIcon />}
            onClick={handlePostJob}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Post New Job
          </Button>
        </Box>

        {/* Main Content Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="employer dashboard tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Job Postings" />
            <Tab label="Recent Applications" />
            <Tab label="Analytics" />
          </Tabs>

          {/* Job Postings Tab */}
          <TabPanel value={tabValue} index={0}>
            {/* Job Summary Header */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    All Posted Jobs ({jobPostings.length})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage and monitor all your job postings
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Chip 
                      label={`Active: ${jobPostings.filter(job => job.status === 'ACTIVE').length}`} 
                      color="success" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Draft: ${jobPostings.filter(job => job.status === 'DRAFT').length}`} 
                      color="warning" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Closed: ${jobPostings.filter(job => job.status === 'CLOSED').length}`} 
                      color="default" 
                      variant="outlined" 
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Search and Filter Bar */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Search Jobs
                  </Typography>
                  <input
                    type="text"
                    placeholder="Search by title, company, or location..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Status Filter
                  </Typography>
                  <select
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Sort By
                  </Typography>
                  <select
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="applications">Most Applications</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 2.5 }}
                    startIcon={<TrendingIcon />}
                    onClick={() => refetchJobs()}
                  >
                    Refresh
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {jobsLoading ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress size={40} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Loading jobs...
                </Typography>
              </Box>
            ) : jobsError ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  Failed to load jobs: {jobsError ? 'Request failed' : 'Unknown error'}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => window.location.reload()}
                  startIcon={<TrendingIcon />}
                >
                  Retry
                </Button>
              </Box>
            ) : jobPostings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No jobs posted yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Start posting jobs to see them here
                </Typography>
                <Button
                  variant="contained"
                  onClick={handlePostJob}
                  startIcon={<AddIcon />}
                >
                  Post Your First Job
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Showing all {jobPostings.length} posted jobs</strong> - Use the search and filter options above to find specific jobs quickly.
                    </Typography>
                  </Alert>
                </Box>
                <Grid container spacing={3}>
                {jobPostings.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1, mr: 2, lineHeight: 1.3 }}>
                          {job.title || 'Untitled Job'}
                        </Typography>
                        <Chip
                          label={job.status || 'Unknown'}
                          color={getStatusColor(job.status || '') as any}
                          size="small"
                          sx={{ minWidth: 80 }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CompanyIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {job.company || job.employer?.company || 'Company not specified'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {job.location || 'Location not specified'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <WorkIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.type || 'Type not specified'}
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
                            Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Date not available'}
                          </Typography>
                        </Box>
                        {job.deadline && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Deadline: {new Date(job.deadline).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <PeopleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          {job.applications?.length || 0} applications
                        </Typography>
                        {/* Status toggle button */}
                        {job.status === 'ACTIVE' ? (
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={() => handleCloseJob(job._id)}
                            sx={{ minWidth: 80 }}
                          >
                            Close Job
                          </Button>
                        ) : job.status === 'CLOSED' ? (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => handleReopenJob(job._id)}
                            sx={{ minWidth: 80 }}
                          >
                            Reopen Job
                          </Button>
                        ) : null}
                      </Box>

                      {/* Job Description Preview */}
                      {job.description && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4
                          }}>
                            {job.description}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewJob(job._id)}
                          variant="outlined"
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<PeopleIcon />}
                          onClick={() => handleViewApplications(job._id)}
                          variant="outlined"
                          disabled={!job.applications || job.applications.length === 0}
                        >
                          Applications ({job.applications?.length || 0})
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          title="Edit Job"
                          onClick={() => handleEditJob(job._id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          title="Delete Job"
                          onClick={() => handleDeleteJob(job._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            </>
            )}
          </TabPanel>

          {/* Recent Applications Tab */}
          <TabPanel value={tabValue} index={1}>
            {applicationsLoading ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress size={40} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Loading applications...
                </Typography>
              </Box>
            ) : recentApplications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No applications yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Applications will appear here when candidates apply to your jobs
                </Typography>
              </Box>
            ) : (
              <Box>
                {recentApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onStatusUpdate={handleApplicationStatusUpdate}
                  />
                ))}
              </Box>
            )}
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={tabValue} index={2}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Analytics dashboard is coming soon! This will include detailed insights about your job postings, 
              application trends, and candidate engagement metrics.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Application Trends
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track how your job postings are performing over time
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Candidate Quality
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Analyze the quality and fit of candidates applying to your positions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={cancelDeleteJob}
        aria-labelledby="delete-job-dialog-title"
        aria-describedby="delete-job-dialog-description"
      >
        <DialogTitle id="delete-job-dialog-title">
          Confirm Job Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-job-dialog-description">
            Are you sure you want to delete this job? This action cannot be undone and will remove all associated applications.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteJob} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteJob} color="error" variant="contained">
            Delete Job
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployerDashboard;
