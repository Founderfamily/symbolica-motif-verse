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
  // Récupérer les messages d'un groupe
  async getMessages(groupId: string, limit = 50): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('group_chat_messages')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }

    if (!data) return [];

    // Récupérer les profils des utilisateurs séparément
    const userIds = [...new Set(data.map(msg => msg.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', userIds);

    // Associer les profils aux messages
    const messagesWithProfiles = data.map(message => ({
      ...message,
      profiles: profiles?.find(profile => profile.id === message.user_id)
    }));

    return messagesWithProfiles;
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
      .select('*')
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    // Récupérer le profil de l'utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url')
      .eq('id', user.id)
      .single();

    return {
      ...data,
      profiles: profile
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

  // S'abonner aux nouveaux messages en temps réel
  subscribeToMessages(groupId: string, onNewMessage: (message: ChatMessage) => void) {
    const channel = supabase
      .channel(`group-chat-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_chat_messages',
          filter: `group_id=eq.${groupId}`
        },
        async (payload) => {
          // Récupérer le message complet avec le profil utilisateur
          const { data: message } = await supabase
            .from('group_chat_messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (message) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url')
              .eq('id', message.user_id)
              .single();

            onNewMessage({
              ...message,
              profiles: profile
            });
          }
        }
      )
      .subscribe();

    return channel;
  }
};