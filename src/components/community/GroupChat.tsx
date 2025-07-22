import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageCircle } from 'lucide-react';
import { groupChatService } from '@/services/groupChatService';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface GroupChatProps {
  groupId: string;
  isWelcomeGroup?: boolean;
}

const GroupChat: React.FC<GroupChatProps> = ({ groupId, isWelcomeGroup = false }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['group-chat-messages', groupId],
    queryFn: () => groupChatService.getMessages(groupId),
    enabled: !!groupId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => 
      groupChatService.sendMessage(groupId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-chat-messages', groupId] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    try {
      await sendMessageMutation.mutateAsync({
        content: message,
      });
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="text-center py-12 text-stone-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Connexion requise</h3>
          <p className="text-sm">Vous devez être connecté pour participer à la discussion.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-stone-200">
        <h2 className="text-xl font-semibold text-stone-800">Discussion Principale</h2>
      </div>

      {/* Welcome Message - Only for welcome groups */}
      {isWelcomeGroup && (
        <div className="p-4 bg-purple-50 border-b border-purple-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">👋</div>
            <div>
              <h3 className="font-semibold text-purple-800 mb-1">Bienvenue dans notre communauté !</h3>
              <p className="text-purple-700 text-sm">
                Ce groupe est spécialement conçu pour accueillir les nouveaux membres. 
                N'hésitez pas à vous présenter, poser vos questions et partager vos premières découvertes !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-stone-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            Chargement des messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucun message pour l'instant</h3>
            <p className="text-sm">Soyez le premier à démarrer une conversation dans ce groupe !</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.user_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.user_id === user.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-stone-100 text-stone-800'
                }`}
              >
                {msg.user_id !== user.id && (
                  <div className="text-xs font-medium mb-1 opacity-75">
                    {msg.profiles?.full_name || msg.profiles?.username || `Utilisateur ${msg.user_id.slice(0, 8)}`}
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                <div className={`text-xs mt-1 ${
                  msg.user_id === user.id ? 'text-purple-200' : 'text-stone-500'
                }`}>
                  {formatTime(msg.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-stone-200">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message... (Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne)"
            className="flex-1 min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;