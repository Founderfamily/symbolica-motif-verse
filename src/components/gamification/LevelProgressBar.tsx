
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { UserLevel } from '@/types/gamification';
import { I18nText } from '@/components/ui/i18n-text';

interface LevelProgressBarProps {
  userLevel: UserLevel;
  showDetails?: boolean;
  compact?: boolean;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({ 
  userLevel, 
  showDetails = true,
  compact = false 
}) => {
  const progressPercentage = (userLevel.xp / userLevel.next_level_xp) * 100;
  
  const getLevelTitle = (level: number) => {
    if (level >= 100) return "Cultural Guardian";
    if (level >= 50) return "Symbol Sage";
    if (level >= 25) return "Journey Master";
    if (level >= 10) return "Apprentice Scholar";
    if (level >= 5) return "Novice Explorer";
    return "Newcomer";
  };

  const getLevelColor = (level: number) => {
    if (level >= 50) return "text-purple-600";
    if (level >= 25) return "text-blue-600";
    if (level >= 10) return "text-green-600";
    if (level >= 5) return "text-amber-600";
    return "text-slate-600";
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Trophy className={`h-4 w-4 ${getLevelColor(userLevel.level)}`} />
        <Badge variant="outline" className="text-xs">
          <I18nText translationKey="profile.level" values={{ level: userLevel.level }} />
        </Badge>
        <div className="flex-1 max-w-20">
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className={`h-5 w-5 ${getLevelColor(userLevel.level)}`} />
          <div>
            <div className="font-semibold">
              <I18nText translationKey="profile.level" values={{ level: userLevel.level }} />
            </div>
            {showDetails && (
              <div className={`text-sm ${getLevelColor(userLevel.level)}`}>
                {getLevelTitle(userLevel.level)}
              </div>
            )}
          </div>
        </div>
        
        {showDetails && (
          <div className="text-right text-sm text-slate-600">
            <div>{userLevel.xp} / {userLevel.next_level_xp} XP</div>
            <div className="text-xs">
              <I18nText 
                translationKey="profile.xpToNextLevel" 
                values={{ xp: userLevel.next_level_xp - userLevel.xp }}
              >
                {userLevel.next_level_xp - userLevel.xp} XP to next level
              </I18nText>
            </div>
          </div>
        )}
      </div>
      
      <Progress value={progressPercentage} className="h-3" />
    </div>
  );
};

export default LevelProgressBar;
