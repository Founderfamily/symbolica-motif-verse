import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'participant';
  senderName?: string;
  timestamp: Date;
  type?: 'message' | 'analysis' | 'discovery';
}

interface EnhancedChatInterfaceProps {
  questId: string;
  participants: any[];
  onAnalysisRequest: () => void;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  questId,
  participants,
  onAnalysisRequest
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Bienvenue dans le chat collaboratif ! Partagez vos découvertes et théories ici.',
      sender: 'ai',
      senderName: 'Assistant IA',
      timestamp: new Date(),
      type: 'message'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      senderName: 'Vous',
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'ai': return <Bot className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Chat collaboratif</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {participants.length} participant{participants.length > 1 ? 's' : ''}
            </Badge>
            <Button
              onClick={onAnalysisRequest}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Bot className="h-4 w-4" />
              Analyse IA
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  {getSenderIcon(msg.sender)}
                </div>
                
                <div className={`flex-1 max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.type === 'analysis' && (
                      <Badge variant="secondary" className="text-xs">
                        Analyse IA
                      </Badge>
                    )}
                  </div>
                  
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : msg.sender === 'ai'
                        ? 'bg-muted'
                        : 'bg-card border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tapez votre message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Envoyer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedChatInterface;