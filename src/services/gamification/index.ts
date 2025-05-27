
import { pointsService } from './pointsService';
import { achievementService } from './achievementService';
import { activityService } from './activityService';
import { levelService } from './levelService';
import { badgeService } from './badgeService';

/**
 * Unified gamification service that exports all specific services
 */
export const gamificationService = {
  // Points related operations
  awardPoints: pointsService.awardPoints,
  getUserPoints: pointsService.getUserPoints,
  getLeaderboard: pointsService.getLeaderboard,
  
  // Achievement related operations
  getAchievements: achievementService.getAchievements,
  getUserAchievements: achievementService.getUserAchievements,
  checkAchievements: achievementService.checkAchievements,
  
  // Activity related operations
  getUserActivities: activityService.getUserActivities,
  
  // Level related operations
  getUserLevel: levelService.getUserLevel,
  updateUserLevel: levelService.updateUserLevel,
  
  // Badge related operations
  getUserBadges: badgeService.getUserBadges,
  awardBadge: badgeService.awardBadge,
  getBadgeTypes: badgeService.getBadgeTypes
};
