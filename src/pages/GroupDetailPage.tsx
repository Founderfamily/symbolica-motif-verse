
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
import { getGroupById } from '@/services/interestGroupService';
import { useAuth } from '@/hooks/useAuth';

const GroupDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [group, setGroup] = useState<InterestGroup | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    if (slug) {
      loadGroupData();
    }
  }, [slug]);

  const loadGroupData = async () => {
    try {
      // Since we don't have getGroupBySlug, we'll need to modify this
      // For now, we'll use a placeholder
      setLoading(false);
    } catch (error) {
      console.error('Error loading group:', error);
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    // TODO: Implement join group functionality
    setIsMember(true);
  };

  const handleLeaveGroup = async () => {
    // TODO: Implement leave group functionality
    setIsMember(false);
  };

  const handleCreatePost = async (content: string) => {
    // TODO: Implement create post functionality
    console.log('Creating post:', content);
  };

  const handleLikePost = async (postId: string) => {
    // TODO: Implement like post functionality
    console.log('Liking post:', postId);
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

  // Placeholder group data for demonstration
  const placeholderGroup: InterestGroup = {
    id: '1',
    name: 'Ancient Egyptian Symbols',
    slug: slug || '',
    description: 'Explore the rich symbolism of ancient Egypt',
    icon: null,
    banner_image: null,
    theme_color: '#3B82F6',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1',
    members_count: 156,
    discoveries_count: 23
  };

  const displayGroup = group || placeholderGroup;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Group Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={displayGroup.icon || ''} alt={displayGroup.name} />
                  <AvatarFallback style={{ backgroundColor: displayGroup.theme_color }}>
                    {displayGroup.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{displayGroup.name}</CardTitle>
                  <div className="flex items-center space-x-4 text-slate-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{displayGroup.members_count} <I18nText translationKey="community.members">members</I18nText></span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{displayGroup.discoveries_count} <I18nText translationKey="community.discoveries">discoveries</I18nText></span>
                    </div>
                    <Badge variant={displayGroup.is_public ? "secondary" : "outline"}>
                      {displayGroup.is_public ? 
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
                    <Button variant="outline" onClick={handleLeaveGroup}>
                      <UserMinus className="h-4 w-4 mr-2" />
                      <I18nText translationKey="community.leave">Leave</I18nText>
                    </Button>
                  ) : (
                    <Button onClick={handleJoinGroup}>
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
            <p className="text-slate-700">{displayGroup.description}</p>
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
            <GroupDiscussion
              groupId={displayGroup.id}
              posts={posts}
              onCreatePost={handleCreatePost}
              onLikePost={handleLikePost}
            />
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>
                  <I18nText translationKey="community.groupMembers">Group Members</I18nText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  <I18nText translationKey="community.membersComingSoon">
                    Member list functionality coming soon
                  </I18nText>
                </p>
              </CardContent>
            </Card>
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
