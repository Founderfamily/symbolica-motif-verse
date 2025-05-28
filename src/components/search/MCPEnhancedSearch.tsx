import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Brain, Sparkles, History, GitCompare, BookOpen, Loader2, AlertCircle, CheckCircle, Bug, Settings, Zap } from 'lucide-react';
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
    testSimpleFunction,
    analyzeSymbol,
    getCulturalContext,
    compareSymbols,
    synthesizeResearch,
    isLoading,
    error,
    clearError
  } = useMCPDeepSeek();

  const handleTestSimpleFunction = useCallback(async () => {
    console.log('🧪 Testing SIMPLE Edge Function...');
    clearError();
    
    try {
      const simpleResult = await testSimpleFunction();
      console.log('🧪 Simple function result:', simpleResult);
      
      if (simpleResult.success) {
        toast.success('✅ Test simple - Edge Function fonctionne!');
        setResults({
          success: true,
          testType: 'simple-function',
          response: simpleResult,
          timestamp: new Date().toISOString(),
          debug: { simpleTest: true, ...simpleResult }
        });
      } else {
        toast.error(`❌ Test simple échoué: ${simpleResult.error}`);
        setResults({
          success: false,
          testType: 'simple-function',
          error: simpleResult.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('❌ Simple function test error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur de test simple inconnue';
      toast.error(`❌ Erreur de test simple: ${errorMessage}`);
      setResults({
        success: false,
        testType: 'simple-function',
        error: errorMessage,
        timestamp: new Date().toISOString(),
        debug: { simpleTestFailed: true, clientError: true }
      });
    }
  }, [testSimpleFunction, clearError]);

  const handleDebugTest = useCallback(async () => {
    console.log('🧪 Testing ENHANCED DEBUG MODE...');
    clearError();
    
    try {
      const debugResult = await testDebugMode();
      console.log('🧪 Enhanced debug result:', debugResult);
      
      if (debugResult.success) {
        toast.success('✅ Mode Debug Amélioré - Tests réussis!');
        setResults(debugResult);
      } else {
        toast.error(`❌ Mode Debug échoué: ${debugResult.error}`);
        setResults(debugResult);
      }
    } catch (err) {
      console.error('❌ Enhanced debug test error:', err);
      toast.error(`❌ Erreur de debug amélioré: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [testDebugMode, clearError]);

  const handleTestConnection = useCallback(async () => {
    console.log('🧪 Testing ENHANCED connection...');
    clearError();
    
    try {
      const testResult = await testConnection();
      console.log('🧪 Enhanced test result:', testResult);
      
      if (testResult.success) {
        toast.success('✅ Connexion MCP améliorée fonctionnelle!');
        setResults(testResult);
      } else {
        toast.error(`❌ Test amélioré échoué: ${testResult.error}`);
        setResults(testResult);
      }
    } catch (err) {
      console.error('❌ Enhanced test error:', err);
      toast.error(`❌ Erreur de test amélioré: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
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
      console.log('🔍 Starting ENHANCED search:', trimmedQuery.substring(0, 100) + '...');
      
      const searchResults = await searchWithMCP({
        query: trimmedQuery,
        toolRequests: [],
        contextData: { searchType, simplified: true, enhanced: true }
      });

      console.log('📊 Enhanced search results received:', {
        success: searchResults.success,
        hasResponse: !!searchResults.response,
        debug: searchResults.debug,
        error: searchResults.error,
        processingTime: searchResults.processingTime
      });

      setResults(searchResults);
      
      if (searchResults.success) {
        setSearchHistory(prev => [trimmedQuery, ...prev.filter(q => q !== trimmedQuery)].slice(0, 10));
        toast.success(`Recherche MCP améliorée complétée (${searchResults.processingTime || 0}ms)`);
      } else {
        toast.error(`Erreur lors de la recherche améliorée: ${searchResults.error}`);
      }
      
      if (onResultsUpdate) {
        onResultsUpdate(searchResults);
      }

    } catch (err) {
      console.error('❌ Enhanced search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche améliorée';
      toast.error(errorMessage);
      
      setResults({
        success: false,
        error: errorMessage,
        response: null,
        mcpTools: [],
        mcpToolResults: [],
        timestamp: new Date().toISOString(),
        debug: { enhancedSearchFailed: true, clientError: true }
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
        {/* Statut de la recherche avec infos debug améliorées */}
        <Card className={`border-2 ${results.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="p-4">
            <div className={`flex items-center gap-2 ${results.success ? 'text-green-800' : 'text-red-800'}`}>
              {results.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">
                {results.success ? 'Test/Recherche réussi' : 'Erreur de test/recherche'}
              </span>
              {results.processingTime && (
                <Badge variant="outline" className="ml-auto">
                  {results.processingTime}ms
                </Badge>
              )}
              {results.debug && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Enhanced Debug
                </Badge>
              )}
              {results.testType && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {results.testType}
                </Badge>
              )}
            </div>
            
            {/* Infos de debug améliorées */}
            {results.debug && (
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                <div><strong>Enhanced Debug Info:</strong></div>
                {results.debug.simpleTest && (
                  <div>• Test Simple: ✅ (Edge Function basique fonctionne)</div>
                )}
                {results.debug.apiTest && (
                  <div>• API Test: ✅ ({results.debug.apiTest.models?.length || 0} modèles disponibles)</div>
                )}
                {results.debug.environment && (
                  <div>• Config: API Key {results.debug.environment.hasDeepSeekKey ? '✅' : '❌'}, Supabase {results.debug.environment.hasSupabaseUrl ? '✅' : '❌'}</div>
                )}
                {results.debug.clientError && (
                  <div>• Erreur Côté Client: ❌ (Problème d'invocation)</div>
                )}
                {results.debug.enhanced && (
                  <div>• Mode: Amélioré avec logging détaillé</div>
                )}
              </div>
            )}
            
            {!results.success && results.error && (
              <p className="mt-2 text-sm text-red-700">{results.error}</p>
            )}
          </CardContent>
        </Card>

        {/* Réponse pour test simple */}
        {results.success && results.testType === 'simple-function' && results.response && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Test Edge Function Simple
                <Badge variant="secondary">Fonctionnel</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p><strong>Message:</strong> {results.response.message}</p>
                <p><strong>Timestamp:</strong> {results.response.timestamp}</p>
                <p><strong>Temps de traitement:</strong> {results.response.processingTime}ms</p>
                <p><strong>Méthode:</strong> {results.response.method}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Réponse principale */}
        {results.success && results.response && results.testType !== 'simple-function' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Analyse DeepSeek Améliorée
                <Badge variant="secondary">Mode Amélioré</Badge>
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
            Recherche MCP + DeepSeek (Mode Debug Amélioré)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Diagnostic avancé avec Edge Function de test et logging détaillé
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Boutons de debug améliorés */}
          <div className="flex gap-2 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <Button 
              variant="outline" 
              onClick={handleTestSimpleFunction}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Test Edge Function Simple
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDebugTest}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Test Debug MCP Complet
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Test Connexion MCP
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
              <span>Mode Debug Amélioré: limité à 1000 caractères</span>
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
              {isLoading ? 'Test en cours...' : 'Tester MCP Amélioré'}
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
                  <p className="font-medium">Erreur de connexion améliorée</p>
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
