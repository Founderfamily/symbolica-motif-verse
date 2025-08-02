import { useQuery, useMutation } from '@tanstack/react-query';
import { investigationService } from '@/services/investigationService';
import { useToast } from '@/components/ui/use-toast';

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
    
    // Actions
    regenerateInsights: regenerateInsightsMutation.mutate,
    analyzeConnections: analyzeConnectionsMutation.mutate,
    isRegeneratingInsights: regenerateInsightsMutation.isPending,
    isAnalyzingConnections: analyzeConnectionsMutation.isPending,
    
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