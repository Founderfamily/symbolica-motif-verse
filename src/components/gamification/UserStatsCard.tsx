
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, Trophy, Target, Users } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { gamificationService } from '@/services/gamification';
import { UserPoints, UserLevel, UserBadge } from '@/types/gamification';
import LevelProgressBar from './LevelProgressBar';
import BadgeDisplay from './BadgeDisplay';

const UserStatsCard: React.FC = () => {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [points, level, badges] = await Promise.all([
        gamificationService.getUserPoints(user.id),
        gamificationService.getUserLevel(user.id),
        gamificationService.getUserBadges ? gamificationService.getUserBadges(user.id) : Promise.resolve([])
      ]);
      
      setUserPoints(points);
      setUserLevel(level);
      setUserBadges(badges);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">
            <I18nText translationKey="auth.loginToSeeStats">
              Connectez-vous pour voir vos statistiques
            </I18nText>
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-amber-500" />
          <I18nText translationKey="gamification.yourProgress">
            Votre Progression
          </I18nText>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Progress */}
        {userLevel && (
          <div>
            <LevelProgressBar userLevel={userLevel} />
          </div>
        )}
        
        <Separator />
        
        {/* Points Breakdown */}
        {userPoints && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                <Star className="h-4 w-4 fill-amber-500" />
                <span className="font-bold text-lg">{userPoints.total}</span>
              </div>
              <div className="text-xs text-slate-600">
                <I18nText translationKey="gamification.totalPoints">
                  Points totaux
                </I18nText>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <Target className="h-4 w-4" />
                <span className="font-bold text-lg">{userPoints.contribution_points}</span>
              </div>
              <div className="text-xs text-slate-600">
                <I18nText translationKey="gamification.contributions">
                  Contributions
                </I18nText>
              </div>
            </div>
          </div>
        )}
        
        <Separator />
        
        {/* Badges */}
        {userBadges.length > 0 ? (
          <div>
            <div className="text-sm font-medium mb-2">
              <I18nText translationKey="gamification.recentBadges">
                Badges récents
              </I18nText>
            </div>
            <BadgeDisplay badges={userBadges} maxVisible={3} size="sm" />
          </div>
        ) : (
          <div className="text-center py-4 text-slate-500">
            <div className="text-sm">
              <I18nText translationKey="gamification.noBadgesYet">
                Aucun badge gagné pour le moment
              </I18nText>
            </div>
            <div className="text-xs">
              <I18nText translationKey="gamification.startContributing">
                Commencez à contribuer pour gagner votre premier badge !
              </I18nText>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
