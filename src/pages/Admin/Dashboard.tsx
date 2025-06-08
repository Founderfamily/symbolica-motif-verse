
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useLazyAdminServices } from '@/hooks/useLazyAdminServices';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  
  // Initialize admin services lazily
  useLazyAdminServices();

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Tableau de Bord Admin
          </h1>
          <p className="text-slate-600">
            Bienvenue dans l'interface d'administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Gérez les comptes utilisateurs, leurs rôles et leurs permissions.
              </p>
              <a href="/admin/users" className="text-amber-600 hover:underline">
                Accéder à la gestion des utilisateurs
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Modérez et approuvez les contributions des utilisateurs.
              </p>
              <a href="/admin/contributions" className="text-amber-600 hover:underline">
                Accéder à la gestion des contributions
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Automatique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Gérez la conversion automatique des contributions approuvées en symboles.
              </p>
              <a href="/admin/conversion" className="text-amber-600 hover:underline">
                Accéder à la conversion automatique
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Symboles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Gérez les symboles, leurs informations et leurs relations.
              </p>
              <a href="/admin/symbols" className="text-amber-600 hover:underline">
                Accéder à la gestion des symboles
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Gérez les collections de symboles et leurs catégories.
              </p>
              <a href="/admin/collections" className="text-amber-600 hover:underline">
                Accéder à la gestion des collections
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres Système</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
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
  );
};

export default Dashboard;
