import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface QuestChatMessage {
  id: string;
  quest_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const useQuestChat = (questId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['quest-chat', questId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quest_chat_messages')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('quest_id', questId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as QuestChatMessage[];
    },
    enabled: !!questId,
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('quest_chat_messages')
        .insert({
          quest_id: questId,
          user_id: user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest-chat', questId] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!questId) return;

    const channel = supabase
      .channel(`quest-chat-${questId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quest_chat_messages',
          filter: `quest_id=eq.${questId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['quest-chat', questId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [questId, queryClient]);

  return {
    messages,
    isLoading,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
  };
};