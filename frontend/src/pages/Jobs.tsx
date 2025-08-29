/**
 * Jobs Page for Job Board Platform
 * 
 * This page displays all available job listings with comprehensive
 * filtering, search, and sorting capabilities. It includes both
 * the job filters sidebar and the main job listings area.
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Fab,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import { Job, JobFilters as JobFiltersType, UserRole } from '../types/jobBoard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSearchJobsQuery } from '../services/api';
import { JobListSkeleton, FilterSkeleton, SearchBarSkeleton } from '../components/common/SkeletonLoader';
import { useJobListLoader } from '../hooks/useSkeletonLoader';

/**
 * Sort options for job listings
 */
type SortOption = 'recent' | 'salary-high' | 'salary-low' | 'applications';

/**
 * Jobs page component
 * 
 * @returns JSX element representing the jobs page
 */
const Jobs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State management
  const [filters, setFilters] = useState<JobFiltersType>({});
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Get user role from auth context
  const { user } = useAuth();
  const userRole: UserRole = user?.role || 'CANDIDATE';
  
  // Skeleton loader hook
  const skeletonLoader = useJobListLoader({
    delay: 200,
    minDisplayTime: 800,
  });
  
  // API query for jobs - show all jobs by default
  const { data: jobsData, isLoading, error } = useSearchJobsQuery({
    search: '', // Empty search to get all jobs
    page: currentPage,
    limit: jobsPerPage,
  });

  // Fix data mapping - backend returns jobs directly in data array, not nested under 'jobs' property
  const jobs = Array.isArray(jobsData?.data) ? jobsData.data : [];
  const totalJobs = jobsData?.pagination?.total || 0;
  const totalPages = jobsData?.pagination?.totalPages || jobsData?.pagination?.pages || 1;
  
  // Sync skeleton loader with API loading state
  useEffect(() => {
    if (isLoading) {
      skeletonLoader.startLoading();
    } else {
      skeletonLoader.stopLoading();
    }
  }, [isLoading, skeletonLoader]);
  
  /**
   * Handle filter changes
   */
  const handleFiltersChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
  };
  
  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setFilters({});
  };
  
  /**
   * Handle job application
   */
  const handleApply = (jobId: string) => {
    // In a real app, this would navigate to application form or apply directly
    console.log('Apply for job:', jobId);
    navigate(`/job/${jobId}`);
  };

  /**
   * Handle bookmark toggle
   */
  const handleBookmarkToggle = (jobId: string) => {
    // In a real app, this would toggle bookmark via API
    console.log('Toggle bookmark for job:', jobId);
  };

  /**
   * Handle job sharing
   */
  const handleShare = (job: Job) => {
    // In a real app, this would share the job
    console.log('Share job:', job.title);
  };
  
  /**
   * Handle view job details
   */
  const handleViewDetails = (jobId: string) => {
    // In a real app, this would navigate to detailed job view
    console.log('View job details:', jobId);
    navigate(`/job/${jobId}`);
  };
  
  /**
   * Handle sort change
   */
  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };
  
  /**
   * Handle page change
   */
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Calculate pagination
   */
  // Use jobs directly from API (pagination is handled by the backend)
  const currentJobs = jobs;
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
          All Available Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse {totalJobs} job opportunities from top companies
        </Typography>
      </Box>
      
      {/* Mobile Filter FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filters"
          onClick={() => setMobileFiltersOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <FilterIcon />
        </Fab>
      )}
      
      <Grid container spacing={3}>
        {/* Filters Sidebar - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                💡 <strong>Tip:</strong> All jobs are shown by default. Use filters to narrow down your search.
              </Typography>
            </Paper>
            <JobFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </Grid>
        )}
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Results Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between',
              gap: 2
            }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {isLoading ? 'Loading jobs...' : `${totalJobs} jobs available`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All jobs are displayed below. Use filters to narrow down your search.
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 2,
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    label="Sort by"
                    startAdornment={<SortIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="recent">Most Recent</MenuItem>
                    <MenuItem value="salary-high">Highest Salary</MenuItem>
                    <MenuItem value="salary-low">Lowest Salary</MenuItem>
                    <MenuItem value="applications">Most Applications</MenuItem>
                  </Select>
                </FormControl>
                
                {isMobile && (
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setMobileFiltersOpen(true)}
                    fullWidth
                  >
                    Filters
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
          

          
          {/* Job Listings */}
          {skeletonLoader.showSkeleton ? (
            // Loading state with skeleton
            <Box>
              <JobListSkeleton count={6} />
            </Box>
          ) : error ? (
            // Error state
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                Error loading jobs
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {JSON.stringify(error)}
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                startIcon={<SearchIcon />}
              >
                Retry
              </Button>
            </Paper>
          ) : jobs.length === 0 ? (
            // No results state
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No jobs available
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                There are currently no job postings available. Check back later for new opportunities.
              </Typography>
            </Paper>
          ) : (
            // Job listings
            <Box>
              {currentJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  userRole={userRole}
                  onApply={handleApply}
                  onShare={handleShare}
                  onViewDetails={handleViewDetails}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
      
      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="right"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
          sx: { width: '100%', maxWidth: 400 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          

          
          <JobFilters
            filters={filters}
            onFiltersChange={(newFilters) => {
              handleFiltersChange(newFilters);
              setMobileFiltersOpen(false);
            }}
            onClearFilters={() => {
              handleClearFilters();
              setMobileFiltersOpen(false);
            }}
          />
        </Box>
      </Drawer>
    </Container>
  );
};

export default Jobs;
