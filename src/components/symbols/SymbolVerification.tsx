import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Info,
  History
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface SymbolVerificationProps {
  symbol: {
    id: string;
    name: string;
    culture: string;
    period: string;
    description?: string;
    significance?: string;
    historical_context?: string;
  };
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

export const SymbolVerification: React.FC<SymbolVerificationProps> = ({ symbol }) => {
  const { user } = useAuth();
  const [results, setResults] = useState<Record<string, VerificationResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('overview');
  const [verificationHistory, setVerificationHistory] = useState<any[]>([]);
  const [currentVerification, setCurrentVerification] = useState<any | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadVerificationHistory();
  }, [symbol.id, refreshKey, results]); // Add results dependency

  // Auto-refresh every 30 seconds to catch new verifications
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadVerificationHistory = async () => {
    try {
      setHistoryLoading(true);
      
      const { data: verifications, error } = await supabase
        .from('symbol_verifications')
        .select('*')
        .eq('symbol_id', symbol.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (verifications && verifications.length > 0) {
        const groupedVerifications = groupVerificationsBySession(verifications);
        
        const history = groupedVerifications.map(group => {
          const averageConfidence = Math.round(
            group.reduce((acc, v) => acc + v.confidence, 0) / group.length
          );
          
          const overallStatus = determineOverallStatus(group, averageConfidence);
          
          return {
            id: group[0].id,
            timestamp: group[0].created_at,
            overallStatus,
            averageConfidence,
            verifiedBy: 'Système automatique',
            results: group.map(v => ({
              api: v.api,
              status: v.status,
              confidence: v.confidence,
              summary: v.summary,
              sources: v.sources
            }))
          };
        });

        setCurrentVerification(history[0] || null);
        
        // Merge with current session results if any
        if (Object.keys(results).length > 0) {
          const sessionVerification = {
            id: 'current-session',
            timestamp: new Date().toISOString(),
            overallStatus: getOverallStatus(),
            averageConfidence: getAverageConfidence(),
            verifiedBy: 'Session actuelle',
            results: Object.values(results).map(r => ({
              api: r.api,
              status: r.status,
              confidence: r.confidence,
              summary: r.summary,
              sources: r.sources
            }))
          };
          
          // Add current session at the beginning if it's different from the latest saved
          const combinedHistory = history.length > 0 && 
            Math.abs(new Date(history[0].timestamp).getTime() - new Date().getTime()) < 5 * 60 * 1000
            ? history // Recent verification exists, don't duplicate
            : [sessionVerification, ...history]; // Add current session
            
          setVerificationHistory(combinedHistory);
          setCurrentVerification(sessionVerification);
        } else {
          setVerificationHistory(history);
          setCurrentVerification(history[0] || null);
        }
      } else {
        // No saved verifications, but check if we have current session results
        if (Object.keys(results).length > 0) {
          const sessionVerification = {
            id: 'current-session',
            timestamp: new Date().toISOString(),
            overallStatus: getOverallStatus(),
            averageConfidence: getAverageConfidence(),
            verifiedBy: 'Session actuelle',
            results: Object.values(results).map(r => ({
              api: r.api,
              status: r.status,
              confidence: r.confidence,
              summary: r.summary,
              sources: r.sources
            }))
          };
          
          setVerificationHistory([sessionVerification]);
          setCurrentVerification(sessionVerification);
        } else {
          setVerificationHistory([]);
          setCurrentVerification(null);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const groupVerificationsBySession = (verifications: any[]) => {
    const sessions: any[][] = [];
    const sortedVerifications = [...verifications].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (const verification of sortedVerifications) {
      const verificationTime = new Date(verification.created_at).getTime();
      
      const existingSession = sessions.find(session => {
        const sessionTime = new Date(session[0].created_at).getTime();
        return Math.abs(verificationTime - sessionTime) < 15 * 60 * 1000;
      });

      if (existingSession) {
        existingSession.push(verification);
      } else {
        sessions.push([verification]);
      }
    }

    return sessions;
  };

  const determineOverallStatus = (verifications: any[], averageConfidence: number): 'verified' | 'disputed' | 'unverified' => {
    if (averageConfidence >= 70) {
      return 'verified';
    } else if (averageConfidence >= 50) {
      return 'disputed';
    } else {
      return 'unverified';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Vérifié';
      case 'disputed': return 'Contesté';
      case 'unverified': return 'Non vérifié';
      default: return 'Inconnu';
    }
  };

  const getStatusDescription = (status: string, confidence: number) => {
    switch (status) {
      case 'verified':
        return `Les informations de ce symbole ont été vérifiées par plusieurs sources d'IA avec un niveau de confiance de ${confidence}%.`;
      case 'disputed':
        return `Les informations de ce symbole présentent des incohérences ou des sources contradictoires. Niveau de confiance: ${confidence}%.`;
      case 'unverified':
        return `Les informations de ce symbole n'ont pas pu être vérifiées ou manquent de sources fiables. Niveau de confiance: ${confidence}%.`;
      default:
        return 'Aucune vérification n\'a encore été effectuée pour ce symbole.';
    }
  };

  const verifyWithAPI = async (apiKey: string) => {
    setLoading(prev => ({ ...prev, [apiKey]: true }));
    
    try {
      const payload = {
        api: apiKey,
        symbol: {
          name: symbol.name,
          culture: symbol.culture,
          period: symbol.period,
          description: symbol.description,
          significance: symbol.significance,
          historical_context: symbol.historical_context
        },
        autoSave: true,
        symbolId: symbol.id,
        userId: user?.id
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
      
      // Reload history after successful verification  
      setTimeout(() => {
        loadVerificationHistory();
      }, 1000); // Small delay to ensure DB is updated
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
    // History will be reloaded by individual verifyWithAPI calls
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="details">Détails par API</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
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

        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Historique des vérifications
              </h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setRefreshKey(prev => prev + 1)}
              disabled={historyLoading}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Actualiser
            </Button>
          </div>

          {historyLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Chargement des vérifications...</p>
            </div>
          )}

          {!historyLoading && currentVerification ? (
            <div className="space-y-4">
              {/* Résultat global actuel */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(currentVerification.overallStatus)}
                    <h3 className="text-lg font-semibold">
                      Analyse de vérification actuelle
                    </h3>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(currentVerification.overallStatus)} text-white border-none`}
                  >
                    {getStatusText(currentVerification.overallStatus)}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">Consensus des sources:</span>
                    <span className="text-sm font-semibold">{currentVerification.averageConfidence}%</span>
                  </div>
                  
                  <p className="text-sm text-slate-600">
                    {getStatusDescription(currentVerification.overallStatus, currentVerification.averageConfidence)}
                  </p>
                  
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-amber-800">
                        <strong>Analyse multicritère :</strong> Les variations entre sources reflètent souvent la complexité historique et la nature parfois "cachée" ou symbolique de certains éléments patrimoniaux.
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    Dernière analyse: {new Date(currentVerification.timestamp).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </Card>

              {/* Détails par API pour la vérification actuelle */}
              <Card className="p-6">
                <h4 className="text-md font-semibold mb-4">Analyse détaillée par source</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {currentVerification.results.map((result: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{result.api}</span>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(result.status)} text-white border-none text-xs`}
                        >
                          {getStatusText(result.status)}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-600 mb-2">
                        Niveau de confiance: {result.confidence}%
                      </div>
                      {result.summary && (
                        <div className="text-xs text-slate-500 line-clamp-2">
                          {result.summary.substring(0, 120)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Historique complet */}
              {verificationHistory.length > 1 && (
                <Card className="p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Historique complet</h4>
                  <div className="space-y-3">
                    {verificationHistory.map((verification: any) => (
                      <div key={verification.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(verification.overallStatus)}
                          <div>
                            <div className="font-medium text-sm">
                              {getStatusText(verification.overallStatus)} • {verification.averageConfidence}% de confiance
                            </div>
                            <div className="text-xs text-slate-600">
                              {new Date(verification.timestamp).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {verification.results.length} API{verification.results.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : !historyLoading ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Aucune vérification n'a encore été effectuée pour ce symbole. 
                Utilisez l'onglet "Vue d'ensemble" pour lancer une nouvelle vérification.
              </AlertDescription>
            </Alert>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
};
