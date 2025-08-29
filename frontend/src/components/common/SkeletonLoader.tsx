import React from 'react';
import { Skeleton, Box, Card, CardContent, Grid, useTheme } from '@mui/material';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
  className?: string;
}

// Basic skeleton component
export const SkeletonItem: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'wave',
  className,
}) => {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      className={className}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        '&::after': {
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
        },
      }}
    />
  );
};

// Job card skeleton
export const JobCardSkeleton: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Card className="card-hover" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <SkeletonItem variant="circular" width={60} height={60} />
          <Box sx={{ flex: 1 }}>
            <SkeletonItem variant="text" width="80%" height={24} />
            <SkeletonItem variant="text" width="60%" height={20} />
            <SkeletonItem variant="text" width="40%" height={16} />
          </Box>
        </Box>
        
        <SkeletonItem variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <SkeletonItem variant="text" width="90%" height={16} sx={{ mb: 1 }} />
        <SkeletonItem variant="text" width="70%" height={16} sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <SkeletonItem variant="rounded" width={80} height={32} />
          <SkeletonItem variant="rounded" width={100} height={32} />
          <SkeletonItem variant="rounded" width={70} height={32} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SkeletonItem variant="text" width={100} height={16} />
          <SkeletonItem variant="rounded" width={120} height={36} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Job list skeleton with multiple cards
export const JobListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <JobCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

// Application card skeleton
export const ApplicationCardSkeleton: React.FC = () => {
  return (
    <Card className="card-hover">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SkeletonItem variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <SkeletonItem variant="text" width="70%" height={20} />
            <SkeletonItem variant="text" width="50%" height={16} />
          </Box>
          <SkeletonItem variant="rounded" width={80} height={28} />
        </Box>
        
        <SkeletonItem variant="text" width="100%" height={16} sx={{ mb: 1 }} />
        <SkeletonItem variant="text" width="85%" height={16} sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SkeletonItem variant="text" width={120} height={16} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <SkeletonItem variant="rounded" width={80} height={32} />
            <SkeletonItem variant="rounded" width={80} height={32} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// User profile skeleton
export const UserProfileSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <SkeletonItem variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
          <SkeletonItem variant="text" width="60%" height={28} sx={{ mx: 'auto', mb: 1 }} />
          <SkeletonItem variant="text" width="40%" height={20} sx={{ mx: 'auto' }} />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <SkeletonItem variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <SkeletonItem variant="text" width="90%" height={16} sx={{ mb: 1 }} />
          <SkeletonItem variant="text" width="80%" height={16} />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <SkeletonItem variant="rounded" width={100} height={32} />
          <SkeletonItem variant="rounded" width={120} height={32} />
          <SkeletonItem variant="rounded" width={90} height={32} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Form skeleton
export const FormSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <SkeletonItem variant="text" width="40%" height={32} sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <SkeletonItem variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <SkeletonItem variant="rounded" width="100%" height={56} />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <SkeletonItem variant="text" width="25%" height={20} sx={{ mb: 1 }} />
          <SkeletonItem variant="rounded" width="100%" height={56} />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <SkeletonItem variant="text" width="35%" height={20} sx={{ mb: 1 }} />
          <SkeletonItem variant="rounded" width="100%" height={120} />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <SkeletonItem variant="rounded" width={100} height={40} />
          <SkeletonItem variant="rounded" width={120} height={40} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <SkeletonItem variant="text" width="30%" height={32} />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            {Array.from({ length: columns }).map((_, index) => (
              <Grid item xs key={index}>
                <SkeletonItem variant="text" width="100%" height={24} />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box key={rowIndex} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Grid item xs key={colIndex}>
                  <SkeletonItem variant="text" width="100%" height={20} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

// Dashboard skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <SkeletonItem variant="text" width="40%" height={40} sx={{ mb: 4 }} />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <SkeletonItem variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                <SkeletonItem variant="text" width="40%" height={32} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <SkeletonItem variant="text" width="50%" height={28} sx={{ mb: 2 }} />
              <SkeletonItem variant="rounded" width="100%" height={300} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <SkeletonItem variant="text" width="70%" height={28} sx={{ mb: 2 }} />
              {Array.from({ length: 5 }).map((_, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SkeletonItem variant="circular" width={32} height={32} />
                  <Box sx={{ flex: 1 }}>
                    <SkeletonItem variant="text" width="80%" height={16} />
                    <SkeletonItem variant="text" width="60%" height={14} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Navigation skeleton
export const NavigationSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <SkeletonItem variant="text" width={120} height={32} />
      <SkeletonItem variant="text" width={80} height={32} />
      <SkeletonItem variant="text" width={100} height={32} />
      <SkeletonItem variant="text" width={90} height={32} />
    </Box>
  );
};

// Search bar skeleton
export const SearchBarSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <SkeletonItem variant="rounded" width={300} height={48} />
      <SkeletonItem variant="rounded" width={100} height={48} />
    </Box>
  );
};

// Filter skeleton
export const FilterSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      <SkeletonItem variant="rounded" width={120} height={36} />
      <SkeletonItem variant="rounded" width={100} height={36} />
      <SkeletonItem variant="rounded" width={140} height={36} />
      <SkeletonItem variant="rounded" width={90} height={36} />
    </Box>
  );
};

// Pagination skeleton
export const PaginationSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
      <SkeletonItem variant="rounded" width={40} height={40} />
      <SkeletonItem variant="rounded" width={40} height={40} />
      <SkeletonItem variant="rounded" width={40} height={40} />
      <SkeletonItem variant="rounded" width={40} height={40} />
      <SkeletonItem variant="rounded" width={40} height={40} />
    </Box>
  );
};

// Loading overlay skeleton
export const LoadingOverlaySkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <SkeletonItem variant="circular" width={80} height={80} sx={{ mb: 2 }} />
      <SkeletonItem variant="text" width={200} height={24} />
      <SkeletonItem variant="text" width={150} height={16} />
    </Box>
  );
};

// Shimmer effect skeleton (alternative to wave animation)
export const ShimmerSkeleton: React.FC<SkeletonLoaderProps> = (props) => {
  return (
    <Skeleton
      {...props}
      animation={false}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
          animation: 'shimmer 1.5s infinite',
        },
        '@keyframes shimmer': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      }}
    />
  );
};

export default SkeletonItem;
