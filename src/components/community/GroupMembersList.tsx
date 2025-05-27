
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { getGroupMembers } from '@/services/communityService';

interface GroupMembersListProps {
  groupId: string;
}

const GroupMembersList: React.FC<GroupMembersListProps> = ({ groupId }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, [groupId]);

  const loadMembers = async () => {
    try {
      const membersData = await getGroupMembers(groupId);
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <I18nText translationKey="community.groupMembers">Group Members</I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="h-3 bg-slate-200 rounded w-16 mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <I18nText translationKey="community.groupMembers">Group Members</I18nText>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={`https://avatar.vercel.sh/${member.profiles?.username}.png`} 
                  alt={member.profiles?.username || 'Member'} 
                />
                <AvatarFallback>
                  {member.profiles?.username?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {member.profiles?.full_name || member.profiles?.username || 'Unknown User'}
                </p>
                <p className="text-sm text-slate-500">
                  @{member.profiles?.username || 'unknown'}
                </p>
              </div>
              <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                {member.role}
              </Badge>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <p className="text-slate-500 text-center py-4">
            <I18nText translationKey="community.noMembers">No members yet</I18nText>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupMembersList;
