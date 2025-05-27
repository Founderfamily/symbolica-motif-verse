
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Users, TrendingUp, Star } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { InterestGroup } from '@/types/interest-groups';
import InterestGroupCard from './InterestGroupCard';
import { getAllGroups } from '@/services/interestGroupService';
import { useAuth } from '@/hooks/useAuth';

const CommunityHub: React.FC = () => {
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const auth = useAuth();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const fetchedGroups = await getAllGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularGroups = [...filteredGroups].sort((a, b) => b.members_count - a.members_count);
  const activeGroups = [...filteredGroups].sort((a, b) => b.discoveries_count - a.discoveries_count);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">
              <I18nText translationKey="community.title">Community Hub</I18nText>
            </h1>
            <p className="text-slate-600 mt-1">
              <I18nText translationKey="community.subtitle">
                Join interest groups and connect with fellow researchers
              </I18nText>
            </p>
          </div>
          {auth?.user && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              <I18nText translationKey="community.createGroup">Create Group</I18nText>
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{groups.length}</p>
                <p className="text-slate-600 text-sm">
                  <I18nText translationKey="community.totalGroups">Active Groups</I18nText>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {groups.reduce((sum, group) => sum + group.members_count, 0)}
                </p>
                <p className="text-slate-600 text-sm">
                  <I18nText translationKey="community.totalMembers">Total Members</I18nText>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {groups.reduce((sum, group) => sum + group.discoveries_count, 0)}
                </p>
                <p className="text-slate-600 text-sm">
                  <I18nText translationKey="community.totalDiscoveries">Discoveries Shared</I18nText>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            <I18nText translationKey="community.allGroups">All Groups</I18nText>
          </TabsTrigger>
          <TabsTrigger value="popular">
            <I18nText translationKey="community.popular">Popular</I18nText>
          </TabsTrigger>
          <TabsTrigger value="active">
            <I18nText translationKey="community.mostActive">Most Active</I18nText>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <InterestGroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGroups.slice(0, 9).map((group) => (
              <InterestGroupCard key={group.id} group={group} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGroups.slice(0, 9).map((group) => (
              <InterestGroupCard key={group.id} group={group} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredGroups.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              <I18nText translationKey="community.noGroups">No groups found</I18nText>
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="community.noGroupsDescription">
                Try adjusting your search or create a new group
              </I18nText>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityHub;
