import { useQuery, useMutation } from '@tanstack/react-query';
import { investigationService } from '@/services/investigationService';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useProactiveAI = (questId: string) => {
  const { toast } = useToast();

  // Insights IA proactifs
  const {
    data: insights,
    isLoading: insightsLoading,
    refetch: refetchInsights
  } = useQuery({
    queryKey: ['proactive-insights', questId],
    queryFn: () => investigationService.generateProactiveInsights(questId),
    enabled: !!questId,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
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
  });

  // Mutation pour forcer une nouvelle analyse
  const regenerateInsightsMutation = useMutation({
    mutationFn: () => investigationService.generateProactiveInsights(questId),
    onSuccess: () => {
      refetchInsights();
      toast({
        title: "Analyse terminée",
        description: "Les insights IA ont été mis à jour",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'analyse",
        variant: "destructive",
      });
    },
  });

  // Mutation pour analyser les connexions
  const analyzeConnectionsMutation = useMutation({
    mutationFn: () => investigationService.analyzeEvidenceTheoryConnections(questId),
    onSuccess: () => {
      refetchConnections();
      toast({
        title: "Analyse des connexions terminée",
        description: "Les relations entre preuves et théories ont été analysées",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'analyse des connexions",
        variant: "destructive",
      });
    },
  });

  // Mutation pour investigation proactive complète
  const startProactiveInvestigationMutation = useMutation({
    mutationFn: async (investigationType?: string) => {
      const { data, error } = await supabase.functions.invoke('proactive-investigation', {
        body: {
          questId,
          investigationType: investigationType || 'full_investigation',
          context: {
            location: 'France', // À récupérer depuis la quête
            period: '1850-1900', // À récupérer depuis la quête
            coordinates: { latitude: 46.2, longitude: 2.3 } // À récupérer depuis la quête
          }
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
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
    onError: (error) => {
      toast({
        title: "Erreur d'investigation",
        description: error instanceof Error ? error.message : "L'IA n'a pas pu effectuer l'investigation",
        variant: "destructive",
      });
    },
  });

  // Mutation pour recherche de sources historiques
  const searchHistoricalSourcesMutation = useMutation({
    mutationFn: async () => {
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
    onSuccess: () => {
      toast({
        title: "🏛️ Sources historiques trouvées",
        description: "L'IA a découvert de nouvelles sources d'archives",
      });
    },
  });

  // Mutation pour génération de théories
  const generateTheoriesMutation = useMutation({
    mutationFn: async () => {
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
    onSuccess: () => {
      toast({
        title: "🧠 Théories générées",
        description: "L'IA a élaboré de nouvelles théories d'investigation",
      });
    },
  });

  return {
    // Données
    insights: insights?.success ? insights.data : [],
    investigationAreas: investigationAreas?.success ? investigationAreas.data : [],
    connections: connections?.success ? connections.data : null,
    patterns: patterns?.success ? patterns.data : [],
    
    // États de chargement
    isLoading: insightsLoading || areasLoading || connectionsLoading || patternsLoading,
    insightsLoading,
    areasLoading,
    connectionsLoading,
    patternsLoading,
    
    // Actions existantes
    regenerateInsights: regenerateInsightsMutation.mutate,
    analyzeConnections: analyzeConnectionsMutation.mutate,
    isRegeneratingInsights: regenerateInsightsMutation.isPending,
    isAnalyzingConnections: analyzeConnectionsMutation.isPending,
    
    // Nouvelles actions IA proactive
    startProactiveInvestigation: startProactiveInvestigationMutation.mutate,
    searchHistoricalSources: searchHistoricalSourcesMutation.mutate,
    generateTheories: generateTheoriesMutation.mutate,
    isInvestigating: startProactiveInvestigationMutation.isPending,
    isSearchingSources: searchHistoricalSourcesMutation.isPending,
    isGeneratingTheories: generateTheoriesMutation.isPending,
    
    // Méthodes de rafraîchissement
    refetchAll: () => {
      refetchInsights();
      refetchAreas();
      refetchConnections();
      refetchPatterns();
    },
    refetchInsights,
    refetchAreas,
    refetchConnections,
    refetchPatterns,
  };
};