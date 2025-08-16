"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import QRValidator from '@/components/department/QRValidator';

interface ValidationResult {
  success: boolean;
  message: string;
  appointment?: {
    bookingReference: string;
    citizenName: string;
    serviceType: string;
    date: string;
    time: string;
    status: string;
    department?: string;
  };
  timeStatus?: 'early' | 'valid' | 'late' | 'expired';
  departmentMatch?: boolean;
}

interface DepartmentUser {
  id: string;
  departmentId: string;
  email: string;
  name: string;
  status: string;
}

export default function QRValidationPage() {
  const router = useRouter();
  const [user, setUser] = useState<DepartmentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [validationStats, setValidationStats] = useState({
    totalScans: 0,
    validScans: 0,
    invalidScans: 0,
    todayScans: 0
  });

  const navigateToLogin = useCallback(() => {
    router.push('/department/login');
  }, [router]);

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        if (!mounted) return;
        
        setIsLoading(true);
        setAuthError(null);
        
        console.log('🔍 Checking department authentication...');
        
        const response = await fetch('/api/auth/department/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
          
        console.log('🌐 Department auth response status:', response.status);
        
        if (!mounted) return;
          
        if (response.status === 401) {
          console.log('❌ Authentication failed - redirecting to department login');
          setAuthError('Authentication required. Redirecting to login...');
          setTimeout(() => {
            if (mounted) navigateToLogin();
          }, 2000);
          return;
        }

        if (!response.ok) {
          throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Department authentication successful:', data);
        
        if (!mounted) return;
          
        if (data.success && data.department) {
          setUser(data.department);
          console.log('🏢 Department user authenticated:', data.department.name);
        } else {
          throw new Error(data.message || 'Authentication failed');
        }
          
      } catch (error) {
        console.error('❌ Department authentication error:', error);
        if (!mounted) return;
        
        setAuthError(error instanceof Error ? error.message : 'Authentication failed');
        setTimeout(() => {
          if (mounted) navigateToLogin();
        }, 3000);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    checkAuth();
    
    return () => {
      mounted = false;
    };
  }, [navigateToLogin]); // Add navigateToLogin dependency

  const handleValidationResult = (result: ValidationResult) => {
    // Update stats based on validation result
    setValidationStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      validScans: result.success ? prev.validScans + 1 : prev.validScans,
      invalidScans: result.success ? prev.invalidScans : prev.invalidScans + 1,
      todayScans: prev.todayScans + 1
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Checking Authentication...
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we verify your department credentials
          </p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {authError}
          </p>
          <button
            onClick={() => router.push('/department/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Access Denied
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Department authentication required
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                QR Code Validation
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Scan appointment QR codes to validate citizen check-ins
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {user.name}
                </span>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {validationStats.validScans}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Valid Today</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {validationStats.totalScans}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Scans</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner */}
        <QRValidator 
          onValidationResult={handleValidationResult}
          departmentName={user.name}
        />
      </div>
    </div>
  );
}