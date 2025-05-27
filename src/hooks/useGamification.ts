
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { gamificationService } from '@/services/gamification';
import { UserPoints, UserLevel, UserAchievement, UserActivity } from '@/types/gamification';
import { triggerGamificationNotification } from '@/components/gamification/NotificationToast';

export const useGamification = () => {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user gamification data
  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [points, level, achievements, activities] = await Promise.all([
        gamificationService.getUserPoints(user.id),
        gamificationService.getUserLevel(user.id),
        gamificationService.getUserAchievements(user.id),
        gamificationService.getUserActivities(user.id, 10)
      ]);
      
      setUserPoints(points);
      setUserLevel(level);
      setUserAchievements(achievements);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Award points for an activity
  const awardPoints = async (
    activityType: string,
    points: number,
    entityId?: string,
    details?: Record<string, any>
  ) => {
    if (!user) return false;
    
    try {
      const success = await gamificationService.awardPoints(
        user.id,
        activityType,
        points,
        entityId,
        details
      );
      
      if (success) {
        // Show notification
        triggerGamificationNotification({
          type: 'points',
          data: {
            pointsEarned: points,
            activityType
          }
        });
        
        // Reload user data to get updated stats
        await loadUserData();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error awarding points:', error);
      return false;
    }
  };

  // Get user rank in leaderboard
  const getUserRank = async (): Promise<number | null> => {
    if (!user || !userPoints) return null;
    
    try {
      const leaderboard = await gamificationService.getLeaderboard(100);
      const userIndex = leaderboard.findIndex(entry => entry.userId === user.id);
      return userIndex !== -1 ? userIndex + 1 : null;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return null;
    }
  };

  // Calculate points for different activities
  const getActivityPoints = (activityType: string): number => {
    const pointsMap: Record<string, number> = {
      'contribution': 25,
      'exploration': 10,
      'validation': 15,
      'comment': 5,
      'collection_creation': 20,
      'symbol_annotation': 15,
      'pattern_identification': 20
    };
    
    return pointsMap[activityType] || 5;
  };

  // Check if user should level up based on new XP
  const checkLevelUp = (oldLevel: UserLevel, newXp: number): boolean => {
    return newXp >= oldLevel.next_level_xp;
  };

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  return {
    userPoints,
    userLevel,
    userAchievements,
    recentActivities,
    loading,
    awardPoints,
    loadUserData,
    getUserRank,
    getActivityPoints,
    checkLevelUp
  };
};
