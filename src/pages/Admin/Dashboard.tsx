
import React from 'react';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-medium text-slate-800 mb-6">Tableau de bord</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800">Symboles</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">20</p>
          <p className="text-sm text-slate-500 mt-1">Symboles dans la base de données</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800">Images</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">60</p>
          <p className="text-sm text-slate-500 mt-1">Images de symboles</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800">Utilisateurs</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">1</p>
          <p className="text-sm text-slate-500 mt-1">Administrateurs</p>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Bienvenue dans l'administration</h3>
          <p className="text-slate-600">
            Cette interface vous permet de gérer les symboles et leurs images pour le musée Symbolica. 
            Vous pouvez ajouter de nouveaux symboles, modifier les existants, et gérer les trois types d'images 
            pour chaque symbole : image originale, extraction du motif, et nouvelle utilisation.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
