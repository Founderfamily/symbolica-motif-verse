
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
      return { success: true, data: data as QuestDocument[] };
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
      return { success: true, data: data as QuestDocument };
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
      return { success: true, data: data as (QuestEvidence & { submitted_by_profile?: any })[] };
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
      return { success: true, data: data as QuestEvidence };
    } catch (error) {
      console.error('Error submitting evidence:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async validateEvidence(evidenceId: string, voteType: 'validate' | 'dispute' | 'reject', comment?: string, expertiseLevel: string = 'amateur') {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('evidence_validations')
        .insert({
          evidence_id: evidenceId,
          validator_id: user.user.id,
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
      return { success: true, data: data as QuestLocation[] };
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
      return { success: true, data: data as QuestLocation };
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
      return { success: true, data: data as (QuestDiscussion & { created_by_profile?: any })[] };
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
      return { success: true, data: data as QuestDiscussion };
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
      return { success: true, data: data as (QuestTheory & { author_profile?: any })[] };
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
      return { success: true, data: data as QuestTheory };
    } catch (error) {
      console.error('Error creating theory:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Analyses IA proactives
  async generateProactiveInsights(questId: string) {
    try {
      // Analyser les preuves et théories existantes pour identifier des patterns
      const { data: evidenceData } = await supabase
        .from('quest_evidence')
        .select('*')
        .eq('quest_id', questId);

      const { data: theoriesData } = await supabase
        .from('quest_theories')
        .select('*')
        .eq('quest_id', questId);

      // Simuler des insights IA basés sur les données
      const insights = [];

      // Analyser les lacunes dans les preuves
      const evidenceTypes = evidenceData?.map(e => e.evidence_type) || [];
      const missingTypes = ['document', 'photo', 'artifact'].filter(type => 
        !evidenceTypes.includes(type)
      );

      if (missingTypes.length > 0) {
        insights.push({
          type: 'missing_evidence',
          title: 'Types de preuves manquantes détectées',
          description: `L'IA suggère de rechercher des ${missingTypes.join(', ')} pour compléter l'investigation`,
          priority: 'high',
          action: `Chercher des ${missingTypes[0]}s dans la zone d'investigation`,
          metadata: { missing_types: missingTypes }
        });
      }

      // Analyser les correlations géographiques
      const locatedEvidence = evidenceData?.filter(e => e.latitude && e.longitude) || [];
      if (locatedEvidence.length >= 2) {
        insights.push({
          type: 'location_correlation',
          title: 'Corrélation géographique détectée',
          description: `${locatedEvidence.length} preuves géolocalisées trouvées, concentration dans un secteur défini`,
          priority: 'medium',
          action: 'Analyser le périmètre de recherche pour identifier des zones prioritaires',
          metadata: { evidence_count: locatedEvidence.length }
        });
      }

      // Analyser les patterns dans les théories
      const theoryTypes = theoriesData?.map(t => t.theory_type) || [];
      const dominantType = theoryTypes.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonType = Object.entries(dominantType).reduce((a, b) => 
        dominantType[a[0]] > dominantType[b[0]] ? a : b
      )?.[0];

      if (mostCommonType && dominantType[mostCommonType] > 1) {
        insights.push({
          type: 'pattern_detected',
          title: 'Pattern thématique identifié',
          description: `Convergence vers le type "${mostCommonType}" dans ${dominantType[mostCommonType]} théories`,
          priority: 'medium',
          action: 'Approfondir la recherche dans cette direction thématique',
          metadata: { dominant_type: mostCommonType, count: dominantType[mostCommonType] }
        });
      }

      return { success: true, data: insights };
    } catch (error) {
      console.error('Error generating proactive insights:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Suggestions de zones d'investigation
  async suggestInvestigationAreas(questId: string) {
    try {
      const { data: questData } = await supabase
        .from('treasure_quests')
        .select('*')
        .eq('id', questId)
        .single();

      const { data: evidenceData } = await supabase
        .from('quest_evidence')
        .select('*')
        .eq('quest_id', questId);

      // Suggérer des zones basées sur les indices et preuves existantes
      const suggestions = [];

      if (questData?.quest_type === 'unfound_treasure') {
        suggestions.push({
          type: 'archive_search',
          title: 'Archives historiques',
          locations: ['Bibliothèque Nationale', 'Archives départementales', 'Musées locaux'],
          priority: 'high',
          description: 'Rechercher des documents d\'époque et témoignages historiques'
        });
      }

      // Analyser les zones géographiques des preuves existantes
      const locatedEvidence = evidenceData?.filter(e => e.latitude && e.longitude) || [];
      if (locatedEvidence.length > 0) {
        // Calculer le centre géographique
        const avgLat = locatedEvidence.reduce((sum, e) => sum + Number(e.latitude), 0) / locatedEvidence.length;
        const avgLng = locatedEvidence.reduce((sum, e) => sum + Number(e.longitude), 0) / locatedEvidence.length;
        
        suggestions.push({
          type: 'geographic_expansion',
          title: 'Extension géographique',
          center: { latitude: avgLat, longitude: avgLng },
          radius: 5000, // 5km
          priority: 'medium',
          description: 'Étendre la recherche autour du centre de gravité des preuves actuelles'
        });
      }

      return { success: true, data: suggestions };
    } catch (error) {
      console.error('Error suggesting investigation areas:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Analyser les connexions entre preuves et théories
  async analyzeEvidenceTheoryConnections(questId: string) {
    try {
      const { data: evidenceData } = await supabase
        .from('quest_evidence')
        .select('*')
        .eq('quest_id', questId);

      const { data: theoriesData } = await supabase
        .from('quest_theories')
        .select('*')
        .eq('quest_id', questId);

      const connections = [];

      // Analyser les connexions entre preuves et théories
      theoriesData?.forEach(theory => {
        const supportingEvidenceIds = Array.isArray(theory.supporting_evidence) 
          ? theory.supporting_evidence 
          : [];
        const supportingEvidence = evidenceData?.filter(evidence => 
          supportingEvidenceIds.includes(evidence.id)
        ) || [];

        const connectionStrength = supportingEvidence.length / (evidenceData?.length || 1);
        
        connections.push({
          theory_id: theory.id,
          theory_title: theory.title,
          supporting_evidence_count: supportingEvidence.length,
          connection_strength: connectionStrength,
          confidence_level: theory.confidence_level,
          evidence_quality: supportingEvidence.reduce((avg, e) => 
            avg + (e.validation_score || 0), 0
          ) / (supportingEvidence.length || 1)
        });
      });

      // Identifier les théories les mieux supportées
      const bestSupportedTheories = connections
        .sort((a, b) => b.connection_strength - a.connection_strength)
        .slice(0, 3);

      return { 
        success: true, 
        data: {
          connections,
          best_supported: bestSupportedTheories,
          analysis_summary: {
            total_theories: theoriesData?.length || 0,
            total_evidence: evidenceData?.length || 0,
            average_support: connections.reduce((avg, c) => avg + c.connection_strength, 0) / (connections.length || 1)
          }
        }
      };
    } catch (error) {
      console.error('Error analyzing connections:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Détecter des patterns automatiquement
  async detectPatterns(questId: string) {
    try {
      const { data: evidenceData } = await supabase
        .from('quest_evidence')
        .select('*')
        .eq('quest_id', questId);

      const patterns = [];

      // Pattern temporel
      const evidenceDates = evidenceData?.map(e => new Date(e.created_at)) || [];
      const dateRange = evidenceDates.length > 1 ? 
        Math.max(...evidenceDates.map(d => d.getTime())) - Math.min(...evidenceDates.map(d => d.getTime())) : 0;
      
      if (dateRange > 0) {
        patterns.push({
          type: 'temporal_pattern',
          title: 'Rythme de découverte',
          description: `Les preuves ont été découvertes sur une période de ${Math.ceil(dateRange / (1000 * 60 * 60 * 24))} jours`,
          significance: dateRange < 7 * 24 * 60 * 60 * 1000 ? 'high' : 'medium' // Moins d'une semaine = haute significance
        });
      }

      // Pattern de validation
      const validationRates = evidenceData?.reduce((acc, e) => {
        acc[e.validation_status] = (acc[e.validation_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const totalEvidence = evidenceData?.length || 0;
      const validatedRate = (validationRates.validated || 0) / totalEvidence;

      if (validatedRate > 0.7) {
        patterns.push({
          type: 'validation_pattern',
          title: 'Taux de validation élevé',
          description: `${Math.round(validatedRate * 100)}% des preuves sont validées, indiquant une qualité élevée`,
          significance: 'high'
        });
      }

      return { success: true, data: patterns };
    } catch (error) {
      console.error('Error detecting patterns:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};
