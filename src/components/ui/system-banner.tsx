
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/i18n/useTranslation';

interface BannerConfig {
  enabled: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  title: {
    fr: string;
    en: string;
  };
  message: {
    fr: string;
    en: string;
  };
  startDate?: string;
  endDate?: string;
}

export const SystemBanner: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const [config, setConfig] = useState<BannerConfig | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBannerConfig();
  }, []);

  const loadBannerConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_key', 'system_banner')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.content) {
        const content = data.content as { fr?: string };
        if (content.fr) {
          try {
            const savedConfig = JSON.parse(content.fr) as BannerConfig;
            
            // Vérifier si le bandeau doit être affiché selon les dates
            const now = new Date();
            const startDate = savedConfig.startDate ? new Date(savedConfig.startDate) : null;
            const endDate = savedConfig.endDate ? new Date(savedConfig.endDate) : null;
            
            let shouldShow = savedConfig.enabled;
            
            if (startDate && now < startDate) {
              shouldShow = false;
            }
            
            if (endDate && now > endDate) {
              shouldShow = false;
            }
            
            if (shouldShow) {
              setConfig(savedConfig);
              
              // Vérifier si l'utilisateur a fermé ce bandeau
              const dismissedKey = `system-banner-dismissed-${JSON.stringify(savedConfig.title)}`;
              const isDismissed = localStorage.getItem(dismissedKey) === 'true';
              setIsVisible(!isDismissed);
            }
          } catch (parseError) {
            console.error('Error parsing banner config:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Error loading banner config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    if (config) {
      const dismissedKey = `system-banner-dismissed-${JSON.stringify(config.title)}`;
      localStorage.setItem(dismissedKey, 'true');
      setIsVisible(false);
    }
  };

  const getBannerIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getBannerStyles = (type: string) => {
    switch (type) {
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          title: 'text-blue-900',
          message: 'text-blue-700',
          icon: 'text-blue-600'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          title: 'text-yellow-900',
          message: 'text-yellow-700',
          icon: 'text-yellow-600'
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          title: 'text-green-900',
          message: 'text-green-700',
          icon: 'text-green-600'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          title: 'text-red-900',
          message: 'text-red-700',
          icon: 'text-red-600'
        };
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          title: 'text-blue-900',
          message: 'text-blue-700',
          icon: 'text-blue-600'
        };
    }
  };

  if (loading || !config || !isVisible || !config.enabled) {
    return null;
  }

  const title = config.title[currentLanguage] || config.title.fr;
  const message = config.message[currentLanguage] || config.message.fr;
  const styles = getBannerStyles(config.type);

  if (!title) {
    return null;
  }

  return (
    <div className={`border rounded-lg p-4 mb-6 ${styles.container}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={styles.icon}>
            {getBannerIcon(config.type)}
          </div>
          <div className="flex-1">
            <h3 className={`font-medium ${styles.title}`}>
              {title}
            </h3>
            {message && (
              <p className={`text-sm mt-1 ${styles.message}`}>
                {message}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0 hover:bg-white/50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
