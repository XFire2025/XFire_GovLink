import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Hook for login redirection based on user role
export const useAuthRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const redirectToDashboard = useCallback(() => {
    if (!isAuthenticated || !user) return;

    const dashboardPaths = {
      citizen: '/user/dashboard',
      agent: '/agent/dashboard',
      admin: '/admin/dashboard'
    };

    const path = dashboardPaths[user.role] || '/';
    router.push(path);
  }, [user, isAuthenticated, router]);

  const redirectToLogin = useCallback((userType: 'citizen' | 'agent' | 'admin' = 'citizen') => {
    const loginPaths = {
      citizen: '/user/auth/login',
      agent: '/agent/login',
      admin: '/admin/login'
    };

    router.push(loginPaths[userType]);
  }, [router]);

  return {
    redirectToDashboard,
    redirectToLogin,
    user,
    isAuthenticated
  };
};

// Hook for checking user permissions
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = useCallback((role: 'citizen' | 'agent' | 'admin') => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles: ('citizen' | 'agent' | 'admin')[]) => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  const isStaff = useCallback(() => {
    return user ? ['agent', 'admin'].includes(user.role) : false;
  }, [user]);

  const canAccess = useCallback((resource: string) => {
    if (!user) return false;

    // Define access control rules
    const accessRules: Record<string, ('citizen' | 'agent' | 'admin')[]> = {
      'user-management': ['admin'],
      'agent-management': ['admin'],
      'system-configuration': ['admin'],
      'reports': ['admin', 'agent'],
      'customer-support': ['admin', 'agent'],
      'verification': ['admin', 'agent'],
      'bookings': ['citizen', 'agent', 'admin'],
      'profile': ['citizen', 'agent', 'admin'],
      'submissions': ['citizen', 'agent', 'admin']
    };

    const allowedRoles = accessRules[resource] || [];
    return allowedRoles.includes(user.role);
  }, [user]);

  return {
    hasRole,
    hasAnyRole,
    isStaff,
    canAccess,
    user
  };
};

// Hook for account status checks
export const useAccountStatus = () => {
  const { user } = useAuth();

  const isActive = useCallback(() => {
    return user?.accountStatus === 'active';
  }, [user]);

  const isPending = useCallback(() => {
    return user?.accountStatus === 'pending';
  }, [user]);

  const isSuspended = useCallback(() => {
    return user?.accountStatus === 'suspended';
  }, [user]);

  const isDeactivated = useCallback(() => {
    return user?.accountStatus === 'deactivated';
  }, [user]);

  const isEmailVerified = useCallback(() => {
    return user?.isEmailVerified === true;
  }, [user]);

  const isProfileComplete = useCallback(() => {
    return user?.isProfileComplete === true;
  }, [user]);

  const getProfileCompletionPercentage = useCallback(() => {
    return user?.profileCompletionPercentage || 0;
  }, [user]);

  const requiresAction = useCallback(() => {
    if (!user) return false;
    return !user.isEmailVerified || !user.isProfileComplete || user.accountStatus === 'pending';
  }, [user]);

  return {
    isActive,
    isPending,
    isSuspended,
    isDeactivated,
    isEmailVerified,
    isProfileComplete,
    getProfileCompletionPercentage,
    requiresAction,
    user
  };
};

// Hook for logout with cleanup
export const useLogout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const logoutAndRedirect = useCallback(async (redirectPath?: string) => {
    try {
      await logout();
      router.push(redirectPath || '/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout API fails
      router.push(redirectPath || '/');
    }
  }, [logout, router]);

  return { logoutAndRedirect };
};
