
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questEnrichmentService, QuestEnrichmentRequest, QuestEnrichmentResponse } from '@/services/questEnrichmentService';
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
      try {
        return await questEnrichmentService.enrichField(request);
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      try {
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
      } catch (error) {
        console.error('Success handler error:', error);
      }
    },
    onError: (error, variables) => {
      try {
        console.error('Erreur d\'enrichissement:', error);
        const providerName = variables.provider || 'IA';
        toast.error(`Erreur lors de l'enrichissement avec ${providerName}`);
      } catch (handlerError) {
        console.error('Error handler error:', handlerError);
      }
    }
  });

  const saveMutation = useMutation({
    mutationFn: async ({ questId, updates }: { questId: string; updates: Partial<TreasureQuest> }) => {
      try {
        return await questEnrichmentService.saveEnrichedQuest(questId, updates);
      } catch (error) {
        console.error('Save mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      try {
        toast.success('Quête sauvegardée avec succès');
        queryClient.invalidateQueries({ queryKey: ['treasure-quests'] });
        queryClient.invalidateQueries({ queryKey: ['quest'] });
      } catch (error) {
        console.error('Save success handler error:', error);
      }
    },
    onError: (error) => {
      try {
        console.error('Erreur de sauvegarde:', error);
        toast.error('Erreur lors de la sauvegarde');
      } catch (handlerError) {
        console.error('Save error handler error:', handlerError);
      }
    }
  });

  const enrichField = async (request: QuestEnrichmentRequest) => {
    try {
      return await enrichmentMutation.mutateAsync(request);
    } catch (error) {
      console.error('EnrichField error:', error);
      throw error;
    }
  };

  const saveQuest = async (questId: string, updates: Partial<TreasureQuest>) => {
    try {
      return await saveMutation.mutateAsync({ questId, updates });
    } catch (error) {
      console.error('SaveQuest error:', error);
      throw error;
    }
  };

  const getFieldHistory = (questId: string, field: string): EnrichmentHistoryItem | undefined => {
    try {
      return enrichmentHistory.get(`${questId}-${field}`);
    } catch (error) {
      console.error('GetFieldHistory error:', error);
      return undefined;
    }
  };

  const revertField = (questId: string, field: string) => {
    try {
      const history = getFieldHistory(questId, field);
      if (history) {
        return history.original;
      }
      return null;
    } catch (error) {
      console.error('RevertField error:', error);
      return null;
    }
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
