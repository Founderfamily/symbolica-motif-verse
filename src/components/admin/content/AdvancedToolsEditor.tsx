
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { BarChart3, Brain, Building2, Search, Smartphone, Compass } from 'lucide-react';

const ToolCard = ({ 
  to, 
  icon: Icon, 
  title, 
  description, 
  badge 
}: { 
  to: string; 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  badge?: { text: string; color: string };
}) => (
  <Link to={to}>
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
            <Icon className="h-6 w-6 text-amber-600" />
          </div>
          {badge && (
            <span className={`px-2 py-1 text-xs rounded-full text-white ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const AdvancedToolsEditor = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Outils Avancés</h2>
        <p className="text-slate-600">
          Gérez et accédez aux outils avancés de la plateforme réservés aux administrateurs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Outils d'analyse */}
        <div className="col-span-full">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Outils d'Analyse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Outils IA et Intelligence */}
        <div className="col-span-full">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Intelligence Artificielle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToolCard
              to="/mcp-search"
              icon={Brain}
              title="MCP Search"
              description="Recherche intelligente avec IA DeepSeek via Model Context Protocol"
              badge={{ text: "AI", color: "bg-purple-500" }}
            />
          </div>
        </div>

        {/* Cartes et Géolocalisation */}
        <div className="col-span-full">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Cartes & Géolocalisation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToolCard
              to="/map"
              icon={Compass}
              title="Carte Interactive"
              description="Exploration géographique des symboles et de leurs origines culturelles"
            />
          </div>
        </div>

        {/* Solutions Business */}
        <div className="col-span-full">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Solutions Business</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToolCard
              to="/enterprise"
              icon={Building2}
              title="Enterprise"
              description="Solutions enterprise pour l'intégration et l'analyse à grande échelle"
              badge={{ text: "New", color: "bg-amber-500" }}
            />
            
            <ToolCard
              to="/mobile"
              icon={Smartphone}
              title="Application Mobile"
              description="Interface mobile pour l'exploration de terrain et la contribution"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration des Outils</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">Accès aux outils</h4>
                <p className="text-sm text-slate-600">Seuls les administrateurs peuvent accéder aux outils avancés</p>
              </div>
              <div className="text-sm text-green-600 font-medium">Activé</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">Notifications d'usage</h4>
                <p className="text-sm text-slate-600">Recevoir des notifications sur l'usage des outils</p>
              </div>
              <div className="text-sm text-slate-500 font-medium">Désactivé</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedToolsEditor;
