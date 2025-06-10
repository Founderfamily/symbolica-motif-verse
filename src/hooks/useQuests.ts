
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TreasureQuest, QuestParticipant, QuestProgress, QuestClue } from '@/types/quests';

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
        const processed = {
          ...quest,
          clues: (quest.clues as any) || [],
          special_rewards: quest.special_rewards || [],
          target_symbols: quest.target_symbols || [],
          translations: quest.translations || { en: {}, fr: {} }
        } as TreasureQuest;
        
        console.log('useQuests - Processed quest:', processed.title, 'ID:', processed.id);
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
      
      return data?.map(quest => ({
        ...quest,
        clues: (quest.clues as any) || [],
        special_rewards: quest.special_rewards || [],
        target_symbols: quest.target_symbols || [],
        translations: quest.translations || { en: {}, fr: {} }
      })) as TreasureQuest[];
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
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when not found
      
      if (error) {
        console.error('useQuestById - Database error:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('useQuestById - Quest not found for ID:', questId);
        return null;
      }
      
      const processedQuest = {
        ...data,
        clues: (data.clues as any) || [],
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

export const useJoinQuest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ questId, teamName }: { questId: string; teamName?: string }) => {
      console.log('useJoinQuest - Attempting to join quest:', questId);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('useJoinQuest - User not authenticated');
        throw new Error('User not authenticated');
      }
      
      console.log('useJoinQuest - User authenticated:', user.user.id);
      
      const { data, error } = await supabase
        .from('quest_participants')
        .insert({
          quest_id: questId,
          user_id: user.user.id,
          team_name: teamName,
          role: 'member'
        })
        .select()
        .single();
      
      if (error) {
        console.error('useJoinQuest - Database error:', error);
        throw error;
      }
      
      console.log('useJoinQuest - Successfully joined quest:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('useJoinQuest - Invalidating queries after successful join');
      queryClient.invalidateQueries({ queryKey: ['treasure-quests'] });
      queryClient.invalidateQueries({ queryKey: ['my-quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest', variables.questId] });
    },
    onError: (error) => {
      console.error('useJoinQuest - Mutation error:', error);
    }
  });
};

export const useMyQuests = () => {
  return useQuery({
    queryKey: ['my-quests'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('quest_participants')
        .select(`
          *,
          treasure_quests (*)
        `)
        .eq('user_id', user.user.id)
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
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
