
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questEnrichmentService, QuestEnrichmentRequest, QuestEnrichmentResponse } from '@/services/questEnrichment';
import { TreasureQuest } from '@/types/quests';
import { toast } from 'sonner';

interface EnrichmentHistoryItem {
  original: any;
  enriched: any;
  timestamp: Date;
  confidence: number;
  provider: string;
}

export const useQuestEnrichment = () => {
  const [enrichmentHistory, setEnrichmentHistory] = useState<Map<string, EnrichmentHistoryItem>>(new Map());
  const queryClient = useQueryClient();

  const enrichmentMutation = useMutation({
    mutationFn: async (request: QuestEnrichmentRequest): Promise<QuestEnrichmentResponse> => {
      return questEnrichmentService.enrichField(request);
    },
    onSuccess: (data, variables) => {
      const providerName = data.provider || variables.provider || 'IA';
      toast.success(`Champ "${variables.field}" enrichi avec ${providerName}`);
      
      const key = `${variables.questId}-${variables.field}`;
      setEnrichmentHistory(prev => new Map(prev.set(key, {
        original: variables.currentValue,
        enriched: data.enrichedValue,
        timestamp: new Date(),
        confidence: data.confidence,
        provider: data.provider
      })));
    },
    onError: (error, variables) => {
      console.error('Erreur d\'enrichissement:', error);
      const providerName = variables.provider || 'IA';
      toast.error(`Erreur lors de l'enrichissement avec ${providerName}`);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async ({ questId, updates }: { questId: string; updates: Partial<TreasureQuest> }) => {
      return questEnrichmentService.saveEnrichedQuest(questId, updates);
    },
    onSuccess: () => {
      toast.success('Quête sauvegardée avec succès');
      queryClient.invalidateQueries({ queryKey: ['treasure-quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest'] });
    },
    onError: (error) => {
      console.error('Erreur de sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  const enrichField = async (request: QuestEnrichmentRequest) => {
    return enrichmentMutation.mutateAsync(request);
  };

  const saveQuest = async (questId: string, updates: Partial<TreasureQuest>) => {
    return saveMutation.mutateAsync({ questId, updates });
  };

  const getFieldHistory = (questId: string, field: string): EnrichmentHistoryItem | undefined => {
    return enrichmentHistory.get(`${questId}-${field}`);
  };

  const revertField = (questId: string, field: string) => {
    const history = getFieldHistory(questId, field);
    if (history) {
      return history.original;
    }
    return null;
  };

  return {
    enrichField,
    saveQuest,
    getFieldHistory,
    revertField,
    isEnriching: enrichmentMutation.isPending,
    isSaving: saveMutation.isPending,
    enrichmentHistory: enrichmentHistory
  };
};
