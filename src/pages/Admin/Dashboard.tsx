
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import StatsOverview from '@/components/admin/StatsOverview';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import AdminLogs from '@/components/admin/AdminLogs';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminErrorDisplay from '@/components/admin/AdminErrorDisplay';
import AdminWelcomeCard from '@/components/admin/AdminWelcomeCard';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import DashboardSystemWidgets from '@/components/admin/DashboardSystemWidgets';
import { adminStatsService, AdminStats } from '@/services/admin/statsService';
import { toast } from 'sonner';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, profile, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardStats = await adminStatsService.getDashboardStats();
      setStats(dashboardStats);
      toast.success('Données actualisées avec succès');
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord:", error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des données';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <I18nText translationKey="admin.access.denied">
                Accès refusé
              </I18nText>
            </CardTitle>
            <CardDescription className="text-center">
              <I18nText translationKey="admin.access.notAuthorized">
                Vous n'êtes pas autorisé à accéder au tableau de bord administratif.
              </I18nText>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <AdminHeader loading={loading} onRefresh={loadDashboardData} />

      {error && (
        <AdminErrorDisplay error={error} onRetry={loadDashboardData} />
      )}
      
      <AdminWelcomeCard profile={profile} />

      <div>
        <h2 className="text-xl font-semibold mb-4">
          <I18nText translationKey="admin.dashboard.systemHealth">
            État du système
          </I18nText>
        </h2>
        <DashboardSystemWidgets />
      </div>

      <AdminQuickActions stats={stats} loading={loading} />
      
      <div>
        <h2 className="text-xl font-semibold mb-4">
          <I18nText translationKey="admin.dashboard.overview">
            Aperçu général
          </I18nText>
        </h2>
        <StatsOverview stats={stats || {} as AdminStats} loading={loading} />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">
          <I18nText translationKey="admin.dashboard.analytics">
            Analyses et tendances
          </I18nText>
        </h2>
        <AnalyticsCharts stats={stats || {} as AdminStats} loading={loading} />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">
          <I18nText translationKey="admin.dashboard.recentActivity">
            Activité récente
          </I18nText>
        </h2>
        <AdminLogs />
      </div>
    </div>
  );
}
