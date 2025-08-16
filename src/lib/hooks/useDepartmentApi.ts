// src/lib/hooks/useDepartmentApi.ts
import { useState, useEffect, useCallback } from 'react';
import DepartmentApiService, {
  DashboardData,
  Service,
  Agent,
  Submission,
  DepartmentProfile,
  AnalyticsData
} from '@/lib/services/departmentApiService';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Dashboard Hook
export function useDashboardData() {
  const [state, setState] = useState<UseApiState<DashboardData>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await DepartmentApiService.getDashboardData();
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: response.message });
      }
    } catch (error) {
      setState({ data: null, loading: false, error: (error as Error).message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Services Hook
export function useServices(filters?: {
  isActive?: boolean;
  category?: string;
  search?: string;
}) {
  const [state, setState] = useState<UseApiState<Service[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await DepartmentApiService.getServices(filters);
      if (response.success && response.data) {
        setState({ data: response.data.services, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: response.message });
      }
    } catch (error) {
      setState({ data: null, loading: false, error: (error as Error).message });
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Single Service Hook
export function useService(id: string) {
  const [state, setState] = useState<UseApiState<Service>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await DepartmentApiService.getService(id);
      if (response.success && response.data) {
        setState({ data: response.data.service, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: response.message });
      }
    } catch (error) {
      setState({ data: null, loading: false, error: (error as Error).message });
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Agents Hook
export function useAgents(filters?: {
  status?: string;
  search?: string;
}) {
  const [state, setState] = useState<UseApiState<Agent[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await DepartmentApiService.getAgents(filters);
      if (response.success && response.data) {
        setState({ data: response.data.agents, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: response.message });
      }
    } catch (error) {
      setState({ data: null, loading: false, error: (error as Error).message });
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Single Agent Hook
export function useAgent(id: string) {
  const [state, setState] = useState<UseApiState<Agent>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await DepartmentApiService.getAgent(id);
      if (response.success && response.data) {
        setState({ data: response.data.agent, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: response.message });
      }
    } catch (error) {
      setState({ data: null, loading: false, error: (error as Error).message });
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Submissions Hook
export function useSubmissions(filters?: {
  status?: string;
  priority?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const [state, setState] = useState<UseApiState<{ submissions: Submission[]; total: number }>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      console.log('Fetching submissions with filters:', filters);
      const response = await DepartmentApiService.getSubmissions(filters);
      console.log('Submissions API response:', response);
      if (response.success && response.data) {
        console.log('Submissions data:', response.data);
        setState({ data: response.data, loading: false, error: null });
      } else {
        console.error('Failed to fetch submissions:', response.message);
        setState({ data: null, loading: false, error: response.message });
      }
    } catch (error) {
      console.error('Fetch submissions error:', error);
      setState({ data: null, loading: false, error: (error as Error).message });
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Single Submission Hook
export function useSubmission(id: string) {
  const [state, setState] = useState<UseApiState<Submission>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await DepartmentApiService.getSubmission(id);
      if (response.success && response.data) {
        setState({ data: response.data.submission, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: response.message });
      }
    } catch (error) {
      setState({ data: null, loading: false, error: (error as Error).message });
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Analytics Hook
export function useAnalytics(period: string = '30') {
  const [state, setState] = useState<UseApiState<AnalyticsData>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await DepartmentApiService.getAnalytics(period);
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: response.message });
      }
    } catch (error) {
      setState({ data: null, loading: false, error: (error as Error).message });
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Profile Hook
export function useDepartmentProfile() {
  const [state, setState] = useState<UseApiState<DepartmentProfile>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await DepartmentApiService.getProfile();
      if (response.success && response.data) {
        setState({ data: response.data.department, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: response.message });
      }
    } catch (error) {
      setState({ data: null, loading: false, error: (error as Error).message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Mutation Hooks for Create, Update, Delete operations
export function useServiceMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createService = useCallback(async (serviceData: Partial<Service>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await DepartmentApiService.createService(serviceData);
      setLoading(false);
      return response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  }, []);

  const updateService = useCallback(async (id: string, serviceData: Partial<Service>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await DepartmentApiService.updateService(id, serviceData);
      setLoading(false);
      return response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  }, []);

  const deleteService = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await DepartmentApiService.deleteService(id);
      setLoading(false);
      return response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  }, []);

  const toggleServiceStatus = useCallback(async (id: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await DepartmentApiService.toggleServiceStatus(id, isActive);
      setLoading(false);
      return response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    loading,
    error,
  };
}

export function useAgentMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAgent = useCallback(async (agentData: Partial<Agent>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await DepartmentApiService.createAgent(agentData);
      setLoading(false);
      return response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  }, []);

  const updateAgent = useCallback(async (id: string, agentData: Partial<Agent>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await DepartmentApiService.updateAgent(id, agentData);
      setLoading(false);
      return response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  }, []);

  const deleteAgent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await DepartmentApiService.deleteAgent(id);
      setLoading(false);
      return response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    createAgent,
    updateAgent,
    deleteAgent,
    loading,
    error,
  };
}

export function useSubmissionMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSubmission = useCallback(async (id: string, submissionData: Partial<Submission>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await DepartmentApiService.updateSubmission(id, submissionData);
      setLoading(false);
      return response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    updateSubmission,
    loading,
    error,
  };
}

export function useProfileMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (profileData: Partial<DepartmentProfile>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await DepartmentApiService.updateProfile(profileData);
      setLoading(false);
      return response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    updateProfile,
    loading,
    error,
  };
}
