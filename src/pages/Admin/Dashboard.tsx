
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useLazyAdminServices } from '@/hooks/useLazyAdminServices';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminHeader from '@/components/admin/AdminHeader';
import AdminWelcomeCard from '@/components/admin/AdminWelcomeCard';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import StatsOverview from '@/components/admin/StatsOverview';
import DashboardSystemWidgets from '@/components/admin/DashboardSystemWidgets';
import { AdminStats, adminStatsService } from '@/services/admin/statsService';

const Dashboard: React.FC = () => {
  const { user, isAdmin, profile } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize admin services lazily
  useLazyAdminServices();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const adminStats = await adminStatsService.getDashboardStats();
      setStats(adminStats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header avec titre et bouton refresh */}
        <AdminHeader loading={loading} onRefresh={fetchStats} />

        <div className="space-y-8">
          {/* Carte de bienvenue */}
          <AdminWelcomeCard profile={profile} />

          {/* Actions rapides */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions rapides</h2>
            <AdminQuickActions stats={stats} loading={loading} />
          </div>

          {/* Vue d'ensemble des statistiques */}
          {stats && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Vue d'ensemble</h2>
              <StatsOverview stats={stats} loading={loading} />
            </div>
          )}

          {/* Widgets système */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Surveillance système</h2>
            <DashboardSystemWidgets />
          </div>

          {/* Section principale des gestions */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Gestion de la plateforme</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Gérez les comptes utilisateurs, leurs rôles et leurs permissions.
                  </p>
                  <a href="/admin/users" className="text-amber-600 hover:underline">
                    Accéder à la gestion des utilisateurs
                  </a>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Gestion des Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Modérez et approuvez les contributions des utilisateurs.
                  </p>
                  <a href="/admin/contributions" className="text-amber-600 hover:underline">
                    Accéder à la gestion des contributions
                  </a>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Conversion Automatique</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Gérez la conversion automatique des contributions approuvées en symboles.
                  </p>
                  <a href="/admin/conversion" className="text-amber-600 hover:underline">
                    Accéder à la conversion automatique
                  </a>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Gestion des Symboles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Gérez les symboles, leurs informations et leurs relations.
                  </p>
                  <a href="/admin/symbols" className="text-amber-600 hover:underline">
                    Accéder à la gestion des symboles
                  </a>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Gestion des Collections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Gérez les collections de symboles et leurs catégories.
                  </p>
                  <a href="/admin/collections" className="text-amber-600 hover:underline">
                    Accéder à la gestion des collections
                  </a>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Paramètres Système</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Configurez les paramètres généraux du système et Mapbox.
                  </p>
                  <a href="/admin/settings" className="text-amber-600 hover:underline">
                    Accéder aux paramètres système
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
