
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, Brain, Loader2, AlertCircle, CheckCircle, Bug, Settings, Zap, Activity, RotateCcw, Wifi, Database } from 'lucide-react';
import { useMCPDeepSeek } from '@/hooks/useMCPDeepSeek';
import { toast } from 'sonner';

interface MCPSearchProps {
  onResultsUpdate?: (results: any) => void;
  initialQuery?: string;
}

const MCPEnhancedSearch: React.FC<MCPSearchProps> = ({ onResultsUpdate, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const {
    testSimpleFunction,
    testSimpleDebug,
    testApiConnectivity,
    searchWithMCP,
    isLoading,
    error,
    clearError,
    forceReset
  } = useMCPDeepSeek();

  // Force reset
  const handleForceReset = useCallback(() => {
    console.log('🔄 USER: Force reset requested');
    forceReset();
    setResults(null);
    clearError();
    toast.info('🔄 Interface réinitialisée');
  }, [forceReset, clearError]);

  // TEST 1: Edge Function simple
  const handleTestSimpleFunction = useCallback(async () => {
    console.log('🧪 USER: TEST 1 - Simple Edge Function');
    clearError();
    
    try {
      const simpleResult = await testSimpleFunction();
      console.log('✅ USER: TEST 1 completed:', simpleResult);
      
      toast.success('✅ TEST 1: Edge Function basique OK!');
      setResults({
        success: true,
        testType: 'test-1-simple-function',
        response: simpleResult,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('❌ USER: TEST 1 failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur TEST 1';
      toast.error(`❌ TEST 1 échoué: ${errorMessage}`);
      setResults({
        success: false,
        testType: 'test-1-simple-function',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  }, [testSimpleFunction, clearError]);

  // TEST 2: Debug simple (NOUVEAU)
  const handleTestSimpleDebug = useCallback(async () => {
    console.log('🧪 USER: TEST 2 - Simple Debug (no external calls)');
    clearError();
    
    try {
      const debugResult = await testSimpleDebug();
      console.log('✅ USER: TEST 2 completed:', debugResult);
      
      toast.success('✅ TEST 2: Debug simple OK!');
      setResults(debugResult);
    } catch (err) {
      console.error('❌ USER: TEST 2 failed:', err);
      toast.error(`❌ TEST 2 échoué: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [testSimpleDebug, clearError]);

  // TEST 3: Connectivité API (NOUVEAU)
  const handleTestApiConnectivity = useCallback(async () => {
    console.log('🧪 USER: TEST 3 - API Connectivity');
    clearError();
    
    try {
      const connectivityResult = await testApiConnectivity();
      console.log('✅ USER: TEST 3 completed:', connectivityResult);
      
      toast.success('✅ TEST 3: Connectivité API OK!');
      setResults(connectivityResult);
    } catch (err) {
      console.error('❌ USER: TEST 3 failed:', err);
      toast.error(`❌ TEST 3 échoué: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [testApiConnectivity, clearError]);

  // TEST 4: Recherche normale
  const handleSearch = useCallback(async () => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      toast.error('Veuillez saisir une requête de recherche');
      return;
    }

    clearError();
    
    try {
      console.log('🧪 USER: TEST 4 - Normal search:', trimmedQuery);
      
      const searchResults = await searchWithMCP({
        query: trimmedQuery,
        toolRequests: [],
        contextData: { normalSearch: true }
      });

      console.log('✅ USER: TEST 4 completed:', searchResults);

      setResults(searchResults);
      
      if (searchResults.success) {
        setSearchHistory(prev => [trimmedQuery, ...prev.filter(q => q !== trimmedQuery)].slice(0, 5));
        toast.success(`✅ TEST 4: Recherche réussie`);
      } else {
        toast.error(`❌ TEST 4 échoué: ${searchResults.error}`);
      }
      
      if (onResultsUpdate) {
        onResultsUpdate(searchResults);
      }

    } catch (err) {
      console.error('❌ USER: TEST 4 failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      toast.error(`❌ TEST 4: ${errorMessage}`);
    }
  }, [query, searchWithMCP, onResultsUpdate, clearError]);

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="mt-6 space-y-4">
        {/* Statut */}
        <Card className={`border-2 ${results.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="p-4">
            <div className={`flex items-center gap-2 ${results.success ? 'text-green-800' : 'text-red-800'}`}>
              {results.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">
                {results.success ? 'Test réussi' : 'Test échoué'}
              </span>
              {results.processingTime && (
                <Badge variant="outline" className="ml-auto">
                  {results.processingTime}ms
                </Badge>
              )}
              {results.testType && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  {results.testType}
                </Badge>
              )}
              {results.mode && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {results.mode}
                </Badge>
              )}
            </div>
            
            {!results.success && results.error && (
              <p className="mt-2 text-sm text-red-700 font-mono">{results.error}</p>
            )}
          </CardContent>
        </Card>

        {/* Réponse principale */}
        {results.success && results.response && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Résultat {results.mode ? `(${results.mode})` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {results.testType?.includes('simple-function') ? (
                  <div>
                    <p><strong>Message:</strong> {results.response.message}</p>
                    <p><strong>Status:</strong> ✅ Edge Function opérationnelle</p>
                  </div>
                ) : results.mode === 'simple_debug' ? (
                  <div>
                    <p><strong>Configuration:</strong> ✅ Environnement vérifié</p>
                    <p><strong>Supabase:</strong> {results.response.configurationStatus?.supabase}</p>
                    <p><strong>DeepSeek:</strong> {results.response.configurationStatus?.deepseek}</p>
                    <p><strong>Outils disponibles:</strong> {results.response.availableTools?.join(', ')}</p>
                  </div>
                ) : results.mode === 'connectivity_test' ? (
                  <div>
                    <p><strong>Connectivité API:</strong> ✅ Connexion DeepSeek OK</p>
                    <p><strong>Modèles disponibles:</strong> {results.response.connectivity?.modelsCount || 0}</p>
                    <p><strong>Status:</strong> {results.response.connectivity?.status}</p>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">
                    {results.response.choices?.[0]?.message?.content || 
                     results.response.message || 
                     'Réponse reçue avec succès'}
                  </p>
                )}
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
            <Activity className="h-6 w-6 text-red-600" />
            MCP + DeepSeek - Tests Progressifs
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleForceReset}
              className="ml-auto"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tests progressifs avec timeouts optimisés et debug séparé
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tests progressifs dans l'ordre LOGIQUE */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 border border-blue-200 rounded">
            <div className="col-span-2 text-sm font-medium text-blue-800 mb-2">
              TESTS PROGRESSIFS (exécuter dans l'ordre):
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleTestSimpleFunction}
              disabled={isLoading}
              className="flex items-center gap-2 border-green-300"
            >
              <Zap className="h-4 w-4" />
              TEST 1: Edge Function
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestSimpleDebug}
              disabled={isLoading}
              className="flex items-center gap-2 border-blue-300"
            >
              <Database className="h-4 w-4" />
              TEST 2: Debug Simple
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestApiConnectivity}
              disabled={isLoading}
              className="flex items-center gap-2 border-purple-300"
            >
              <Wifi className="h-4 w-4" />
              TEST 3: Connectivité API
            </Button>
          </div>

          {/* Recherche normale */}
          <div className="flex gap-2">
            <Textarea
              placeholder="TEST 4: Requête courte (ex: 'Que signifie le lotus?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-h-[80px]"
              maxLength={300}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{query.length}/300 caractères</span>
              {isLoading && <span className="text-orange-600">⏳ En cours...</span>}
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
              {isLoading ? 'Recherche...' : 'TEST 4: Recherche'}
            </Button>
          </div>

          {/* Historique */}
          {searchHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Tests précédents:</h4>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyQuery, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 max-w-xs truncate"
                    onClick={() => setQuery(historyQuery)}
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
                  <p className="font-medium">ERREUR DÉTECTÉE</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleForceReset}
                    className="ml-auto"
                  >
                    Reset
                  </Button>
                </div>
                <p className="text-sm text-red-600 mt-1 font-mono">{error}</p>
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
