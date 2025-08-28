import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

/**
 * Basic layout for unauthenticated pages (login, signup, etc.)
 * Simply renders the Outlet without any authentication checks.
 */
function Basic() {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    }>
      <Outlet />
    </Suspense>
  );
}

export default Basic;
