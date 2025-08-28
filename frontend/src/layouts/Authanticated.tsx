import { Outlet, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";

/**
 * Authenticated layout component for the job board platform.
 * This layout includes the header with navigation and user menu,
 * and renders the child routes below it.
 * 
 * It also protects routes by checking if the user is authenticated.
 *
 * @returns JSX element representing the authenticated layout
 */
export default function Authenticated() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}
