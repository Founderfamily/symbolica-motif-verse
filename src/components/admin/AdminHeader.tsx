
import React from 'react';
import { Button } from '@/components/ui/button';
import { I18nText } from '@/components/ui/i18n-text';
import { Loader2, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export default function AdminHeader({ loading, onRefresh }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <I18nText translationKey="admin.dashboard.title">
            Tableau de bord administratif
          </I18nText>
        </h1>
        <p className="text-muted-foreground mt-1">
          <I18nText translationKey="admin.dashboard.welcomeMessage">
            Vue d'ensemble de la plateforme et outils de gestion
          </I18nText>
        </p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="self-start sm:self-auto"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-2" />
        )}
        <I18nText translationKey="admin.actions.refresh">
          Actualiser
        </I18nText>
      </Button>
    </div>
  );
}
