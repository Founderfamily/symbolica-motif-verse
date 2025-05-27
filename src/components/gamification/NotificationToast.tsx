
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Trophy, Award, Star, Zap } from 'lucide-react';
import { Achievement, UserLevel } from '@/types/gamification';

interface GamificationNotificationProps {
  type: 'achievement' | 'level_up' | 'points';
  data: {
    achievement?: Achievement;
    newLevel?: number;
    pointsEarned?: number;
    activityType?: string;
  };
}

export const showGamificationNotification = (props: GamificationNotificationProps) => {
  const { type, data } = props;
  
  switch (type) {
    case 'achievement':
      if (data.achievement) {
        toast.success(
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="font-semibold">Achievement Unlocked!</div>
              <div className="text-sm text-slate-600">{data.achievement.name}</div>
              <div className="text-xs text-amber-600">+{data.achievement.points} points</div>
            </div>
          </div>,
          {
            duration: 5000,
            className: "border-amber-200 bg-amber-50"
          }
        );
      }
      break;
      
    case 'level_up':
      if (data.newLevel) {
        toast.success(
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Trophy className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold">Level Up!</div>
              <div className="text-sm text-slate-600">You reached level {data.newLevel}</div>
            </div>
          </div>,
          {
            duration: 5000,
            className: "border-purple-200 bg-purple-50"
          }
        );
      }
      break;
      
    case 'points':
      if (data.pointsEarned && data.pointsEarned > 0) {
        toast.success(
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Star className="h-5 w-5 text-green-600 fill-green-600" />
            </div>
            <div>
              <div className="font-semibold">Points Earned!</div>
              <div className="text-sm text-slate-600">+{data.pointsEarned} points</div>
              {data.activityType && (
                <div className="text-xs text-slate-500">for {data.activityType}</div>
              )}
            </div>
          </div>,
          {
            duration: 3000,
            className: "border-green-200 bg-green-50"
          }
        );
      }
      break;
  }
};

// Hook to listen for gamification events
export const useGamificationNotifications = () => {
  useEffect(() => {
    const handleGamificationEvent = (event: CustomEvent<GamificationNotificationProps>) => {
      showGamificationNotification(event.detail);
    };

    window.addEventListener('gamification-notification', handleGamificationEvent as EventListener);
    
    return () => {
      window.removeEventListener('gamification-notification', handleGamificationEvent as EventListener);
    };
  }, []);
};

// Utility function to trigger notifications
export const triggerGamificationNotification = (props: GamificationNotificationProps) => {
  const event = new CustomEvent('gamification-notification', { detail: props });
  window.dispatchEvent(event);
};
