import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type UserProfileType = 'beginner' | 'treasure_hunter' | 'historian' | 'remote_helper';

export interface AdaptiveProfile {
  type: UserProfileType;
  isFirstTime: boolean;
  age?: number;
  location?: 'on_site' | 'remote';
  expertise?: 'novice' | 'intermediate' | 'expert';
  preferences: {
    gamification: boolean;
    academicMode: boolean;
    fieldMode: boolean;
  };
}

// Détection automatique du profil utilisateur
const detectUserProfile = (profile: any, userActivity: any): UserProfileType => {
  // Si l'utilisateur a moins de 18 ans ou est nouveau
  if (profile?.user_metadata?.age && profile.user_metadata.age < 18) {
    return 'beginner';
  }

  // Si l'utilisateur a des contributions terrain
  if (userActivity?.field_contributions > 3) {
    return 'treasure_hunter';
  }

  // Si l'utilisateur a des validations académiques
  if (userActivity?.academic_validations > 2) {
    return 'historian';
  }

  // Si l'utilisateur travaille uniquement à distance
  if (userActivity?.only_remote_contributions) {
    return 'remote_helper';
  }

  // Par défaut, chasseur de trésor
  return 'treasure_hunter';
};

export const useUserProfile = () => {
  const { user, profile } = useAuth();
  const [adaptiveProfile, setAdaptiveProfile] = useState<AdaptiveProfile>({
    type: 'treasure_hunter',
    isFirstTime: true,
    preferences: {
      gamification: false,
      academicMode: false,
      fieldMode: true,
    }
  });

  useEffect(() => {
    if (profile) {
      // Simuler l'activité utilisateur (à remplacer par de vraies données)
      const userActivity = {
        field_contributions: profile.contributions_count || 0,
        academic_validations: 0,
        only_remote_contributions: profile.contributions_count === 0,
      };

      const detectedType = detectUserProfile(profile, userActivity);
      
      setAdaptiveProfile({
        type: detectedType,
        isFirstTime: (profile.contributions_count || 0) === 0,
        age: profile.user_metadata?.age,
        location: userActivity.only_remote_contributions ? 'remote' : 'on_site',
        expertise: userActivity.field_contributions > 5 ? 'expert' : 
                  userActivity.field_contributions > 1 ? 'intermediate' : 'novice',
        preferences: {
          gamification: detectedType === 'beginner',
          academicMode: detectedType === 'historian',
          fieldMode: detectedType === 'treasure_hunter',
        }
      });
    }
  }, [profile]);

  const setUserProfileType = (type: UserProfileType) => {
    setAdaptiveProfile(prev => ({
      ...prev,
      type,
      preferences: {
        gamification: type === 'beginner',
        academicMode: type === 'historian',
        fieldMode: type === 'treasure_hunter',
      }
    }));
  };

  return {
    adaptiveProfile,
    setUserProfileType,
    isAuthenticated: !!user,
  };
};