
import { useEffect, useCallback } from 'react';
import { usePerformanceMonitor } from './usePerformanceMonitor';

export const useMapPerformance = () => {
  const { measureOperation } = usePerformanceMonitor('InteractiveMap');

  // Measure map operations
  const measureMapOperation = useCallback((operationName: string, operation: () => void | Promise<void>) => {
    return measureOperation(`map.${operationName}`, operation);
  }, [measureOperation]);

  // Track map render performance
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('mapbox') || entry.name.includes('webgl')) {
          console.log(`🗺️ Map render metric: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
        }
      }
    });

    // Only observe if Performance Observer is supported
    if (typeof PerformanceObserver !== 'undefined') {
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    }

    return () => observer.disconnect();
  }, []);

  return { measureMapOperation };
};
