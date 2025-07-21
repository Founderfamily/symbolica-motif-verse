
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
  // Récupérer les messages d'un groupe avec les profils
  async getMessages(groupId: string, limit = 50): Promise<ChatMessage[]> {
    try {
      // D'abord récupérer les messages
      const { data: messages, error } = await supabase
        .from('group_chat_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
      }

      if (!messages || messages.length === 0) {
        return [];
      }

      // Récupérer les profils utilisateurs uniques
      const userIds = [...new Set(messages.map(msg => msg.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continuer sans les profils plutôt que de tout échouer
      }

      // Combiner messages et profils
      return messages.map(message => ({
        ...message,
        profiles: profiles?.find(profile => profile.id === message.user_id) || undefined
      }));
    } catch (error) {
      console.error('Service error fetching messages:', error);
      return [];
    }
  },

  // Envoyer un nouveau message
  async sendMessage(groupId: string, content: string, replyToId?: string): Promise<ChatMessage> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data: message, error } = await supabase
      .from('group_chat_messages')
      .insert({
        group_id: groupId,
        user_id: user.id,
        content: content.trim(),
        message_type: 'text',
        reply_to_id: replyToId
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', user.id)
      .single();

    return {
      ...message,
      profiles: profile || undefined
    };
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
            // Récupérer le message
            const { data: message } = await supabase
              .from('group_chat_messages')
              .select('*')
              .eq('id', payload.new.id)
              .single();

            if (message) {
              // Récupérer le profil utilisateur
              const { data: profile } = await supabase
                .from('profiles')
                .select('id, username, full_name, avatar_url')
                .eq('id', message.user_id)
                .single();

              onNewMessage({
                ...message,
                profiles: profile || undefined
              });
            }
          } catch (error) {
            console.error('Error processing real-time message:', error);
          }
        }
      );

    return channel;
  }
};
