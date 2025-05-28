
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Brain, Sparkles, History, GitCompare, BookOpen, Loader2, AlertCircle, CheckCircle, Bug } from 'lucide-react';
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
    testConnection,
    analyzeSymbol,
    getCulturalContext,
    compareSymbols,
    synthesizeResearch,
    isLoading,
    error,
    clearError
  } = useMCPDeepSeek();

  const handleTestConnection = useCallback(async () => {
    console.log('🧪 Testing connection...');
    clearError();
    
    try {
      const testResult = await testConnection();
      console.log('🧪 Test result:', testResult);
      
      if (testResult.success) {
        toast.success('✅ Connexion MCP fonctionnelle!');
        setResults(testResult);
      } else {
        toast.error(`❌ Test échoué: ${testResult.error}`);
        setResults(testResult);
      }
    } catch (err) {
      console.error('❌ Test error:', err);
      toast.error(`❌ Erreur de test: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [testConnection, clearError]);

  const handleSearch = useCallback(async () => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      toast.error('Veuillez saisir une requête de recherche');
      return;
    }

    if (trimmedQuery.length > 5000) {
      toast.error('La requête est trop longue (maximum 5000 caractères)');
      return;
    }

    clearError();
    
    try {
      console.log('🔍 Starting search with type:', searchType, 'query:', trimmedQuery.substring(0, 100) + '...');
      
      let searchResults;

      switch (searchType) {
        case 'symbol':
          searchResults = await analyzeSymbol(trimmedQuery);
          break;
        case 'cultural':
          searchResults = await getCulturalContext(trimmedQuery);
          break;
        case 'research':
          searchResults = await synthesizeResearch(trimmedQuery);
          break;
        default:
          searchResults = await searchWithMCP({
            query: trimmedQuery,
            toolRequests: ['symbol_analyzer', 'cultural_context_provider'],
            contextData: { searchType }
          });
      }

      console.log('📊 Search results received:', {
        success: searchResults.success,
        hasResponse: !!searchResults.response,
        toolResults: searchResults.mcpToolResults?.length || 0,
        error: searchResults.error,
        processingTime: searchResults.processingTime
      });

      setResults(searchResults);
      
      // Ajouter à l'historique seulement si la recherche est réussie
      if (searchResults.success) {
        setSearchHistory(prev => [trimmedQuery, ...prev.filter(q => q !== trimmedQuery)].slice(0, 10));
        toast.success(`Recherche MCP complétée (${searchResults.processingTime || 0}ms)`);
      } else {
        toast.error(`Erreur lors de la recherche: ${searchResults.error}`);
      }
      
      // Notifier le parent
      if (onResultsUpdate) {
        onResultsUpdate(searchResults);
      }

    } catch (err) {
      console.error('❌ Search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      toast.error(errorMessage);
      
      setResults({
        success: false,
        error: errorMessage,
        response: null,
        mcpTools: [],
        mcpToolResults: [],
        timestamp: new Date().toISOString()
      });
    }
  }, [query, searchType, searchWithMCP, analyzeSymbol, getCulturalContext, synthesizeResearch, onResultsUpdate, clearError]);

  const handleHistorySelect = (historicalQuery: string) => {
    setQuery(historicalQuery);
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="mt-6 space-y-4">
        {/* Statut de la recherche */}
        <Card className={`border-2 ${results.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="p-4">
            <div className={`flex items-center gap-2 ${results.success ? 'text-green-800' : 'text-red-800'}`}>
              {results.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">
                {results.success ? 'Recherche réussie' : 'Erreur de recherche'}
              </span>
              {results.processingTime && (
                <Badge variant="outline" className="ml-auto">
                  {results.processingTime}ms
                </Badge>
              )}
            </div>
            {!results.success && results.error && (
              <p className="mt-2 text-sm text-red-700">{results.error}</p>
            )}
          </CardContent>
        </Card>

        {!results.success && (
          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="text-red-600">
                <h4 className="font-medium mb-2">Détails de l'erreur</h4>
                <p className="text-sm">{results.error}</p>
                <div className="mt-3 text-xs text-red-500">
                  <p>Conseils de dépannage :</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Vérifiez que votre requête n'est pas trop longue</li>
                    <li>Essayez avec une requête plus simple</li>
                    <li>Testez la connexion avec le bouton de test</li>
                    <li>Attendez quelques secondes avant de réessayer</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Réponse principale de DeepSeek */}
        {results.success && results.response && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Analyse DeepSeek
                {results.mcpToolResults && results.mcpToolResults.length > 0 && (
                  <Badge variant="secondary">
                    {results.mcpToolResults.length} outil{results.mcpToolResults.length > 1 ? 's' : ''} MCP
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">
                  {results.response.choices?.[0]?.message?.content || 'Aucune réponse générée'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Résultats des outils MCP */}
        {results.success && results.mcpToolResults && results.mcpToolResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                Analyses MCP Spécialisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.mcpToolResults.map((toolResult: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{toolResult.toolName}</Badge>
                      {toolResult.error ? (
                        <Badge variant="destructive">Erreur</Badge>
                      ) : (
                        <Badge variant="secondary">Succès</Badge>
                      )}
                    </div>
                    
                    {toolResult.error ? (
                      <p className="text-red-600 text-sm">{toolResult.error}</p>
                    ) : (
                      <div className="space-y-2">
                        {/* Rendu spécialisé selon le type d'outil */}
                        {toolResult.toolName === 'symbol_analyzer' && toolResult.result.symbolAnalysis && (
                          <div>
                            <h4 className="font-medium">Analyse Symbolique</h4>
                            <p className="text-sm"><strong>Signification culturelle:</strong> {toolResult.result.symbolAnalysis.culturalSignificance}</p>
                            <p className="text-sm"><strong>Contexte historique:</strong> {toolResult.result.symbolAnalysis.historicalContext}</p>
                            <p className="text-sm"><strong>Symboles trouvés:</strong> {toolResult.result.symbolAnalysis.foundSymbols?.length || 0}</p>
                            {toolResult.result.metadata && (
                              <Badge variant="outline" className="mt-2">
                                Confiance: {Math.round(toolResult.result.metadata.confidence * 100)}%
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {toolResult.toolName === 'cultural_context_provider' && toolResult.result.culturalContext && (
                          <div>
                            <h4 className="font-medium">Contexte Culturel</h4>
                            <p className="text-sm"><strong>Culture:</strong> {toolResult.result.culturalContext.culture}</p>
                            <p className="text-sm"><strong>Caractéristiques:</strong> {toolResult.result.culturalContext.culturalCharacteristics}</p>
                            <p className="text-sm"><strong>Symboles associés:</strong> {toolResult.result.culturalContext.symbolsCount}</p>
                          </div>
                        )}
                        
                        {/* Rendu générique pour autres outils */}
                        {!['symbol_analyzer', 'cultural_context_provider'].includes(toolResult.toolName) && (
                          <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto max-h-40">
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
            
            {/* Bouton de test de connexion */}
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Test Connexion
            </Button>
          </div>

          {/* Interface de recherche */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Entrez votre requête de recherche (ex: 'Analysez le symbolisme du lotus dans la culture bouddhiste')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-h-[100px]"
              maxLength={5000}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Ctrl+Enter pour rechercher</span>
              <span>•</span>
              <span>{query.length}/5000 caractères</span>
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
              {isLoading ? 'Recherche en cours...' : 'Rechercher avec MCP'}
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
                    className="cursor-pointer hover:bg-gray-100 max-w-xs truncate"
                    onClick={() => handleHistorySelect(historyQuery)}
                    title={historyQuery}
                  >
                    {historyQuery.length > 50 ? `${historyQuery.slice(0, 50)}...` : historyQuery}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Erreurs globales */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <p className="font-medium">Erreur de connexion</p>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
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
