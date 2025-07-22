import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  parent_message_id?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    full_name: string;
  };
}

export const useGroupMessages = (groupId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['group-messages', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_group_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!groupId) return;

    const channel = supabase
      .channel(`group_messages_${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_group_messages',
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          queryClient.invalidateQueries({ queryKey: ['group-messages', groupId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, queryClient]);

  return query;
};

export const useSendMessage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, content }: { groupId: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('community_group_messages')
        .insert({
          group_id: groupId,
          user_id: user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group-messages', data.group_id] });
    },
  });
};