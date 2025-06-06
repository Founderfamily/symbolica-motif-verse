
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Loader2, RefreshCw, Users, AlertTriangle, CheckCircle, Clock, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import StatsOverview from '@/components/admin/StatsOverview';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import AdminLogs from '@/components/admin/AdminLogs';
import { adminStatsService, AdminStats } from '@/services/admin/statsService';
import { Link } from 'react-router-dom';
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
      {/* En-tête avec actions */}
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
          onClick={loadDashboardData}
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

      {/* Gestion d'erreur améliorée */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-200 font-medium">Erreur de chargement</p>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadDashboardData}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Carte de bienvenue admin */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/users">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  <I18nText translationKey="admin.actions.manageUsers">
                    Gérer les utilisateurs
                  </I18nText>
                </Button>
              </Link>
              <Link to="/admin/contributions">
                <Button variant="outline" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <I18nText translationKey="admin.actions.moderateContributions">
                    Modérer les contributions
                  </I18nText>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/users">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Utilisateurs</p>
                  <p className="text-sm text-muted-foreground">
                    {loading ? (
                      <div className="h-4 w-16 bg-slate-200 animate-pulse rounded"></div>
                    ) : (
                      `${stats?.totalUsers || 0} utilisateurs`
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/contributions">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Contributions</p>
                  <p className="text-sm text-muted-foreground">
                    {loading ? (
                      <div className="h-4 w-16 bg-slate-200 animate-pulse rounded"></div>
                    ) : (
                      `${stats?.pendingContributions || 0} en attente`
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/symbols">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Symboles</p>
                  <p className="text-sm text-muted-foreground">
                    {loading ? (
                      <div className="h-4 w-16 bg-slate-200 animate-pulse rounded"></div>
                    ) : (
                      `${stats?.totalSymbols || 0} symboles`
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/settings">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Settings className="h-5 w-5 text-green-600" />
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
      
      {/* Aperçu des statistiques */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          <I18nText translationKey="admin.dashboard.overview">
            Aperçu général
          </I18nText>
        </h2>
        <StatsOverview stats={stats || {} as AdminStats} loading={loading} />
      </div>
      
      {/* Graphiques analytiques */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          <I18nText translationKey="admin.dashboard.analytics">
            Analyses et tendances
          </I18nText>
        </h2>
        <AnalyticsCharts stats={stats || {} as AdminStats} loading={loading} />
      </div>
      
      {/* Logs admin */}
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
