import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { questChatServiceReal } from '@/services/questChatServiceReal';
import { useAuth } from '@/hooks/useAuth';

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

interface QuestChatRealProps {
  questId: string;
  questName?: string;
}

const QuestChatReal: React.FC<QuestChatRealProps> = ({ questId, questName }) => {
  const [messages, setMessages] = useState<QuestChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Charger les messages existants
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const data = await questChatServiceReal.getMessages(questId);
        setMessages(data);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [questId, toast]);

  // S'abonner aux nouveaux messages en temps réel
  useEffect(() => {
    const unsubscribe = questChatServiceReal.subscribeToMessages(questId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    });

    return unsubscribe;
  }, [questId]);

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !user) return;

    try {
      setIsSending(true);
      await questChatServiceReal.sendMessage(questId, newMessage.trim());
      setNewMessage('');
      
      // Redimensionner la textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Gérer l'envoi avec Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-redimensionnement de la textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // Formater l'heure
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Connexion requise pour participer au chat</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat de Quête
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            En direct
          </Badge>
        </CardTitle>
        {questName && (
          <p className="text-sm text-muted-foreground">{questName}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Zone des messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Chargement des messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun message pour le moment.</p>
                <p className="text-sm mt-2">Soyez le premier à écrire quelque chose !</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.profiles?.avatar_url} />
                    <AvatarFallback>
                      {message.profiles?.full_name?.[0] || message.profiles?.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {message.profiles?.full_name || message.profiles?.username || 'Utilisateur'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm bg-muted rounded-lg px-3 py-2 break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Zone de saisie */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              disabled={isSending}
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              size="icon"
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestChatReal;