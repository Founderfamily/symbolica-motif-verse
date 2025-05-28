import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Brain, Sparkles, History, GitCompare, BookOpen, Loader2, AlertCircle, CheckCircle, Bug, Settings } from 'lucide-react';
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
  const [debugMode, setDebugMode] = useState(false);

  const {
    searchWithMCP,
    testConnection,
    testDebugMode,
    analyzeSymbol,
    getCulturalContext,
    compareSymbols,
    synthesizeResearch,
    isLoading,
    error,
    clearError
  } = useMCPDeepSeek();

  const handleDebugTest = useCallback(async () => {
    console.log('🧪 Testing DEBUG MODE...');
    clearError();
    
    try {
      const debugResult = await testDebugMode();
      console.log('🧪 Debug result:', debugResult);
      
      if (debugResult.success) {
        toast.success('✅ Mode Debug - Tests réussis!');
        setResults(debugResult);
      } else {
        toast.error(`❌ Mode Debug échoué: ${debugResult.error}`);
        setResults(debugResult);
      }
    } catch (err) {
      console.error('❌ Debug test error:', err);
      toast.error(`❌ Erreur de debug: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [testDebugMode, clearError]);

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

    if (trimmedQuery.length > 1000) {
      toast.error('La requête est trop longue (maximum 1000 caractères en mode debug)');
      return;
    }

    clearError();
    
    try {
      console.log('🔍 Starting search with simplified mode:', trimmedQuery.substring(0, 100) + '...');
      
      const searchResults = await searchWithMCP({
        query: trimmedQuery,
        toolRequests: [], // Désactivé en mode simplifié
        contextData: { searchType, simplified: true }
      });

      console.log('📊 Search results received:', {
        success: searchResults.success,
        hasResponse: !!searchResults.response,
        debug: searchResults.debug,
        error: searchResults.error,
        processingTime: searchResults.processingTime
      });

      setResults(searchResults);
      
      if (searchResults.success) {
        setSearchHistory(prev => [trimmedQuery, ...prev.filter(q => q !== trimmedQuery)].slice(0, 10));
        toast.success(`Recherche MCP complétée (${searchResults.processingTime || 0}ms)`);
      } else {
        toast.error(`Erreur lors de la recherche: ${searchResults.error}`);
      }
      
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
  }, [query, searchType, searchWithMCP, onResultsUpdate, clearError]);

  const handleHistorySelect = (historicalQuery: string) => {
    setQuery(historicalQuery);
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="mt-6 space-y-4">
        {/* Statut de la recherche avec infos debug */}
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
              {results.debug && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Debug Mode
                </Badge>
              )}
            </div>
            
            {/* Infos de debug */}
            {results.debug && (
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                <div><strong>Debug Info:</strong></div>
                {results.debug.apiTest && (
                  <div>• API Test: ✅ ({results.debug.apiTest.models?.length || 0} modèles disponibles)</div>
                )}
                {results.debug.environment && (
                  <div>• Config: API Key {results.debug.environment.hasDeepSeekKey ? '✅' : '❌'}, Supabase {results.debug.environment.hasSupabaseUrl ? '✅' : '❌'}</div>
                )}
                {results.debug.simplifiedMode && (
                  <div>• Mode: Simplifié (outils MCP désactivés)</div>
                )}
              </div>
            )}
            
            {!results.success && results.error && (
              <p className="mt-2 text-sm text-red-700">{results.error}</p>
            )}
          </CardContent>
        </Card>

        {/* Réponse principale */}
        {results.success && results.response && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Analyse DeepSeek
                <Badge variant="secondary">Mode Simplifié</Badge>
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

        {/* Détails d'erreur pour le debug */}
        {!results.success && results.debug && (
          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="text-red-600">
                <h4 className="font-medium mb-2">Détails de Debug</h4>
                <pre className="text-xs bg-red-50 p-2 rounded overflow-auto">
                  {JSON.stringify(results.debug, null, 2)}
                </pre>
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
            Recherche MCP + DeepSeek (Mode Debug)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Mode de débogage activé avec logs détaillés et tests simplifiés
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Boutons de debug */}
          <div className="flex gap-2 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <Button 
              variant="outline" 
              onClick={handleDebugTest}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Test Debug Complet
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Test Connexion Simple
            </Button>
          </div>

          {/* Interface de recherche simplifiée */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Test avec une requête courte (ex: 'Que signifie le lotus?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-h-[80px]"
              maxLength={1000}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Mode Debug: limité à 1000 caractères</span>
              <span>•</span>
              <span>{query.length}/1000</span>
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
              {isLoading ? 'Test en cours...' : 'Tester MCP'}
            </Button>
          </div>

          {/* Historique */}
          {searchHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <History className="h-4 w-4" />
                Tests récents
              </h4>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 3).map((historyQuery, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 max-w-xs truncate"
                    onClick={() => setQuery(historyQuery)}
                    title={historyQuery}
                  >
                    {historyQuery.length > 30 ? `${historyQuery.slice(0, 30)}...` : historyQuery}
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
