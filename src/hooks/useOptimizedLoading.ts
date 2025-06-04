
import { useState, useEffect, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  progress: number;
}

export const useOptimizedLoading = (initialLoading = false) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: initialLoading,
    isInitialLoading: initialLoading,
    isRefreshing: false,
    progress: 0
  });

  const setLoading = useCallback((loading: boolean, type: 'initial' | 'refresh' = 'initial') => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: loading,
      isInitialLoading: type === 'initial' ? loading : prev.isInitialLoading,
      isRefreshing: type === 'refresh' ? loading : prev.isRefreshing,
      progress: loading ? 0 : 100
    }));
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(Math.max(progress, 0), 100)
    }));
  }, []);

  const simulateProgress = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 90) {
        clearInterval(interval);
        updateProgress(90);
      } else {
        updateProgress(progress);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [updateProgress]);

  return {
    ...loadingState,
    setLoading,
    updateProgress,
    simulateProgress
  };
};
