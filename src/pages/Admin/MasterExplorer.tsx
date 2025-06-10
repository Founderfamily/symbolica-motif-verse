
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, MapPin, Search, Users } from 'lucide-react';

const MasterExplorer: React.FC = () => {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Analyse de Quêtes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Analysez et enrichissez les quêtes existantes avec des données historiques avancées.
              </p>
              <button className="text-blue-600 hover:underline">
                Commencer l'analyse
              </button>
            </CardContent>
          </Card>

          <Card>
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
              <button className="text-green-600 hover:underline">
                Accéder à la cartographie
              </button>
            </CardContent>
          </Card>

          <Card>
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
              <button className="text-purple-600 hover:underline">
                Gérer les validations
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Tableau de bord Master Explorer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Interface Master Explorer
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Cette interface permet aux administrateurs d'enrichir les quêtes existantes 
                  avec des données historiques avancées, sans modifier les pages de quêtes principales.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MasterExplorer;
