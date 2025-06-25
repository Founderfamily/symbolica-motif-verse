
import { TreasureQuest } from '@/types/quests';

export const getQuestCluesCount = (quest: TreasureQuest): number => {
  if (!quest.clues) return 0;
  if (Array.isArray(quest.clues)) return quest.clues.length;
  return 0;
};

export const getQuestTypeLabel = (questType: string): string => {
  switch (questType) {
    case 'templar': return 'Templiers';
    case 'lost_civilization': return 'Civilisation Perdue';
    case 'grail': return 'Quête du Graal';
    case 'custom': return 'Personnalisée';
    default: return questType;
  }
};

export const getDifficultyLabel = (level: string): string => {
  switch (level) {
    case 'beginner': return 'Accessible';
    case 'intermediate': return 'Intermédiaire';
    case 'expert': return 'Avancé';
    case 'master': return 'Expert';
    default: return level;
  }
};

export const getQuestStatusLabel = (status: string): string => {
  switch (status) {
    case 'active': return 'Active';
    case 'upcoming': return 'À venir';
    case 'completed': return 'Résolue';
    case 'cancelled': return 'En pause';
    default: return status;
  }
};
