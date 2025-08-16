// src/lib/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export interface DashboardStats {
  activeBookings: number;
  applications: number;
  messages: number;
  completed: number;
}

export interface DashboardData {
  user: {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    nicNumber: string;
    mobileNumber?: string;
    accountStatus: string;
    verificationStatus: string;
    profileStatus: string;
    isEmailVerified: boolean;
    isProfileComplete: boolean;
    profileCompletionPercentage: number;
  };
  stats: DashboardStats;
  activity: {
    totalAppointments: number;
    totalApplications: number;
    recentActivity: {
      thisMonth: {
        appointments: number;
        applications: number;
      };
    };
  };
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
  });

  const { isAuthenticated, user } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Not authenticated'
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/user/dashboard', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log('Dashboard API response:', result.data);
        setState({
          data: result.data,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, [isAuthenticated]);

  const refetchDashboard = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user, fetchDashboardData]);

  return {
    ...state,
    refetch: refetchDashboard,
  };
};
