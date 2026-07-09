'use client';

import { useContext } from 'react';
import { SIMRSContext, type SIMRSContextValue } from './SIMRSDatasetProvider';

/** Hook to access the active SIMRS dataset store */
export function useSIMRSDatasetStore(): SIMRSContextValue {
  const context = useContext(SIMRSContext);
  if (!context) {
    throw new Error('useSIMRSDatasetStore must be used within a SIMRSDatasetProvider');
  }
  return context;
}
