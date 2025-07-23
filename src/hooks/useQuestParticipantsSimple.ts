
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QuestParticipant {
  id: string;
  user_id: string;
  status: 'active' | 'away' | 'offline';
  last_seen: string;
  profiles?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export const useQuestParticipantsSimple = (questId: string) => {
  const [participants, setParticipants] = useState<QuestParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler des participants pour l'instant
    const mockParticipants: QuestParticipant[] = [
      {
        id: '1',
        user_id: 'user-1',
        status: 'active',
        last_seen: new Date().toISOString(),
        profiles: {
          id: 'user-1',
          username: 'explorateur1',
          full_name: 'Marie Dubois',
          avatar_url: null
        }
      },
      {
        id: '2',
        user_id: 'user-2',
        status: 'active',
        last_seen: new Date(Date.now() - 300000).toISOString(),
        profiles: {
          id: 'user-2',
          username: 'historien',
          full_name: 'Jean Martin',
          avatar_url: null
        }
      }
    ];

    setParticipants(mockParticipants);
    setLoading(false);
  }, [questId]);

  return { participants, loading };
};
