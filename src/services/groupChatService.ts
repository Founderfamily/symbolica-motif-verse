
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  message_type: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  reply_to_id?: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const groupChatService = {
  // Récupérer les messages d'un groupe avec les profils en une seule requête
  async getMessages(groupId: string, limit = 50): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('group_chat_messages')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Service error fetching messages:', error);
      return [];
    }
  },

  // Envoyer un nouveau message
  async sendMessage(groupId: string, content: string, replyToId?: string): Promise<ChatMessage> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('group_chat_messages')
      .insert({
        group_id: groupId,
        user_id: user.id,
        content: content.trim(),
        message_type: 'text',
        reply_to_id: replyToId
      })
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data;
  },

  // Modifier un message
  async editMessage(messageId: string, newContent: string): Promise<void> {
    const { error } = await supabase
      .from('group_chat_messages')
      .update({
        content: newContent.trim(),
        is_edited: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  },

  // Supprimer un message
  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('group_chat_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // S'abonner aux nouveaux messages en temps réel avec gestion améliorée
  subscribeToMessages(groupId: string, onNewMessage: (message: ChatMessage) => void) {
    // Créer un identifiant unique pour ce canal
    const channelId = `group-chat-${groupId}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_chat_messages',
          filter: `group_id=eq.${groupId}`
        },
        async (payload) => {
          try {
            // Récupérer le message complet avec le profil utilisateur
            const { data: message } = await supabase
              .from('group_chat_messages')
              .select(`
                *,
                profiles:user_id (
                  username,
                  full_name,
                  avatar_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (message) {
              onNewMessage(message);
            }
          } catch (error) {
            console.error('Error processing real-time message:', error);
          }
        }
      );

    return channel;
  }
};
