# Skeleton Loader System Documentation

## Overview

This project features a comprehensive skeleton loader system that provides smooth, professional loading states for all components. The system includes pre-built skeleton components, a powerful hook for managing loading states, and seamless integration with the theme system.

## Features

### 🚀 **Comprehensive Skeleton Components**
- **Job-related**: Job cards, application cards, job lists
- **UI Components**: Forms, tables, navigation, search bars
- **Layout Components**: Dashboards, user profiles, filters
- **Customizable**: Configurable sizes, counts, and layouts

### ⚡ **Smart Loading Management**
- **Intelligent Timing**: Configurable delays and minimum display times
- **Smooth Transitions**: Prevents flickering and jarring changes
- **Performance Optimized**: Efficient state management and cleanup

### 🎨 **Theme Integration**
- **Automatic Adaptation**: Works with both light and dark themes
- **Consistent Styling**: Matches your app's design system
- **Animation Variants**: Wave, pulse, and shimmer effects

### 🔧 **Developer Experience**
- **Easy Integration**: Simple hook-based API
- **TypeScript Support**: Full type safety and IntelliSense
- **Flexible Configuration**: Customizable for different use cases

## Component Library

### Basic Skeletons

#### `SkeletonItem`
The foundation component for all skeleton elements.

```tsx
import { SkeletonItem } from '../components/common/SkeletonLoader';

// Basic usage
<SkeletonItem variant="text" width="100%" height={20} />

// With custom animation
<SkeletonItem 
  variant="rounded" 
  width={200} 
  height={40} 
  animation="pulse" 
/>
```

**Props:**
- `variant`: 'text' | 'circular' | 'rectangular' | 'rounded'
- `width`: number | string
- `height`: number | string
- `animation`: 'pulse' | 'wave' | false
- `className`: string

### Job-Related Skeletons

#### `JobCardSkeleton`
Complete skeleton for job listing cards.

```tsx
import { JobCardSkeleton } from '../components/common/SkeletonLoader';

<JobCardSkeleton />
```

#### `JobListSkeleton`
Grid of multiple job card skeletons.

```tsx
import { JobListSkeleton } from '../components/common/SkeletonLoader';

// Default 6 items
<JobListSkeleton />

// Custom count
<JobListSkeleton count={12} />
```

#### `ApplicationCardSkeleton`
Skeleton for job application cards.

```tsx
import { ApplicationCardSkeleton } from '../components/common/SkeletonLoader';

<ApplicationCardSkeleton />
```

### Form and UI Skeletons

#### `FormSkeleton`
Complete form layout skeleton.

```tsx
import { FormSkeleton } from '../components/common/SkeletonLoader';

<FormSkeleton />
```

#### `UserProfileSkeleton`
User profile page skeleton.

```tsx
import { UserProfileSkeleton } from '../components/common/SkeletonLoader';

<UserProfileSkeleton />
```

#### `TableSkeleton`
Data table skeleton with configurable rows and columns.

```tsx
import { TableSkeleton } from '../components/common/SkeletonLoader';

// Default 5 rows, 4 columns
<TableSkeleton />

// Custom configuration
<TableSkeleton rows={10} columns={6} />
```

### Layout Skeletons

#### `DashboardSkeleton`
Complete dashboard layout skeleton.

```tsx
import { DashboardSkeleton } from '../components/common/SkeletonLoader';

<DashboardSkeleton />
```

#### `NavigationSkeleton`
Navigation menu skeleton.

```tsx
import { NavigationSkeleton } from '../components/common/SkeletonLoader';

<NavigationSkeleton />
```

#### `SearchBarSkeleton`
Search input and button skeleton.

```tsx
import { SearchBarSkeleton } from '../components/common/SkeletonLoader';

<SearchBarSkeleton />
```

### Specialized Skeletons

#### `FilterSkeleton`
Filter controls skeleton.

```tsx
import { FilterSkeleton } from '../components/common/SkeletonLoader';

<FilterSkeleton />
```

#### `PaginationSkeleton`
Pagination controls skeleton.

```tsx
import { PaginationSkeleton } from '../components/common/SkeletonLoader';

<PaginationSkeleton />
```

#### `LoadingOverlaySkeleton`
Full-screen loading overlay.

```tsx
import { LoadingOverlaySkeleton } from '../components/common/SkeletonLoader';

<LoadingOverlaySkeleton />
```

#### `ShimmerSkeleton`
Custom shimmer effect skeleton.

```tsx
import { ShimmerSkeleton } from '../components/common/SkeletonLoader';

<ShimmerSkeleton variant="text" width="100%" height={20} />
```

## Hook System

