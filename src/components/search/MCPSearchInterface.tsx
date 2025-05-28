
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, AlertCircle, CheckCircle, Brain } from 'lucide-react';
import { useMCPSearch } from '@/hooks/useMCPSearch';
import { toast } from 'sonner';

const MCPSearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const { search, isLoading, error, lastResponse, clearError } = useMCPSearch();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Veuillez saisir une requête');
      return;
    }

    try {
      await search(query);
      toast.success('Recherche effectuée avec succès');
    } catch (err) {
      toast.error('Erreur lors de la recherche');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Recherche MCP + DeepSeek
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Posez votre question sur les symboles culturels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {query.length}/500 caractères
              </span>
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
                {isLoading ? 'Recherche...' : 'Rechercher'}
              </Button>
            </div>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Erreur</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearError}
                    className="ml-auto"
                  >
                    Effacer
                  </Button>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {lastResponse && (
        <Card className={`border-2 ${lastResponse.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {lastResponse.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              Résultat de la recherche
              {lastResponse.processingTime && (
                <Badge variant="outline" className="ml-auto">
                  {lastResponse.processingTime}ms
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastResponse.success ? (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{lastResponse.content}</p>
              </div>
            ) : (
              <p className="text-red-600">{lastResponse.error}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCPSearchInterface;
