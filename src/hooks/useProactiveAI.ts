import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useProactiveAI = (questId: string) => {
  const { toast } = useToast();
  
  // Protection contre double-clic et états de verrous
  const actionLocks = useRef({
    investigation: false,
    sources: false,
    theories: false,
    connections: false,
  });
  
  // Références pour le debouncing
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const lastActionTime = useRef<{ [key: string]: number }>({});
  
  // Fonction de debouncing optimisée
  const debounceAction = useCallback((actionKey: string, action: () => Promise<any>, delay = 200) => {
    const now = Date.now();
    const lastTime = lastActionTime.current[actionKey] || 0;
    
    // Si la dernière action était il y a moins de 200ms, ignorer
    if (now - lastTime < delay) {
      console.log(`⏱️ Action ${actionKey} trop rapide - dernière: ${now - lastTime}ms`);
      return Promise.resolve();
    }
    
    // Clear le timer précédent s'il existe
    if (debounceTimers.current[actionKey]) {
      clearTimeout(debounceTimers.current[actionKey]);
    }
    
    // Exécuter immédiatement
    console.log(`🚀 Exécution action ${actionKey}`);
    lastActionTime.current[actionKey] = now;
    return action();
  }, []);

  // Fonction de récupération d'erreur
  const handleError = useCallback((error: Error, context: string) => {
    console.error(`Erreur ${context}:`, error);
    toast({
      title: "Erreur",
      description: `${context}: ${error.message}`,
      variant: "destructive",
    });
  }, [toast]);

  // Mutation pour investigation proactive complète
  const startProactiveInvestigationMutation = useMutation({
    mutationFn: async ({ questId, questData }: { questId: string, questData?: any }) => {
      console.log('🚀 Starting proactive investigation for quest:', questId);
      
      // Récupérer l'ID utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        console.log('⚠️ Utilisateur non authentifié - investigation sans sauvegarde');
      }
      
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { 
          action: 'full_investigation',
          questId,
          questData,
          userId: user?.id || 'anonymous',
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Erreur lors de l\'investigation proactive');
      }

      if (!data || data.status !== 'success') {
        throw new Error(data?.message || 'Erreur lors de l\'investigation proactive');
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Investigation data received:', data);
      
      if (data.auth_required) {
        toast({
          title: "⚠️ Investigation IA générée",
          description: "Résultat généré mais non sauvegardé. Connectez-vous pour sauvegarder.",
          variant: "default",
        });
      } else if (data.saved) {
        toast({
          title: "🔍 Investigation IA terminée",
          description: "L'analyse complète a été générée et sauvegardée avec succès",
        });
      } else {
        toast({
          title: "🔍 Investigation IA générée",
          description: data.save_error ? `Erreur de sauvegarde: ${data.save_error}` : "Résultat généré",
          variant: data.save_error ? "destructive" : "default",
        });
      }
    },
    onError: (error) => {
      handleError(error as Error, 'Investigation proactive');
    },
  });

  // Mutation pour recherche de sources historiques
  const searchHistoricalSourcesMutation = useMutation({
    mutationFn: async ({ questId, questData }: { questId: string, questData?: any }) => {
      console.log('📚 Searching historical sources for quest:', questId);
      
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { 
          action: 'search_historical_sources',
          questId,
          questData,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Erreur lors de la recherche de sources');
      }

      if (!data || data.status !== 'success') {
        throw new Error(data?.message || 'Erreur lors de la recherche de sources');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "📚 Sources historiques trouvées",
        description: "L'IA a identifié des sources pertinentes",
      });
    },
    onError: (error) => {
      handleError(error as Error, 'Recherche de sources');
    },
  });

  // Mutation pour génération de théories
  const generateTheoriesMutation = useMutation({
    mutationFn: async ({ questId, questData, evidenceData }: { questId: string, questData?: any, evidenceData?: any[] }) => {
      console.log('💡 Generating theories for quest:', questId);
      
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { 
          action: 'generate_theories',
          questId,
          questData,
          evidenceData,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Erreur lors de la génération de théories');
      }

      if (!data || data.status !== 'success') {
        throw new Error(data?.message || 'Erreur lors de la génération de théories');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "💡 Théories générées",
        description: "L'IA a élaboré des théories d'investigation",
      });
    },
    onError: (error) => {
      handleError(error as Error, 'Génération de théories');
    },
  });

  // Mutation pour analyse des connexions
  const analyzeConnectionsMutation = useMutation({
    mutationFn: async ({ questId, questData, evidenceData, theoriesData }: { questId: string, questData?: any, evidenceData?: any[], theoriesData?: any[] }) => {
      console.log('🔗 Analyzing connections for quest:', questId);
      
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { 
          action: 'analyze_connections',
          questId,
          questData,
          evidenceData,
          theoriesData,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Erreur lors de l\'analyse des connexions');
      }

      if (!data || data.status !== 'success') {
        throw new Error(data?.message || 'Erreur lors de l\'analyse des connexions');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "🔗 Analyse des connexions terminée",
        description: "L'IA a analysé les relations entre les éléments",
      });
    },
    onError: (error) => {
      handleError(error as Error, 'Analyse des connexions');
    },
  });

  // Actions protégées avec debouncing
  const protectedActions = {
    startProactiveInvestigation: (params: { questId: string, questData?: any }) => debounceAction('investigation', () => {
      if (actionLocks.current.investigation) return Promise.resolve();
      actionLocks.current.investigation = true;
      setTimeout(() => actionLocks.current.investigation = false, 30000);
      return startProactiveInvestigationMutation.mutateAsync(params);
    }),

    searchHistoricalSources: (params: { questId: string, questData?: any }) => debounceAction('sources', () => {
      if (actionLocks.current.sources) return Promise.resolve();
      actionLocks.current.sources = true;
      setTimeout(() => actionLocks.current.sources = false, 20000);
      return searchHistoricalSourcesMutation.mutateAsync(params);
    }),

    generateTheories: (params: { questId: string, questData?: any, evidenceData?: any[] }) => debounceAction('theories', () => {
      if (actionLocks.current.theories) return Promise.resolve();
      actionLocks.current.theories = true;
      setTimeout(() => actionLocks.current.theories = false, 25000);
      return generateTheoriesMutation.mutateAsync(params);
    }),

    analyzeConnections: (params: { questId: string, questData?: any, evidenceData?: any[], theoriesData?: any[] }) => debounceAction('connections', () => {
      if (actionLocks.current.connections) return Promise.resolve();
      actionLocks.current.connections = true;
      setTimeout(() => actionLocks.current.connections = false, 20000);
      return analyzeConnectionsMutation.mutateAsync(params);
    }),
  };

  return {
    // Actions avec paramètres
    ...protectedActions,
    
    // États de chargement
    isInvestigating: startProactiveInvestigationMutation.isPending,
    isSearchingSources: searchHistoricalSourcesMutation.isPending,
    isGeneratingTheories: generateTheoriesMutation.isPending,
    isAnalyzingConnections: analyzeConnectionsMutation.isPending,
    
    // Fonction de récupération d'interface
    resetInterface: useCallback(() => {
      console.log('🔄 Reset interface IA');
      actionLocks.current = {
        investigation: false,
        sources: false,
        theories: false,
        connections: false,
      };
      
      // Clear tous les timers
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
      debounceTimers.current = {};
      lastActionTime.current = {};
      
      toast({
        title: "Interface réinitialisée",
        description: "L'interface IA a été remise à zéro",
      });
    }, [toast]),
  };
};