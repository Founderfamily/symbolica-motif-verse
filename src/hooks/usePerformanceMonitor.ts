import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = performance.now();

  // Monitor component mount time
  useEffect(() => {
    const mountTime = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 ${componentName} mount time: ${mountTime.toFixed(2)}ms`);
      
      // Warn if mount time is too high
      if (mountTime > 100) {
        console.warn(`⚠️ ${componentName} slow mount: ${mountTime.toFixed(2)}ms`);
      }
    }

    // Could send to analytics service in production
    const metrics: PerformanceMetrics = {
      componentName,
      renderTime: 0, // Could be measured with React Profiler
      mountTime,
      timestamp: Date.now()
    };

    // Store metrics locally for debugging
    if (typeof window !== 'undefined') {
      const existingMetrics = JSON.parse(
        localStorage.getItem('performance_metrics') || '[]'
      );
      existingMetrics.push(metrics);
      
      // Keep only last 50 entries
      if (existingMetrics.length > 50) {
        existingMetrics.splice(0, existingMetrics.length - 50);
      }
      
      localStorage.setItem('performance_metrics', JSON.stringify(existingMetrics));
    }
  }, [componentName, startTime]);

  // Measure arbitrary operations
  const measureOperation = useCallback((operationName: string, operation: () => void | Promise<void>) => {
    const start = performance.now();
    
    const result = operation();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        console.log(`🔍 ${componentName}.${operationName}: ${duration.toFixed(2)}ms`);
      });
    } else {
      const duration = performance.now() - start;
      console.log(`🔍 ${componentName}.${operationName}: ${duration.toFixed(2)}ms`);
      return result;
    }
  }, [componentName]);

  return { measureOperation };
};

// Get performance metrics for debugging
export const getPerformanceMetrics = (): PerformanceMetrics[] => {
  if (typeof window === 'undefined') return [];
  
  return JSON.parse(localStorage.getItem('performance_metrics') || '[]');
};

// Clear performance metrics
export const clearPerformanceMetrics = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('performance_metrics');
  }
};
