import { useState, useEffect, useCallback } from 'react';

export interface SkeletonLoaderState {
  isLoading: boolean;
  showSkeleton: boolean;
  delay: number;
  minDisplayTime: number;
}

export interface UseSkeletonLoaderOptions {
  delay?: number; // Delay before showing skeleton (ms)
  minDisplayTime?: number; // Minimum time to show skeleton (ms)
  autoHide?: boolean; // Whether to automatically hide after loading
  showOnMount?: boolean; // Whether to show skeleton on component mount
}

export const useSkeletonLoader = (options: UseSkeletonLoaderOptions = {}) => {
  const {
    delay = 300,
    minDisplayTime = 500,
    autoHide = true,
    showOnMount = false,
  } = options;

  const [state, setState] = useState<SkeletonLoaderState>({
    isLoading: false,
    showSkeleton: showOnMount,
    delay,
    minDisplayTime,
  });

  const [startTime, setStartTime] = useState<number | null>(null);

  // Start loading
  const startLoading = useCallback(() => {
    setStartTime(Date.now());
    setState(prev => ({ ...prev, isLoading: true }));
  }, []);

  // Stop loading
  const stopLoading = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  // Reset loading state
  const resetLoading = useCallback(() => {
    setStartTime(null);
    setState(prev => ({ 
      ...prev, 
      isLoading: false, 
      showSkeleton: false 
    }));
  }, []);

  // Toggle loading state
  const toggleLoading = useCallback(() => {
    if (state.isLoading) {
      stopLoading();
    } else {
      startLoading();
    }
  }, [state.isLoading, startLoading, stopLoading]);

  // Show skeleton immediately
  const showSkeleton = useCallback(() => {
    setState(prev => ({ ...prev, showSkeleton: true }));
  }, []);

  // Hide skeleton immediately
  const hideSkeleton = useCallback(() => {
    setState(prev => ({ ...prev, showSkeleton: false }));
  }, []);

  // Handle delay before showing skeleton
  useEffect(() => {
    let delayTimer: NodeJS.Timeout;

    if (state.isLoading && delay > 0) {
      delayTimer = setTimeout(() => {
        setState(prev => ({ ...prev, showSkeleton: true }));
      }, delay);
    }

    return () => {
      if (delayTimer) {
        clearTimeout(delayTimer);
      }
    };
  }, [state.isLoading, delay]);

  // Handle minimum display time
  useEffect(() => {
    let minTimeTimer: NodeJS.Timeout;

    if (!state.isLoading && state.showSkeleton && autoHide && startTime) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      if (remainingTime > 0) {
        minTimeTimer = setTimeout(() => {
          setState(prev => ({ ...prev, showSkeleton: false }));
        }, remainingTime);
      } else {
        setState(prev => ({ ...prev, showSkeleton: false }));
      }
    }

    return () => {
      if (minTimeTimer) {
        clearTimeout(minTimeTimer);
      }
    };
  }, [state.isLoading, state.showSkeleton, autoHide, startTime, minDisplayTime]);

  // Auto-hide skeleton when loading stops
  useEffect(() => {
    if (!state.isLoading && state.showSkeleton && autoHide) {
      const elapsedTime = startTime ? Date.now() - startTime : 0;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, showSkeleton: false }));
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [state.isLoading, state.showSkeleton, autoHide, startTime, minDisplayTime]);

  return {
    // State
    isLoading: state.isLoading,
    showSkeleton: state.showSkeleton,
    
    // Actions
    startLoading,
    stopLoading,
    resetLoading,
    toggleLoading,
    showSkeleton,
    hideSkeleton,
    
    // Utilities
    withSkeleton: <T>(data: T | null | undefined, skeleton: React.ReactNode) => {
      if (state.showSkeleton) {
        return skeleton;
      }
      return data;
    },
    
    // Conditional rendering helper
    renderConditionally: <T>(
      data: T | null | undefined,
      renderData: (data: T) => React.ReactNode,
      renderSkeleton: () => React.ReactNode
    ) => {
      if (state.showSkeleton) {
        return renderSkeleton();
      }
      return data ? renderData(data) : null;
    },
  };
};

// Specialized hooks for common use cases
export const useJobListLoader = (options?: UseSkeletonLoaderOptions) => {
  return useSkeletonLoader({
    delay: 200,
    minDisplayTime: 800,
    ...options,
  });
};

export const useFormLoader = (options?: UseSkeletonLoaderOptions) => {
  return useSkeletonLoader({
    delay: 100,
    minDisplayTime: 600,
    ...options,
  });
};

export const useProfileLoader = (options?: UseSkeletonLoaderOptions) => {
  return useSkeletonLoader({
    delay: 150,
    minDisplayTime: 700,
    ...options,
  });
};

export const useDashboardLoader = (options?: UseSkeletonLoaderOptions) => {
  return useSkeletonLoader({
    delay: 100,
    minDisplayTime: 1000,
    ...options,
  });
};

export const useTableLoader = (options?: UseSkeletonLoaderOptions) => {
  return useSkeletonLoader({
    delay: 250,
    minDisplayTime: 900,
    ...options,
  });
};

export default useSkeletonLoader;
