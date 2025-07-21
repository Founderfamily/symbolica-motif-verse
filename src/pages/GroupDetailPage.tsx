
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageCircle, Share2, UserPlus, Settings, ArrowLeft, Folder, Eye } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { InterestGroup, GroupPost } from '@/types/interest-groups';
import { getGroupBySlug } from '@/services/interestGroupService';
import { checkGroupMembership, joinGroup, leaveGroup, getGroupPosts, createGroupPost, likePost, getGroupMembers } from '@/services/communityService';
import { toast } from 'sonner';
import GroupDiscussion from '@/components/community/GroupDiscussion';
import EnhancedGroupDiscoveries from '@/components/community/EnhancedGroupDiscoveries';
import GroupMembersList from '@/components/community/GroupMembersList';
import GroupCollections from '@/components/community/GroupCollections';
import GroupSymbols from '@/components/community/GroupSymbols';
import InviteUsersDialog from '@/components/community/InviteUsersDialog';
import RealTimeNotifications from '@/components/community/RealTimeNotifications';

const GroupDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  
  const [group, setGroup] = useState<InterestGroup | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState('discussion');

  useEffect(() => {
    if (slug) {
      loadGroup();
    }
  }, [slug, auth?.user]);

  const loadGroup = async () => {
    if (!slug) return;

    try {
      const groupData = await getGroupBySlug(slug);
      setGroup(groupData);

      // Check membership if user is authenticated
      if (auth?.user && groupData) {
        const membershipStatus = await checkGroupMembership(groupData.id, auth.user.id);
        setIsMember(membershipStatus);

        // Load posts only if user is a member or group is public
        if (membershipStatus || groupData.is_public) {
          await loadPosts(groupData.id);
        }
      }
    } catch (error) {
      console.error('Error loading group:', error);
      toast.error('Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (groupId: string) => {
    try {
      const postsData = await getGroupPosts(groupId);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleJoinGroup = async () => {
    if (!auth?.user || !group) return;

    setJoining(true);
    try {
      await joinGroup(group.id, auth.user.id);
      setIsMember(true);
      toast.success('Successfully joined the group!');
      await loadPosts(group.id);
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!auth?.user || !group) return;

    setJoining(true);
    try {
      await leaveGroup(group.id, auth.user.id);
      setIsMember(false);
      setPosts([]);
      toast.success('Left the group');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    } finally {
      setJoining(false);
    }
  };

  const handleCreatePost = async (content: string) => {
    if (!auth?.user || !group) return;

    try {
      await createGroupPost(group.id, auth.user.id, content);
      await loadPosts(group.id);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!auth?.user) return;

    try {
      await likePost(postId, auth.user.id);
      await loadPosts(group!.id);
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-48"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="community.groupNotFound">Group not found</I18nText>
          </h1>
          <p className="text-slate-600 mb-6">
            <I18nText translationKey="community.groupNotFoundDescription">
              The group you're looking for doesn't exist or has been removed.
            </I18nText>
          </p>
          <Button onClick={() => navigate('/community')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <I18nText translationKey="community.backToCommunity">Back to Community</I18nText>
          </Button>
        </div>
      </div>
    );
  }

  const canViewContent = isMember || group.is_public;

  return (
    <div className="min-h-screen bg-slate-50">
      <RealTimeNotifications />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/community')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <I18nText translationKey="community.backToCommunity">Back to Community</I18nText>
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={group.icon || undefined} alt={group.name} />
                    <AvatarFallback className="text-lg">
                      {group.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{group.name}</CardTitle>
                      <Badge variant={group.is_public ? 'default' : 'secondary'}>
                        <I18nText translationKey={group.is_public ? 'community.public' : 'community.private'}>
                          {group.is_public ? 'Public' : 'Private'}
                        </I18nText>
                      </Badge>
                    </div>
                    {group.description && (
                      <p className="text-slate-600">{group.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members_count} <I18nText translationKey="community.stats.members">members</I18nText>
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        {group.discoveries_count} <I18nText translationKey="community.stats.discoveries">discoveries</I18nText>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {auth?.user && (
                    <>
                      {isMember ? (
                        <>
                          <InviteUsersDialog groupId={group.id}>
                            <Button variant="outline" size="sm">
                              <UserPlus className="h-4 w-4 mr-2" />
                              <I18nText translationKey="community.inviteUsers">Invite</I18nText>
                            </Button>
                          </InviteUsersDialog>
                          <Button variant="outline" size="sm" onClick={handleLeaveGroup} disabled={joining}>
                            <I18nText translationKey="community.leave">Leave</I18nText>
                          </Button>
                        </>
                      ) : (
                        <Button onClick={handleJoinGroup} disabled={joining}>
                          <Users className="h-4 w-4 mr-2" />
                          <I18nText translationKey="community.join">Join</I18nText>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Content Tabs */}
        {canViewContent ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="discussion" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <I18nText translationKey="community.discussion">Discussion</I18nText>
              </TabsTrigger>
              <TabsTrigger value="discoveries" className="gap-2">
                <Share2 className="h-4 w-4" />
                <I18nText translationKey="community.discoveries">Discoveries</I18nText>
              </TabsTrigger>
              <TabsTrigger value="symbols" className="gap-2">
                <Eye className="h-4 w-4" />
                <I18nText translationKey="community.symbols">Symboles</I18nText>
              </TabsTrigger>
              <TabsTrigger value="collections" className="gap-2">
                <Folder className="h-4 w-4" />
                <I18nText translationKey="community.collections">Collections</I18nText>
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-2">
                <Users className="h-4 w-4" />
                <I18nText translationKey="community.groupMembers">Members</I18nText>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discussion">
              <GroupDiscussion
                groupId={group.id}
                posts={posts}
                onCreatePost={handleCreatePost}
                onLikePost={handleLikePost}
              />
            </TabsContent>

            <TabsContent value="discoveries">
              <EnhancedGroupDiscoveries groupId={group.id} isMember={isMember} />
            </TabsContent>

            <TabsContent value="symbols">
              <GroupSymbols groupId={group.id} groupSlug={group.slug} isMember={isMember} />
            </TabsContent>

            <TabsContent value="collections">
              <GroupCollections 
                groupId={group.id} 
                isMember={isMember}
                isAdmin={isMember} // TODO: implement proper admin role check
              />
            </TabsContent>

            <TabsContent value="members">
              <GroupMembersList groupId={group.id} />
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                <I18nText translationKey="community.joinToSeeDiscussions">Join to see discussions</I18nText>
              </h3>
              <p className="text-slate-600 mb-6">
                <I18nText translationKey="community.joinToParticipate">
                  Join this group to participate in discussions and see posts from other members
                </I18nText>
              </p>
              {auth?.user && (
                <Button onClick={handleJoinGroup} disabled={joining}>
                  <Users className="h-4 w-4 mr-2" />
                  <I18nText translationKey="community.join">Join Group</I18nText>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GroupDetailPage;
