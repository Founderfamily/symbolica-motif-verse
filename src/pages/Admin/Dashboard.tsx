
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import StatsOverview from '@/components/admin/StatsOverview';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import AdminLogs from '@/components/admin/AdminLogs';
import { adminStatsService, AdminStats } from '@/services/admin/statsService';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const dashboardStats = await adminStatsService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText translationKey="admin.access.denied">
                Accès refusé
              </I18nText>
            </CardTitle>
            <CardDescription>
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <I18nText translationKey="admin.dashboard.title">
            Tableau de bord administratif
          </I18nText>
        </h1>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadDashboardData}
          disabled={loading}
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
      
      {/* Admin greeting card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold">
                <I18nText translationKey="admin.dashboard.welcome" />
                {user?.full_name || user?.username}
              </h2>
              <p className="text-slate-500">
                <I18nText translationKey="admin.dashboard.welcomeMessage" />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats overview cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          <I18nText translationKey="admin.dashboard.overview">
            Aperçu général
          </I18nText>
        </h2>
        <StatsOverview stats={stats || {} as AdminStats} loading={loading} />
      </div>
      
      {/* Analytics charts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          <I18nText translationKey="admin.dashboard.analytics">
            Analyses et tendances
          </I18nText>
        </h2>
        <AnalyticsCharts stats={stats || {} as AdminStats} loading={loading} />
      </div>
      
      {/* Admin logs */}
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
