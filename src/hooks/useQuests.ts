import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TreasureQuest, QuestProgress, QuestClue } from '@/types/quests';

// Fonction utilitaire pour parser les clues de manière robuste
const parseQuestClues = (clues: any): QuestClue[] => {
  console.log('parseQuestClues - Raw clues:', clues);
  console.log('parseQuestClues - Type:', typeof clues);
  
  if (!clues) {
    console.log('parseQuestClues - No clues, returning empty array');
    return [];
  }
  
  let parsedClues;
  
  // Si c'est une string, essayer de la parser comme JSON
  if (typeof clues === 'string') {
    try {
      console.log('parseQuestClues - Parsing string as JSON');
      parsedClues = JSON.parse(clues);
    } catch (error) {
      console.error('parseQuestClues - Failed to parse JSON string:', error);
      return [];
    }
  } else {
    // Si c'est déjà un objet/array, l'utiliser directement
    parsedClues = clues;
  }
  
  // Vérifier que c'est un array
  if (!Array.isArray(parsedClues)) {
    console.log('parseQuestClues - Parsed clues is not an array:', parsedClues);
    return [];
  }
  
  console.log('parseQuestClues - Successfully parsed clues:', parsedClues);
  return parsedClues;
};

export const useQuests = () => {
  return useQuery({
    queryKey: ['treasure-quests'],
    queryFn: async () => {
      console.log('useQuests - Fetching quests from database...');
      
      const { data, error } = await supabase
        .from('treasure_quests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('useQuests - Database error:', error);
        throw error;
      }
      
      console.log('useQuests - Raw data from database:', data);
      
      // Convertir les données Supabase vers nos types TypeScript
      const processedQuests = data?.map(quest => {
        console.log('useQuests - Processing quest:', quest.title, 'Raw clues:', quest.clues);
        
        // Parser les clues de manière robuste
        const parsedClues = parseQuestClues(quest.clues);
        
        const processed = {
          ...quest,
          clues: parsedClues,
          special_rewards: quest.special_rewards || [],
          target_symbols: quest.target_symbols || [],
          translations: quest.translations || { en: {}, fr: {} }
        } as TreasureQuest;
        
        console.log('useQuests - Processed quest:', processed.title, 'ID:', processed.id, 'Clues count:', processed.clues.length);
        return processed;
      }) || [];
      
      console.log('useQuests - Final processed quests:', processedQuests.length, 'items');
      return processedQuests;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false
  });
};

export const useActiveQuests = () => {
  return useQuery({
    queryKey: ['active-quests'],
    queryFn: async () => {
      console.log('useActiveQuests - Fetching active quests...');
      
      const { data, error } = await supabase
        .from('treasure_quests')
        .select('*')
        .eq('status', 'active')
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('useActiveQuests - Database error:', error);
        throw error;
      }
      
      return data?.map(quest => {
        const parsedClues = parseQuestClues(quest.clues);
        
        return {
          ...quest,
          clues: parsedClues,
          special_rewards: quest.special_rewards || [],
          target_symbols: quest.target_symbols || [],
          translations: quest.translations || { en: {}, fr: {} }
        };
      }) as TreasureQuest[];
    },
    retry: 2,
    staleTime: 60000 // 1 minute
  });
};

