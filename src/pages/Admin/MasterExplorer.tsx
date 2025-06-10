
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, MapPin, Search, Users, BarChart3, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MasterExplorerStats {
  totalQuests: number;
  activeQuests: number;
  pendingValidations: number;
  totalEvidence: number;
  communityContributions: number;
  validatedDiscoveries: number;
}

const MasterExplorer: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<MasterExplorerStats>({
    totalQuests: 0,
    activeQuests: 0,
    pendingValidations: 0,
    totalEvidence: 0,
    communityContributions: 0,
    validatedDiscoveries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchMasterExplorerStats();
    }
  }, [isAdmin]);

  const fetchMasterExplorerStats = async () => {
    try {
      setLoading(true);
      
      // Fetch quest statistics
      const { data: questsData } = await supabase
        .from('treasure_quests')
        .select('id, status');
      
      const { data: evidenceData } = await supabase
        .from('quest_evidence')
        .select('id, validation_status');
      
      const { data: contributionsData } = await supabase
        .from('user_contributions')
        .select('id, status');

      const totalQuests = questsData?.length || 0;
      const activeQuests = questsData?.filter(q => q.status === 'active').length || 0;
      const pendingValidations = evidenceData?.filter(e => e.validation_status === 'pending').length || 0;
      const totalEvidence = evidenceData?.length || 0;
      const communityContributions = contributionsData?.length || 0;
      const validatedDiscoveries = evidenceData?.filter(e => e.validation_status === 'validated').length || 0;

      setStats({
        totalQuests,
        activeQuests,
        pendingValidations,
        totalEvidence,
        communityContributions,
        validatedDiscoveries
      });
    } catch (error) {
      console.error('Error fetching Master Explorer stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Master Explorer
            </h1>
          </div>
          <p className="text-slate-600">
            Interface avancée pour l'enrichissement et la gestion des quêtes historiques.
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Quêtes totales</p>
                  <p className="text-xl font-bold">{loading ? '...' : stats.totalQuests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600">Quêtes actives</p>
                  <p className="text-xl font-bold">{loading ? '...' : stats.activeQuests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm text-slate-600">Validations en attente</p>
                  <p className="text-xl font-bold">{loading ? '...' : stats.pendingValidations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-slate-600">Preuves soumises</p>
                  <p className="text-xl font-bold">{loading ? '...' : stats.totalEvidence}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-slate-600">Contributions</p>
                  <p className="text-xl font-bold">{loading ? '...' : stats.communityContributions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-slate-600">Découvertes validées</p>
                  <p className="text-xl font-bold">{loading ? '...' : stats.validatedDiscoveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Analyse de Quêtes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Analysez et enrichissez les quêtes existantes avec des données historiques avancées.
              </p>
              <div className="space-y-2">
                <Link to="/analysis">
                  <Button className="w-full" variant="default">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Accéder à l'analyse
                  </Button>
                </Link>
                <Link to="/quests">
                  <Button className="w-full" variant="outline">
                    Gérer les quêtes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Cartographie Avancée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Enrichissez les localisations des quêtes avec des données géographiques précises.
              </p>
              <div className="space-y-2">
                <Link to="/map">
                  <Button className="w-full" variant="default">
                    <MapPin className="h-4 w-4 mr-2" />
                    Ouvrir la carte
                  </Button>
                </Link>
                <Link to="/symbol-explorer">
                  <Button className="w-full" variant="outline">
                    Explorer les symboles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Validation Communautaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Gérez la validation communautaire des découvertes et théories.
              </p>
              <div className="space-y-2">
                <Link to="/admin/contributions/moderation">
                  <Button className="w-full" variant="default">
                    <Users className="h-4 w-4 mr-2" />
                    Modérer les contributions
                  </Button>
                </Link>
                <Link to="/community">
                  <Button className="w-full" variant="outline">
                    Voir la communauté
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Master Tools Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Outils Master Explorer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/contributions">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver des contributions
                  </Button>
                </Link>
                <Link to="/admin/symbols">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Gérer les symboles
                  </Button>
                </Link>
                <Link to="/admin/collections">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Organiser les collections
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outils Avancés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/mcp-search">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    MCP Search (IA)
                  </Button>
                </Link>
                <Link to="/enterprise">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Solutions Enterprise
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={fetchMasterExplorerStats}
                  disabled={loading}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {loading ? 'Actualisation...' : 'Actualiser les données'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Tableau de bord Master Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.pendingValidations > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    {stats.pendingValidations} validation(s) en attente de votre attention
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Toutes les validations sont à jour
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Progression des Quêtes</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Quêtes actives</span>
                    <span className="font-medium">{stats.activeQuests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total des preuves</span>
                    <span className="font-medium">{stats.totalEvidence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Découvertes validées</span>
                    <span className="font-medium text-green-600">{stats.validatedDiscoveries}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Activité Communautaire</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Contributions totales</span>
                    <span className="font-medium">{stats.communityContributions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>En attente de validation</span>
                    <span className="font-medium text-amber-600">{stats.pendingValidations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux de validation</span>
                    <span className="font-medium text-blue-600">
                      {stats.totalEvidence > 0 
                        ? Math.round((stats.validatedDiscoveries / stats.totalEvidence) * 100) 
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MasterExplorer;
