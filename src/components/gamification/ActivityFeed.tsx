
import React from 'react';
import { UserActivity } from '@/types/gamification';
import { useTranslation } from '@/i18n/useTranslation';
import { 
  Upload, 
  MessageSquare, 
  ThumbsUp, 
  Award, 
  Search, 
  Star,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ActivityFeedProps {
  activities: UserActivity[];
  loading?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, loading = false }) => {
  const { t } = useTranslation();
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <Upload className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'validation':
        return <ThumbsUp className="h-4 w-4" />;
      case 'achievement':
        return <Award className="h-4 w-4" />;
      case 'exploration':
        return <Search className="h-4 w-4" />;
      case 'community':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };
  
  const getActivityDescription = (activity: UserActivity) => {
    const details = activity.details || {};
    
    switch (activity.activity_type) {
      case 'contribution':
        return details.title 
          ? t('gamification.activity.contribution', { title: details.title })
          : t('gamification.activity.genericContribution');
          
      case 'exploration':
        return details.symbolName
          ? t('gamification.activity.exploredSymbol', { name: details.symbolName })
          : t('gamification.activity.genericExploration');
          
      case 'comment':
        return t('gamification.activity.comment');
        
      default:
        return t('gamification.activity.generic');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        <p>{t('gamification.noActivity')}</p>
      </div>
    );
  }
  
  return (
    <ul className="space-y-3">
      {activities.map((activity) => (
        <li key={activity.id} className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-full">
              {getActivityIcon(activity.activity_type)}
            </div>
            
            <div className="flex-1">
              <p className="text-sm">{getActivityDescription(activity)}</p>
              
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </span>
                
                <Badge variant="secondary" className="ml-auto">
                  +{activity.points_earned} {t('gamification.points')}
                </Badge>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActivityFeed;
