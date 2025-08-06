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
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export const useQuestChatSimple = (questId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Pour l'instant, utiliser une table existante similaire ou simuler
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['quest-chat', questId],
    queryFn: async () => {
      // Import des messages simulés pour la quête Fontainebleau
      if (questId === '0b58fcc0-f40e-4762-a4f7-9bc074824820') {
        const { simulatedFontainebleauMessages } = await import('@/data/simulatedFontainebleauChat');
        return simulatedFontainebleauMessages;
      }
      return [] as QuestChatMessage[];
    },
    enabled: !!questId,
  });

  // Send message mutation (pour l'instant stocké localement)
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('User not authenticated');

      // Pour l'instant, juste simuler l'envoi
      const newMessage: QuestChatMessage = {
        id: Date.now().toString(),
        quest_id: questId,
        user_id: user.id,
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          username: user.email?.split('@')[0] || 'Utilisateur',
          full_name: user.user_metadata?.full_name || 'Utilisateur',
          avatar_url: user.user_metadata?.avatar_url
        }
      };

      return newMessage;
    },
    onSuccess: () => {
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès",
      });
      // Invalider la query pour refetch
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

  return {
    messages,
    isLoading,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
  };
};