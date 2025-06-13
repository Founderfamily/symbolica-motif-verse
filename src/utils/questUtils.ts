
import { TreasureQuest, QuestClue } from '@/types/quests';

// Fonction utilitaire pour normaliser les structures différentes de clues
export const normalizeQuestClues = (quest: TreasureQuest): QuestClue[] => {
  console.log('normalizeQuestClues - Quest:', quest.title);
  console.log('normalizeQuestClues - Raw clues:', quest.clues);
  console.log('normalizeQuestClues - Clues type:', typeof quest.clues);
  console.log('normalizeQuestClues - Is array:', Array.isArray(quest.clues));

  if (!quest.clues) {
    console.log('normalizeQuestClues - No clues found, returning empty array');
    return [];
  }

  if (!Array.isArray(quest.clues)) {
    console.log('normalizeQuestClues - Clues is not an array, returning empty array');
    return [];
  }

  return quest.clues.map((clue: any, index: number) => {
    console.log(`normalizeQuestClues - Processing clue ${index}:`, clue);
    
    // Normaliser la structure en fonction de ce qui est disponible
    const normalizedClue: QuestClue = {
      id: clue.id || index + 1,
      title: clue.title || `Indice ${index + 1}`,
      description: clue.description || '',
      hint: clue.hint || '',
      location: clue.location || undefined,
      symbol_reference: clue.symbol_reference || undefined,
      validation_type: clue.validation_type || 'location',
      validation_data: clue.validation_data || {},
      points: clue.points || 10,
      unlock_condition: clue.unlock_condition || undefined
    };

    console.log(`normalizeQuestClues - Normalized clue ${index}:`, normalizedClue);
    return normalizedClue;
  });
};

// Fonction pour obtenir un aperçu sécurisé des clues pour l'affichage
export const getQuestCluesPreview = (quest: TreasureQuest, maxCount: number = 3): QuestClue[] => {
  const normalizedClues = normalizeQuestClues(quest);
  return normalizedClues.slice(0, maxCount);
};

// Fonction pour compter le nombre total de clues
export const getQuestCluesCount = (quest: TreasureQuest): number => {
  const normalizedClues = normalizeQuestClues(quest);
  return normalizedClues.length;
};
