/**
 * Logging initialization for the UI application
 * This file ensures logging is set up early in the application lifecycle
 */

import { uiLogger } from './logger';

// Initialize logging
export const initializeLogging = () => {
  // Only log application startup in browser environment
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    uiLogger.logInfo('UI Application started', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }

  // Log any existing errors in console
  const originalError = console.error;
  console.error = (...args: any[]) => {
    originalError(...args);
    uiLogger.logError('Console Error', args);
  };

  // Add global error handler for React errors
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      uiLogger.logError('Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      uiLogger.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  // Add utility functions to window for debugging (browser only)
  if (typeof window !== 'undefined') {
    (window as any).clearLogs = () => {
      uiLogger.clearLogs();
    };

    (window as any).getLogs = () => {
      return uiLogger.getLogs();
    };

    (window as any).uiLogger = uiLogger;
    
    console.log('UI Logging initialized. Use window.getLogs() to view logs.');
  }
};

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  initializeLogging();
}