export const useQuestById = (questId: string) => {
  return useQuery({
    queryKey: ['quest', questId],
    queryFn: async () => {
      if (!questId) {
        console.warn('useQuestById - No questId provided');
        throw new Error('Quest ID is required');
      }
      
      console.log('useQuestById - Fetching quest with ID:', questId);
      
      const { data, error } = await supabase
        .from('treasure_quests')
        .select('*')
        .eq('id', questId)
        .maybeSingle();
      
      if (error) {
        console.error('useQuestById - Database error:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('useQuestById - Quest not found for ID:', questId);
        return null;
      }
      
      const parsedClues = parseQuestClues(data.clues);
      
      const processedQuest = {
        ...data,
        clues: parsedClues,
        special_rewards: data.special_rewards || [],
        target_symbols: data.target_symbols || [],
        translations: data.translations || { en: {}, fr: {} }
      } as TreasureQuest;
      
      console.log('useQuestById - Found quest:', processedQuest.title);
      return processedQuest;
    },
    enabled: !!questId,
    retry: 2,
    staleTime: 300000 // 5 minutes
  });
};

// Hook pour soumettre des preuves/contributions
export const useSubmitEvidence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      questId, 
      evidenceType, 
      title, 
      description, 
      imageUrl, 
      location 
    }: { 
      questId: string; 
      evidenceType: string;
      title: string;
      description?: string;
      imageUrl?: string;
      location?: { latitude: number; longitude: number; name?: string };
    }) => {
      console.log('useSubmitEvidence - Submitting evidence for quest:', questId);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('useSubmitEvidence - User not authenticated');
        throw new Error('User not authenticated');
      }
      
      console.log('useSubmitEvidence - User authenticated:', user.user.id);
      
      const { data, error } = await supabase
        .from('quest_evidence')
        .insert({
          quest_id: questId,
          submitted_by: user.user.id,
          evidence_type: evidenceType,
          title,
          description,
          image_url: imageUrl,
          latitude: location?.latitude,
          longitude: location?.longitude,
          location_name: location?.name,
          validation_status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        console.error('useSubmitEvidence - Database error:', error);
        throw error;
      }
      
      console.log('useSubmitEvidence - Successfully submitted evidence:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('useSubmitEvidence - Invalidating queries after successful submission');
      queryClient.invalidateQueries({ queryKey: ['quest-evidence', variables.questId] });
      queryClient.invalidateQueries({ queryKey: ['quest', variables.questId] });
    },
    onError: (error) => {
      console.error('useSubmitEvidence - Mutation error:', error);
    }
  });
};

// Hook pour valider des preuves soumises par d'autres contributeurs
export const useValidateEvidence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      evidenceId, 
      voteType, 
      comment, 
      expertiseLevel 
    }: { 
      evidenceId: string; 
      voteType: 'validate' | 'dispute' | 'reject';
      comment?: string;
      expertiseLevel?: string;
    }) => {
      console.log('useValidateEvidence - Validating evidence:', evidenceId);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('useValidateEvidence - User not authenticated');
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('evidence_validations')
        .insert({
          evidence_id: evidenceId,
          validator_id: user.user.id,
          vote_type: voteType,
          comment,
          expertise_level: expertiseLevel || 'amateur',
          confidence_score: 75
        })
        .select()
        .single();
      
      if (error) {
        console.error('useValidateEvidence - Database error:', error);
        throw error;
      }
      
      console.log('useValidateEvidence - Successfully validated evidence:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('useValidateEvidence - Invalidating queries after successful validation');
      queryClient.invalidateQueries({ queryKey: ['quest-evidence'] });
      queryClient.invalidateQueries({ queryKey: ['evidence-validations', variables.evidenceId] });
    },
    onError: (error) => {
      console.error('useValidateEvidence - Mutation error:', error);
    }
  });
};

export const useQuestProgress = (questId: string) => {
  return useQuery({
    queryKey: ['quest-progress', questId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.warn('useQuestProgress - User not authenticated');
        return [];
      }
      
      console.log('useQuestProgress - Fetching progress for quest:', questId, 'user:', user.user.id);
      
      const { data, error } = await supabase
        .from('quest_progress')
        .select('*')
        .eq('quest_id', questId)
        .eq('user_id', user.user.id)
        .order('clue_index', { ascending: true });
      
      if (error) {
        console.error('useQuestProgress - Database error:', error);
        throw error;
      }
      
      console.log('useQuestProgress - Found progress:', data?.length || 0, 'entries');
      return data as QuestProgress[];
    },
    enabled: !!questId,
    retry: 1
  });
};