### `useSkeletonLoader`

The main hook for managing skeleton loading states.

```tsx
import { useSkeletonLoader } from '../hooks/useSkeletonLoader';

const MyComponent = () => {
  const loader = useSkeletonLoader({
    delay: 300,
    minDisplayTime: 500,
    autoHide: true,
    showOnMount: false,
  });

  return (
    <div>
      {loader.renderConditionally(
        data,
        (data) => <DataComponent data={data} />,
        () => <SkeletonComponent />
      )}
    </div>
  );
};
```

**Options:**
- `delay`: Milliseconds before showing skeleton (default: 300)
- `minDisplayTime`: Minimum time to show skeleton (default: 500)
- `autoHide`: Whether to automatically hide after loading (default: true)
- `showOnMount`: Whether to show skeleton on component mount (default: false)

**Returned Methods:**
- `startLoading()`: Start the loading state
- `stopLoading()`: Stop the loading state
- `resetLoading()`: Reset all loading state
- `toggleLoading()`: Toggle between loading and idle
- `showSkeleton()`: Show skeleton immediately
- `hideSkeleton()`: Hide skeleton immediately

**Utility Methods:**
- `withSkeleton(data, skeleton)`: Conditional rendering helper
- `renderConditionally(data, renderData, renderSkeleton)`: Advanced conditional rendering

### Specialized Hooks

#### `useJobListLoader`
Optimized for job listing pages.

```tsx
import { useJobListLoader } from '../hooks/useSkeletonLoader';

const loader = useJobListLoader({
  delay: 200,
  minDisplayTime: 800,
});
```

#### `useFormLoader`
Optimized for form loading states.

```tsx
import { useFormLoader } from '../hooks/useSkeletonLoader';

const loader = useFormLoader({
  delay: 100,
  minDisplayTime: 600,
});
```

#### `useProfileLoader`
Optimized for profile page loading.

```tsx
import { useProfileLoader } from '../hooks/useSkeletonLoader';

const loader = useProfileLoader({
  delay: 150,
  minDisplayTime: 700,
});
```

#### `useDashboardLoader`
Optimized for dashboard loading.

```tsx
import { useDashboardLoader } from '../hooks/useSkeletonLoader';

const loader = useDashboardLoader({
  delay: 100,
  minDisplayTime: 1000,
});
```

#### `useTableLoader`
Optimized for table data loading.

```tsx
import { useTableLoader } from '../hooks/useSkeletonLoader';

const loader = useTableLoader({
  delay: 250,
  minDisplayTime: 900,
});
```

## Usage Examples

### Basic Integration

```tsx
import React, { useEffect } from 'react';
import { useJobListLoader } from '../hooks/useSkeletonLoader';
import { JobListSkeleton } from '../components/common/SkeletonLoader';

const JobsPage = () => {
  const loader = useJobListLoader();
  const { data: jobs, isLoading } = useJobsQuery();

  useEffect(() => {
    if (isLoading) {
      loader.startLoading();
    } else {
      loader.stopLoading();
    }
  }, [isLoading, loader]);

  return (
    <div>
      {loader.renderConditionally(
        jobs,
        (jobs) => jobs.map(job => <JobCard key={job.id} job={job} />),
        () => <JobListSkeleton count={6} />
      )}
    </div>
  );
};
```

### Advanced Usage with Custom Timing

```tsx
import React from 'react';
import { useSkeletonLoader } from '../hooks/useSkeletonLoader';
import { FormSkeleton } from '../components/common/SkeletonLoader';

const ProfileForm = () => {
  const loader = useSkeletonLoader({
    delay: 500,        // Wait 500ms before showing skeleton
    minDisplayTime: 1000, // Show skeleton for at least 1 second
    autoHide: true,    // Automatically hide when done
  });

  const handleSubmit = async (data) => {
    loader.startLoading();
    try {
      await updateProfile(data);
    } finally {
      loader.stopLoading();
    }
  };

  return (
    <div>
      {loader.withSkeleton(
        <ProfileFormComponent onSubmit={handleSubmit} />,
        <FormSkeleton />
      )}
    </div>
  );
};
```

### Manual Control

```tsx
import React from 'react';
import { useSkeletonLoader } from '../hooks/useSkeletonLoader';
import { LoadingOverlaySkeleton } from '../components/common/SkeletonLoader';

const DataTable = () => {
  const loader = useSkeletonLoader({ autoHide: false });

  const handleRefresh = () => {
    loader.showSkeleton();
    // Perform refresh logic
    setTimeout(() => {
      loader.hideSkeleton();
    }, 2000);
  };

  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      {loader.showSkeleton && <LoadingOverlaySkeleton />}
    </div>
  );
};
```

