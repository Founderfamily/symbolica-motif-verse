import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface QuestParticipant {
  id: string;
  quest_id: string;
  user_id: string;
  status: 'active' | 'away' | 'offline';
  last_seen: string;
  created_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export const useQuestParticipantsSimple = (questId: string) => {
  const { user, profile } = useAuth();

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['quest-participants', questId],
    queryFn: async () => {
      if (!user) return [];

      // Pour l'instant, retourner seulement l'utilisateur actuel
      const currentParticipant: QuestParticipant = {
        id: user.id,
        quest_id: questId,
        user_id: user.id,
        status: 'active',
        last_seen: new Date().toISOString(),
        created_at: new Date().toISOString(),
        profiles: {
          username: profile?.username || user.email?.split('@')[0] || 'Utilisateur',
          full_name: profile?.full_name || user.user_metadata?.full_name || 'Utilisateur',
          avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url
        }
      };

      return [currentParticipant];
    },
    enabled: !!questId && !!user,
  });

  // Auto-join quest effet (simulé pour l'instant)
  useEffect(() => {
    if (user && questId) {
      console.log('User joined quest:', questId);
    }
  }, [user, questId]);

  return {
    participants,
    isLoading,
    updateStatus: () => {}, // Placeholder pour l'instant
  };
};