
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { gamificationService } from '@/services/gamification';

interface LeaderboardUser {
  userId: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  level: number;
  totalPoints: number;
  contributionPoints: number;
  explorationPoints: number;
}

const LeaderboardDisplay: React.FC = () => {
  const { t } = useTranslation();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadLeaderboard();
  }, []);
  
  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const leaderboardUsers = await gamificationService.getLeaderboard(10);
      setLeaderboardData(leaderboardUsers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to get the proper rank icon
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-slate-400 fill-slate-300" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600 fill-amber-500" />;
      default:
        return <span className="font-bold text-slate-500">{index + 1}</span>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <I18nText translationKey="gamification.leaderboard.title">
              Classement
            </I18nText>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-grow">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
          </div>
        ) : leaderboardData.length > 0 ? (
          <div className="space-y-2">
            {leaderboardData.map((user, index) => (
              <div 
                key={user.userId}
                className={`flex items-center gap-3 p-2 rounded-lg
                  ${index < 3 ? 'bg-amber-50 border border-amber-100' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(index)}
                </div>
                
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback>
                    {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-grow">
                  <p className="font-medium text-sm">
                    {user.fullName || user.username || t('user.anonymous')}
                  </p>
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline" className="text-xs h-5 bg-slate-50">
                      <I18nText translationKey="profile.level" values={{ level: user.level }} />
                    </Badge>
                    <div className="text-xs text-slate-500">
                      <I18nText 
                        translationKey="gamification.contributions" 
                        values={{ count: user.contributionPoints }}
                      >
                        {user.contributionPoints} contributions
                      </I18nText>
                    </div>
                  </div>
                </div>
                
                <div className="text-amber-600 font-bold flex items-center gap-1">
                  <span>{user.totalPoints}</span>
                  <span className="text-xs text-slate-500">pts</span>
                </div>
              </div>
            ))}
            
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <I18nText translationKey="gamification.leaderboard.empty">
              Pas encore de données de classement disponibles.
            </I18nText>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardDisplay;
