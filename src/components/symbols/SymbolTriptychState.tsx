
import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-inner">
      <p className="text-slate-500 text-lg">
        {message || <I18nText translationKey="empty" ns="symbolTriptych">Aucun symbole sélectionné</I18nText>}
      </p>
    </div>
  );
};

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-amber-50 rounded-lg animate-pulse">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="mt-4 text-amber-800">
          <I18nText translationKey="loading" ns="symbolTriptych">Chargement du symbole...</I18nText>
        </p>
      </div>
    </div>
  );
};

export const ErrorState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-lg border border-red-100">
      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-slate-800 text-lg">
        <I18nText translationKey="error" ns="symbolTriptych">Erreur de chargement</I18nText>
      </p>
      <p className="text-slate-500">
        <I18nText translationKey="errorDesc" ns="symbolTriptych">Impossible de charger les données du symbole. Veuillez réessayer.</I18nText>
      </p>
    </div>
  );
};
