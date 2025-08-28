import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useAuth = () => {
  const { user, accessToken, refreshToken, loading } = useSelector((state: RootState) => state.auth);
  
  const isAuthenticated = !!accessToken;
  const isEmployer = user?.role === 'EMPLOYER';
  const isCandidate = user?.role === 'CANDIDATE';
  const isAdmin = user?.role === 'ADMIN';
  
  return {
    user,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated,
    isEmployer,
    isCandidate,
    isAdmin,
  };
};
