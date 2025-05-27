
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageCircle, Settings, UserPlus, UserMinus } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { InterestGroup, GroupPost } from '@/types/interest-groups';
import GroupDiscussion from '@/components/community/GroupDiscussion';
import GroupMembersList from '@/components/community/GroupMembersList';
import { getGroupById } from '@/services/interestGroupService';
import { joinGroup, leaveGroup, checkGroupMembership, getGroupPosts, createGroupPost, likePost } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';

const GroupDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [group, setGroup] = useState<InterestGroup | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (slug) {
      loadGroupData();
    }
  }, [slug, auth?.user]);

  const loadGroupData = async () => {
    try {
      // For now, we'll find the group by slug in the groups we fetch
      // In a real app, you'd have a getGroupBySlug function
      const allGroups = await import('@/services/interestGroupService').then(m => m.getAllGroups());
      const foundGroup = (await allGroups()).find(g => g.slug === slug);
      
      if (foundGroup) {
        setGroup(foundGroup);
        
        if (auth?.user) {
          const membershipStatus = await checkGroupMembership(foundGroup.id, auth.user.id);
          setIsMember(membershipStatus);
          
          if (membershipStatus) {
            const groupPosts = await getGroupPosts(foundGroup.id);
            setPosts(groupPosts);
          }
        }
      }
    } catch (error) {
      console.error('Error loading group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!auth?.user || !group || actionLoading) return;
    
    setActionLoading(true);
    try {
      await joinGroup(group.id, auth.user.id);
      setIsMember(true);
      // Reload posts now that user is a member
      const groupPosts = await getGroupPosts(group.id);
      setPosts(groupPosts);
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!auth?.user || !group || actionLoading) return;
    
    setActionLoading(true);
    try {
      await leaveGroup(group.id, auth.user.id);
      setIsMember(false);
      setPosts([]); // Clear posts since user is no longer a member
    } catch (error) {
      console.error('Error leaving group:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreatePost = async (content: string) => {
    if (!auth?.user || !group) return;
    
    try {
      await createGroupPost(group.id, auth.user.id, content);
      // Reload posts
      const groupPosts = await getGroupPosts(group.id);
      setPosts(groupPosts);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!auth?.user) return;
    
    try {
      await likePost(postId, auth.user.id);
      // Reload posts to update like counts
      if (group) {
        const groupPosts = await getGroupPosts(group.id);
        setPosts(groupPosts);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                <I18nText translationKey="community.groupNotFound">Group not found</I18nText>
              </h3>
              <p className="text-slate-600">
                <I18nText translationKey="community.groupNotFoundDescription">
                  The group you're looking for doesn't exist or has been removed.
                </I18nText>
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
        {/* Group Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={group.icon || ''} alt={group.name} />
                  <AvatarFallback style={{ backgroundColor: group.theme_color }}>
                    {group.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{group.name}</CardTitle>
                  <div className="flex items-center space-x-4 text-slate-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{group.members_count} <I18nText translationKey="community.members">members</I18nText></span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{group.discoveries_count} <I18nText translationKey="community.discoveries">discoveries</I18nText></span>
                    </div>
                    <Badge variant={group.is_public ? "secondary" : "outline"}>
                      {group.is_public ? 
                        <I18nText translationKey="community.public">Public</I18nText> : 
                        <I18nText translationKey="community.private">Private</I18nText>
                      }
                    </Badge>
                  </div>
                </div>
              </div>
              
              {auth?.user && (
                <div className="flex space-x-2">
                  {isMember ? (
                    <Button variant="outline" onClick={handleLeaveGroup} disabled={actionLoading}>
                      <UserMinus className="h-4 w-4 mr-2" />
                      <I18nText translationKey="community.leave">Leave</I18nText>
                    </Button>
                  ) : (
                    <Button onClick={handleJoinGroup} disabled={actionLoading}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      <I18nText translationKey="community.join">Join</I18nText>
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700">{group.description}</p>
          </CardContent>
        </Card>

        {/* Group Content */}
        <Tabs defaultValue="discussion" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussion">
              <I18nText translationKey="community.discussion">Discussion</I18nText>
            </TabsTrigger>
            <TabsTrigger value="members">
              <I18nText translationKey="community.members">Members</I18nText>
            </TabsTrigger>
            <TabsTrigger value="discoveries">
              <I18nText translationKey="community.discoveries">Discoveries</I18nText>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discussion">
            {isMember ? (
              <GroupDiscussion
                groupId={group.id}
                posts={posts}
                onCreatePost={handleCreatePost}
                onLikePost={handleLikePost}
              />
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    <I18nText translationKey="community.joinToSeeDiscussions">Join to see discussions</I18nText>
                  </h3>
                  <p className="text-slate-600 mb-4">
                    <I18nText translationKey="community.joinToParticipate">
                      Join this group to participate in discussions and see posts from other members
                    </I18nText>
                  </p>
                  {auth?.user && (
                    <Button onClick={handleJoinGroup} disabled={actionLoading}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      <I18nText translationKey="community.join">Join</I18nText>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="members">
            <GroupMembersList groupId={group.id} />
          </TabsContent>

          <TabsContent value="discoveries">
            <Card>
              <CardHeader>
                <CardTitle>
                  <I18nText translationKey="community.sharedDiscoveries">Shared Discoveries</I18nText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  <I18nText translationKey="community.discoveriesComingSoon">
                    Discoveries sharing functionality coming soon
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

export default GroupDetailPage;
