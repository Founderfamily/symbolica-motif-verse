
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useLazyAdminServices } from '@/hooks/useLazyAdminServices';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { BarChart3, Brain, Building2, Search, Smartphone, Compass, Users, FileText, Settings, Database } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminWelcomeCard from '@/components/admin/AdminWelcomeCard';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import StatsOverview from '@/components/admin/StatsOverview';
import DashboardSystemWidgets from '@/components/admin/DashboardSystemWidgets';
import { AdminStats, adminStatsService } from '@/services/admin/statsService';

const ManagementCard = ({ 
  to, 
  icon: Icon, 
  title, 
  description 
}: { 
  to: string; 
  icon: React.ElementType; 
  title: string; 
  description: string; 
}) => (
  <Link to={to}>
    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Icon className="h-5 w-5 text-slate-600" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  </Link>
);

const ToolCard = ({ 
  to, 
  icon: Icon, 
  title, 
  description, 
  badge,
  disabled = false
}: { 
  to: string; 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  badge?: { text: string; color: string };
  disabled?: boolean;
}) => {
  const cardContent = (
    <Card className={`transition-all duration-200 h-full ${
      disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:shadow-md cursor-pointer group'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg transition-colors ${
            disabled 
              ? 'bg-slate-100' 
              : 'bg-amber-100 group-hover:bg-amber-200'
          }`}>
            <Icon className={`h-6 w-6 ${
              disabled ? 'text-slate-400' : 'text-amber-600'
            }`} />
          </div>
          {badge && (
            <span className={`px-2 py-1 text-xs rounded-full text-white ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
        <div>
          <h3 className={`font-semibold mb-2 ${
            disabled ? 'text-slate-400' : 'text-slate-900'
          }`}>{title}</h3>
          <p className={`text-sm ${
            disabled ? 'text-slate-400' : 'text-slate-600'
          }`}>{description}</p>
          {disabled && (
            <p className="text-xs text-red-500 mt-2 font-medium">
              Fonctionnalité en développement
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return disabled ? (
    <div>{cardContent}</div>
  ) : (
    <Link to={to}>{cardContent}</Link>
  );
};

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
        {/* Header */}
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

          {/* Gestion de la plateforme */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Gestion de la plateforme</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ManagementCard
                to="/admin/users"
                icon={Users}
                title="Gestion des Utilisateurs"
                description="Gérez les comptes utilisateurs, leurs rôles et leurs permissions."
              />

              <ManagementCard
                to="/admin/contributions/moderation"
                icon={FileText}
                title="Modération des Contributions"
                description="Modérez et approuvez les contributions des utilisateurs."
              />

              <ManagementCard
                to="/admin/symbols"
                icon={Database}
                title="Gestion des Symboles"
                description="Gérez les symboles, leurs informations et leurs relations."
              />

              <ManagementCard
                to="/admin/collections"
                icon={Database}
                title="Gestion des Collections"
                description="Gérez les collections de symboles et leurs catégories."
              />

              <ManagementCard
                to="/admin/content"
                icon={FileText}
                title="Gestion du Contenu"
                description="Gérez le contenu de la page d'accueil, témoignages et partenaires."
              />

              <ManagementCard
                to="/admin/settings"
                icon={Settings}
                title="Paramètres Système"
                description="Configurez les paramètres généraux du système et intégrations."
              />
            </div>
          </div>

          {/* Outils Avancés */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Outils Avancés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ToolCard
                to="/analysis"
                icon={BarChart3}
                title="Analyse"
                description="Tableaux de bord analytiques avancés pour l'étude des symboles culturels"
              />
              
              <ToolCard
                to="/symbol-explorer"
                icon={Search}
                title="Explorateur de Symboles"
                description="Interface avancée de recherche et filtrage des symboles"
              />

              <ToolCard
                to="/mcp-search"
                icon={Brain}
                title="MCP Search"
                description="Recherche intelligente avec IA DeepSeek via Model Context Protocol"
                badge={{ text: "AI", color: "bg-purple-500" }}
              />

              <ToolCard
                to="/map"
                icon={Compass}
                title="Carte Interactive"
                description="Exploration géographique des symboles et de leurs origines culturelles"
              />

              <ToolCard
                to="/enterprise"
                icon={Building2}
                title="Enterprise"
                description="Solutions enterprise pour l'intégration et l'analyse à grande échelle"
                badge={{ text: "New", color: "bg-amber-500" }}
                disabled={true}
              />
              
              <ToolCard
                to="/mobile"
                icon={Smartphone}
                title="Application Mobile"
                description="Interface mobile pour l'exploration de terrain et la contribution"
                disabled={true}
              />
            </div>
          </div>

          {/* Widgets système */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Surveillance système</h2>
            <DashboardSystemWidgets />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
