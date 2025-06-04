
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { I18nText } from '@/components/ui/i18n-text';

interface ProgressiveLoaderProps {
  isLoading: boolean;
  progress?: number;
  stage?: string;
  estimatedTime?: number;
  children: React.ReactNode;
}

const LoadingStages = {
  CONNECTING: 'connecting',
  FETCHING: 'fetching',
  PROCESSING: 'processing',
  RENDERING: 'rendering'
};

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  isLoading,
  progress,
  stage = LoadingStages.CONNECTING,
  estimatedTime = 3000,
  children
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(stage);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentProgress(0);
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 100);
      
      if (progress !== undefined) {
        setCurrentProgress(progress);
      } else {
        // Simulation de progression intelligente
        setCurrentProgress(prev => {
          const timeBasedProgress = (elapsedTime / estimatedTime) * 100;
          const naturalProgress = prev + Math.random() * 2;
          return Math.min(Math.max(timeBasedProgress, naturalProgress), 95);
        });
      }

      // Progression des étapes basée sur le temps
      if (elapsedTime > estimatedTime * 0.2 && currentStage === LoadingStages.CONNECTING) {
        setCurrentStage(LoadingStages.FETCHING);
      } else if (elapsedTime > estimatedTime * 0.6 && currentStage === LoadingStages.FETCHING) {
        setCurrentStage(LoadingStages.PROCESSING);
      } else if (elapsedTime > estimatedTime * 0.8 && currentStage === LoadingStages.PROCESSING) {
        setCurrentStage(LoadingStages.RENDERING);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, progress, estimatedTime, elapsedTime, currentStage]);

  const getStageMessage = (stage: string) => {
    switch (stage) {
      case LoadingStages.CONNECTING:
        return <I18nText translationKey="collections.loading.connecting">Connexion...</I18nText>;
      case LoadingStages.FETCHING:
        return <I18nText translationKey="collections.loading.fetching">Récupération des données...</I18nText>;
      case LoadingStages.PROCESSING:
        return <I18nText translationKey="collections.loading.processing">Traitement...</I18nText>;
      case LoadingStages.RENDERING:
        return <I18nText translationKey="collections.loading.rendering">Finalisation...</I18nText>;
      default:
        return <I18nText translationKey="collections.loading.default">Chargement...</I18nText>;
    }
  };

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      {/* En-tête de progression */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-slate-600 font-medium">
            {getStageMessage(currentStage)}
          </span>
        </div>
        
        <div className="space-y-2">
          <Progress value={currentProgress} className="w-full max-w-md mx-auto" />
          <div className="flex justify-between text-xs text-slate-500 max-w-md mx-auto">
            <span>{Math.round(currentProgress)}%</span>
            <span>
              <I18nText translationKey="collections.loading.estimated">
                ~{Math.max(0, Math.round((estimatedTime - elapsedTime) / 1000))}s
              </I18nText>
            </span>
          </div>
        </div>
      </div>

      {/* Skeletons adaptatifs */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton 
              className={`h-48 w-full rounded-lg transition-all duration-1000 ${
                currentProgress > i * 12 ? 'opacity-70' : 'opacity-30'
              }`} 
            />
            <Skeleton 
              className={`h-4 w-3/4 transition-all duration-1000 delay-100 ${
                currentProgress > i * 12 + 5 ? 'opacity-70' : 'opacity-30'
              }`} 
            />
            <Skeleton 
              className={`h-3 w-full transition-all duration-1000 delay-200 ${
                currentProgress > i * 12 + 10 ? 'opacity-70' : 'opacity-30'
              }`} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};
