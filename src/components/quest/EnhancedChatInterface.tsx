import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Brain, 
  Users, 
  ChevronDown,
  Hash,
  MapPin,
  Book,
  Plus
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QuestClue } from '@/types/quests';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  attachedClues?: string[];
  aiSuggestion?: string;
  type: 'user' | 'ai' | 'system';
}

interface EnhancedChatInterfaceProps {
  questId: string;
  messages: ChatMessage[];
  availableClues: QuestClue[];
  onSendMessage: (content: string, attachedClues?: string[]) => void;
  onAISuggestion: (content: string) => Promise<string>;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  questId,
  messages,
  availableClues,
  onSendMessage,
  onAISuggestion
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachedClues, setAttachedClues] = useState<string[]>([]);
  const [showClueSelector, setShowClueSelector] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, attachedClues);
      setNewMessage('');
      setAttachedClues([]);
    }
  };

  const handleAttachClue = (clueId: string) => {
    if (!attachedClues.includes(clueId)) {
      setAttachedClues([...attachedClues, clueId]);
    }
  };

  const handleRemoveClue = (clueId: string) => {
    setAttachedClues(attachedClues.filter(id => id !== clueId));
  };

  const handleAISuggestion = async () => {
    if (!newMessage.trim()) return;
    
    setAiSuggesting(true);
    try {
      const suggestion = await onAISuggestion(newMessage);
      setNewMessage(newMessage + '\n\n💡 Suggestion IA: ' + suggestion);
    } catch (error) {
      console.error('Erreur suggestion IA:', error);
    } finally {
      setAiSuggesting(false);
    }
  };

  const getClueById = (clueId: string) => {
    return availableClues.find(clue => clue.id.toString() === clueId);
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'ai': return 'bg-blue-50 border-blue-200';
      case 'system': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Brain className="w-4 h-4 text-blue-500" />;
      case 'system': return <Hash className="w-4 h-4 text-gray-500" />;
      default: return <Users className="w-4 h-4 text-green-500" />;
    }
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Chat de Recherche Collaborative
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {messages.filter(m => m.type === 'user').length} participants actifs
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`p-3 rounded-lg border ${getMessageTypeColor(message.type)}`}>
              <div className="flex items-center gap-2 mb-1">
                {getMessageTypeIcon(message.type)}
                <span className="font-medium text-sm">{message.user}</span>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </span>
                {message.type === 'ai' && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                    IA
                  </Badge>
                )}
              </div>
              
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {/* Indices attachés */}
              {message.attachedClues && message.attachedClues.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    Indices mentionnés:
                  </div>
                  {message.attachedClues.map(clueId => {
                    const clue = getClueById(clueId);
                    return clue ? (
                      <div key={clueId} className="flex items-center gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                        <Hash className="w-3 h-3 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">{clue.title}</span>
                        <Badge variant="outline" className="text-xs">Indice</Badge>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {/* Suggestion IA */}
              {message.aiSuggestion && (
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Brain className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Suggestion IA</span>
                  </div>
                  <p className="text-xs text-blue-800">{message.aiSuggestion}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de composition */}
        <div className="border-t p-4 space-y-3">
          {/* Indices attachés dans le message en cours */}
          {attachedClues.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Indices à partager:
              </div>
              <div className="flex flex-wrap gap-2">
                {attachedClues.map(clueId => {
                  const clue = getClueById(clueId);
                  return clue ? (
                    <Badge 
                      key={clueId} 
                      variant="outline" 
                      className="bg-amber-50 text-amber-700 cursor-pointer hover:bg-amber-100"
                      onClick={() => handleRemoveClue(clueId)}
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {clue.title}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Partager une découverte, poser une question..."
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Dialog open={showClueSelector} onOpenChange={setShowClueSelector}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Paperclip className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Attacher des indices</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {availableClues.map((clue) => (
                        <div 
                          key={clue.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            attachedClues.includes(clue.id.toString()) 
                              ? 'bg-amber-50 border-amber-200' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleAttachClue(clue.id.toString())}
                        >
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-amber-600" />
                            <span className="font-medium">{clue.title}</span>
                            {attachedClues.includes(clue.id.toString()) && (
                              <Badge variant="outline" className="text-xs">Attaché</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {clue.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  onClick={handleAISuggestion}
                  disabled={aiSuggesting || !newMessage.trim()}
                >
                  <Brain className={`w-3 h-3 ${aiSuggesting ? 'animate-pulse text-blue-500' : ''}`} />
                </Button>
              </div>
            </div>
            <Button onClick={handleSend} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Suggestions rapides */}
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setNewMessage('J\'ai trouvé quelque chose d\'intéressant sur le terrain...')}
            >
              <MapPin className="w-3 h-3 mr-1" />
              Découverte terrain
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setNewMessage('J\'ai consulté les archives et...')}
            >
              <Book className="w-3 h-3 mr-1" />
              Recherche archives
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setNewMessage('J\'ai besoin d\'aide pour...')}
            >
              <Users className="w-3 h-3 mr-1" />
              Demander aide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedChatInterface;