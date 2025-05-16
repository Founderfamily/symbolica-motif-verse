
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Progress } from '@/components/ui/progress';
import { Award, Lock } from 'lucide-react';
import { Achievement, UserAchievement } from '@/types/gamification';

interface AchievementsListProps {
  achievements?: Achievement[];
  userAchievements?: UserAchievement[];
  loading?: boolean;
  type?: string;
  showAll?: boolean;
}

const AchievementsList: React.FC<AchievementsListProps> = ({
  achievements = [],
  userAchievements = [],
  loading = false,
  type,
  showAll = false
}) => {
  const { t } = useTranslation();
  
  // Filter achievements by type if provided
  const filteredAchievements = type 
    ? achievements.filter(a => a.type === type)
    : achievements;
    
  // If showAll is false, only show the first few achievements
  const displayAchievements = showAll 
    ? filteredAchievements 
    : filteredAchievements.slice(0, 3);
    
  // Create a map of user achievements for easier lookup
  const userAchievementsMap = userAchievements.reduce((acc, ua) => {
    acc[ua.achievement_id] = ua;
    return acc;
  }, {} as Record<string, UserAchievement>);
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'text-amber-700';
      case 'silver': return 'text-slate-400';
      case 'gold': return 'text-yellow-500';
      case 'platinum': return 'text-blue-500';
      default: return 'text-slate-500';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (filteredAchievements.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        <p><I18nText translationKey="gamification.noAchievements" /></p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {displayAchievements.map((achievement) => {
        const userAchievement = userAchievementsMap[achievement.id];
        const progress = userAchievement?.progress || 0;
        const isCompleted = userAchievement?.completed || false;
        const progressPercentage = Math.min(100, Math.round((progress / achievement.requirement) * 100));
        
        return (
          <div 
            key={achievement.id}
            className={`bg-white p-4 rounded-lg border ${isCompleted ? 'border-amber-200' : 'border-slate-200'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${isCompleted ? 'bg-amber-100' : 'bg-slate-100'}`}>
                {isCompleted ? (
                  <Award className="h-6 w-6 text-amber-600" />
                ) : (
                  <Lock className="h-6 w-6 text-slate-400" />
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{achievement.name}</h4>
                    <p className="text-sm text-slate-500">{achievement.description}</p>
                  </div>
                  <span className={`text-xs font-medium ${getLevelColor(achievement.level)}`}>
                    {achievement.level.toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{progress} / {achievement.requirement}</span>
                    <span>
                      {achievement.points} <I18nText translationKey="gamification.points" />
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-1.5" />
                </div>
                
                {userAchievement?.earned_at && (
                  <p className="text-xs text-green-600">
                    <I18nText translationKey="gamification.earnedAt" />: {new Date(userAchievement.earned_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {!showAll && filteredAchievements.length > 3 && (
        <div className="text-center">
          <a 
            href="#more" 
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            <I18nText translationKey="gamification.seeMoreAchievements" />
          </a>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;