## Integration with API Calls

### RTK Query Integration

```tsx
import React, { useEffect } from 'react';
import { useGetJobsQuery } from '../services/api';
import { useJobListLoader } from '../hooks/useSkeletonLoader';
import { JobListSkeleton } from '../components/common/SkeletonLoader';

const JobsList = () => {
  const loader = useJobListLoader();
  const { data: jobs, isLoading, error } = useGetJobsQuery();

  useEffect(() => {
    if (isLoading) {
      loader.startLoading();
    } else {
      loader.stopLoading();
    }
  }, [isLoading, loader]);

  if (error) return <ErrorComponent error={error} />;

  return (
    <div>
      {loader.renderConditionally(
        jobs,
        (jobs) => (
          <div>
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ),
        () => <JobListSkeleton count={8} />
      )}
    </div>
  );
};
```

### Custom API Integration

```tsx
import React, { useState, useEffect } from 'react';
import { useSkeletonLoader } from '../hooks/useSkeletonLoader';
import { UserProfileSkeleton } from '../components/common/SkeletonLoader';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const loader = useSkeletonLoader();

  useEffect(() => {
    const fetchProfile = async () => {
      loader.startLoading();
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } finally {
        loader.stopLoading();
      }
    };

    fetchProfile();
  }, [loader]);

  return (
    <div>
      {loader.renderConditionally(
        profile,
        (profile) => <ProfileComponent profile={profile} />,
        () => <UserProfileSkeleton />
      )}
    </div>
  );
};
```

## Customization

### Creating Custom Skeletons

```tsx
import React from 'react';
import { SkeletonItem } from '../components/common/SkeletonLoader';
import { Card, CardContent, Box } from '@mui/material';

export const CustomSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SkeletonItem variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <SkeletonItem variant="text" width="70%" height={20} />
            <SkeletonItem variant="text" width="50%" height={16} />
          </Box>
        </Box>
        <SkeletonItem variant="text" width="100%" height={16} />
      </CardContent>
    </Card>
  );
};
```

### Custom Animation Effects

```tsx
import React from 'react';
import { Skeleton } from '@mui/material';

export const CustomShimmerSkeleton: React.FC = () => {
  return (
    <Skeleton
      variant="text"
      width="100%"
      height={20}
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
          animation: 'customShimmer 2s infinite',
        },
        '@keyframes customShimmer': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      }}
    />
  );
};
```

## Best Practices

### Performance
- Use appropriate delays to prevent unnecessary skeleton flashing
- Set reasonable minimum display times for smooth transitions
- Avoid showing skeletons for very fast operations (< 200ms)

### User Experience
- Match skeleton layouts closely to actual content
- Use consistent spacing and sizing across skeletons
- Provide visual feedback during loading states

### Accessibility
- Ensure skeleton contrast meets accessibility standards
- Consider reduced motion preferences
- Provide loading state announcements for screen readers

### Code Organization
- Create reusable skeleton components for common patterns
- Use specialized hooks for different loading scenarios
- Keep skeleton logic separate from business logic

## Troubleshooting

### Common Issues

1. **Skeleton not showing**: Check if `startLoading()` is called
2. **Skeleton not hiding**: Verify `stopLoading()` is called and `autoHide` is true
3. **Flickering**: Adjust `delay` and `minDisplayTime` values
4. **Performance issues**: Ensure proper cleanup in useEffect

### Debug Mode

```tsx
const loader = useSkeletonLoader();

// Add logging to debug loading states
useEffect(() => {
  console.log('Loading state:', loader.isLoading);
  console.log('Showing skeleton:', loader.showSkeleton);
}, [loader.isLoading, loader.showSkeleton]);
```

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── SkeletonLoader.tsx          # All skeleton components
│   │       └── SkeletonShowcase.tsx        # Demo and showcase
│   ├── hooks/
│   │   └── useSkeletonLoader.ts            # Skeleton management hooks
│   └── pages/
│       └── ThemeDemo.tsx                   # Theme and skeleton demo
└── SKELETON_LOADER_DOCUMENTATION.md        # This documentation
```

## Future Enhancements

- [ ] Additional skeleton variants (list, grid, masonry)
- [ ] Skeleton animation library expansion
- [ ] Automated skeleton generation from component analysis
- [ ] Performance monitoring and optimization
- [ ] Advanced loading state management
- [ ] Skeleton testing utilities

## Support

For skeleton loader issues or questions:
1. Check this documentation
2. Review the skeleton showcase component
3. Test with different loading scenarios
4. Verify hook configuration
5. Check console for error messages
