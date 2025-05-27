
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy, Shield, Target, Zap } from 'lucide-react';
import { UserBadge } from '@/types/gamification';
import { I18nText } from '@/components/ui/i18n-text';

interface BadgeDisplayProps {
  badges: UserBadge[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badges, 
  maxVisible = 5,
  size = 'md' 
}) => {
  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'achievement_contribution':
        return <Award className="h-4 w-4" />;
      case 'achievement_exploration':
        return <Target className="h-4 w-4" />;
      case 'achievement_validation':
        return <Shield className="h-4 w-4" />;
      case 'achievement_community':
        return <Star className="h-4 w-4" />;
      case 'level_milestone':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'achievement_contribution':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'achievement_exploration':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'achievement_validation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'achievement_community':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'level_milestone':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {visibleBadges.map((badge) => (
        <Badge
          key={badge.id}
          variant="outline"
          className={`${getBadgeColor(badge.badge_type)} ${sizeClasses[size]} flex items-center gap-1`}
          title={`Earned on ${new Date(badge.awarded_at).toLocaleDateString()}`}
        >
          {getBadgeIcon(badge.badge_type)}
          <span>{badge.badge_name}</span>
        </Badge>
      ))}
      
      {remainingCount > 0 && (
        <Badge variant="outline" className={`${sizeClasses[size]} bg-slate-100 text-slate-600`}>
          +{remainingCount} <I18nText translationKey="gamification.moreBadges">more</I18nText>
        </Badge>
      )}
    </div>
  );
};

export default BadgeDisplay;
