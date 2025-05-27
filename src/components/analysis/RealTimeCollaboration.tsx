import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, MessageCircle, Video, Share2, 
  Eye, Edit3, Clock, Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  role: 'researcher' | 'expert' | 'student' | 'admin';
  status: 'active' | 'away' | 'offline';
  cursor_position?: { x: number; y: number };
  current_action?: string;
}

interface AnalysisComment {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  timestamp: Date;
  symbol_id?: string;
  coordinates?: { x: number; y: number };
  type: 'general' | 'annotation' | 'suggestion' | 'question';
}

interface LiveSession {
  id: string;
  name: string;
  host_id: string;
  participants: CollaborationUser[];
  created_at: Date;
  status: 'active' | 'paused' | 'ended';
  analysis_focus: string;
}

interface RealTimeCollaborationProps {
  symbolIds: string[];
  currentUserId: string;
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({ 
  symbolIds, 
  currentUserId 
}) => {
  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([]);
  const [comments, setComments] = useState<AnalysisComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize real-time connection
    const channel = supabase.channel('analysis_collaboration')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Properly transform presence state to CollaborationUser objects
        const users: CollaborationUser[] = Object.values(state).flat().map((presence: any) => ({
          id: presence.id || 'unknown',
          name: presence.name || 'Unknown User',
          avatar: presence.avatar,
          role: presence.role || 'researcher',
          status: presence.status || 'active',
          cursor_position: presence.cursor_position,
          current_action: presence.current_action
        }));
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .on('broadcast', { event: 'new_comment' }, ({ payload }) => {
        setComments(prev => [...prev, payload]);
      })
      .on('broadcast', { event: 'cursor_move' }, ({ payload }) => {
        setActiveUsers(prev => 
          prev.map(user => 
            user.id === payload.user_id 
              ? { ...user, cursor_position: payload.position }
              : user
          )
        );
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          // Track current user presence
          await channel.track({
            id: currentUserId,
            name: 'Current User',
            role: 'researcher',
            status: 'active',
            current_action: 'Analyzing symbols'
          });
        }
      });

    // Simulate existing session
    setCurrentSession({
      id: 'session_1',
      name: 'Celtic Symbol Analysis Workshop',
      host_id: 'expert_1',
      participants: [
        {
          id: 'expert_1',
          name: 'Dr. Marie Dubois',
          role: 'expert',
          status: 'active',
          current_action: 'Leading discussion'
        },
        {
          id: 'researcher_1',
          name: 'Prof. Jean Martin',
          role: 'researcher',
          status: 'active',
          current_action: 'Taking notes'
        }
      ],
      created_at: new Date(Date.now() - 3600000),
      status: 'active',
      analysis_focus: 'Celtic knotwork patterns'
    });

    // Load existing comments
    setComments([
      {
        id: '1',
        user_id: 'expert_1',
        user_name: 'Dr. Marie Dubois',
        content: 'Notice the interlacing pattern here - this is characteristic of 8th century Insular art.',
        timestamp: new Date(Date.now() - 1800000),
        type: 'annotation',
        coordinates: { x: 150, y: 200 }
      },
      {
        id: '2',
        user_id: 'researcher_1',
        user_name: 'Prof. Jean Martin',
        content: 'Could this be related to the Book of Kells illuminations?',
        timestamp: new Date(Date.now() - 1200000),
        type: 'question'
      }
    ]);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    const comment: AnalysisComment = {
      id: Date.now().toString(),
      user_id: currentUserId,
      user_name: 'You',
      content: newComment,
      timestamp: new Date(),
      type: 'general'
    };

    // Broadcast to other users
    const channel = supabase.channel('analysis_collaboration');
    await channel.send({
      type: 'broadcast',
      event: 'new_comment',
      payload: comment
    });

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const startLiveSession = async () => {
    // Create new live session
    const newSession: LiveSession = {
      id: `session_${Date.now()}`,
      name: 'New Analysis Session',
      host_id: currentUserId,
      participants: [],
      created_at: new Date(),
      status: 'active',
      analysis_focus: 'Symbol comparison'
    };
    setCurrentSession(newSession);
  };

  const getStatusColor = (status: CollaborationUser['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: CollaborationUser['role']) => {
    switch (role) {
      case 'expert': return 'bg-purple-100 text-purple-800';
      case 'researcher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-red-100 text-red-800';
    }
  };

  const getCommentIcon = (type: AnalysisComment['type']) => {
    switch (type) {
      case 'annotation': return <Edit3 className="h-3 w-3" />;
      case 'question': return <MessageCircle className="h-3 w-3" />;
      case 'suggestion': return <Zap className="h-3 w-3" />;
      default: return <MessageCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Real-Time Collaboration
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {activeUsers.length} user(s) online
              </span>
              {currentSession && (
                <Badge variant="outline">
                  Session: {currentSession.name}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>
              <Button variant="outline" size="sm" onClick={startLiveSession}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {activeUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </Badge>
                        {user.current_action && (
                          <span className="text-xs text-muted-foreground truncate">
                            {user.current_action}
                          </span>
                        )}
                      </div>
                    </div>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Live Comments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Live Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 mb-4">
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {comment.user_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{comment.user_name}</span>
                        <div className="flex items-center gap-1">
                          {getCommentIcon(comment.type)}
                          <span className="text-xs text-muted-foreground">
                            {comment.type}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {comment.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                      {comment.coordinates && (
                        <Badge variant="outline" className="text-xs mt-1">
                          @ Position ({comment.coordinates.x}, {comment.coordinates.y})
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <Separator className="mb-4" />
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Add your analysis comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
                rows={2}
                className="flex-1"
              />
              <Button onClick={handleSendComment} disabled={!newComment.trim()}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Info */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Session: {currentSession.name}
              <Badge variant={currentSession.status === 'active' ? 'default' : 'secondary'}>
                {currentSession.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium">Focus:</span>
                <p className="text-sm text-muted-foreground">{currentSession.analysis_focus}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Duration:</span>
                <p className="text-sm text-muted-foreground">
                  {Math.round((Date.now() - currentSession.created_at.getTime()) / 60000)} minutes
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Participants:</span>
                <p className="text-sm text-muted-foreground">
                  {currentSession.participants.length + activeUsers.length} active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeCollaboration;
