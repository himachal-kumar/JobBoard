import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  Grid,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import {
  SkeletonItem,
  JobCardSkeleton,
  JobListSkeleton,
  ApplicationCardSkeleton,
  UserProfileSkeleton,
  FormSkeleton,
  TableSkeleton,
  DashboardSkeleton,
  NavigationSkeleton,
  SearchBarSkeleton,
  FilterSkeleton,
  PaginationSkeleton,
  LoadingOverlaySkeleton,
  ShimmerSkeleton,
} from './SkeletonLoader';
import { useSkeletonLoader } from '../../hooks/useSkeletonLoader';

export const SkeletonShowcase: React.FC = () => {
  const theme = useTheme();
  const [showOverlay, setShowOverlay] = useState(false);
  const [animationType, setAnimationType] = useState<'wave' | 'pulse' | 'shimmer'>('wave');
  const [delay, setDelay] = useState(300);
  const [minDisplayTime, setMinDisplayTime] = useState(500);

  // Example usage of the skeleton loader hook
  const loader = useSkeletonLoader({
    delay,
    minDisplayTime,
    showOnMount: true,
  });

  const handleToggleLoading = () => {
    if (loader.isLoading) {
      loader.stopLoading();
    } else {
      loader.startLoading();
    }
  };

  const handleShowOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        Skeleton Loader Showcase
      </Typography>

      {/* Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Controls</Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={loader.isLoading}
                    onChange={handleToggleLoading}
                  />
                }
                label="Toggle Loading"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={animationType === 'shimmer'}
                    onChange={(e) => setAnimationType(e.target.checked ? 'shimmer' : 'wave')}
                  />
                }
                label="Shimmer Effect"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Delay: {delay}ms</Typography>
              <Slider
                value={delay}
                onChange={(_, value) => setDelay(value as number)}
                min={0}
                max={1000}
                step={50}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Min Display: {minDisplayTime}ms</Typography>
              <Slider
                value={minDisplayTime}
                onChange={(_, value) => setMinDisplayTime(value as number)}
                min={100}
                max={2000}
                step={100}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleShowOverlay}>
              Show Loading Overlay (3s)
            </Button>
            <Button variant="outlined" onClick={loader.resetLoading}>
              Reset Loader
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Basic Skeletons */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Basic Skeletons</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <SkeletonItem variant="text" width="100%" height={20} />
                <SkeletonItem variant="text" width="80%" height={20} />
                <SkeletonItem variant="text" width="60%" height={20} />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <SkeletonItem variant="circular" width={40} height={40} />
                  <SkeletonItem variant="text" width={100} height={20} />
                </Box>
                <SkeletonItem variant="rounded" width="100%" height={56} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Animation Variants</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" gutterBottom>Wave Animation</Typography>
                  <SkeletonItem variant="text" width="100%" height={20} animation="wave" />
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>Pulse Animation</Typography>
                  <SkeletonItem variant="text" width="100%" height={20} animation="pulse" />
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>Shimmer Effect</Typography>
                  <ShimmerSkeleton variant="text" width="100%" height={20} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Job Related Skeletons */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Job Card Skeleton</Typography>
              <JobCardSkeleton />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Application Card Skeleton</Typography>
              <ApplicationCardSkeleton />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Job List Skeleton */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Job List Skeleton (3 items)</Typography>
          <JobListSkeleton count={3} />
        </CardContent>
      </Card>

      {/* Form and Profile Skeletons */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Form Skeleton</Typography>
              <FormSkeleton />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>User Profile Skeleton</Typography>
              <UserProfileSkeleton />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table Skeleton */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Table Skeleton (5 rows, 4 columns)</Typography>
          <TableSkeleton rows={5} columns={4} />
        </CardContent>
      </Card>

      {/* Dashboard Skeleton */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Dashboard Skeleton</Typography>
          <DashboardSkeleton />
        </CardContent>
      </Card>

      {/* Navigation and Search Skeletons */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Navigation Skeleton</Typography>
              <NavigationSkeleton />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Search Bar Skeleton</Typography>
              <SearchBarSkeleton />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Pagination Skeletons */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Filter Skeleton</Typography>
              <FilterSkeleton />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Pagination Skeleton</Typography>
              <PaginationSkeleton />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Hook Usage Example */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Hook Usage Example</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This section demonstrates the useSkeletonLoader hook in action. 
            Toggle the loading state above to see the skeleton appear and disappear.
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Loading State: {loader.isLoading ? 'Loading...' : 'Idle'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Showing Skeleton: {loader.showSkeleton ? 'Yes' : 'No'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button variant="outlined" onClick={loader.showSkeleton}>
              Show Skeleton
            </Button>
            <Button variant="outlined" onClick={loader.hideSkeleton}>
              Hide Skeleton
            </Button>
          </Box>

          {/* Example of conditional rendering */}
          <Box>
            <Typography variant="h6" gutterBottom>Conditional Rendering Example</Typography>
            {loader.renderConditionally(
              loader.isLoading ? null : { name: 'Sample Data', description: 'This is sample content' },
              (data) => (
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Typography variant="h6">{data.name}</Typography>
                  <Typography>{data.description}</Typography>
                </Paper>
              ),
              () => (
                <Paper sx={{ p: 2 }}>
                  <SkeletonItem variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                  <SkeletonItem variant="text" width="100%" height={16} />
                </Paper>
              )
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Loading Overlay */}
      {showOverlay && <LoadingOverlaySkeleton />}
    </Box>
  );
};

export default SkeletonShowcase;
