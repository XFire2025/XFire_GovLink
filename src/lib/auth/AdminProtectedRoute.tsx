import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from './AdminAuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading, admin } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8D153A]/30 border-t-[#8D153A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin authentication...</p>
        </div>
      </div>
    );
  }

  // Show fallback if provided and not authenticated
  if (!isAuthenticated || !admin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Admin authentication required</p>
          <button 
            onClick={() => router.push('/admin/login')}
            className="px-4 py-2 bg-[#8D153A] text-white rounded-lg hover:bg-[#8D153A]/90 transition-colors"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  // Check if admin account is active
  if (admin.accountStatus !== 'ACTIVE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Account Status</h2>
          <p className="text-muted-foreground mb-4">
            Your admin account is currently {admin.accountStatus.toLowerCase()}. 
            Please contact the system administrator.
          </p>
          <button 
            onClick={() => router.push('/admin/login')}
            className="px-4 py-2 bg-[#8D153A] text-white rounded-lg hover:bg-[#8D153A]/90 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
