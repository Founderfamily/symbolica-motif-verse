
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Loader2, RefreshCw, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import StatsOverview from '@/components/admin/StatsOverview';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import AdminLogs from '@/components/admin/AdminLogs';
import { adminStatsService, AdminStats } from '@/services/admin/statsService';
import { Link } from 'react-router-dom';

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
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <I18nText translationKey="admin.dashboard.title">
              Tableau de bord administratif
            </I18nText>
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de la plateforme et outils de gestion
          </p>
        </div>
        
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

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Admin greeting card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Bienvenue, {profile?.full_name || profile?.username || 'Administrateur'}
              </h2>
              <p className="text-slate-500 mt-1">
                <I18nText translationKey="admin.dashboard.welcomeMessage">
                  Gérez et supervisez la plateforme Symbolica
                </I18nText>
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/users">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Gérer les utilisateurs
                </Button>
              </Link>
              <Link to="/admin/contributions">
                <Button variant="outline" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Modérer les contributions
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link to="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Utilisateurs</p>
                  <p className="text-sm text-muted-foreground">
                    {stats ? `${stats.totalUsers} utilisateurs` : 'Chargement...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/contributions">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Contributions</p>
                  <p className="text-sm text-muted-foreground">
                    {stats ? `${stats.pendingContributions} en attente` : 'Chargement...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/symbols">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Symboles</p>
                  <p className="text-sm text-muted-foreground">
                    {stats ? `${stats.totalSymbols} symboles` : 'Chargement...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Paramètres</p>
                  <p className="text-sm text-muted-foreground">
                    Configuration système
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      
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
