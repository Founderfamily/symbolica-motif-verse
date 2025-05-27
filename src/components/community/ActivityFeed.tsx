import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Activity, MessageCircle, Heart, UserPlus } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { supabase } from '@/integrations/supabase/client';

interface ActivityItem {
  id: string;
  type: 'post' | 'like' | 'follow' | 'join';
  user: {
    username: string;
    full_name: string;
  };
  content: string;
  created_at: string;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      // Fetch recent group posts
      const { data: posts, error } = await supabase
        .from('group_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Get profiles for each post
      const activityItems: ActivityItem[] = [];
      
      for (const post of posts || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', post.user_id)
          .single();

        activityItems.push({
          id: post.id,
          type: 'post',
          user: {
            username: profile?.username || 'unknown',
            full_name: profile?.full_name || 'Unknown User'
          },
          content: post.content,
          created_at: post.created_at
        });
      }

      setActivities(activityItems);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'like': return <Heart className="h-4 w-4 text-red-500" />;
      case 'follow': return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'join': return <UserPlus className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'post': return 'posted in a group';
      case 'like': return 'liked a post';
      case 'follow': return 'started following someone';
      case 'join': return 'joined a group';
      default: return 'did something';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span><I18nText translationKey="community.recentActivity">Recent Activity</I18nText></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mt-2"></div>
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
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span><I18nText translationKey="community.recentActivity">Recent Activity</I18nText></span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={`https://avatar.vercel.sh/${activity.user.username}.png`} 
                  alt={activity.user.username} 
                />
                <AvatarFallback>
                  {activity.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {getActivityIcon(activity.type)}
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.full_name || activity.user.username}</span>
                    <span className="text-slate-600 ml-1">{getActivityText(activity)}</span>
                  </p>
                </div>
                {activity.type === 'post' && (
                  <p className="text-sm text-slate-600 line-clamp-2">{activity.content}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(activity.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <p className="text-slate-500 text-center py-4">
            <I18nText translationKey="community.noActivity">No recent activity</I18nText>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
