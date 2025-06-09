
import { supabase } from '@/integrations/supabase/client';
import { QuestDocument, QuestEvidence, QuestLocation, QuestDiscussion, QuestTheory } from '@/types/investigation';

export const investigationService = {
  // Documents historiques
  async getQuestDocuments(questId: string) {
    try {
      const { data, error } = await supabase
        .from('quest_documents')
        .select('*')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching quest documents:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async uploadDocument(document: Omit<QuestDocument, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('quest_documents')
        .insert(document)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Preuves et validations
  async getQuestEvidence(questId: string) {
    try {
      const { data, error } = await supabase
        .from('quest_evidence')
        .select(`
          *,
          submitted_by_profile:profiles!quest_evidence_submitted_by_fkey(username, full_name)
        `)
        .eq('quest_id', questId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching quest evidence:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async submitEvidence(evidence: Omit<QuestEvidence, 'id' | 'created_at' | 'updated_at' | 'validation_score' | 'validation_count' | 'validation_status'>) {
    try {
      const { data, error } = await supabase
        .from('quest_evidence')
        .insert(evidence)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting evidence:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async validateEvidence(evidenceId: string, voteType: 'validate' | 'dispute' | 'reject', comment?: string, expertiseLevel: string = 'amateur') {
    try {
      const { data, error } = await supabase
        .from('evidence_validations')
        .insert({
          evidence_id: evidenceId,
          validator_id: (await supabase.auth.getUser()).data.user?.id,
          vote_type: voteType,
          comment,
          expertise_level: expertiseLevel,
          confidence_score: 75
        })
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error validating evidence:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Lieux emblématiques
  async getQuestLocations(questId: string) {
    try {
      const { data, error } = await supabase
        .from('quest_locations')
        .select('*')
        .eq('quest_id', questId)
        .order('name');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching quest locations:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async addQuestLocation(location: Omit<QuestLocation, 'id' | 'created_at' | 'updated_at' | 'verified' | 'verified_by'>) {
    try {
      const { data, error } = await supabase
        .from('quest_locations')
        .insert(location)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding quest location:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Discussions
  async getQuestDiscussions(questId: string, clueIndex?: number) {
    try {
      let query = supabase
        .from('quest_discussions')
        .select(`
          *,
          created_by_profile:profiles!quest_discussions_created_by_fkey(username, full_name)
        `)
        .eq('quest_id', questId);
      
      if (clueIndex !== undefined) {
        query = query.eq('clue_index', clueIndex);
      }
      
      const { data, error } = await query.order('pinned', { ascending: false })
        .order('last_activity_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching quest discussions:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async createDiscussion(discussion: Omit<QuestDiscussion, 'id' | 'created_at' | 'updated_at' | 'replies_count' | 'last_activity_at' | 'pinned' | 'locked'>) {
    try {
      const { data, error } = await supabase
        .from('quest_discussions')
        .insert(discussion)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating discussion:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Théories
  async getQuestTheories(questId: string) {
    try {
      const { data, error } = await supabase
        .from('quest_theories')
        .select(`
          *,
          author_profile:profiles!quest_theories_author_id_fkey(username, full_name)
        `)
        .eq('quest_id', questId)
        .eq('status', 'active')
        .order('community_score', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching quest theories:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async createTheory(theory: Omit<QuestTheory, 'id' | 'created_at' | 'updated_at' | 'community_score' | 'votes_count'>) {
    try {
      const { data, error } = await supabase
        .from('quest_theories')
        .insert(theory)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating theory:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};
