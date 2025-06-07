
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Search, X, Mail } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { sendGroupInvitation, searchUsersForInvitation } from '@/services/communityService';
import { toast } from 'sonner';

interface InviteUsersDialogProps {
  groupId: string;
  children: React.ReactNode;
}

const InviteUsersDialog: React.FC<InviteUsersDialogProps> = ({ groupId, children }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{id: string, username: string, full_name: string}>>([]);
  const [selectedUsers, setSelectedUsers] = useState<Array<{id: string, username: string, full_name: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const auth = useAuth();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const users = await searchUsersForInvitation(query);
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleAddUser = (user: {id: string, username: string, full_name: string}) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleSendInvitations = async () => {
    if (!auth?.user) return;
    if (selectedUsers.length === 0 && !emailInput.trim()) {
      toast.error('Please select users or enter an email address');
      return;
    }

    setLoading(true);
    try {
      // Send invitations to selected users
      for (const user of selectedUsers) {
        await sendGroupInvitation(groupId, auth.user.id, user.id, undefined, message);
      }

      // Send invitation by email if provided
      if (emailInput.trim()) {
        await sendGroupInvitation(groupId, auth.user.id, undefined, emailInput.trim(), message);
      }

      toast.success(`Invitations sent successfully!`);
      setOpen(false);
      setSelectedUsers([]);
      setEmailInput('');
      setMessage('');
      setSearchQuery('');
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
          {/* Search Users */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <I18nText translationKey="community.searchUsers">Search Users</I18nText>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Search by username or name..."
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-lg max-h-32 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    onClick={() => handleAddUser(user)}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://avatar.vercel.sh/${user.username}.png`} />
                      <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.full_name || user.username}</p>
                      <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                <I18nText translationKey="community.selectedUsers">Selected Users</I18nText>
              </label>
              <div className="space-y-1">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://avatar.vercel.sh/${user.username}.png`} />
                      <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm">{user.full_name || user.username}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Invitation */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <I18nText translationKey="community.inviteByEmail">Invite by Email</I18nText>
            </label>
            <Input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter email address..."
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <I18nText translationKey="community.invitationMessage">Message (Optional)</I18nText>
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to your invitation..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              <I18nText translationKey="common.cancel">Cancel</I18nText>
            </Button>
            <Button onClick={handleSendInvitations} disabled={loading} className="flex-1">
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
