
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, AlertCircle, CheckCircle, Brain, Shield } from 'lucide-react';
import { useMCPSearch } from '@/hooks/useMCPSearch';
import { toast } from 'sonner';

const MCPSearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const { search, isLoading, error, lastResponse, clearError } = useMCPSearch();

  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setQuery(sanitizedValue);
  };

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      toast.error('Veuillez saisir une requête');
      return;
    }

    if (trimmedQuery.length > 500) {
      toast.error('Requête trop longue (max 500 caractères)');
      return;
    }

    try {
      await search(trimmedQuery);
      toast.success('Recherche effectuée avec succès');
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Erreur lors de la recherche');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Recherche MCP + DeepSeek
            <Shield className="h-4 w-4 text-green-600 ml-auto" title="Interface sécurisée" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Posez votre question sur les symboles culturels..."
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="min-h-[100px]"
              maxLength={500}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {query.length}/500 caractères
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Ctrl+Enter pour rechercher</span>
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
              <p className="text-red-600">Service temporairement indisponible</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCPSearchInterface;
