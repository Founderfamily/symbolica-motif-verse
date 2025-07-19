
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
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
  Clock,
  Pause,
  RotateCcw,
  List,
  Zap,
  Bell
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
  status: 'verified' | 'disputed' | 'unverified' | 'running' | 'error';
  confidence: number;
  summary: string;
  details?: string;
  sources?: any[];
  saved: boolean;
  startTime?: number;
  endTime?: number;
}

interface VerificationState {
  mode: 'complete' | 'selective';
  selectedApis: string[];
  isVerifying: boolean;
  isPaused: boolean;
  results: VerificationResult[];
  currentStep: string;
  startTime?: number;
  completedCount: number;
  totalCount: number;
}

const API_OPTIONS = [
  { id: 'anthropic', name: 'Anthropic Claude', description: 'IA généraliste avancée' },
  { id: 'gemini', name: 'Google Gemini', description: 'IA multimodale de Google' },
  { id: 'perplexity', name: 'Perplexity', description: 'IA avec accès web en temps réel' },
  { id: 'openai', name: 'OpenAI GPT', description: 'GPT-4 d\'OpenAI' },
  { id: 'deepseek', name: 'DeepSeek', description: 'IA spécialisée en raisonnement' }
];

export const SymbolVerificationAdmin: React.FC<SymbolVerificationAdminProps> = ({ 
  symbol, 
  onVerificationComplete 
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [verificationState, setVerificationState] = useState<VerificationState>({
    mode: 'complete',
    selectedApis: API_OPTIONS.map(api => api.id),
    isVerifying: false,
    isPaused: false,
    results: [],
    currentStep: '',
    completedCount: 0,
    totalCount: 0
  });

  useEffect(() => {
    checkAdminStatus();
    loadPersistedState();
  }, []);

  useEffect(() => {
    // Persister l'état dans localStorage
    if (verificationState.isVerifying || verificationState.results.length > 0) {
      localStorage.setItem(`verification_${symbol.id}`, JSON.stringify(verificationState));
    }
  }, [verificationState, symbol.id]);

  const loadPersistedState = () => {
    const persistedState = localStorage.getItem(`verification_${symbol.id}`);
    if (persistedState) {
      try {
        const state = JSON.parse(persistedState);
        // Reprendre seulement si la vérification était en cours
        if (state.isVerifying && !state.isPaused) {
          setVerificationState(prev => ({
            ...prev,
            ...state,
            isVerifying: false, // Reprendre manuellement
            currentStep: 'Vérification interrompue - Cliquez pour reprendre'
          }));
          toast.info('Vérification précédente détectée - Vous pouvez reprendre', {
            action: {
              label: 'Reprendre',
              onClick: () => resumeVerification(state)
            }
          });
        } else if (state.results?.length > 0) {
          setVerificationState(prev => ({ ...prev, results: state.results }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'état persisté:', error);
      }
    }
  };

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

    const apis = verificationState.mode === 'complete' 
      ? API_OPTIONS.map(api => api.id)
      : verificationState.selectedApis;

    if (apis.length === 0) {
      toast.error('Sélectionnez au moins une IA pour la vérification');
      return;
    }

    setVerificationState(prev => ({
      ...prev,
      isVerifying: true,
      isPaused: false,
      results: [],
      currentStep: 'Initialisation...',
      startTime: Date.now(),
      completedCount: 0,
      totalCount: apis.length
    }));

    // Notification browser
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Vérification commencée', {
        body: `${apis.length} IA(s) vont vérifier ${symbol.name}`,
        icon: '/favicon.ico'
      });
    }
    
    await runVerification(apis);
  };

  const resumeVerification = async (previousState: VerificationState) => {
    const completedApis = previousState.results.filter(r => r.saved).map(r => r.api.toLowerCase());
    const remainingApis = previousState.selectedApis.filter(api => !completedApis.includes(api));
    
    if (remainingApis.length === 0) {
      toast.info('Toutes les vérifications sont déjà terminées');
      return;
    }

    setVerificationState(prev => ({
      ...prev,
      isVerifying: true,
      isPaused: false,
      currentStep: `Reprise - ${remainingApis.length} IA(s) restantes...`
    }));

    await runVerification(remainingApis);
  };

  const runVerification = async (apis: string[]) => {
    try {
      for (let i = 0; i < apis.length; i++) {
        const api = apis[i];
        
        // Vérifier si la vérification est en pause
        if (verificationState.isPaused) {
          setVerificationState(prev => ({
            ...prev,
            currentStep: 'Vérification en pause...'
          }));
          return;
        }

        setVerificationState(prev => ({
          ...prev,
          currentStep: `Vérification via ${api.toUpperCase()}... (${i + 1}/${apis.length})`
        }));
        
        // Ajouter un résultat temporaire
        setVerificationState(prev => ({
          ...prev,
          results: [...prev.results.filter(r => r.api !== api.toUpperCase()), {
            api: api.toUpperCase(),
            status: 'running',
            confidence: 0,
            summary: 'Vérification en cours...',
            saved: false,
            startTime: Date.now()
          }]
        }));

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
          setVerificationState(prev => ({
            ...prev,
            results: prev.results.map(result => 
              result.api === api.toUpperCase() 
                ? {
                    ...result,
                    status: data.status,
                    confidence: data.confidence,
                    summary: data.summary,
                    details: data.details,
                    sources: data.sources,
                    saved: true,
                    endTime: Date.now()
                  }
                : result
            ),
            completedCount: prev.completedCount + 1
          }));

          // Feedback visuel de sauvegarde
          toast.success(`✓ ${api.toUpperCase()} - Résultat sauvegardé`, {
            duration: 2000,
          });

        } catch (apiError) {
          console.error(`Erreur ${api}:`, apiError);
          
          // Mettre à jour avec l'erreur
          setVerificationState(prev => ({
            ...prev,
            results: prev.results.map(result => 
              result.api === api.toUpperCase() 
                ? {
                    ...result,
                    status: 'error',
                    confidence: 0,
                    summary: 'Erreur lors de la vérification',
                    details: 'Service temporairement indisponible',
                    saved: false,
                    endTime: Date.now()
                  }
                : result
            ),
            completedCount: prev.completedCount + 1
          }));

          toast.error(`Erreur ${api.toUpperCase()}`);
        }

        // Pause courte entre les appels
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setVerificationState(prev => ({
        ...prev,
        isVerifying: false,
        currentStep: 'Vérification terminée'
      }));

      // Notification browser de fin
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Vérification terminée !', {
          body: `${symbol.name} a été vérifié par ${apis.length} IA(s)`,
          icon: '/favicon.ico'
        });
      }

      toast.success('🎉 Vérification complète ! Tous les résultats ont été sauvegardés.', {
        duration: 4000,
      });

      // Nettoyer le localStorage
      localStorage.removeItem(`verification_${symbol.id}`);

      // Notifier le parent
      onVerificationComplete?.();

    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast.error('Erreur lors de la vérification');
      setVerificationState(prev => ({
        ...prev,
        isVerifying: false,
        currentStep: 'Erreur lors de la vérification'
      }));
    }
  };

  const pauseVerification = () => {
    setVerificationState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
      currentStep: prev.isPaused ? 'Vérification reprise...' : 'Vérification en pause...'
    }));
  };

  const resetVerification = () => {
    setVerificationState(prev => ({
      ...prev,
      isVerifying: false,
      isPaused: false,
      results: [],
      currentStep: '',
      completedCount: 0,
      totalCount: 0
    }));
    localStorage.removeItem(`verification_${symbol.id}`);
    toast.info('État de vérification réinitialisé');
  };

  const retryFailedApis = async () => {
    const failedApis = verificationState.results
      .filter(r => r.status === 'error' || !r.saved)
      .map(r => r.api.toLowerCase());
    
    if (failedApis.length === 0) {
      toast.info('Aucune IA en échec à relancer');
      return;
    }

    setVerificationState(prev => ({
      ...prev,
      isVerifying: true,
      currentStep: `Relancement de ${failedApis.length} IA(s) en échec...`,
      completedCount: prev.results.filter(r => r.saved).length,
      totalCount: prev.results.length
    }));

    await runVerification(failedApis);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success('Notifications activées pour les vérifications');
        }
      });
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
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
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
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgress = () => {
    if (verificationState.totalCount === 0) return 0;
    return (verificationState.completedCount / verificationState.totalCount) * 100;
  };

  const getEstimatedTimeRemaining = () => {
    if (!verificationState.startTime || verificationState.completedCount === 0) return null;
    
    const elapsed = Date.now() - verificationState.startTime;
    const averageTimePerApi = elapsed / verificationState.completedCount;
    const remaining = (verificationState.totalCount - verificationState.completedCount) * averageTimePerApi;
    
    return Math.round(remaining / 1000); // en secondes
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
          {('Notification' in window && Notification.permission === 'default') && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={requestNotificationPermission}
              className="text-blue-600"
            >
              <Bell className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {verificationState.results.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetVerification}
              disabled={verificationState.isVerifying}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          {verificationState.isVerifying && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={pauseVerification}
            >
              <Pause className="h-4 w-4" />
              {verificationState.isPaused ? 'Reprendre' : 'Pause'}
            </Button>
          )}
          <Button 
            onClick={startVerification}
            disabled={verificationState.isVerifying || (verificationState.mode === 'selective' && verificationState.selectedApis.length === 0)}
            className="flex items-center gap-2"
          >
            {verificationState.isVerifying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {verificationState.isVerifying ? 'Vérification...' : 'Lancer la vérification'}
          </Button>
        </div>
      </div>

      {/* Sélection du mode et des IA */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-900">Mode de vérification :</span>
            <div className="flex gap-2">
              <Button 
                variant={verificationState.mode === 'complete' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setVerificationState(prev => ({ 
                  ...prev, 
                  mode: 'complete',
                  selectedApis: API_OPTIONS.map(api => api.id)
                }))}
                disabled={verificationState.isVerifying}
              >
                <Zap className="h-4 w-4 mr-1" />
                Toutes les IA
              </Button>
              <Button 
                variant={verificationState.mode === 'selective' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setVerificationState(prev => ({ ...prev, mode: 'selective' }))}
                disabled={verificationState.isVerifying}
              >
                <List className="h-4 w-4 mr-1" />
                Sélection personnalisée
              </Button>
            </div>
          </div>

          {verificationState.mode === 'selective' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {API_OPTIONS.map(api => (
                <div key={api.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={api.id}
                    checked={verificationState.selectedApis.includes(api.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setVerificationState(prev => ({
                          ...prev,
                          selectedApis: [...prev.selectedApis, api.id]
                        }));
                      } else {
                        setVerificationState(prev => ({
                          ...prev,
                          selectedApis: prev.selectedApis.filter(id => id !== api.id)
                        }));
                      }
                    }}
                    disabled={verificationState.isVerifying}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={api.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {api.name}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {api.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {verificationState.mode === 'selective' && (
            <div className="text-sm text-slate-600">
              {verificationState.selectedApis.length} IA(s) sélectionnée(s)
            </div>
          )}
        </div>
      </Card>

      {/* État actuel et progression */}
      {(verificationState.isVerifying || verificationState.currentStep) && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {verificationState.isVerifying && !verificationState.isPaused && (
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                )}
                {verificationState.isPaused && (
                  <Pause className="h-4 w-4 text-yellow-600" />
                )}
                <span className="font-medium">{verificationState.currentStep}</span>
              </div>
              {verificationState.results.some(r => r.status === 'error' || !r.saved) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={retryFailedApis}
                  disabled={verificationState.isVerifying}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Relancer les échecs
                </Button>
              )}
            </div>
            
            {verificationState.totalCount > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{verificationState.completedCount}/{verificationState.totalCount} IA(s) traitées</span>
                  {getEstimatedTimeRemaining() && (
                    <span className="text-slate-600">
                      ~{getEstimatedTimeRemaining()}s restantes
                    </span>
                  )}
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Résultats en temps réel */}
      {verificationState.results.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-slate-900">Résultats en temps réel</h4>
            </div>
            {verificationState.results.length > 0 && verificationState.results.every(r => r.saved) && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Terminé
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            {verificationState.results.map((result, index) => (
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
                  ) : result.status === 'running' ? (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs">En cours</span>
                    </div>
                  ) : result.status === 'error' ? (
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-3 w-3" />
                      <span className="text-xs">Échec</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">En attente</span>
                    </div>
                  )}
                  {result.startTime && result.endTime && (
                    <span className="text-xs text-slate-500">
                      {Math.round((result.endTime - result.startTime) / 1000)}s
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Résumé global */}
          {verificationState.results.length > 0 && verificationState.results.every(r => r.saved || r.status === 'error') && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Vérification terminée</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Confiance moyenne: {Math.round(verificationState.results.filter(r => r.saved).reduce((acc, r) => acc + r.confidence, 0) / verificationState.results.filter(r => r.saved).length) || 0}% 
                • {verificationState.results.filter(r => r.status === 'verified').length} vérifiées 
                • {verificationState.results.filter(r => r.status === 'disputed').length} contestées 
                • {verificationState.results.filter(r => r.status === 'unverified').length} non vérifiées
                • {verificationState.results.filter(r => r.status === 'error').length} en échec
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Instructions */}
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertDescription>
          <strong>Vérification objective :</strong> Cette interface lance une vérification complètement neutre du symbole via 5 APIs d'IA indépendantes. 
          Aucune information préalable n'est fournie aux IA pour garantir des résultats non biaisés.
          Les résultats sont automatiquement sauvegardés et apparaîtront dans l'onglet "Vérification" public.
        </AlertDescription>
      </Alert>
      
      <Alert className="border-blue-200 bg-blue-50">
        <RefreshCw className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Note importante :</strong> Pour éviter tout biais, chaque nouvelle vérification utilise uniquement les informations de base du symbole 
          (nom, culture, période) sans référence aux vérifications précédentes ou aux sources externes.
        </AlertDescription>
      </Alert>
    </div>
  );
};
