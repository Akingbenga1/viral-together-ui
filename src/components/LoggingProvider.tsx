'use client';

import { useEffect } from 'react';
import { initializeLogging } from '@/lib/logging-init';

export default function LoggingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize logging on client side
    initializeLogging();
  }, []);

  return <>{children}</>;
}
