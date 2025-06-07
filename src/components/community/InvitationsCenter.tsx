
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Check, X, Clock } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupInvitation } from '@/types/interest-groups';
import { getUserInvitations, respondToInvitation, joinGroup } from '@/services/communityService';
import { toast } from 'sonner';

const InvitationsCenter: React.FC = () => {
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

  const handleRespond = async (invitationId: string, response: 'accepted' | 'declined') => {
    if (!auth?.user) return;

    setResponding(invitationId);
    try {
      await respondToInvitation(invitationId, response);
      
      // If accepted, also join the group
      if (response === 'accepted') {
        const invitation = invitations.find(inv => inv.id === invitationId);
        if (invitation) {
          await joinGroup(invitation.group_id, auth.user.id);
        }
      }

      // Remove the invitation from the list
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      toast.success(
        response === 'accepted' 
          ? 'Invitation accepted! You have joined the group.' 
          : 'Invitation declined.'
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
            <Badge variant="destructive" className="text-xs">
              {invitations.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{invitation.group?.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    
                    {invitation.message && (
                      <p className="text-sm text-slate-600 mb-3">"{invitation.message}"</p>
                    )}
                    
                    <p className="text-xs text-slate-500">
                      Received {new Date(invitation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => handleRespond(invitation.id, 'accepted')}
                    disabled={responding === invitation.id}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    <I18nText translationKey="common.accept">Accept</I18nText>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRespond(invitation.id, 'declined')}
                    disabled={responding === invitation.id}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    <I18nText translationKey="common.decline">Decline</I18nText>
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
