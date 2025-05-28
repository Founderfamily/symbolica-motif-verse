
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Search, Zap } from 'lucide-react';
import MCPEnhancedSearch from '@/components/search/MCPEnhancedSearch';

const MCPSearchPage: React.FC = () => {
  const handleResultsUpdate = (results: any) => {
    console.log('MCP Search Results:', results);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
          Recherche Intelligente MCP
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explorez les symboles culturels avec l'intelligence artificielle DeepSeek 
          et le Model Context Protocol pour des analyses approfondies
        </p>
      </div>

      {/* Fonctionnalités MCP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="p-4">
            <Search className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium">Analyse Symbolique</h3>
            <p className="text-sm text-muted-foreground">
              Analyse profonde des symboles culturels
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-medium">Contexte Culturel</h3>
            <p className="text-sm text-muted-foreground">
              Enrichissement contextuel historique
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <h3 className="font-medium">Comparaison</h3>
            <p className="text-sm text-muted-foreground">
              Analyse comparative interculturelle
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-medium">Synthèse</h3>
            <p className="text-sm text-muted-foreground">
              Synthèse de recherche académique
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informations sur MCP */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            À propos du Model Context Protocol (MCP)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Outils MCP Disponibles</h4>
              <div className="space-y-2">
                <Badge variant="outline">symbol_analyzer</Badge>
                <Badge variant="outline">cultural_context_provider</Badge>
                <Badge variant="outline">temporal_pattern_detector</Badge>
                <Badge variant="outline">cross_cultural_comparator</Badge>
                <Badge variant="outline">research_synthesizer</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Capacités IA</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Analyse sémantique approfondie</li>
                <li>• Détection de motifs temporels</li>
                <li>• Comparaisons interculturelles</li>
                <li>• Synthèse de recherche académique</li>
                <li>• Recommandations personnalisées</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface de recherche principale */}
      <MCPEnhancedSearch onResultsUpdate={handleResultsUpdate} />

      {/* Exemples de recherches */}
      <Card>
        <CardHeader>
          <CardTitle>Exemples de Recherches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Analyses Symboliques</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• "Analysez la symbolique du dragon dans la culture chinoise"</li>
                <li>• "Évolution du symbole de l'arbre de vie à travers les cultures"</li>
                <li>• "Signification spirituelle du mandala tibétain"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recherches Comparatives</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• "Comparez les symboles solaires dans l'art aztèque et égyptien"</li>
                <li>• "Influences communes des motifs géométriques islamiques"</li>
                <li>• "Synthèse des recherches sur l'art précolombien"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MCPSearchPage;
