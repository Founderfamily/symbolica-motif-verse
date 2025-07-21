import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Edit3, Trash2, Reply } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { groupChatService, ChatMessage } from '@/services/groupChatService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface GroupChatProps {
  groupId: string;
  groupName?: string;
}

const GroupChat: React.FC<GroupChatProps> = ({ groupId, groupName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Charger les messages initiaux
  useEffect(() => {
    if (!groupId) return;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const chatMessages = await groupChatService.getMessages(groupId);
        setMessages(chatMessages);
        scrollToBottom();
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        toast.error('Impossible de charger les messages');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [groupId]);

  // S'abonner aux nouveaux messages en temps réel
  useEffect(() => {
    if (!groupId || !auth?.user) return;

    const channel = groupChatService.subscribeToMessages(
      groupId,
      (newMessage: ChatMessage) => {
        setMessages(prev => {
          // Éviter les doublons
          if (prev.find(msg => msg.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
        scrollToBottom();
      }
    );

    channel.subscribe((status: string) => {
      console.log('📡 Chat real-time status:', status);
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, auth?.user]);

  // Auto-scroll quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !auth?.user) return;

    try {
      await groupChatService.sendMessage(groupId, newMessage, replyTo?.id);
      setNewMessage('');
      setReplyTo(null);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Impossible d\'envoyer le message');
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim()) return;

    try {
      await groupChatService.editMessage(messageId, editContent);
      setEditingMessage(null);
      setEditContent('');
      
      // Mettre à jour localement
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: editContent, is_edited: true }
          : msg
      ));
      
      toast.success('Message modifié');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error('Impossible de modifier le message');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await groupChatService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Impossible de supprimer le message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <I18nText translationKey="community.groupChat">Chat du groupe</I18nText>
            {groupName && <span className="text-sm text-muted-foreground">- {groupName}</span>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? <I18nText translationKey="community.online">En ligne</I18nText> : <I18nText translationKey="community.offline">Hors ligne</I18nText>}
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Zone de réponse */}
      {replyTo && (
        <div className="bg-muted/50 px-4 py-2 border-b">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Reply className="h-4 w-4" />
              <span><I18nText translationKey="community.replyTo">Réponse à</I18nText> {replyTo.profiles?.full_name || 'Utilisateur'}</span>
              <span className="text-muted-foreground truncate max-w-32">
                {replyTo.content}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyTo(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p><I18nText translationKey="community.noMessages">Aucun message pour l'instant</I18nText></p>
            <p className="text-sm"><I18nText translationKey="community.firstMessage">Soyez le premier à envoyer un message !</I18nText></p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.user_id === auth?.user?.id ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage
                  src={message.profiles?.avatar_url || `https://avatar.vercel.sh/${message.profiles?.username}.png`}
                  alt={message.profiles?.username || 'User'}
                />
                <AvatarFallback>
                  {message.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className={`flex-1 max-w-md ${
                message.user_id === auth?.user?.id ? 'text-right' : 'text-left'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {message.profiles?.full_name || message.profiles?.username || 'Utilisateur'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.created_at)}
                  </span>
                  {message.is_edited && (
                    <Badge variant="outline" className="text-xs">
                      <I18nText translationKey="community.edited">modifié</I18nText>
                    </Badge>
                  )}
                </div>

                {/* Message de réponse */}
                {message.reply_to_id && (
                  <div className="bg-muted/30 border-l-2 border-primary/30 pl-2 py-1 mb-2 text-xs text-muted-foreground">
                    <I18nText translationKey="community.replyToMessage">Réponse à un message</I18nText>
                  </div>
                )}

                {/* Contenu du message */}
                {editingMessage === message.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEditMessage(message.id);
                        } else if (e.key === 'Escape') {
                          setEditingMessage(null);
                          setEditContent('');
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditMessage(message.id)}
                      >
                        <I18nText translationKey="community.save">Sauvegarder</I18nText>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingMessage(null);
                          setEditContent('');
                        }}
                      >
                        <I18nText translationKey="community.cancel">Annuler</I18nText>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-lg px-3 py-2 ${
                    message.user_id === auth?.user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                )}

                {/* Actions du message */}
                {!editingMessage && message.user_id === auth?.user?.id && (
                  <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingMessage(message.id);
                        setEditContent(message.content);
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* Bouton répondre */}
                {!editingMessage && message.user_id !== auth?.user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(message)}
                    className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    <I18nText translationKey="community.reply">Répondre</I18nText>
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Zone d'envoi */}
      {auth?.user && (
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GroupChat;