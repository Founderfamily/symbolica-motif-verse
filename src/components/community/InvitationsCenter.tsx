
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupInvitation } from '@/types/interest-groups';
import { getUserInvitations, respondToGroupInvitation } from '@/services/communityService';
import { toast } from 'sonner';

interface InvitationsCenterProps {
  onInvitationResponse?: (invitationId: string, status: 'accepted' | 'declined') => void;
}

const InvitationsCenter: React.FC<InvitationsCenterProps> = ({ onInvitationResponse }) => {
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth?.user) {
      loadInvitations();
    }
  }, [auth?.user]);

  const loadInvitations = async () => {
    if (!auth?.user) return;

    try {
      const invitationsData = await getUserInvitations(auth.user.id);
      setInvitations(invitationsData);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (invitationId: string, status: 'accepted' | 'declined') => {
    if (!auth?.user) return;

    setResponding(invitationId);
    try {
      await respondToGroupInvitation(invitationId, auth.user.id, status);
      
      // Remove invitation from local state
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      // Call callback if provided
      onInvitationResponse?.(invitationId, status);
      
      toast.success(
        status === 'accepted' 
          ? 'Invitation accepted successfully!' 
          : 'Invitation declined'
      );
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast.error('Failed to respond to invitation');
    } finally {
      setResponding(null);
    }
  };

  if (!auth?.user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">
            <I18nText translationKey="auth.loginRequired">Please log in to view invitations</I18nText>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <I18nText translationKey="community.groupInvitations">Group Invitations</I18nText>
          {invitations.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {invitations.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-4 p-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex space-x-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : invitations.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-1 p-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium text-slate-900">
                          {invitation.group?.name || 'Unknown Group'}
                        </h4>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2">
                        Invited by {invitation.inviter_profile?.full_name || invitation.inviter_profile?.username || 'Unknown User'}
                      </p>
                      
                      {invitation.message && (
                        <p className="text-sm text-slate-700 italic mb-2">
                          "{invitation.message}"
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        Invited {new Date(invitation.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleResponse(invitation.id, 'accepted')}
                      disabled={responding === invitation.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <I18nText translationKey="community.accept">Accept</I18nText>
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResponse(invitation.id, 'declined')}
                      disabled={responding === invitation.id}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      <I18nText translationKey="community.decline">Decline</I18nText>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-6">
            <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">
              <I18nText translationKey="community.noInvitations">No pending invitations</I18nText>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationsCenter;
