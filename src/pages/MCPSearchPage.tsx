
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Search, Sparkles, Zap } from 'lucide-react';
import MCPSearchInterface from '@/components/search/MCPSearchInterface';

const MCPSearchPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
          Recherche Intelligente MCP
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explorez les symboles culturels avec l'IA DeepSeek via le Model Context Protocol
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="p-4">
            <Search className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium">Analyse Symbolique</h3>
            <p className="text-sm text-muted-foreground">
              Découvrez la signification des symboles
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-medium">Contexte Culturel</h3>
            <p className="text-sm text-muted-foreground">
              Comprenez l'histoire et les traditions
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <h3 className="font-medium">Insights IA</h3>
            <p className="text-sm text-muted-foreground">
              Analyses approfondies par DeepSeek
            </p>
          </CardContent>
        </Card>
      </div>

      <MCPSearchInterface />

      <Card>
        <CardHeader>
          <CardTitle>Exemples de Recherches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Questions Symboliques</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• "Que signifie le lotus dans la culture bouddhiste ?"</li>
                <li>• "Symbolisme du dragon en Chine"</li>
                <li>• "Origine du symbole de l'arbre de vie"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Analyses Culturelles</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• "Différences entre mandalas tibétains et hindous"</li>
                <li>• "Évolution du symbole de la croix"</li>
                <li>• "Motifs géométriques dans l'art islamique"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MCPSearchPage;
