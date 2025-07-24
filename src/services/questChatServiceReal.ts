import { supabase } from '@/integrations/supabase/client';

interface QuestChatMessage {
  id: string;
  quest_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export const questChatServiceReal = {
  // Récupérer les messages d'une quête avec les profils
  async getMessages(questId: string, limit = 50): Promise<QuestChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('quest_chat_messages')
        .select('*')
        .eq('quest_id', questId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching quest messages:', error);
        return [];
      }

      // Enrichir avec les profils utilisateur
      const messagesWithProfiles = await Promise.all((data || []).map(async (message) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', message.user_id)
          .single();

        return {
          ...message,
          profiles: profile
        };
      }));

      return messagesWithProfiles;
    } catch (error) {
      console.error('Error fetching quest messages:', error);
      return [];
    }
  },

  // Envoyer un message dans une quête
  async sendMessage(questId: string, content: string): Promise<QuestChatMessage | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('quest_chat_messages')
        .insert({
          quest_id: questId,
          user_id: user.id,
          content: content.trim()
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error sending quest message:', error);
        throw error;
      }

      // Enrichir avec le profil utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      const enrichedData = {
        ...data,
        profiles: profile
      };

      // Créer une activité pour ce message
      await supabase
        .from('quest_activities')
        .insert({
          quest_id: questId,
          user_id: user.id,
          activity_type: 'message',
          activity_data: {
            content: content.trim(),
            message_id: data.id
          }
        });

      return enrichedData;
    } catch (error) {
      console.error('Error sending quest message:', error);
      throw error;
    }
  },

  // S'abonner aux nouveaux messages en temps réel
  subscribeToMessages(questId: string, callback: (message: QuestChatMessage) => void) {
    const channel = supabase
      .channel(`quest_messages:${questId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quest_chat_messages',
          filter: `quest_id=eq.${questId}`
        },
        async (payload) => {
          // Récupérer le message complet avec le profil
          const { data: message } = await supabase
            .from('quest_chat_messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (message) {
            // Enrichir avec le profil utilisateur
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url')
              .eq('id', message.user_id)
              .single();

            const enrichedMessage = {
              ...message,
              profiles: profile
            };

            callback(enrichedMessage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};