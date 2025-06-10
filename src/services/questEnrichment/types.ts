
import { TreasureQuest } from '@/types/quests';
import { AIProvider } from '@/services/mcpService';

export interface QuestEnrichmentRequest {
  questId: string;
  field: 'story_background' | 'description' | 'clues' | 'target_symbols';
  currentValue: any;
  questContext: Partial<TreasureQuest>;
  provider?: AIProvider;
}

export interface QuestEnrichmentResponse {
  enrichedValue: any;
  suggestions: string[];
  confidence: number;
  provider: string;
}
