
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Bot, 
  Search, 
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VerificationTabProps {
  symbolId: string;
  symbolName: string;
}

interface VerificationResult {
  api: string;
  status: 'verified' | 'disputed' | 'unverified' | 'error';
  confidence: number;
  summary: string;
  details: string;
  sources?: string[];
  timestamp: string;
}

const API_CONFIGS = {
  openai: {
    name: 'OpenAI GPT-4',
    icon: Bot,
    description: 'Analyse avec GPT-4 pour vérifier les informations historiques',
    color: 'green'
  },
  deepseek: {
    name: 'DeepSeek',
    icon: Search,
    description: 'Modèle spécialisé dans la recherche et l\'analyse factuelle',
    color: 'blue'
  },
  anthropic: {
    name: 'Claude (Anthropic)',
    icon: ShieldCheck,
    description: 'Analyse critique et factuelle avec Claude',
    color: 'purple'
  },
  perplexity: {
    name: 'Perplexity',
    icon: ExternalLink,
    description: 'Recherche en temps réel avec sources web actualisées',
    color: 'orange'
  },
  gemini: {
    name: 'Google Gemini',
    icon: Bot,
    description: 'Analyse multimodale avec accès aux données Google',
    color: 'red'
  }
};

export function VerificationTab({ symbolId, symbolName }: VerificationTabProps) {
  const [results, setResults] = useState<Record<string, VerificationResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('overview');

  const verifyWithAPI = async (apiKey: string) => {
    setLoading(prev => ({ ...prev, [apiKey]: true }));
    
    try {
      const payload = {
        api: apiKey,
        symbolId: symbolId,
        symbolName: symbolName
      };

      const { data, error } = await supabase.functions.invoke('verify-symbol', {
        body: payload
      });

      if (error) throw error;

      setResults(prev => ({
        ...prev,
        [apiKey]: {
          ...data,
          timestamp: new Date().toISOString()
        }
      }));
      
      toast.success(`Vérification ${API_CONFIGS[apiKey as keyof typeof API_CONFIGS].name} terminée`);
    } catch (error) {
      console.error(`Erreur lors de la vérification ${apiKey}:`, error);
      setResults(prev => ({
        ...prev,
        [apiKey]: {
          api: apiKey,
          status: 'error',
          confidence: 0,
          summary: 'Erreur lors de la vérification',
          details: error instanceof Error ? error.message : 'Erreur inconnue',
          timestamp: new Date().toISOString()
        }
      }));
      toast.error(`Erreur lors de la vérification ${API_CONFIGS[apiKey as keyof typeof API_CONFIGS].name}`);
    } finally {
      setLoading(prev => ({ ...prev, [apiKey]: false }));
    }
  };

  const verifyAll = async () => {
    const apis = Object.keys(API_CONFIGS);
    await Promise.all(apis.map(api => verifyWithAPI(api)));
  };

  const getStatusIcon = (status: VerificationResult['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disputed':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'unverified':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: VerificationResult['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disputed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unverified':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'error':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOverallStatus = () => {
    const resultValues = Object.values(results);
    if (resultValues.length === 0) return null;
    
    const verified = resultValues.filter(r => r.status === 'verified').length;
    const disputed = resultValues.filter(r => r.status === 'disputed').length;
    const unverified = resultValues.filter(r => r.status === 'unverified').length;
    
    if (verified > disputed + unverified) return 'verified';
    if (disputed > 0) return 'disputed';
    return 'unverified';
  };

  const getAverageConfidence = () => {
    const validResults = Object.values(results).filter(r => r.status !== 'error');
    if (validResults.length === 0) return 0;
    return Math.round(validResults.reduce((acc, r) => acc + r.confidence, 0) / validResults.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            Vérification de la véracité
          </h3>
          <p className="text-slate-600 text-sm">
            Vérifiez l'exactitude des informations sur ce symbole avec plusieurs IA
          </p>
        </div>
        <Button 
          onClick={verifyAll} 
          disabled={Object.values(loading).some(Boolean)}
          className="flex items-center gap-2"
        >
          {Object.values(loading).some(Boolean) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Vérifier tout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="details">Détails par API</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {Object.keys(results).length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Résultat global</h4>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-600">
                    Confiance moyenne: {getAverageConfidence()}%
                  </div>
                  <Badge className={getStatusColor(getOverallStatus() || 'error')}>
                    {getStatusIcon(getOverallStatus() || 'error')}
                    <span className="ml-1 capitalize">{getOverallStatus() || 'Erreur'}</span>
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(results).filter(r => r.status === 'verified').length}
                  </div>
                  <div className="text-sm text-green-700">Vérifiées</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Object.values(results).filter(r => r.status === 'disputed').length}
                  </div>
                  <div className="text-sm text-yellow-700">Contestées</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {Object.values(results).filter(r => r.status === 'unverified').length}
                  </div>
                  <div className="text-sm text-red-700">Non vérifiées</div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(API_CONFIGS).map(([key, config]) => {
              const result = results[key];
              const isLoading = loading[key];
              const Icon = config.icon;

              return (
                <Card key={key} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{config.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => verifyWithAPI(key)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Vérifier'
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{config.description}</p>
                  
                  {result && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(result.status)}>
                          {getStatusIcon(result.status)}
                          <span className="ml-1 capitalize">{result.status}</span>
                        </Badge>
                        <span className="text-sm text-slate-600">{result.confidence}%</span>
                      </div>
                      <p className="text-sm text-slate-700">{result.summary}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {Object.entries(results).map(([key, result]) => {
            const config = API_CONFIGS[key as keyof typeof API_CONFIGS];
            const Icon = config.icon;

            return (
              <Card key={key} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h4 className="font-semibold">{config.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)}
                      <span className="ml-1 capitalize">{result.status}</span>
                    </Badge>
                    <span className="text-sm text-slate-600">{result.confidence}% confiance</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Résumé</h5>
                    <p className="text-slate-700">{result.summary}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Analyse détaillée</h5>
                    <p className="text-slate-700 whitespace-pre-wrap">{result.details}</p>
                  </div>

                  {result.sources && result.sources.length > 0 && (
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Sources</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {result.sources.map((source, index) => (
                          <li key={index} className="text-slate-700 text-sm">
                            <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {source}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span>Vérifié le {new Date(result.timestamp).toLocaleString('fr-FR')}</span>
                  </div>
                </div>
              </Card>
            );
          })}

          {Object.keys(results).length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Aucune vérification n'a encore été effectuée. Cliquez sur "Vérifier tout" pour commencer.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
