import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QuestActivity {
  id: string;
  quest_id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const useQuestActivities = (questId: string) => {
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['quest-activities', questId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quest_activities')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('quest_id', questId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as QuestActivity[];
    },
    enabled: !!questId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!questId) return;

    const channel = supabase
      .channel(`quest-activities-${questId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quest_activities',
          filter: `quest_id=eq.${questId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['quest-activities', questId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [questId, queryClient]);

  return {
    activities,
    isLoading,
  };
};