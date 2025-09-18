'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface AuthErrorHandler {
  handleAuthError: (error: any, customMessage?: string) => boolean;
  withAuthErrorHandling: <T>(apiCall: () => Promise<T>, customErrorMessage?: string) => Promise<T>;
}

/**
 * Custom hook for handling authentication errors across all authenticated pages
 * Provides a consistent way to handle 401 errors with toast notifications and redirects
 */
export const useAuthErrorHandler = (): AuthErrorHandler => {
  const { logout } = useAuth();
  const router = useRouter();

  /**
   * Handles authentication errors (401 status)
   * @param error - The error object from API calls
   * @param customMessage - Optional custom error message
   * @returns true if it was an auth error (and handled), false otherwise
   */
  const handleAuthError = (error: any, customMessage?: string): boolean => {
    if (error.response?.status === 401) {
      const message = customMessage || 'Your session has expired. Please log in again.';
      toast.error(message);
      
      // Clear user state and redirect to login
      logout();
      
      // Redirect after a short delay to allow toast to show
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
      
      return true; // Indicates this was an auth error
    }
    return false; // Not an auth error
  };

  /**
   * Wrapper function for API calls that automatically handles auth errors
   * @param apiCall - The API function to call
   * @param customErrorMessage - Optional custom error message for auth errors
   * @returns Promise that resolves to the API response or rejects with non-auth errors
   */
  const withAuthErrorHandling = async <T,>(
    apiCall: () => Promise<T>,
    customErrorMessage?: string
  ): Promise<T> => {
    try {
      return await apiCall();
    } catch (error: any) {
      // Handle authentication errors first
      if (handleAuthError(error, customErrorMessage)) {
        // Re-throw a special error to indicate auth failure
        throw new Error('AUTH_ERROR');
      }
      // Re-throw other errors for normal handling
      throw error;
    }
  };

  return {
    handleAuthError,
    withAuthErrorHandling,
  };
};
