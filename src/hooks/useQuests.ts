
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TreasureQuest, QuestParticipant, QuestProgress } from '@/types/quests';

export const useQuests = () => {
  return useQuery({
    queryKey: ['treasure-quests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treasure_quests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TreasureQuest[];
    }
  });
};

export const useActiveQuests = () => {
  return useQuery({
    queryKey: ['active-quests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treasure_quests')
        .select('*')
        .eq('status', 'active')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data as TreasureQuest[];
    }
  });
};

export const useQuestById = (questId: string) => {
  return useQuery({
    queryKey: ['quest', questId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treasure_quests')
        .select('*')
        .eq('id', questId)
        .single();
      
      if (error) throw error;
      return data as TreasureQuest;
    },
    enabled: !!questId
  });
};

export const useJoinQuest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ questId, teamName }: { questId: string; teamName?: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');
      
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
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treasure-quests'] });
      queryClient.invalidateQueries({ queryKey: ['my-quests'] });
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
      if (!user.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('quest_progress')
        .select('*')
        .eq('quest_id', questId)
        .eq('user_id', user.user.id)
        .order('clue_index', { ascending: true });
      
      if (error) throw error;
      return data as QuestProgress[];
    },
    enabled: !!questId
  });
};
