
import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-inner">
      <p className="text-slate-500 text-lg">{message || t('symbolTriptych.empty')}</p>
    </div>
  );
};

export const LoadingState: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-amber-50 rounded-lg animate-pulse">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="mt-4 text-amber-800">{t('symbolTriptych.loading')}</p>
      </div>
    </div>
  );
};

export const ErrorState: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-lg border border-red-100">
      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-slate-800 text-lg">{t('symbolTriptych.error')}</p>
      <p className="text-slate-500">{t('symbolTriptych.errorDesc')}</p>
    </div>
  );
};
