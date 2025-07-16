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
      
      // Récupérer toutes les vérifications pour ce symbole
      const { data: verifications, error } = await supabase
        .from('symbol_verifications')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .eq('symbol_id', symbol.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (verifications && verifications.length > 0) {
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
            verifiedBy: group[0].profiles?.full_name || group[0].profiles?.username || 'Inconnu',
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
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
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

      {currentVerification ? (
        <div className="space-y-4">
          {/* Résultat global actuel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-900">Résultat global</h4>
              <Badge className={getStatusColor(currentVerification.overallStatus)}>
                {getStatusIcon(currentVerification.overallStatus)}
                <span className="ml-1">{getStatusText(currentVerification.overallStatus)}</span>
              </Badge>
            </div>
            
            <p className="text-slate-700 mb-4">
              {getStatusDescription(currentVerification.overallStatus, currentVerification.averageConfidence)}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-600">
                  {currentVerification.averageConfidence}%
                </div>
                <div className="text-sm text-slate-700">Confiance moyenne</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-600">
                  {currentVerification.results.length}
                </div>
                <div className="text-sm text-slate-700">APIs consultées</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-600">
                  {currentVerification.results.filter(r => r.status === 'verified').length}
                </div>
                <div className="text-sm text-slate-700">Sources vérifiées</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              <span>Dernière vérification le {new Date(currentVerification.timestamp).toLocaleString('fr-FR')}</span>
            </div>
          </Card>

          {/* Résumé des résultats par API */}
          <Card className="p-6">
            <h4 className="font-medium text-slate-900 mb-4">Résultats par source</h4>
            <div className="space-y-3">
              {currentVerification.results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(result.status)} variant="outline">
                      {getStatusIcon(result.status)}
                      <span className="ml-1">{result.api}</span>
                    </Badge>
                    <span className="text-sm text-slate-700">{result.summary}</span>
                  </div>
                  <span className="text-sm text-slate-600">{result.confidence}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Aucune vérification n'a encore été effectuée pour ce symbole. 
            Les informations présentées n'ont pas été validées par des sources externes.
          </AlertDescription>
        </Alert>
      )}

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