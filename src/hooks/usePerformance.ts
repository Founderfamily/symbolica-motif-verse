
import { useEffect, useRef } from 'react';
import { logger } from '@/services/logService';

interface PerformanceMetrics {
  loadTime?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  domInteractive?: number;
  domComplete?: number;
  component?: {
    renderTime: number;
    name: string;
  };
}

export const usePerformance = (componentName?: string) => {
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    if (!componentName) return;
    
    // Log component mount time
    const mountTime = performance.now() - startTime.current;
    
    logger.debug(`Component mounted: ${componentName}`, {
      component: componentName,
      mountTimeMs: mountTime.toFixed(2)
    });
    
    return () => {
      // Log component lifetime
      const lifetime = performance.now() - startTime.current;
      logger.debug(`Component unmounted: ${componentName}`, {
        component: componentName,
        lifetimeMs: lifetime.toFixed(2)
      });
    };
  }, [componentName]);
  
  // Track page navigation events
  useEffect(() => {
    const trackPageNavigation = () => {
      // Only track if browser supports Performance API
      if (!window.performance || !window.performance.getEntriesByType) {
        return;
      }
      
      setTimeout(() => {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (!navigationEntry) return;
        
        const metrics: PerformanceMetrics = {
          loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
          domInteractive: navigationEntry.domInteractive - navigationEntry.startTime,
          domComplete: navigationEntry.domComplete - navigationEntry.startTime,
        };
        
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        if (firstPaint) {
          metrics.firstPaint = firstPaint.startTime;
        }
        
        if (firstContentfulPaint) {
          metrics.firstContentfulPaint = firstContentfulPaint.startTime;
        }
        
        logger.info('Page performance metrics', metrics);
      }, 0);
    };
    
    window.addEventListener('load', trackPageNavigation);
    return () => window.removeEventListener('load', trackPageNavigation);
  }, []);
  
  return {
    logRender: (name: string) => {
      const renderTime = performance.now() - startTime.current;
      logger.debug(`Rendered: ${name}`, {
        component: name,
        renderTimeMs: renderTime.toFixed(2)
      });
    }
  };
};

export default usePerformance;
