import { useState, useEffect, useCallback } from 'react';

// Agent interface
interface Agent {
  id: string;
  officerId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: string;
  officeName: string;
  isActive: boolean;
  assignedDistricts: string[];
}

// Login data interface
interface AgentLoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Auth state interface
interface AgentAuthState {
  agent: Agent | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// API response interface
interface AgentAuthResponse {
  success: boolean;
  message: string;
  agent?: Agent;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  errors?: string[];
}

/**
 * Agent authentication hook
 */
export function useAgentAuth() {
  const [authState, setAuthState] = useState<AgentAuthState>({
    agent: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  });

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth/agent/me', {
        method: 'GET',
        credentials: 'include'
      });

      const data: AgentAuthResponse = await response.json();

      if (data.success && data.agent) {
        setAuthState({
          agent: data.agent,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
        return data.agent;
      } else {
        setAuthState({
          agent: null,
          isLoading: false,
          isAuthenticated: false,
          error: null
        });
        return null;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState({
        agent: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Failed to check authentication status'
      });
      return null;
    }
  }, []);

  /**
   * Login agent
   */
  const login = useCallback(async (loginData: AgentLoginData): Promise<AgentAuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth/agent/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });

      const data: AgentAuthResponse = await response.json();

      if (data.success && data.agent) {
        setAuthState({
          agent: data.agent,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.message || 'Login failed'
        }));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = 'Login failed due to network error';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg
      }));
      return {
        success: false,
        message: errorMsg,
        errors: [errorMsg]
      };
    }
  }, []);

  /**
   * Logout agent
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      await fetch('/api/auth/agent/logout', {
        method: 'POST',
        credentials: 'include'
      });

      setAuthState({
        agent: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local state
      setAuthState({
        agent: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });
    }
  }, []);

  /**
   * Refresh token
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/agent/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      const data: AgentAuthResponse = await response.json();

      if (data.success && data.agent) {
        setAuthState(prev => ({
          ...prev,
          agent: data.agent || null,
          isAuthenticated: true,
          error: null
        }));
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          agent: null,
          isAuthenticated: false,
          error: null
        }));
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      setAuthState(prev => ({
        ...prev,
        agent: null,
        isAuthenticated: false,
        error: null
      }));
      return false;
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Auto refresh token every 14 minutes (before 15min expiry)
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const interval = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, refreshToken]);

  return {
    agent: authState.agent,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    login,
    logout,
    refreshToken,
    checkAuth,
    clearError
  };
}

/**
 * Agent authorization hook for specific departments
 */
export function useAgentDepartmentAuth(allowedDepartments: string[]) {
  const auth = useAgentAuth();
  
  const hasAccess = auth.agent ? 
    allowedDepartments.includes(auth.agent.department) : 
    false;

  return {
    ...auth,
    hasAccess,
    allowedDepartments
  };
}

/**
 * Agent authorization hook for specific districts
 */
export function useAgentDistrictAuth(requiredDistrict: string) {
  const auth = useAgentAuth();
  
  const hasAccess = auth.agent ? 
    auth.agent.assignedDistricts.includes(requiredDistrict) : 
    false;

  return {
    ...auth,
    hasAccess,
    requiredDistrict
  };
}
