
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, Brain, Loader2, AlertCircle, CheckCircle, Bug, Settings, Zap, Activity } from 'lucide-react';
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
    clearError
  } = useMCPDeepSeek();

  // AUDIT: Test simple Edge Function
  const handleTestSimpleFunction = useCallback(async () => {
    console.log('🔍 AUDIT: Starting simple Edge Function test...');
    clearError();
    
    try {
      const simpleResult = await testSimpleFunction();
      console.log('✅ AUDIT: Simple test result:', simpleResult);
      
      if (simpleResult.success) {
        toast.success('✅ AUDIT: Edge Function simple fonctionne parfaitement!');
        setResults({
          success: true,
          testType: 'simple-function-audit',
          response: simpleResult,
          timestamp: new Date().toISOString(),
          audit: true
        });
      } else {
        toast.error(`❌ AUDIT: Test simple échoué: ${simpleResult.error}`);
        setResults({
          success: false,
          testType: 'simple-function-audit',
          error: simpleResult.error,
          timestamp: new Date().toISOString(),
          audit: true
        });
      }
    } catch (err) {
      console.error('❌ AUDIT: Simple function test error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur de test simple inconnue';
      toast.error(`❌ AUDIT: Erreur critique - ${errorMessage}`);
      setResults({
        success: false,
        testType: 'simple-function-audit',
        error: errorMessage,
        timestamp: new Date().toISOString(),
        audit: true,
        critical: true
      });
    }
  }, [testSimpleFunction, clearError]);

  // AUDIT: Test debug MCP complet
  const handleDebugTest = useCallback(async () => {
    console.log('🔍 AUDIT: Starting complete MCP debug test...');
    clearError();
    
    try {
      const debugResult = await testDebugMode();
      console.log('✅ AUDIT: Debug test result:', debugResult);
      
      if (debugResult.success) {
        toast.success('✅ AUDIT: Mode Debug MCP fonctionne!');
        setResults(debugResult);
      } else {
        toast.error(`❌ AUDIT: Debug MCP échoué: ${debugResult.error}`);
        setResults(debugResult);
      }
    } catch (err) {
      console.error('❌ AUDIT: Debug test error:', err);
      toast.error(`❌ AUDIT: Erreur critique de debug: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [testDebugMode, clearError]);

  // AUDIT: Test connexion MCP normale
  const handleTestConnection = useCallback(async () => {
    console.log('🔍 AUDIT: Starting normal MCP connection test...');
    clearError();
    
    try {
      const testResult = await testConnection();
      console.log('✅ AUDIT: Connection test result:', testResult);
      
      if (testResult.success) {
        toast.success('✅ AUDIT: Connexion MCP normale fonctionne!');
        setResults(testResult);
      } else {
        toast.error(`❌ AUDIT: Connexion MCP échouée: ${testResult.error}`);
        setResults(testResult);
      }
    } catch (err) {
      console.error('❌ AUDIT: Connection test error:', err);
      toast.error(`❌ AUDIT: Erreur critique de connexion: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [testConnection, clearError]);

  // AUDIT: Recherche MCP normale
  const handleSearch = useCallback(async () => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      toast.error('Veuillez saisir une requête de recherche');
      return;
    }

    clearError();
    
    try {
      console.log('🔍 AUDIT: Starting normal MCP search:', trimmedQuery.substring(0, 100) + '...');
      
      const searchResults = await searchWithMCP({
        query: trimmedQuery,
        toolRequests: [],
        contextData: { audit: true, normalSearch: true }
      });

      console.log('✅ AUDIT: Search results:', searchResults);

      setResults(searchResults);
      
      if (searchResults.success) {
        setSearchHistory(prev => [trimmedQuery, ...prev.filter(q => q !== trimmedQuery)].slice(0, 5));
        toast.success(`✅ AUDIT: Recherche MCP réussie (${searchResults.processingTime || 0}ms)`);
      } else {
        toast.error(`❌ AUDIT: Recherche échouée: ${searchResults.error}`);
      }
      
      if (onResultsUpdate) {
        onResultsUpdate(searchResults);
      }

    } catch (err) {
      console.error('❌ AUDIT: Search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      toast.error(`❌ AUDIT: ${errorMessage}`);
    }
  }, [query, searchWithMCP, onResultsUpdate, clearError]);

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="mt-6 space-y-4">
        {/* Statut AUDIT */}
        <Card className={`border-2 ${results.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="p-4">
            <div className={`flex items-center gap-2 ${results.success ? 'text-green-800' : 'text-red-800'}`}>
              {results.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">
                AUDIT: {results.success ? 'Test réussi' : 'Test échoué'}
              </span>
              {results.processingTime && (
                <Badge variant="outline" className="ml-auto">
                  {results.processingTime}ms
                </Badge>
              )}
              {results.audit && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  AUDIT PRO
                </Badge>
              )}
              {results.testType && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  {results.testType}
                </Badge>
              )}
              {results.critical && (
                <Badge variant="destructive">
                  CRITIQUE
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
                Résultat AUDIT
                <Badge variant="secondary">Professionnel</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {results.testType === 'simple-function-audit' ? (
                  <div>
                    <p><strong>Message:</strong> {results.response.message}</p>
                    <p><strong>Temps:</strong> {results.response.processingTime}ms</p>
                    <p><strong>Status:</strong> ✅ Edge Function basique opérationnelle</p>
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
            AUDIT PROFESSIONNEL MCP + DeepSeek
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Diagnostic complet et systématique - 4ème tentative avec méthodologie professionnelle
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tests AUDIT - Ordre logique */}
          <div className="flex gap-2 mb-4 p-4 bg-red-50 border border-red-200 rounded">
            <div className="text-sm font-medium text-red-800 mb-2 w-full">
              SÉQUENCE AUDIT (exécuter dans l'ordre):
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
              maxLength={1000}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>AUDIT: {query.length}/1000 caractères</span>
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
              {isLoading ? 'AUDIT en cours...' : '4. Test Recherche Normale'}
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
                  <p className="font-medium">ERREUR CRITIQUE DÉTECTÉE</p>
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
