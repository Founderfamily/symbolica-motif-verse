
import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Wifi, Database, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { I18nText } from '@/components/ui/i18n-text';
import { errorRecoveryService } from '@/services/errorRecoveryService';

interface EnhancedErrorStateProps {
  error: Error;
  context: string;
  onRetry: () => void;
  onFallback?: () => void;
}

export const EnhancedErrorState: React.FC<EnhancedErrorStateProps> = ({
  error,
  context,
  onRetry,
  onFallback
}) => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryProgress, setRecoveryProgress] = useState(0);
  const [autoRetryCountdown, setAutoRetryCountdown] = useState(5);

  const getErrorType = (error: Error) => {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'network';
    }
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      return 'auth';
    }
    if (error.message.includes('timeout')) {
      return 'timeout';
    }
    return 'unknown';
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'network': return <Wifi className="w-6 h-6 text-red-500" />;
      case 'timeout': return <Clock className="w-6 h-6 text-orange-500" />;
      case 'auth': return <Database className="w-6 h-6 text-yellow-500" />;
      default: return <AlertTriangle className="w-6 h-6 text-red-500" />;
    }
  };

  const handleAutoRecovery = async () => {
    setIsRecovering(true);
    setRecoveryProgress(0);

    const progressInterval = setInterval(() => {
      setRecoveryProgress(prev => Math.min(prev + 20, 80));
    }, 200);

    try {
      const recovered = await errorRecoveryService.recoverFromError(error, context);
      setRecoveryProgress(100);
      
      setTimeout(() => {
        clearInterval(progressInterval);
        setIsRecovering(false);
        if (recovered) {
          onRetry();
        }
      }, 500);
    } catch (recoveryError) {
      clearInterval(progressInterval);
      setIsRecovering(false);
      console.error('Auto-recovery failed:', recoveryError);
    }
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setAutoRetryCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleAutoRecovery();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const errorType = getErrorType(error);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
          {getErrorIcon(errorType)}
        </div>
        <CardTitle className="text-xl">
          <I18nText translationKey={`collections.errors.${errorType}.title`}>
            Une erreur s'est produite
          </I18nText>
        </CardTitle>
        <CardDescription>
          <I18nText translationKey={`collections.errors.${errorType}.description`}>
            {error.message}
          </I18nText>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRecovering && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                <I18nText translationKey="collections.errors.recovering">
                  Récupération en cours...
                </I18nText>
              </span>
              <span>{recoveryProgress}%</span>
            </div>
            <Progress value={recoveryProgress} className="w-full" />
          </div>
        )}

        {!isRecovering && autoRetryCountdown > 0 && (
          <div className="text-center text-sm text-slate-600">
            <I18nText translationKey="collections.errors.autoRetry">
              Nouvelle tentative automatique dans {autoRetryCountdown}s
            </I18nText>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={onRetry} 
            className="flex-1"
            disabled={isRecovering}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
            <I18nText translationKey="collections.errors.retry">Réessayer</I18nText>
          </Button>
          
          {onFallback && (
            <Button 
              onClick={onFallback} 
              variant="outline"
              className="flex-1"
            >
              <I18nText translationKey="collections.errors.fallback">Mode hors ligne</I18nText>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
