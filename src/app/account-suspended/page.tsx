"use client";

import { useAuth } from '@/lib/auth/AuthContext';
import { useLogout } from '@/lib/auth/useAuthUtils';
import { useEffect } from 'react';

export default function AccountSuspended() {
  const { user } = useAuth();
  const { logoutAndRedirect } = useLogout();

  useEffect(() => {
    // If user is not suspended, redirect them
    if (user && user.accountStatus !== 'suspended' && user.accountStatus !== 'deactivated') {
      window.location.href = '/';
    }
  }, [user]);

  const handleLogout = () => {
    logoutAndRedirect('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 text-red-600">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Account {user.accountStatus === 'suspended' ? 'Suspended' : 'Deactivated'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your account has been {user.accountStatus === 'suspended' ? 'temporarily suspended' : 'deactivated'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Access Restricted
            </h3>
            
            <div className="text-sm text-gray-600 mb-6 space-y-3">
              {user.accountStatus === 'suspended' ? (
                <>
                  <p>
                    Your account has been temporarily suspended due to a violation of our terms of service 
                    or suspicious activity detected on your account.
                  </p>
                  <p>
                    During this period, you will not be able to access government services through GovLink.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Your account has been deactivated and you no longer have access to government services 
                    through GovLink.
                  </p>
                  <p>
                    If you believe this is an error, please contact our support team.
                  </p>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Need Help?
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Contact our support team:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Email: support@govlink.lk</li>
                        <li>Phone: +94 11 234 5678</li>
                        <li>Office hours: 8:00 AM - 5:00 PM (Monday to Friday)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
