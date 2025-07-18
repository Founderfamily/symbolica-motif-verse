
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserBadge } from '@/types/gamification';
import { Award, Star, Trophy, Shield } from 'lucide-react';

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
      case 'level_milestone':
        return Trophy;
      case 'contribution':
        return Star;
      case 'community':
        return Shield;
      default:
        return Award;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'level_milestone':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'contribution':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'community':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  if (badges.length === 0) {
    return (
      <div className="text-center text-slate-500 text-sm py-2">
        Aucun badge pour le moment
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleBadges.map((badge) => {
        const IconComponent = getBadgeIcon(badge.badge_type);
        return (
          <Badge
            key={badge.id}
            variant="outline"
            className={`${getBadgeColor(badge.badge_type)} ${sizeClasses[size]} flex items-center gap-1`}
          >
            <IconComponent className={iconSizeClasses[size]} />
            <span>{badge.badge_name}</span>
          </Badge>
        );
      })}
      
      {remainingCount > 0 && (
        <Badge variant="outline" className={`bg-slate-100 text-slate-600 ${sizeClasses[size]}`}>
          +{remainingCount} de plus
        </Badge>
      )}
    </div>
  );
};

export default BadgeDisplay;
