import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useAppDispatch } from "./store/store";
import { initializeAuth } from "./store/reducers/authReducer";

// Lazy load layouts
const AuthenticatedLayout = lazy(() => import("./layouts/Authanticated"));
const BasicLayout = lazy(() => import("./layouts/Basic"));

// Lazy load pages
const Jobs = lazy(() => import('./pages/Jobs'));
const PostJob = lazy(() => import('./pages/employers/PostJob'));
const Applications = lazy(() => import('./pages/candidates/Applications'));
const ApplyToJob = lazy(() => import('./pages/candidates/ApplyToJob'));
const ResumeUploadPage = lazy(() => import('./pages/candidates/ResumeUploadPage'));
const Profile = lazy(() => import('./pages/profile'));
const ResetPassword = lazy(() => import('./pages/reset-password'));
const ForgotPassword = lazy(() => import('./pages/forgot-password'));
const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/register'));

// Lazy load role-based dashboard pages
const EmployerDashboard = lazy(() => import('./pages/employers/EmployerDashboard'));
const CandidateDashboard = lazy(() => import('./pages/candidates/CandidateDashboard'));
const ViewApplication = lazy(() => import('./pages/employers/ViewApplication'));
const JobDetails = lazy(() => import('./pages/JobDetails'));

// Loading component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress size={60} />
  </Box>
);

// Simple fallback component for debugging
const FallbackPage = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <Typography variant="h4">Route not found</Typography>
  </Box>
);

/**
 * The main application component, which is a collection of routes.
 *
 * The authenticated routes are:
 * - `/jobs`: The jobs listing page.
 * - `/post-job`: The job posting page (employers only).
 * - `/employer-dashboard`: The employer-specific dashboard.
 * - `/candidate-dashboard`: The candidate-specific dashboard.
 * - `/applications`: The applications page (candidates only).
 * - `/profile`: The user's profile page.
 *
 * The unauthenticated routes are:
 * - `/`: Redirects to login
 * - `/login`: The login page.
 * - `/signup`: The signup page.
 * - `/forgot-password`: The forgot password page.
 * - `/reset-password`: The reset password page.
 */
function App() {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  
  console.log('App component rendering'); // Debug log
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes - no authentication required */}
        <Route element={<BasicLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        
        {/* Protected routes - authentication required */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:jobId" element={<JobDetails />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/employer" element={<EmployerDashboard />} />
          <Route path="/job/:jobId/resume-upload" element={<ResumeUploadPage />} />
          <Route path="/job/:jobId/apply" element={<ApplyToJob />} />
          <Route path="/application/:applicationId" element={<ViewApplication />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Catch-all route for debugging */}
        <Route path="*" element={<FallbackPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
