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

// Mutation pour investigation proactive complète - VERSION ULTRA-ROBUSTE
  const startProactiveInvestigationMutation = useMutation({
    mutationFn: async ({ questId, questData }: { questId: string, questData?: any }) => {
      console.log('🚀 [ROBUSTE] Démarrage investigation - tentative 1');
      
      // Fonction de retry avec backoff exponentiel
      const retryWithBackoff = async (fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> => {
        for (let i = 0; i < retries; i++) {
          try {
            const result = await fn();
            console.log(`✅ [ROBUSTE] Succès à la tentative ${i + 1}`);
            return result;
          } catch (error) {
            console.log(`❌ [ROBUSTE] Échec tentative ${i + 1}:`, error.message);
            if (i === retries - 1) throw error;
            console.log(`⏳ [ROBUSTE] Attente ${delay}ms avant retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Backoff exponentiel
          }
        }
      };

      // Récupérer l'ID utilisateur avec timeout
      const getUserWithTimeout = async (): Promise<any> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          const { data: { user } } = await supabase.auth.getUser();
          clearTimeout(timeoutId);
          return user;
        } catch (error) {
          clearTimeout(timeoutId);
          console.log('⚠️ [ROBUSTE] Auth timeout ou erreur, continuons en anonyme');
          return null;
        }
      };

      const user = await getUserWithTimeout();
      console.log('👤 [ROBUSTE] Utilisateur:', user ? 'Authentifié' : 'Anonyme');

      // Fonction d'appel Edge Function avec gestion ultra-robuste
      const callEdgeFunction = async () => {
        const requestBody = {
          action: 'full_investigation',
          questId,
          questData,
          userId: user?.id || 'anonymous',
          timestamp: new Date().toISOString()
        };

        console.log('📤 [ROBUSTE] Envoi requête:', Object.keys(requestBody));

        const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
          body: requestBody
        });

        console.log('📥 [ROBUSTE] Réponse Edge Function:', { 
          hasData: !!data, 
          hasError: !!error,
          status: data?.status 
        });

        // Gestion ultra-flexible des erreurs
        if (error) {
          console.error('🔥 [ROBUSTE] Edge Function error détaillé:', error);
          // Essayer de parser le message d'erreur
          let errorMessage = 'Erreur de communication avec le serveur';
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.error_description) {
            errorMessage = error.error_description;
          }
          throw new Error(errorMessage);
        }

        // Validation flexible de la réponse
        if (!data) {
          throw new Error('Aucune donnée reçue du serveur');
        }

        // Accepter différents formats de réponse
        if (data.status === 'success' || data.investigation || data.message) {
          console.log('✅ [ROBUSTE] Réponse valide détectée');
          return data;
        }

        // Si on a des données mais pas de status success, essayer quand même
        if (typeof data === 'object' && Object.keys(data).length > 0) {
          console.log('⚠️ [ROBUSTE] Réponse non-standard mais exploitable:', Object.keys(data));
          return data;
        }

        throw new Error('Format de réponse invalide');
      };

      // Exécuter avec retry automatique
      return await retryWithBackoff(callEdgeFunction, 3, 1000);
    },
    onSuccess: (data) => {
      console.log('🎉 [ROBUSTE] Investigation réussie! Données reçues:', Object.keys(data || {}));
      
      // Gestion ultra-flexible des différents types de réponse
      let successMessage = "Investigation IA terminée avec succès";
      let variant: "default" | "destructive" = "default";
      
      if (data?.auth_required) {
        successMessage = "Investigation générée - Connectez-vous pour sauvegarder l'historique";
      } else if (data?.saved) {
        successMessage = "Investigation générée et sauvegardée dans l'historique";
      } else if (data?.save_error) {
        successMessage = `Investigation générée - Erreur sauvegarde: ${data.save_error}`;
        variant = "destructive";
      } else if (data?.investigation || data?.message) {
        successMessage = "Investigation IA générée avec succès";
      }

      toast({
        title: "🔍 Investigation IA",
        description: successMessage,
        variant,
      });
    },
    onError: (error) => {
      console.error('💥 [ROBUSTE] Erreur finale investigation:', error);
      
      // Messages d'erreur plus informatifs
      let userFriendlyMessage = "Erreur lors de l'investigation IA";
      
      if (error.message?.includes('timeout')) {
        userFriendlyMessage = "Délai d'attente dépassé - Veuillez réessayer";
      } else if (error.message?.includes('network')) {
        userFriendlyMessage = "Erreur réseau - Vérifiez votre connexion";
      } else if (error.message?.includes('OpenAI')) {
        userFriendlyMessage = "Service IA temporairement indisponible";
      } else if (error.message) {
        userFriendlyMessage = error.message;
      }

      toast({
        title: "❌ Erreur Investigation",
        description: userFriendlyMessage,
        variant: "destructive",
      });
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