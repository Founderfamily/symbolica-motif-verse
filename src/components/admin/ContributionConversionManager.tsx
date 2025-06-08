
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { contributionConversionService, ConversionResult } from '@/services/contributionConversionService';
import { RefreshCw, Play, CheckCircle, AlertCircle, Users, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NonConvertedContribution {
  id: string;
  title: string;
  cultural_context: string;
  period: string;
  description: string;
  created_at: string;
  reviewed_at: string;
  profiles: {
    username: string;
    full_name: string;
  };
}

const ContributionConversionManager: React.FC = () => {
  const [nonConvertedContributions, setNonConvertedContributions] = useState<NonConvertedContribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const { toast } = useToast();

  const loadNonConvertedContributions = async () => {
    setLoading(true);
    try {
      const contributions = await contributionConversionService.getApprovedContributionsNotConverted();
      setNonConvertedContributions(contributions);
    } catch (error) {
      console.error('Error loading contributions:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les contributions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const processAllContributions = async () => {
    setProcessing(true);
    try {
      const conversionResults = await contributionConversionService.processExistingApprovedContributions();
      setResults(conversionResults);
      
      toast({
        title: 'Traitement terminé',
        description: `${conversionResults.length} contributions traitées`,
        variant: 'default'
      });
      
      // Recharger la liste
      await loadNonConvertedContributions();
    } catch (error) {
      console.error('Error processing contributions:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors du traitement des contributions',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const convertSingleContribution = async (contributionId: string) => {
    try {
      const symbolId = await contributionConversionService.convertContributionToSymbol(contributionId);
      
      if (symbolId) {
        toast({
          title: 'Conversion réussie',
          description: 'La contribution a été convertie en symbole',
          variant: 'default'
        });
        
        // Retirer de la liste
        setNonConvertedContributions(prev => 
          prev.filter(contrib => contrib.id !== contributionId)
        );
      }
    } catch (error) {
      console.error('Error converting contribution:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la conversion',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadNonConvertedContributions();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestionnaire de Conversion des Contributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-600">
              {nonConvertedContributions.length} contributions approuvées en attente de conversion
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadNonConvertedContributions}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button
                onClick={processAllContributions}
                disabled={processing || nonConvertedContributions.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className={`h-4 w-4 mr-2 ${processing ? 'animate-spin' : ''}`} />
                {processing ? 'Traitement...' : 'Traiter Toutes'}
              </Button>
            </div>
          </div>

          {/* Résultats du dernier traitement */}
          {results.length > 0 && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Dernier traitement terminé</AlertTitle>
              <AlertDescription className="text-green-700">
                {results.length} contributions traitées. {results.filter(r => r.collection_found).length} ajoutées à des collections.
              </AlertDescription>
            </Alert>
          )}

          {/* Liste des contributions */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-slate-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : nonConvertedContributions.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Tout est à jour</AlertTitle>
              <AlertDescription>
                Toutes les contributions approuvées ont été converties en symboles.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {nonConvertedContributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="border rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-slate-900">{contribution.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {contribution.cultural_context}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                        {contribution.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {contribution.profiles?.username || contribution.profiles?.full_name || 'Utilisateur'}
                        </span>
                        <span>
                          Approuvée {formatDistanceToNow(new Date(contribution.reviewed_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => convertSingleContribution(contribution.id)}
                      className="ml-4"
                    >
                      Convertir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations sur le processus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <p>
              <strong>Automatique :</strong> Désormais, quand vous approuvez une nouvelle contribution, 
              elle sera automatiquement convertie en symbole et ajoutée à la collection appropriée.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
            <p>
              <strong>Rétroactif :</strong> Utilisez ce gestionnaire pour traiter les contributions 
              déjà approuvées qui n'ont pas encore été converties.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <p>
              <strong>Collections :</strong> Le système recherche automatiquement la collection 
              correspondante basée sur la culture de la contribution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributionConversionManager;
