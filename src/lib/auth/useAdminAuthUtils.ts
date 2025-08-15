import { useAdminAuth } from './AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Hook for admin login redirection
export const useAdminAuthRedirect = () => {
  const { admin, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  const redirectToDashboard = useCallback(() => {
    if (!isAuthenticated || !admin) return;
    router.push('/admin/dashboard');
  }, [admin, isAuthenticated, router]);

  const redirectToLogin = useCallback(() => {
    router.push('/admin/login');
  }, [router]);

  return {
    redirectToDashboard,
    redirectToLogin,
    admin,
    isAuthenticated
  };
};

// Hook for admin logout functionality
export const useAdminLogout = () => {
  const { logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      router.push('/admin/login');
    }
  }, [logout, router]);

  return { handleLogout };
};

// Hook to check if current admin has required permissions
export const useAdminPermissions = () => {
  const { admin, isAuthenticated } = useAdminAuth();

  const hasPermission = useCallback((requiredStatus: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' = 'ACTIVE') => {
    return isAuthenticated && admin && admin.accountStatus === requiredStatus;
  }, [admin, isAuthenticated]);

  const isActiveAdmin = useCallback(() => {
    return hasPermission('ACTIVE');
  }, [hasPermission]);

  return {
    hasPermission,
    isActiveAdmin,
    admin,
    isAuthenticated
  };
};

// Hook for admin profile data
export const useAdminProfile = () => {
  const { admin, isAuthenticated, isLoading } = useAdminAuth();

  return {
    admin,
    isAuthenticated,
    isLoading,
    isProfileLoaded: !isLoading && isAuthenticated && admin !== null
  };
};
