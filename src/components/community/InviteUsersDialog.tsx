
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { UserPlus, X, Mail, User, Search } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { sendGroupInvitation, searchUsersForInvitation } from '@/services/communityService';
import { toast } from 'sonner';

interface InviteUsersDialogProps {
  groupId: string;
  children: React.ReactNode;
  onInvitesSent?: () => void;
}

interface InviteUser {
  type: 'user' | 'email';
  id?: string;
  username?: string;
  full_name?: string;
  email?: string;
}

const InviteUsersDialog: React.FC<InviteUsersDialogProps> = ({ 
  groupId, 
  children, 
  onInvitesSent 
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<InviteUser[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    setSearching(true);
    try {
      const results = await searchUsersForInvitation(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const addUser = (user: any) => {
    const inviteUser: InviteUser = {
      type: 'user',
      id: user.id,
      username: user.username,
      full_name: user.full_name
    };
    
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(prev => [...prev, inviteUser]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const addEmail = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      const inviteUser: InviteUser = {
        type: 'email',
        email: emailInput.trim()
      };
      
      if (!selectedUsers.find(u => u.email === emailInput.trim())) {
        setSelectedUsers(prev => [...prev, inviteUser]);
      }
      setEmailInput('');
    }
  };

  const removeUser = (index: number) => {
    setSelectedUsers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!auth?.user || selectedUsers.length === 0) return;

    setLoading(true);
    try {
      const invitees = selectedUsers.map(user => ({
        userId: user.id,
        email: user.email,
        message: message.trim() || undefined
      }));

      await sendGroupInvitation(groupId, auth.user.id, invitees);
      
      toast.success(`Invitations sent to ${selectedUsers.length} ${selectedUsers.length === 1 ? 'person' : 'people'}!`);
      
      // Reset form
      setSelectedUsers([]);
      setMessage('');
      setOpen(false);
      
      onInvitesSent?.();
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error('Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <I18nText translationKey="community.inviteUsers">Invite Users</I18nText>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Search */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <I18nText translationKey="community.searchUsers">Search Users</I18nText>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by username or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-lg max-h-32 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 hover:bg-slate-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => addUser(user)}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-sm">{user.full_name || user.username}</p>
                        {user.username && user.full_name && (
                          <p className="text-xs text-slate-500">@{user.username}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <I18nText translationKey="community.inviteByEmail">Invite by Email</I18nText>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                  className="pl-10"
                />
              </div>
              <Button onClick={addEmail} size="sm" disabled={!emailInput.includes('@')}>
                <I18nText translationKey="common.add">Add</I18nText>
              </Button>
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                <I18nText translationKey="community.selectedUsers">Selected Users ({selectedUsers.length})</I18nText>
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user, index) => (
                  <Badge key={index} variant="secondary" className="text-xs gap-1">
                    {user.type === 'user' ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Mail className="h-3 w-3" />
                    )}
                    {user.full_name || user.username || user.email}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeUser(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <I18nText translationKey="community.invitationMessage">Personal Message (Optional)</I18nText>
            </label>
            <Textarea
              placeholder="Add a personal message to your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              <I18nText translationKey="common.cancel">Cancel</I18nText>
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || selectedUsers.length === 0} 
              className="flex-1"
            >
              {loading ? (
                <I18nText translationKey="common.sending">Sending...</I18nText>
              ) : (
                <I18nText translationKey="community.sendInvitations">Send Invitations</I18nText>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsersDialog;
