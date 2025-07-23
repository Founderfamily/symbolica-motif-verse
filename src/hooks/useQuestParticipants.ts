import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface QuestParticipant {
  id: string;
  quest_id: string;
  user_id: string;
  status: 'active' | 'away' | 'offline';
  last_seen: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const useQuestParticipants = (questId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['quest-participants', questId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quest_participants')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('quest_id', questId)
        .gte('last_seen', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Actifs dans les 30 dernières minutes
        .order('last_seen', { ascending: false });

      if (error) throw error;
      return data as QuestParticipant[];
    },
    enabled: !!questId,
  });

  // Join quest mutation
  const joinQuest = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('quest_participants')
        .upsert({
          quest_id: questId,
          user_id: user.id,
          status: 'active',
          last_seen: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest-participants', questId] });
    },
  });

  // Update status mutation
  const updateStatus = useMutation({
    mutationFn: async (status: 'active' | 'away' | 'offline') => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('quest_participants')
        .update({
          status,
          last_seen: new Date().toISOString(),
        })
        .eq('quest_id', questId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest-participants', questId] });
    },
  });

  // Auto-join quest when component mounts
  useEffect(() => {
    if (user && questId) {
      joinQuest.mutate();
    }
  }, [user, questId]);

  // Heartbeat to keep user active
  useEffect(() => {
    if (!user || !questId) return;

    const interval = setInterval(() => {
      updateStatus.mutate('active');
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [user, questId]);

  // Real-time subscription
  useEffect(() => {
    if (!questId) return;

    const channel = supabase
      .channel(`quest-participants-${questId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quest_participants',
          filter: `quest_id=eq.${questId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['quest-participants', questId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [questId, queryClient]);

  return {
    participants,
    isLoading,
    updateStatus: updateStatus.mutate,
  };
};
