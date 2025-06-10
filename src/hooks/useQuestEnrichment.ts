
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questEnrichmentService } from '@/services/questEnrichment';
import { QuestEnrichmentRequest, QuestEnrichmentResponse } from '@/services/questEnrichment/types';
import { TreasureQuest } from '@/types/quests';
import { toast } from '@/components/ui/use-toast';

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
        console.error('Erreur dans enrichmentMutation:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      try {
        const providerName = data?.provider || variables?.provider || 'IA';
        toast({
          title: "Enrichissement réussi",
          description: `Champ "${variables.field}" enrichi avec ${providerName}`,
        });
        
        const key = `${variables.questId}-${variables.field}`;
        setEnrichmentHistory(prev => new Map(prev.set(key, {
          original: variables.currentValue,
          enriched: data.enrichedValue,
          timestamp: new Date(),
          confidence: data.confidence || 0,
          provider: data.provider || 'IA'
        })));
      } catch (error) {
        console.error('Erreur dans onSuccess:', error);
      }
    },
    onError: (error, variables) => {
      try {
        console.error('Erreur enrichissement:', error);
        const providerName = variables?.provider || 'IA';
        toast({
          title: "Erreur d'enrichissement",
          description: `Erreur lors de l'enrichissement avec ${providerName}`,
          variant: "destructive",
        });
      } catch (toastError) {
        console.error('Erreur dans onError:', toastError);
      }
    }
  });

  const saveMutation = useMutation({
    mutationFn: async ({ questId, updates }: { questId: string; updates: Partial<TreasureQuest> }) => {
      try {
        return await questEnrichmentService.saveEnrichedQuest(questId, updates);
      } catch (error) {
        console.error('Erreur dans saveMutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      try {
        toast({
          title: "Sauvegarde réussie",
          description: "Quête sauvegardée avec succès",
        });
        queryClient.invalidateQueries({ queryKey: ['treasure-quests'] });
        queryClient.invalidateQueries({ queryKey: ['quest'] });
      } catch (error) {
        console.error('Erreur dans onSuccess save:', error);
      }
    },
    onError: (error) => {
      try {
        console.error('Erreur sauvegarde:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Erreur lors de la sauvegarde",
          variant: "destructive",
        });
      } catch (toastError) {
        console.error('Erreur dans onError save:', toastError);
      }
    }
  });

  const enrichField = async (request: QuestEnrichmentRequest) => {
    try {
      return await enrichmentMutation.mutateAsync(request);
    } catch (error) {
      console.error('Erreur dans enrichField:', error);
      throw error;
    }
  };

  const saveQuest = async (questId: string, updates: Partial<TreasureQuest>) => {
    try {
      return await saveMutation.mutateAsync({ questId, updates });
    } catch (error) {
      console.error('Erreur dans saveQuest:', error);
      throw error;
    }
  };

  const getFieldHistory = (questId: string, field: string): EnrichmentHistoryItem | undefined => {
    try {
      return enrichmentHistory.get(`${questId}-${field}`);
    } catch (error) {
      console.error('Erreur dans getFieldHistory:', error);
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
      console.error('Erreur dans revertField:', error);
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
