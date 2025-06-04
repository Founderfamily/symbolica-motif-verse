
import React, { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  errorCount: number;
}

interface PerformanceTrackerProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  enabled?: boolean;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({
  onMetricsUpdate,
  enabled = true
}) => {
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    errorCount: 0
  });

  const startTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!enabled) return;

    // Mesure du temps de chargement initial
    const loadEndTime = performance.now();
    metricsRef.current.loadTime = loadEndTime - startTimeRef.current;

    // Observer des Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          metricsRef.current.renderTime = entry.duration;
        }
        
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          metricsRef.current.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
        }
      }
      
      if (onMetricsUpdate) {
        onMetricsUpdate({ ...metricsRef.current });
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    // Mesure du temps d'interaction
    const handleFirstInput = (event: Event) => {
      const inputTime = performance.now();
      metricsRef.current.interactionTime = inputTime - startTimeRef.current;
      
      if (onMetricsUpdate) {
        onMetricsUpdate({ ...metricsRef.current });
      }
    };

    // Écoute des erreurs JavaScript
    const handleError = () => {
      metricsRef.current.errorCount += 1;
      
      if (onMetricsUpdate) {
        onMetricsUpdate({ ...metricsRef.current });
      }
    };

    document.addEventListener('click', handleFirstInput, { once: true });
    document.addEventListener('keydown', handleFirstInput, { once: true });
    window.addEventListener('error', handleError);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleFirstInput);
      document.removeEventListener('keydown', handleFirstInput);
      window.removeEventListener('error', handleError);
    };
  }, [enabled, onMetricsUpdate]);

  // Marquer le rendu comme terminé
  useEffect(() => {
    performance.mark('collections-render-end');
    performance.measure('collections-render', 'collections-render-start', 'collections-render-end');
  });

  // Marquer le début du rendu
  performance.mark('collections-render-start');

  return null;
};
