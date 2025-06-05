
import { useState, useEffect } from 'react';

interface UseLoadingTimeoutProps {
  isLoading: boolean;
  timeoutMs?: number;
  onTimeout?: () => void;
}

export const useLoadingTimeout = ({ 
  isLoading, 
  timeoutMs = 8000, 
  onTimeout 
}: UseLoadingTimeoutProps) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      console.log('⏰ Loading timeout started...');
      timeoutId = setTimeout(() => {
        console.error(`❌ TIMEOUT après ${timeoutMs}ms - activation fallback`);
        setHasTimedOut(true);
        onTimeout?.();
      }, timeoutMs);
    } else {
      console.log('✅ Loading completed normally');
      setHasTimedOut(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, timeoutMs, onTimeout]);

  return hasTimedOut;
};
