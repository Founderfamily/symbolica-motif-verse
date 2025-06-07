
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { AlertTriangle, Loader2 } from 'lucide-react';
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
  const { user, profile, isAdmin, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log('Dashboard - Auth state:', { user: !!user, profile: !!profile, isAdmin, authLoading });

  useEffect(() => {
    console.log('Dashboard - useEffect triggered:', { isAdmin, authLoading });
    
    // Ne charger les données que si l'utilisateur est authentifié et admin
    if (!authLoading && isAdmin) {
      loadDashboardData();
    } else if (!authLoading && isAdmin === false) {
      setLoading(false);
    }
  }, [isAdmin, authLoading]);

  const loadDashboardData = async () => {
    console.log('Dashboard - Loading data...');
    setLoading(true);
    setError(null);
    
    try {
      // Simuler des données si le service n'est pas disponible
      const mockStats: AdminStats = {
        total_users: 156,
        active_users: 45,
        total_contributions: 1247,
        pending_contributions: 23,
        total_symbols: 892,
        verified_symbols: 756,
        user_growth: [
          { date: '2024-01-01', count: 100 },
          { date: '2024-01-02', count: 105 },
          { date: '2024-01-03', count: 110 },
          { date: '2024-01-04', count: 120 },
          { date: '2024-01-05', count: 135 },
          { date: '2024-01-06', count: 145 },
          { date: '2024-01-07', count: 156 }
        ],
        contributions_per_day: [
          { date: '2024-01-01', count: 15 },
          { date: '2024-01-02', count: 18 },
          { date: '2024-01-03', count: 22 },
          { date: '2024-01-04', count: 19 },
          { date: '2024-01-05', count: 25 },
          { date: '2024-01-06', count: 21 },
          { date: '2024-01-07', count: 28 }
        ],
        top_contributor: {
          username: 'marie_culturelle',
          contributions: 45,
          points: 1250
        },
        last_contribution: {
          title: 'Motif berbère traditionnel',
          created_at: new Date().toISOString(),
          author: 'ahmed_artisan'
        }
      };

      try {
        const dashboardStats = await adminStatsService.getDashboardStats();
        setStats(dashboardStats);
        console.log('Dashboard - Data loaded successfully');
        toast.success('Données actualisées avec succès');
      } catch (serviceError) {
        console.warn('Dashboard - Service error, using mock data:', serviceError);
        setStats(mockStats);
        toast.success('Données de démonstration chargées');
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord:", error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des données';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Affichage pendant le chargement de l'authentification
  if (authLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Vérification des autorisations...</span>
        </div>
      </div>
    );
  }

  // Vérification des permissions admin
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
