import React from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('citizen' | 'agent' | 'admin')[];
  requireEmailVerification?: boolean;
  requireProfileComplete?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['citizen'],
  requireEmailVerification = false,
  requireProfileComplete = false,
  redirectTo,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (!isAuthenticated || !user) {
        const loginPath = allowedRoles.includes('admin') 
          ? '/admin/login' 
          : allowedRoles.includes('agent') 
          ? '/agent/login' 
          : '/user/auth/login';
        
        router.push(redirectTo || loginPath);
        return;
      }

      // Check role authorization
      if (!allowedRoles.includes(user.role)) {
        // Redirect based on user's actual role
        const dashboardPath = user.role === 'admin' 
          ? '/admin/dashboard' 
          : user.role === 'agent' 
          ? '/agent/dashboard' 
          : '/user/dashboard';
        
        router.push(dashboardPath);
        return;
      }

      // Check account status
      if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated') {
        router.push('/account-suspended');
        return;
      }

      // Check email verification requirement
      if (requireEmailVerification && !user.isEmailVerified) {
        router.push('/verify-email');
        return;
      }

      // Check profile completion requirement
      if (requireProfileComplete && !user.isProfileComplete) {
        router.push('/user/profile?complete=true');
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, requireEmailVerification, requireProfileComplete, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or authorized
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  // Check additional requirements
  if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated') {
    return null;
  }

  if (requireEmailVerification && !user.isEmailVerified) {
    return null;
  }

  if (requireProfileComplete && !user.isProfileComplete) {
    return null;
  }

  return <>{children}</>;
};

// Higher-order component version
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  const AuthenticatedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return AuthenticatedComponent;
};

// Specific protected route components for different user types
export const CitizenProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['citizen']}>{children}</ProtectedRoute>
);

export const AgentProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['agent']}>{children}</ProtectedRoute>
);

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
);

// Multi-role protected route
export const StaffProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['agent', 'admin']}>{children}</ProtectedRoute>
);
