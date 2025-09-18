'use client';

import { useEffect } from 'react';
import { initializeLogging } from '@/lib/logging-init';

const LoggingProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize logging on client side
    initializeLogging();
  }, []);

  return <>{children}</>;
};

export default LoggingProvider;
