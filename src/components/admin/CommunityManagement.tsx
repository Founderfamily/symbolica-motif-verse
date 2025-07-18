import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Users, MessageSquare, TrendingUp, Plus, AlertTriangle } from 'lucide-react';

interface CommunityStats {
  id: string;
  name: string;
  member_count: number;
  discoveries_count: number;
  is_public: boolean;
  activity_score: number;
}

export const CommunityManagement: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    is_public: true
  });

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interest_groups')
        .select(`
          id,
          name,
          members_count,
          discoveries_count,
          is_public,
          group_members(count)
        `);
      
      if (error) throw error;
      
      const statsData = data?.map(community => ({
        id: community.id,
        name: community.name,
        member_count: community.members_count,
        discoveries_count: community.discoveries_count,
        is_public: community.is_public,
        activity_score: Math.min(100, (community.discoveries_count * 10) + (community.members_count * 5))
      })) || [];
      
      setCommunities(statsData);
    } catch (error) {
      console.error('Error loading communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async () => {
    if (!newCommunity.name.trim()) {
      toast.error('Community name is required');
      return;
    }

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast.error('You must be logged in to create a community');
        return;
      }

      const slug = newCommunity.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const { error } = await supabase
        .from('interest_groups')
        .insert({
          name: newCommunity.name,
          slug,
          description: newCommunity.description,
          is_public: newCommunity.is_public,
          created_by: user.data.user.id
        });

      if (error) throw error;

      toast.success('Community created successfully');
      setCreateDialogOpen(false);
      setNewCommunity({ name: '', description: '', is_public: true });
      loadCommunities();
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Failed to create community');
    }
  };

  React.useEffect(() => {
    loadCommunities();
  }, []);

  const getHealthStatus = (memberCount: number, activityScore: number) => {
    if (memberCount >= 5 && activityScore >= 50) return 'healthy';
    if (memberCount >= 2 && activityScore >= 20) return 'warning';
    return 'critical';
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Community Management</h2>
          <p className="text-muted-foreground">
            Monitor community health and manage growth
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadCommunities} variant="outline">
            Refresh
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Community
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Community</DialogTitle>
                <DialogDescription>
                  Create a new community with admin approval
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Community name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Community description"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="public"
                    checked={newCommunity.is_public}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, is_public: e.target.checked }))}
                  />
                  <label htmlFor="public" className="text-sm">Public community</label>
                </div>
                <Button onClick={createCommunity} className="w-full">
                  Create Community
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Communities</span>
            </div>
            <div className="text-2xl font-bold">{communities.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Active Communities</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {communities.filter(c => getHealthStatus(c.member_count, c.activity_score) === 'healthy').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">At Risk</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {communities.filter(c => getHealthStatus(c.member_count, c.activity_score) === 'warning').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Discoveries</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {communities.reduce((sum, c) => sum + c.discoveries_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communities List */}
      <Card>
        <CardHeader>
          <CardTitle>Community Health Monitor</CardTitle>
          <CardDescription>
            Track community engagement and identify communities that need attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communities.map((community) => {
              const healthStatus = getHealthStatus(community.member_count, community.activity_score);
              return (
                <div
                  key={community.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{community.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{community.member_count} members</span>
                        <span>•</span>
                        <span>{community.discoveries_count} discoveries</span>
                        <span>•</span>
                        <span>{community.activity_score}% activity</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {community.is_public && (
                      <Badge variant="secondary">Public</Badge>
                    )}
                    <Badge className={getHealthColor(healthStatus)}>
                      {healthStatus === 'healthy' && 'Active'}
                      {healthStatus === 'warning' && 'At Risk'}
                      {healthStatus === 'critical' && 'Inactive'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};