
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, Brain, Loader2, AlertCircle, CheckCircle, Bug, Settings, Zap, Activity, RotateCcw } from 'lucide-react';
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
    searchWithMCP,
    testConnection,
    testDebugMode,
    testSimpleFunction,
    isLoading,
    error,
    clearError,
    forceReset
  } = useMCPDeepSeek();

  // Force reset en cas de blocage
  const handleForceReset = useCallback(() => {
    console.log('🔄 USER: Force reset requested');
    forceReset();
    setResults(null);
    clearError();
    toast.info('🔄 Interface réinitialisée');
  }, [forceReset, clearError]);

  // Test simple Edge Function
  const handleTestSimpleFunction = useCallback(async () => {
    console.log('🔍 USER: Starting simple Edge Function test...');
    clearError();
    
    try {
      const simpleResult = await testSimpleFunction();
      console.log('✅ USER: Simple test completed:', simpleResult);
      
      toast.success('✅ Edge Function simple fonctionne!');
      setResults({
        success: true,
        testType: 'simple-function',
        response: simpleResult,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('❌ USER: Simple function test failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur de test simple';
      toast.error(`❌ Test simple échoué: ${errorMessage}`);
      setResults({
        success: false,
        testType: 'simple-function',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  }, [testSimpleFunction, clearError]);

  // Test debug MCP
  const handleDebugTest = useCallback(async () => {
    console.log('🔍 USER: Starting MCP debug test...');
    clearError();
    
    try {
      const debugResult = await testDebugMode();
      console.log('✅ USER: Debug test completed:', debugResult);
      
      toast.success('✅ Mode Debug MCP fonctionne!');
      setResults(debugResult);
    } catch (err) {
      console.error('❌ USER: Debug test failed:', err);
      toast.error(`❌ Debug MCP échoué: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [testDebugMode, clearError]);

  // Test connexion MCP normale
  const handleTestConnection = useCallback(async () => {
    console.log('🔍 USER: Starting normal MCP connection test...');
    clearError();
    
    try {
      const testResult = await testConnection();
      console.log('✅ USER: Connection test completed:', testResult);
      
      toast.success('✅ Connexion MCP normale fonctionne!');
      setResults(testResult);
    } catch (err) {
      console.error('❌ USER: Connection test failed:', err);
      toast.error(`❌ Connexion MCP échouée: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [testConnection, clearError]);

  // Recherche MCP normale
  const handleSearch = useCallback(async () => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      toast.error('Veuillez saisir une requête de recherche');
      return;
    }

    clearError();
    
    try {
      console.log('🔍 USER: Starting normal MCP search:', trimmedQuery);
      
      const searchResults = await searchWithMCP({
        query: trimmedQuery,
        toolRequests: [],
        contextData: { normalSearch: true }
      });

      console.log('✅ USER: Search completed:', searchResults);

      setResults(searchResults);
      
      if (searchResults.success) {
        setSearchHistory(prev => [trimmedQuery, ...prev.filter(q => q !== trimmedQuery)].slice(0, 5));
        toast.success(`✅ Recherche MCP réussie`);
      } else {
        toast.error(`❌ Recherche échouée: ${searchResults.error}`);
      }
      
      if (onResultsUpdate) {
        onResultsUpdate(searchResults);
      }

    } catch (err) {
      console.error('❌ USER: Search failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      toast.error(`❌ ${errorMessage}`);
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
                Résultat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {results.testType === 'simple-function' ? (
                  <div>
                    <p><strong>Message:</strong> {results.response.message}</p>
                    <p><strong>Status:</strong> ✅ Edge Function opérationnelle</p>
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
            MCP + DeepSeek - Version Corrigée
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
            Version avec protection anti-blocage et timeouts de sécurité
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tests dans l'ordre logique */}
          <div className="flex gap-2 mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm font-medium text-blue-800 mb-2 w-full">
              TESTS (exécuter dans l'ordre):
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleTestSimpleFunction}
              disabled={isLoading}
              className="flex items-center gap-2 border-green-300"
            >
              <Zap className="h-4 w-4" />
              1. Test Edge Function
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDebugTest}
              disabled={isLoading}
              className="flex items-center gap-2 border-blue-300"
            >
              <Settings className="h-4 w-4" />
              2. Test Debug MCP
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading}
              className="flex items-center gap-2 border-purple-300"
            >
              <Bug className="h-4 w-4" />
              3. Test Connexion MCP
            </Button>
          </div>

          {/* Recherche normale */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Test avec une requête courte (ex: 'Que signifie le lotus?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-h-[80px]"
              maxLength={500}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{query.length}/500 caractères</span>
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
              {isLoading ? 'Recherche...' : '4. Test Recherche'}
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
