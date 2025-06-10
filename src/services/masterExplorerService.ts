
import { supabase } from '@/integrations/supabase/client';

export interface MasterExplorerAccount {
  email: string;
  password: string;
  username: string;
  fullName: string;
  questIds?: string[];
}

export interface QuestEnrichment {
  questId: string;
  enrichmentType: 'evidence' | 'document' | 'theory' | 'guidance';
  title: string;
  description?: string;
  sourceUrl?: string;
  credibilityScore?: number;
  isOfficial?: boolean;
  enrichmentData?: any;
}

export const masterExplorerService = {
  /**
   * Créer un compte Master Explorer
   */
  createMasterExplorerAccount: async (accountData: MasterExplorerAccount) => {
    console.log('Creating Master Explorer account:', accountData.email);
    
    try {
      // 1. Créer l'utilisateur via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountData.email,
        password: accountData.password,
        options: {
          data: {
            username: accountData.username,
            full_name: accountData.fullName
          }
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user created');
      }

      console.log('Auth user created:', authData.user.id);

      // 2. Créer/Mettre à jour le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          username: accountData.username,
          full_name: accountData.fullName,
          expertise_areas: ['historical_research', 'archaeology', 'symbology'],
          specialization: 'Master Explorer - Historical Research',
          credentials: 'Expert en recherche historique et symbologie'
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }

      // 3. Assigner le rôle master_explorer
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'master_explorer'
        });

      if (roleError) {
        console.error('Error assigning role:', roleError);
        throw roleError;
      }

      console.log('Master Explorer account created successfully');
      return {
        success: true,
        userId: authData.user.id,
        message: `Compte Master Explorer créé pour ${accountData.email}`
      };

    } catch (error) {
      console.error('Error in createMasterExplorerAccount:', error);
      throw error;
    }
  },

  /**
   * Enrichir une quête avec du contenu expert
   */
  enrichQuest: async (enrichment: QuestEnrichment) => {
    console.log('Enriching quest:', enrichment.questId);

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    try {
      // Utiliser une insertion directe dans la table quest_enrichments
      const { data, error } = await (supabase as any)
        .from('quest_enrichments')
        .insert({
          quest_id: enrichment.questId,
          enriched_by: user.user.id,
          enrichment_type: enrichment.enrichmentType,
          title: enrichment.title,
          description: enrichment.description || null,
          source_url: enrichment.sourceUrl || null,
          credibility_score: enrichment.credibilityScore || 1.0,
          is_official: enrichment.isOfficial || true,
          enrichment_data: enrichment.enrichmentData || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error enriching quest:', error);
        throw error;
      }

      console.log('Quest enriched successfully:', data);
      return data;

    } catch (error) {
      console.error('Error in enrichQuest:', error);
      throw error;
    }
  },

  /**
   * Pré-remplir une quête avec du contenu historique authentique
   */
  prefillQuestWithHistoricalContent: async (questId: string, questType: string) => {
    console.log('Pre-filling quest with historical content:', questId, questType);

    const historicalContent: Record<string, any> = {
      templar: {
        evidence: [
          {
            title: "Archives de l'Ordre du Temple - BnF Ms. Latin 15138",
            description: "Document authentique de 1307 détaillant les possessions templières en France avant la dissolution de l'ordre.",
            sourceUrl: "https://gallica.bnf.fr/ark:/12148/btv1b8422165f",
            enrichmentData: {
              year: "1307",
              location: "Paris, Bibliothèque nationale de France",
              significance: "Inventaire officiel des biens templiers"
            }
          },
          {
            title: "Sceau de Jacques de Molay - Archives Nationales",
            description: "Empreinte du sceau du dernier Grand Maître de l'Ordre du Temple, conservée aux Archives Nationales.",
            sourceUrl: "https://www.archives-nationales.culture.gouv.fr/",
            enrichmentData: {
              period: "1292-1314",
              location: "Archives Nationales, Paris",
              significance: "Authentification de documents officiels"
            }
          }
        ],
        documents: [
          {
            title: "Bulle papale 'Pastoralis praeeminentiae' - 1307",
            description: "Document papal ordonnant l'arrestation des Templiers dans toute la chrétienté.",
            sourceUrl: "https://www.vatican.va/content/vatican/fr.html",
            enrichmentData: {
              date: "22 novembre 1307",
              author: "Pape Clément V",
              impact: "Début de la chute de l'Ordre du Temple"
            }
          }
        ],
        guidance: [
          {
            title: "Méthodologie de recherche historique",
            description: "Pour authentifier les sources templières, vérifiez la provenance, la datation paléographique et croisez avec les chroniques contemporaines.",
            enrichmentData: {
              sources_primary: ["Chroniques de Guillaume de Nangis", "Continuateur de Guillaume de Tyr"],
              sources_secondary: ["Archives du Vatican", "Bibliothèque nationale de France"],
              methodology: "Critique historique et analyse diplomatique"
            }
          }
        ]
      },
      grail: {
        evidence: [
          {
            title: "Perceval ou le Conte du Graal - Chrétien de Troyes (1180)",
            description: "Premier récit littéraire mentionnant le Graal, manuscrit conservé à la Bibliothèque nationale.",
            sourceUrl: "https://gallica.bnf.fr/",
            enrichmentData: {
              manuscript: "BnF Ms. français 794",
              period: "XIIe siècle",
              significance: "Première mention littéraire du Graal"
            }
          }
        ],
        documents: [
          {
            title: "Queste del Saint Graal - Manuscrit enluminé XIIIe",
            description: "Cycle arthurien en prose décrivant la quête spirituelle du Graal.",
            sourceUrl: "https://gallica.bnf.fr/",
            enrichmentData: {
              period: "1215-1230",
              style: "Prose française médiévale",
              theme: "Quête mystique et chevaleresque"
            }
          }
        ]
      },
      lost_civilization: {
        evidence: [
          {
            title: "Codex de Dresde - Écriture maya classique",
            description: "Manuscrit maya pré-colombien authentique, l'un des quatre codex mayas survivants.",
            sourceUrl: "https://digital.slub-dresden.de/",
            enrichmentData: {
              period: "XIe-XIIe siècle",
              location: "Bibliothèque d'État de Dresde",
              content: "Astronomie, divination, rituels"
            }
          }
        ],
        documents: [
          {
            title: "Relation de Diego de Landa - 1566",
            description: "Chronique espagnole décrivant la civilisation maya du Yucatan.",
            sourceUrl: "https://archive.org/",
            enrichmentData: {
              author: "Fray Diego de Landa",
              significance: "Témoignage direct de la conquête espagnole",
              content: "Description des coutumes et écritures mayas"
            }
          }
        ]
      }
    };

    const contentToAdd = historicalContent[questType];
    if (!contentToAdd) {
      console.warn('No historical content available for quest type:', questType);
      return;
    }

    const enrichments = [];

    // Ajouter les preuves
    if (contentToAdd.evidence && Array.isArray(contentToAdd.evidence)) {
      for (const evidence of contentToAdd.evidence) {
        enrichments.push(this.enrichQuest({
          questId,
          enrichmentType: 'evidence',
          ...evidence
        }));
      }
    }

    // Ajouter les documents
    if (contentToAdd.documents && Array.isArray(contentToAdd.documents)) {
      for (const document of contentToAdd.documents) {
        enrichments.push(this.enrichQuest({
          questId,
          enrichmentType: 'document',
          ...document
        }));
      }
    }

    // Ajouter les guidances
    if (contentToAdd.guidance && Array.isArray(contentToAdd.guidance)) {
      for (const guidance of contentToAdd.guidance) {
        enrichments.push(this.enrichQuest({
          questId,
          enrichmentType: 'guidance',
          ...guidance
        }));
      }
    }

    try {
      const results = await Promise.all(enrichments);
      console.log('Quest pre-filled with historical content:', results.length, 'items added');
      return results;
    } catch (error) {
      console.error('Error pre-filling quest:', error);
      throw error;
    }
  },

  /**
   * Obtenir les enrichissements d'une quête
   */
  getQuestEnrichments: async (questId: string) => {
    try {
      // Essayer d'abord avec une requête directe
      const { data, error } = await (supabase as any)
        .from('quest_enrichments')
        .select(`
          *,
          enricher:profiles!enriched_by(username, full_name)
        `)
        .eq('quest_id', questId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quest enrichments:', error);
        // Retourner un tableau vide en cas d'erreur
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestEnrichments:', error);
      return [];
    }
  },

  /**
   * Vérifier si l'utilisateur est un Master Explorer
   */
  isMasterExplorer: async (userId?: string) => {
    const { data: user } = await supabase.auth.getUser();
    const targetUserId = userId || user.user?.id;
    
    if (!targetUserId) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', targetUserId)
      .eq('role', 'master_explorer')
      .single();

    return !error && !!data;
  }
};
