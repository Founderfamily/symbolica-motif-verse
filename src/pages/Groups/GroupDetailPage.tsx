import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Map, Settings, Edit, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getInterestGroupBySlug, InterestGroup, isGroupMember, joinGroup, leaveGroup, getGroupMembers, GroupMember } from '@/services/interestGroupService';
import { useBreakpoint } from '@/hooks/use-breakpoints';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const GroupDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [group, setGroup] = useState<InterestGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [joiningOrLeaving, setJoiningOrLeaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const isSmallScreen = useBreakpoint('md');
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    
    checkAuth();
  }, []);
  
  useEffect(() => {
    const fetchGroup = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const groupData = await getInterestGroupBySlug(slug);
        
        if (!groupData) {
          toast.error(t('groups.notFound'));
          navigate('/groups');
          return;
        }
        
        setGroup(groupData);
        
        // Check if current user is a member
        const memberStatus = await isGroupMember(groupData.id);
        setIsMember(memberStatus);
        
        // Get group members
        const membersData = await getGroupMembers(groupData.id);
        setMembers(membersData);
        
      } catch (error) {
        console.error('Error fetching group:', error);
        toast.error(t('groups.loadError'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroup();
  }, [slug, navigate, t]);
  
  const handleJoinLeaveGroup = async () => {
    if (!group) return;
    
    try {
      setJoiningOrLeaving(true);
      
      if (isMember) {
        await leaveGroup(group.id);
        setIsMember(false);
        setMembers(prev => prev.filter(member => member.profiles.id !== currentUserId));
      } else {
        await joinGroup(group.id);
        setIsMember(true);
        
        // Refresh members list
        const membersData = await getGroupMembers(group.id);
        setMembers(membersData);
      }
    } catch (error) {
      console.error('Error joining/leaving group:', error);
    } finally {
      setJoiningOrLeaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-48 bg-slate-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-slate-200 w-1/3 mb-4 rounded"></div>
          <div className="h-4 bg-slate-200 w-2/3 mb-8 rounded"></div>
          <div className="h-32 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  if (!group) return null;
  
  const isOwner = group.created_by === currentUserId;
  
  return (
    <div className="relative">
      {/* Banner Image */}
      <div 
        className="h-40 sm:h-64 w-full bg-cover bg-center relative" 
        style={{ 
          backgroundImage: group.banner_image 
            ? `url(${group.banner_image})` 
            : `linear-gradient(to right, ${group.theme_color || '#f59e0b'}, ${group.theme_color ? group.theme_color : '#d97706'})`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      {/* Group Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-24">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg">
              <AvatarImage src={group.icon || undefined} />
              <AvatarFallback className="text-2xl font-bold bg-amber-100 text-amber-800">
                {group.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{group.name}</h1>
              <div className="flex flex-wrap items-center mt-2 gap-4">
                <div className="flex items-center text-sm text-slate-600">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members_count} {t('community.stats.members')}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Map className="h-4 w-4 mr-1" />
                  {group.discoveries_count} {t('community.stats.discoveries')}
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 flex gap-2 self-start sm:self-auto">
              {isOwner ? (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => navigate(`/groups/${slug}/edit`)}
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('groups.manage')}</span>
                </Button>
              ) : (
                <Button
                  variant={isMember ? "outline" : "default"}
                  className={isMember ? "" : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"}
                  onClick={handleJoinLeaveGroup}
                  disabled={joiningOrLeaving || !currentUserId}
                >
                  {joiningOrLeaving ? (
                    t('groups.processing')
                  ) : isMember ? (
                    t('groups.leave')
                  ) : (
                    t('groups.join')
                  )}
                </Button>
              )}
            </div>
          </div>
          
          <p className="mt-6 text-slate-600">{group.description}</p>
        </div>
      </div>
      
      {/* Tabs Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="discussions">{t('groups.tabs.discussions')}</TabsTrigger>
            <TabsTrigger value="discoveries">{t('groups.tabs.discoveries')}</TabsTrigger>
            <TabsTrigger value="members">{t('groups.tabs.members')}</TabsTrigger>
            <TabsTrigger value="collections">{t('groups.tabs.collections')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions">
            {isMember && (
              <Button 
                className="mb-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                <Plus className="mr-2 h-4 w-4" /> {t('groups.createPost')}
              </Button>
            )}
            
            <div className="text-center py-10">
              <p className="text-slate-500">{t('groups.noPostsYet')}</p>
              {isMember && (
                <p className="mt-2 text-slate-500">{t('groups.beTheFirst')}</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="discoveries">
            <div className="text-center py-10">
              <p className="text-slate-500">{t('groups.noDiscoveriesYet')}</p>
              {isMember && (
                <p className="mt-2 text-slate-500">{t('groups.contributeFirst')}</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="members">
            <h3 className="text-xl font-semibold mb-4">{t('groups.membersList')}</h3>
            
            <div className={`grid ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-4`}>
              {members.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.profiles.username?.substring(0, 2).toUpperCase() || 
                           member.profiles.full_name?.substring(0, 2).toUpperCase() || 'UN'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.profiles.full_name || member.profiles.username || t('user.anonymous')}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {member.role === 'admin' ? t('groups.roles.admin') : 
                           member.role === 'moderator' ? t('groups.roles.moderator') : 
                           t('groups.roles.member')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="collections">
            {isMember && (
              <Button 
                className="mb-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                <Plus className="mr-2 h-4 w-4" /> {t('groups.createCollection')}
              </Button>
            )}
            
            <div className="text-center py-10">
              <p className="text-slate-500">{t('groups.noCollectionsYet')}</p>
              {isMember && (
                <p className="mt-2 text-slate-500">{t('groups.createFirstCollection')}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GroupDetailPage;
