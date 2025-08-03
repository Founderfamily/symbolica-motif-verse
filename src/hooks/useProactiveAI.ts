import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { investigationService } from '@/services/investigationService';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { errorRecoveryService } from '@/services/errorRecoveryService';

export const useProactiveAI = (questId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Protection contre double-clic et états de verrous
  const [actionLocks, setActionLocks] = useState({
    investigating: false,
    searchingSources: false,
    generatingTheories: false,
    analyzing: false,
    regenerating: false
  });
  
  // Références pour le debouncing
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const lastActionTime = useRef<{ [key: string]: number }>({});
  
  // Fonction de debouncing optimisée pour une meilleure responsivité
  const debounceAction = useCallback((actionKey: string, action: () => void, delay = 500) => {
    const now = Date.now();
    const lastTime = lastActionTime.current[actionKey] || 0;
    
    // Si la dernière action était il y a moins de 500ms, ignorer
    if (now - lastTime < delay) {
      console.log(`⏱️ Action ${actionKey} trop rapide - dernière: ${now - lastTime}ms`);
      return;
    }
    
    // Clear le timer précédent s'il existe
    if (debounceTimers.current[actionKey]) {
      clearTimeout(debounceTimers.current[actionKey]);
    }
    
    // Exécuter immédiatement sans timer supplémentaire
    console.log(`🚀 Exécution action ${actionKey}`);
    lastActionTime.current[actionKey] = now;
    action();
  }, []);

  // Fonction de récupération d'erreur
  const handleError = useCallback(async (error: Error, context: string) => {
    console.error(`Erreur ${context}:`, error);
    
    const recovered = await errorRecoveryService.recoverFromError(error, context);
    if (!recovered) {
      toast({
        title: "Erreur",
        description: `${context}: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Insights IA proactifs
  const {
    data: insights,
    isLoading: insightsLoading,
    refetch: refetchInsights,
    error: insightsError
  } = useQuery({
    queryKey: ['proactive-insights', questId],
    queryFn: () => investigationService.generateProactiveInsights(questId),
    enabled: !!questId,
    refetchInterval: 30000,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      handleError(error as Error, 'fetch-insights');
      return true;
    }
  });

  // Suggestions de zones d'investigation
  const {
    data: investigationAreas,
    isLoading: areasLoading,
    refetch: refetchAreas
  } = useQuery({
    queryKey: ['investigation-areas', questId],
    queryFn: () => investigationService.suggestInvestigationAreas(questId),
    enabled: !!questId,
    retry: 2
  });

  // Analyse des connexions
  const {
    data: connections,
    isLoading: connectionsLoading,
    refetch: refetchConnections
  } = useQuery({
    queryKey: ['evidence-theory-connections', questId],
    queryFn: () => investigationService.analyzeEvidenceTheoryConnections(questId),
    enabled: !!questId,
    retry: 2
  });

  // Détection de patterns
  const {
    data: patterns,
    isLoading: patternsLoading,
    refetch: refetchPatterns
  } = useQuery({
    queryKey: ['investigation-patterns', questId],
    queryFn: () => investigationService.detectPatterns(questId),
    enabled: !!questId,
    retry: 2
  });

  // Mutation pour forcer une nouvelle analyse
  const regenerateInsightsMutation = useMutation({
    mutationFn: () => investigationService.generateProactiveInsights(questId),
    onMutate: () => {
      setActionLocks(prev => ({ ...prev, regenerating: true }));
    },
    onSuccess: () => {
      setActionLocks(prev => ({ ...prev, regenerating: false }));
      refetchInsights();
      toast({
        title: "Analyse terminée",
        description: "Les insights IA ont été mis à jour",
      });
    },
    onError: async (error) => {
      setActionLocks(prev => ({ ...prev, regenerating: false }));
      await handleError(error as Error, 'regenerate-insights');
    },
  });

  // Mutation pour analyser les connexions
  const analyzeConnectionsMutation = useMutation({
    mutationFn: () => investigationService.analyzeEvidenceTheoryConnections(questId),
    onMutate: () => {
      setActionLocks(prev => ({ ...prev, analyzing: true }));
    },
    onSuccess: () => {
      setActionLocks(prev => ({ ...prev, analyzing: false }));
      refetchConnections();
      toast({
        title: "Analyse des connexions terminée",
        description: "Les relations entre preuves et théories ont été analysées",
      });
    },
    onError: async (error) => {
      setActionLocks(prev => ({ ...prev, analyzing: false }));
      await handleError(error as Error, 'analyze-connections');
    },
  });

  // Mutation pour investigation proactive complète
  const startProactiveInvestigationMutation = useMutation({
    mutationFn: async (investigationType?: string) => {
      // Vérifier si une investigation est déjà en cours
      if (actionLocks.investigating) {
        throw new Error('Investigation déjà en cours');
      }
      
      const { data, error } = await supabase.functions.invoke('proactive-investigation', {
        body: {
          questId,
          investigationType: investigationType || 'full_investigation',
          context: {
            location: 'France',
            period: '1850-1900',
            coordinates: { latitude: 46.2, longitude: 2.3 }
          }
        }
      });
      
      if (error) throw error;
      return data;
    },
    onMutate: () => {
      console.log('🚀 Démarrage investigation IA');
      setActionLocks(prev => ({ ...prev, investigating: true }));
    },
    onSuccess: (data) => {
      console.log('✅ Investigation IA terminée avec succès');
      setActionLocks(prev => ({ ...prev, investigating: false }));
      
      // Rafraîchir toutes les données après l'investigation
      refetchInsights();
      refetchAreas();
      refetchConnections();
      refetchPatterns();
      
      toast({
        title: "🔍 Investigation IA terminée",
        description: `L'IA a trouvé ${data?.data?.results ? Object.keys(data.data.results).length : 'plusieurs'} nouvelles pistes`,
      });
    },
    onError: async (error) => {
      console.error('❌ Erreur investigation IA:', error);
      setActionLocks(prev => ({ ...prev, investigating: false }));
      await handleError(error as Error, 'proactive-investigation');
    },
  });

  // Mutation pour recherche de sources historiques
  const searchHistoricalSourcesMutation = useMutation({
    mutationFn: async () => {
      if (actionLocks.searchingSources) {
        throw new Error('Recherche de sources déjà en cours');
      }
      
      const { data, error } = await supabase.functions.invoke('proactive-investigation', {
        body: {
          questId,
          investigationType: 'search_historical_sources',
          context: {
            location: 'France',
            period: '1850-1900',
            coordinates: { latitude: 46.2, longitude: 2.3 }
          }
        }
      });
      
      if (error) throw error;
      return data;
    },
    onMutate: () => {
      setActionLocks(prev => ({ ...prev, searchingSources: true }));
    },
    onSuccess: () => {
      setActionLocks(prev => ({ ...prev, searchingSources: false }));
      toast({
        title: "🏛️ Sources historiques trouvées",
        description: "L'IA a découvert de nouvelles sources d'archives",
      });
    },
    onError: async (error) => {
      setActionLocks(prev => ({ ...prev, searchingSources: false }));
      await handleError(error as Error, 'search-sources');
    },
  });

  // Mutation pour génération de théories
  const generateTheoriesMutation = useMutation({
    mutationFn: async () => {
      if (actionLocks.generatingTheories) {
        throw new Error('Génération de théories déjà en cours');
      }
      
      const { data, error } = await supabase.functions.invoke('proactive-investigation', {
        body: {
          questId,
          investigationType: 'generate_theories',
          context: {
            location: 'France',
            period: '1850-1900',
            coordinates: { latitude: 46.2, longitude: 2.3 }
          }
        }
      });
      
      if (error) throw error;
      return data;
    },
    onMutate: () => {
      setActionLocks(prev => ({ ...prev, generatingTheories: true }));
    },
    onSuccess: () => {
      setActionLocks(prev => ({ ...prev, generatingTheories: false }));
      toast({
        title: "🧠 Théories générées",
        description: "L'IA a élaboré de nouvelles théories d'investigation",
      });
    },
    onError: async (error) => {
      setActionLocks(prev => ({ ...prev, generatingTheories: false }));
      await handleError(error as Error, 'generate-theories');
    },
  });

  // Actions protégées avec debouncing
  const protectedActions = {
    startProactiveInvestigation: useCallback((investigationType?: string) => {
      debounceAction('investigation', () => {
        if (!actionLocks.investigating) {
          startProactiveInvestigationMutation.mutate(investigationType);
        }
      });
    }, [debounceAction, actionLocks.investigating, startProactiveInvestigationMutation.mutate]),
    
    searchHistoricalSources: useCallback(() => {
      debounceAction('search-sources', () => {
        if (!actionLocks.searchingSources) {
          searchHistoricalSourcesMutation.mutate();
        }
      });
    }, [debounceAction, actionLocks.searchingSources, searchHistoricalSourcesMutation.mutate]),
    
    generateTheories: useCallback(() => {
      debounceAction('generate-theories', () => {
        if (!actionLocks.generatingTheories) {
          generateTheoriesMutation.mutate();
        }
      });
    }, [debounceAction, actionLocks.generatingTheories, generateTheoriesMutation.mutate]),
    
    analyzeConnections: useCallback(() => {
      debounceAction('analyze-connections', () => {
        if (!actionLocks.analyzing) {
          analyzeConnectionsMutation.mutate();
        }
      });
    }, [debounceAction, actionLocks.analyzing, analyzeConnectionsMutation.mutate]),
    
    regenerateInsights: useCallback(() => {
      debounceAction('regenerate-insights', () => {
        if (!actionLocks.regenerating) {
          regenerateInsightsMutation.mutate();
        }
      });
    }, [debounceAction, actionLocks.regenerating, regenerateInsightsMutation.mutate])
  };

  return {
    // Données
    insights: insights?.success ? insights.data : [],
    investigationAreas: investigationAreas?.success ? investigationAreas.data : [],
    connections: connections?.success ? connections.data : null,
    patterns: patterns?.success ? patterns.data : [],
    
    // États de chargement consolidés
    isLoading: insightsLoading || areasLoading || connectionsLoading || patternsLoading,
    insightsLoading,
    areasLoading,
    connectionsLoading,
    patternsLoading,
    
    // États des verrous pour UI
    isInvestigating: actionLocks.investigating || startProactiveInvestigationMutation.isPending,
    isSearchingSources: actionLocks.searchingSources || searchHistoricalSourcesMutation.isPending,
    isGeneratingTheories: actionLocks.generatingTheories || generateTheoriesMutation.isPending,
    isAnalyzingConnections: actionLocks.analyzing || analyzeConnectionsMutation.isPending,
    isRegeneratingInsights: actionLocks.regenerating || regenerateInsightsMutation.isPending,
    
    // Actions protégées
    ...protectedActions,
    
    // Fonction de récupération d'interface
    resetInterface: useCallback(() => {
      console.log('🔄 Reset interface IA');
      setActionLocks({
        investigating: false,
        searchingSources: false,
        generatingTheories: false,
        analyzing: false,
        regenerating: false
      });
      
      // Clear tous les timers
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
      debounceTimers.current = {};
      lastActionTime.current = {};
      
      toast({
        title: "Interface réinitialisée",
        description: "L'interface IA a été remise à zéro",
      });
    }, [toast]),
    
    // Méthodes de rafraîchissement
    refetchAll: useCallback(() => {
      refetchInsights();
      refetchAreas();
      refetchConnections();
      refetchPatterns();
    }, [refetchInsights, refetchAreas, refetchConnections, refetchPatterns]),
    
    refetchInsights,
    refetchAreas,
    refetchConnections,
    refetchPatterns,
  };
};