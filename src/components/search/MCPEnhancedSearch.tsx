
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Brain, Sparkles, History, Compare, BookOpen, Loader2 } from 'lucide-react';
import { useMCPDeepSeek } from '@/hooks/useMCPDeepSeek';
import { toast } from 'sonner';

interface MCPSearchProps {
  onResultsUpdate?: (results: any) => void;
  initialQuery?: string;
}

const MCPEnhancedSearch: React.FC<MCPSearchProps> = ({ onResultsUpdate, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<'general' | 'symbol' | 'cultural' | 'comparative' | 'research'>('general');
  const [results, setResults] = useState<any>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const {
    searchWithMCP,
    analyzeSymbol,
    getCulturalContext,
    compareSymbols,
    synthesizeResearch,
    isLoading,
    error,
    clearError
  } = useMCPDeepSeek();

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      toast.error('Veuillez saisir une requête de recherche');
      return;
    }

    clearError();
    
    try {
      let searchResults;

      switch (searchType) {
        case 'symbol':
          searchResults = await analyzeSymbol(query);
          break;
        case 'cultural':
          searchResults = await getCulturalContext(query);
          break;
        case 'research':
          searchResults = await synthesizeResearch(query);
          break;
        default:
          searchResults = await searchWithMCP({
            query,
            toolRequests: ['symbol_analyzer', 'cultural_context_provider'],
            contextData: { searchType }
          });
      }

      setResults(searchResults);
      
      // Ajouter à l'historique
      setSearchHistory(prev => [query, ...prev.filter(q => q !== query)].slice(0, 10));
      
      // Notifier le parent
      if (onResultsUpdate) {
        onResultsUpdate(searchResults);
      }

      if (searchResults.success) {
        toast.success('Recherche MCP complétée avec succès');
      } else {
        toast.error('Erreur lors de la recherche MCP');
      }

    } catch (err) {
      console.error('Search error:', err);
      toast.error('Erreur lors de la recherche');
    }
  }, [query, searchType, searchWithMCP, analyzeSymbol, getCulturalContext, synthesizeResearch, onResultsUpdate, clearError]);

  const handleHistorySelect = (historicalQuery: string) => {
    setQuery(historicalQuery);
  };

  const renderResults = () => {
    if (!results) return null;

    if (!results.success) {
      return (
        <Card className="mt-4 border-red-200">
          <CardContent className="p-4">
            <div className="text-red-600">
              <p>Erreur: {results.error}</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    const response = results.response;
    const mcpToolResults = results.mcpToolResults;

    return (
      <div className="mt-6 space-y-4">
        {/* Réponse principale de DeepSeek */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Analyse DeepSeek
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">
                {response.choices?.[0]?.message?.content || 'Aucune réponse générée'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Résultats des outils MCP */}
        {mcpToolResults && mcpToolResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                Analyses MCP Spécialisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mcpToolResults.map((toolResult, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{toolResult.toolName}</Badge>
                      {toolResult.error && (
                        <Badge variant="destructive">Erreur</Badge>
                      )}
                    </div>
                    
                    {toolResult.error ? (
                      <p className="text-red-600">{toolResult.error}</p>
                    ) : (
                      <div className="space-y-2">
                        {/* Rendu spécialisé selon le type d'outil */}
                        {toolResult.toolName === 'symbol_analyzer' && toolResult.result.symbolAnalysis && (
                          <div>
                            <h4 className="font-medium">Analyse Symbolique</h4>
                            <p><strong>Signification culturelle:</strong> {toolResult.result.symbolAnalysis.culturalSignificance}</p>
                            <p><strong>Contexte historique:</strong> {toolResult.result.symbolAnalysis.historicalContext}</p>
                            <p><strong>Symboles trouvés:</strong> {toolResult.result.symbolAnalysis.foundSymbols?.length || 0}</p>
                          </div>
                        )}
                        
                        {toolResult.toolName === 'cultural_context_provider' && toolResult.result.culturalContext && (
                          <div>
                            <h4 className="font-medium">Contexte Culturel</h4>
                            <p><strong>Culture:</strong> {toolResult.result.culturalContext.culture}</p>
                            <p><strong>Caractéristiques:</strong> {toolResult.result.culturalContext.culturalCharacteristics}</p>
                            <p><strong>Symboles associés:</strong> {toolResult.result.culturalContext.symbolsCount}</p>
                          </div>
                        )}
                        
                        {/* Rendu générique pour autres outils */}
                        {!['symbol_analyzer', 'cultural_context_provider'].includes(toolResult.toolName) && (
                          <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto">
                            {JSON.stringify(toolResult.result, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Recherche Intelligente MCP + DeepSeek
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recherche avancée avec analyse culturelle et symbolique alimentée par l'IA
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sélection du type de recherche */}
          <div className="flex gap-2 mb-4">
            <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Recherche générale</SelectItem>
                <SelectItem value="symbol">Analyse de symbole</SelectItem>
                <SelectItem value="cultural">Contexte culturel</SelectItem>
                <SelectItem value="comparative">Analyse comparative</SelectItem>
                <SelectItem value="research">Synthèse recherche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interface de recherche */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Entrez votre requête de recherche (ex: 'Analysez le symbolisme du lotus dans la culture bouddhiste')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Ctrl+Enter pour rechercher
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !query.trim()}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Rechercher avec MCP
            </Button>
          </div>

          {/* Historique de recherche */}
          {searchHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <History className="h-4 w-4" />
                Recherches récentes
              </h4>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((historyQuery, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleHistorySelect(historyQuery)}
                  >
                    {historyQuery.length > 50 ? `${historyQuery.slice(0, 50)}...` : historyQuery}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Erreurs */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      {renderResults()}
    </div>
  );
};

export default MCPEnhancedSearch;
