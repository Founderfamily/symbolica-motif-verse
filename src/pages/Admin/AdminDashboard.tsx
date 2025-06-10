import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Settings, 
  Crown, 
  TrendingUp,
  FileText,
  MapPin,
  Archive
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MasterExplorerDashboard } from '@/components/admin/MasterExplorerDashboard';

export default function AdminDashboard() {
  const { isAdmin, isMasterExplorer } = useAuth();

  if (!isAdmin && !isMasterExplorer) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
        <p className="text-muted-foreground">
          Vous devez être administrateur ou Maître Explorateur pour accéder à cette page.
        </p>
      </div>
    );
  }

  // Si l'utilisateur est Maître Explorateur mais pas admin, montrer uniquement le dashboard ME
  if (isMasterExplorer && !isAdmin) {
    return <MasterExplorerDashboard />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord administrateur
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du système et outils de gestion
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="master-explorer">Maître Explorateur</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilisateurs totaux
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,293</div>
                <p className="text-xs text-muted-foreground">
                  +12% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Maîtres Explorateurs
                </CardTitle>
                <Crown className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Experts actifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Quêtes actives
                </CardTitle>
                <MapPin className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Recherches en cours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Contributions
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +23% ce mois-ci
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/admin/users">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">Gestion des utilisateurs</h3>
                  <p className="text-sm text-muted-foreground">
                    Gérer les comptes et permissions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/roles">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Crown className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold">Maîtres Explorateurs</h3>
                  <p className="text-sm text-muted-foreground">
                    Nommer et gérer les experts
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/content">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Archive className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-semibold">Contenu</h3>
                  <p className="text-sm text-muted-foreground">
                    Modérer contributions et archives
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/system">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                  <h3 className="font-semibold">Système</h3>
                  <p className="text-sm text-muted-foreground">
                    Paramètres et maintenance
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">Nouveau</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Nouvelle contribution validée par un Maître Explorateur
                    </p>
                    <p className="text-xs text-muted-foreground">il y a 2 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">Utilisateur</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Nouvel utilisateur inscrit
                    </p>
                    <p className="text-xs text-muted-foreground">il y a 15 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="destructive">Alerte</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Contribution signalée pour modération
                    </p>
                    <p className="text-xs text-muted-foreground">il y a 1 heure</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="master-explorer">
          <MasterExplorerDashboard />
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres système</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interface de gestion système à implémenter
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
