

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, UserPlus, UserMinus } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { UserProfile } from '@/types/auth';
import { followUser, unfollowUser } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';

interface UserCardProps {
  user: UserProfile;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isFollowing = false, onFollowToggle }) => {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleFollowToggle = async () => {
    if (!auth?.user || loading) return;
    
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(auth.user.id, user.id);
      } else {
        await followUser(auth.user.id, user.id);
      }
      onFollowToggle?.();
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://avatar.vercel.sh/${user.username}.png`} alt={user.username} />
            <AvatarFallback>
              {user.username?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {user.full_name || user.username}
            </h3>
            <p className="text-slate-500 text-sm">@{user.username}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{user.followers_count || 0} <I18nText translationKey="community.followers">followers</I18nText></span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4" />
            <span>{user.contributions_count || 0} <I18nText translationKey="community.contributions">contributions</I18nText></span>
          </div>
        </div>

        {user.bio && (
          <p className="text-slate-600 text-sm mb-4">{user.bio}</p>
        )}

        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            <I18nText translationKey="community.member">Member</I18nText>
          </Badge>
          
          {auth?.user && auth.user.id !== user.id && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={handleFollowToggle}
              disabled={loading}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="h-4 w-4 mr-1" />
                  <I18nText translationKey="community.unfollow">Unfollow</I18nText>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  <I18nText translationKey="community.follow">Follow</I18nText>
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;

