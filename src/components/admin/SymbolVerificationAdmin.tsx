import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck,
  Settings,
  Play,
  Loader2,
  RefreshCw,
  Eye,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SymbolVerificationAdminProps {
  symbol: {
    id: string;
    name: string;
  };
  onVerificationComplete?: () => void;
}

interface VerificationResult {
  api: string;
  status: 'verified' | 'disputed' | 'unverified';
  confidence: number;
  summary: string;
  details?: string;
  sources?: any[];
  saved: boolean;
}

export const SymbolVerificationAdmin: React.FC<SymbolVerificationAdminProps> = ({ 
  symbol, 
  onVerificationComplete 
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      setIsAdmin(profile?.is_admin || false);
    } catch (error) {
      console.error('Erreur lors de la vérification admin:', error);
    }
  };

  const startVerification = async () => {
    if (!isAdmin) {
      toast.error('Seuls les administrateurs peuvent lancer des vérifications');
      return;
    }

    setIsVerifying(true);
    setResults([]);
    setCurrentStep('Initialisation...');

    const apis = ['anthropic', 'gemini', 'perplexity', 'openai', 'deepseek'];
    
    try {
      for (const api of apis) {
        setCurrentStep(`Vérification via ${api.toUpperCase()}...`);
        
        // Ajouter un résultat temporaire
        setResults(prev => [...prev, {
          api: api.toUpperCase(),
          status: 'disputed',
          confidence: 0,
          summary: 'Vérification en cours...',
          saved: false
        }]);

        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          const { data, error } = await supabase.functions.invoke('verify-symbol', {
            body: { 
              symbolId: symbol.id,
              symbolName: symbol.name,
              api: api,
              userId: user?.id,
              autoSave: true
            }
          });

          if (error) throw error;

          // Mettre à jour le résultat avec les vraies données
          setResults(prev => prev.map(result => 
            result.api === api.toUpperCase() 
              ? {
                  ...result,
                  status: data.status,
                  confidence: data.confidence,
                  summary: data.summary,
                  details: data.details,
                  sources: data.sources,
                  saved: true
                }
              : result
          ));

          // Feedback visuel de sauvegarde
          toast.success(`✓ ${api.toUpperCase()} - Résultat sauvegardé`, {
            duration: 2000,
          });

        } catch (apiError) {
          console.error(`Erreur ${api}:`, apiError);
          
          // Mettre à jour avec l'erreur
          setResults(prev => prev.map(result => 
            result.api === api.toUpperCase() 
              ? {
                  ...result,
                  status: 'unverified',
                  confidence: 0,
                  summary: 'Erreur lors de la vérification',
                  details: 'Service temporairement indisponible',
                  saved: false
                }
              : result
          ));

          toast.error(`Erreur ${api.toUpperCase()}`);
        }

        // Pause courte entre les appels
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setCurrentStep('Vérification terminée');
      toast.success('🎉 Vérification complète ! Tous les résultats ont été sauvegardés.', {
        duration: 4000,
      });

      // Notifier le parent
      onVerificationComplete?.();

    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast.error('Erreur lors de la vérification');
    } finally {
      setIsVerifying(false);
      setCurrentStep('');
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

  if (!isAdmin) {
    return (
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertDescription>
          Seuls les administrateurs peuvent accéder à l'interface de vérification.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Interface de vérification admin
          </h3>
        </div>
        <Button 
          onClick={startVerification}
          disabled={isVerifying}
          className="flex items-center gap-2"
        >
          {isVerifying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isVerifying ? 'Vérification...' : 'Lancer la vérification'}
        </Button>
      </div>

      {/* État actuel */}
      {isVerifying && currentStep && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertDescription>
            {currentStep}
          </AlertDescription>
        </Alert>
      )}

      {/* Résultats en temps réel */}
      {results.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-slate-900">Résultats en temps réel</h4>
          </div>
          
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(result.status)} variant="outline">
                    {getStatusIcon(result.status)}
                    <span className="ml-1">{result.api}</span>
                  </Badge>
                  <span className="text-sm text-slate-700">{result.summary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">{result.confidence}%</span>
                  {result.saved ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">Sauvé</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">En cours</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Résumé global */}
          {results.length > 0 && results.every(r => r.saved) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Vérification terminée</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Confiance moyenne: {Math.round(results.reduce((acc, r) => acc + r.confidence, 0) / results.length)}% 
                • {results.filter(r => r.status === 'verified').length} vérifiées 
                • {results.filter(r => r.status === 'disputed').length} contestées 
                • {results.filter(r => r.status === 'unverified').length} non vérifiées
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Instructions */}
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertDescription>
          Cette interface permet de lancer une vérification complète du symbole via 5 APIs d'IA. 
          Les résultats sont automatiquement sauvegardés et apparaîtront dans l'onglet "Vérification" public.
        </AlertDescription>
      </Alert>
    </div>
  );
};