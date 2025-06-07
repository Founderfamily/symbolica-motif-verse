import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Trophy, UserPlus, UserMinus, MapPin, Link as LinkIcon } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { UserProfile } from '@/types/auth';
import { getUserProfile, followUser, unfollowUser, checkFollowStatus } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (userId) {
      loadProfile();
      if (auth?.user) {
        checkFollow();
      }
    }
  }, [userId, auth?.user]);

  const loadProfile = async () => {
    if (!userId) return;
    
    try {
      const profileData = await getUserProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollow = async () => {
    if (!auth?.user || !userId) return;
    
    try {
      const followStatus = await checkFollowStatus(auth.user.id, userId);
      setIsFollowing(followStatus);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!auth?.user || !userId || followLoading) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(auth.user.id, userId);
        setIsFollowing(false);
      } else {
        await followUser(auth.user.id, userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4 mt-2"></div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-slate-600">
                <I18nText translationKey="community.userNotFound">User not found</I18nText>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://avatar.vercel.sh/${profile.username}.png`} alt={profile.username} />
                  <AvatarFallback className="text-xl">
                    {profile.username?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile.full_name || profile.username}
                  </h1>
                  <p className="text-slate-600">@{profile.username}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mt-2">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{profile.followers_count} <I18nText translationKey="community.followers">followers</I18nText></span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{profile.following_count} <I18nText translationKey="community.following">following</I18nText></span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4" />
                      <span>{profile.contributions_count} <I18nText translationKey="community.contributions">contributions</I18nText></span>
                    </div>
                  </div>
                </div>
              </div>
              
              {auth?.user && auth.user.id !== profile.id && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      <I18nText translationKey="community.unfollow">Unfollow</I18nText>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      <I18nText translationKey="community.follow">Follow</I18nText>
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          {(profile.bio || profile.location || profile.website) && (
            <CardContent>
              {profile.bio && <p className="text-slate-700 mb-3">{profile.bio}</p>}
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                {profile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="contributions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contributions">
              <I18nText translationKey="community.contributions">Contributions</I18nText>
            </TabsTrigger>
            <TabsTrigger value="followers">
              <I18nText translationKey="community.followers">Followers</I18nText>
            </TabsTrigger>
            <TabsTrigger value="following">
              <I18nText translationKey="community.following">Following</I18nText>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contributions">
            <Card>
              <CardHeader>
                <CardTitle>
                  <I18nText translationKey="community.userContributions">User Contributions</I18nText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  <I18nText translationKey="community.contributionsComingSoon">
                    Contributions list functionality coming soon
                  </I18nText>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followers">
            <Card>
              <CardHeader>
                <CardTitle>
                  <I18nText translationKey="community.followers">Followers</I18nText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  <I18nText translationKey="community.followersComingSoon">
                    Followers list functionality coming soon
                  </I18nText>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="following">
            <Card>
              <CardHeader>
                <CardTitle>
                  <I18nText translationKey="community.following">Following</I18nText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  <I18nText translationKey="community.followingComingSoon">
                    Following list functionality coming soon
                  </I18nText>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;
