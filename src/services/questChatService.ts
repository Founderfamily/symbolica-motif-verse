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

export const questChatService = {
  // Récupérer les messages d'une quête avec les profils
  async getMessages(questId: string, limit = 50): Promise<QuestChatMessage[]> {
    try {
      // Pour l'instant, utiliser une table existante ou simuler
      // En attendant que les nouvelles tables soient dans les types
      return [];
    } catch (error) {
      console.error('Error fetching quest messages:', error);
      return [];
    }
  },

  // Envoyer un message dans une quête
  async sendMessage(questId: string, content: string): Promise<QuestChatMessage> {
    try {
      // Pour l'instant, simuler l'envoi
      // En attendant que les nouvelles tables soient dans les types
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      const mockMessage: QuestChatMessage = {
        id: Date.now().toString(),
        quest_id: questId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString(),
        profiles: profile || {
          id: user.id,
          username: user.email?.split('@')[0],
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url
        }
      };

      return mockMessage;
    } catch (error) {
      console.error('Error sending quest message:', error);
      throw error;
    }
  }
};