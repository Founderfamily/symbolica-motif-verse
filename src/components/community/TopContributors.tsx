
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { getTopContributors } from '@/services/userService';

const TopContributors: React.FC = () => {
  const [contributors, setContributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContributors();
  }, []);

  const loadContributors = async () => {
    try {
      const data = await getTopContributors(5);
      setContributors(data);
    } catch (error) {
      console.error('Error loading contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span><I18nText translationKey="community.topContributors">Top Contributors</I18nText></span>
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

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-amber-500" />;
    if (index === 1) return <Trophy className="h-4 w-4 text-slate-400" />;
    if (index === 2) return <Trophy className="h-4 w-4 text-amber-600" />;
    return <Star className="h-4 w-4 text-slate-300" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span><I18nText translationKey="community.topContributors">Top Contributors</I18nText></span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contributors.map((contributor, index) => (
            <div key={contributor.user_id} className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getRankIcon(index)}
                <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={`https://avatar.vercel.sh/${contributor.username}.png`} 
                  alt={contributor.username || 'Contributor'} 
                />
                <AvatarFallback>
                  {contributor.username?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {contributor.full_name || contributor.username || 'Unknown User'}
                </p>
                <p className="text-sm text-slate-500">
                  {contributor.contributions_count} <I18nText translationKey="community.contributions">contributions</I18nText>
                </p>
              </div>
              <Badge variant="secondary">
                {contributor.total_points} pts
              </Badge>
            </div>
          ))}
        </div>

        {contributors.length === 0 && (
          <p className="text-slate-500 text-center py-4">
            <I18nText translationKey="community.noContributors">No contributors yet</I18nText>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TopContributors;
