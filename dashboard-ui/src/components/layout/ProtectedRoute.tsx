import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SkeletonLoader } from '../ui/SkeletonLoader';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--ct-bg-surface)]">
        <div className="w-64 space-y-4">
          <SkeletonLoader variant="text" />
          <SkeletonLoader variant="text" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect them to the /auth page, but save the current location they were trying to go to
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
