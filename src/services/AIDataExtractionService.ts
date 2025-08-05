import { supabase } from '@/integrations/supabase/client';

export interface AIExtractedData {
  theories: AITheory[];
  sources: AISource[];
  connections: AIConnection[];
  historicalFigures: AIHistoricalFigure[];
  locations: AILocation[];
  insights: AIInsight[];
}

export interface AITheory {
  id: string;
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  evidence: string[];
  category: 'historical' | 'cultural' | 'geographical' | 'archaeological';
}

export interface AISource {
  id: string;
  title: string;
  author?: string;
  date?: string;
  url?: string;
  excerpt: string;
  relevance: number;
  type: 'document' | 'book' | 'article' | 'archive';
}

export interface AIConnection {
  id: string;
  fromEntity: string;
  toEntity: string;
  relationshipType: string;
  strength: number;
  description: string;
  evidence: string[];
}

export interface AIHistoricalFigure {
  id: string;
  name: string;
  period: string;
  role: string;
  relevance: number;
  connections: string[];
  description: string;
  wikipediaUrl?: string;
  imageUrl?: string;
}

export interface AILocation {
  id: string;
  name: string;
  coordinates?: { lat: number; lng: number };
  period: string;
  significance: string;
  confidence: number;
  description: string;
}

export interface AIInsight {
  id: string;
  type: 'discovery' | 'connection' | 'theory' | 'warning';
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  relatedEntities: string[];
}

class AIDataExtractionService {
  /**
   * Extrait et structure les données IA d'une quête, incluant les archives et documents
   */
  async extractAIData(questId: string): Promise<AIExtractedData> {
    try {
      const extractedData: AIExtractedData = {
        theories: [],
        sources: [],
        connections: [],
        historicalFigures: [],
        locations: [],
        insights: []
      };

      // 1. Récupérer les investigations IA
      const { data: investigations, error: investigationError } = await supabase
        .from('ai_investigations')
        .select('*')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false });

      if (investigationError) throw investigationError;

      investigations?.forEach(investigation => {
        if (investigation.result_content) {
          if (typeof investigation.result_content === 'object') {
            this.extractFromJSON(investigation.result_content as any, investigation.created_at, extractedData);
          } else if (typeof investigation.result_content === 'string') {
            this.parseAnalysisResult(investigation.result_content, investigation.created_at, extractedData);
          }
        }
      });

      // 2. Récupérer les archives historiques
      const { data: archives, error: archiveError } = await supabase
        .from('historical_archives')
        .select('*')
        .order('created_at', { ascending: false });

      if (!archiveError && archives) {
        archives.forEach(archive => {
          // Ajouter l'archive comme source
          extractedData.sources.push({
            id: `archive-${archive.id}`,
            title: archive.title,
            author: archive.author,
            date: archive.date,
            url: archive.archive_link || archive.document_url,
            excerpt: archive.description || '',
            relevance: 0.8,
            type: 'archive'
          });

          // Extraire les personnages historiques des archives
          const archiveText = `${archive.title} ${archive.description || ''} ${archive.author || ''}`;
          this.extractHistoricalFigures(archiveText, archive.created_at || '', extractedData, 'archive');
        });
      }

      // 3. Récupérer les documents de quête
      const { data: questDocuments, error: documentError } = await supabase
        .from('quest_documents')
        .select('*')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false });

      if (!documentError && questDocuments) {
        questDocuments.forEach(doc => {
          // Ajouter le document comme source
          extractedData.sources.push({
            id: `quest-doc-${doc.id}`,
            title: doc.title,
            author: doc.author,
            date: doc.date_created,
            url: doc.document_url,
            excerpt: doc.description || '',
            relevance: 0.9,
            type: 'document'
          });

          // Extraire les personnages historiques des documents
          const documentText = `${doc.title} ${doc.description || ''} ${doc.author || ''}`;
          this.extractHistoricalFigures(documentText, doc.created_at || '', extractedData, 'document');
        });
      }

      return extractedData;
    } catch (error) {
      console.error('Erreur lors de l\'extraction des données IA:', error);
      return {
        theories: [],
        sources: [],
        connections: [],
        historicalFigures: [],
        locations: [],
        insights: []
      };
    }
  }

  /**
   * Parse le contenu JSON d'une analyse pour extraire des données structurées
   */
  private parseAnalysisResult(analysisText: string, timestamp: string, extractedData: AIExtractedData) {
    try {
      // Essayer de parser le JSON first
      const jsonData = JSON.parse(analysisText);
      
      if (jsonData && typeof jsonData === 'object') {
        this.extractFromJSON(jsonData, timestamp, extractedData);
        return;
      }
    } catch (e) {
      // Si ce n'est pas du JSON valide, utiliser l'ancien parsing texte
    }

    // Fallback sur l'ancien parsing textuel
    const text = analysisText.toLowerCase();
    this.extractHistoricalFigures(analysisText, timestamp, extractedData);
    this.extractLocations(analysisText, timestamp, extractedData);
    this.extractTheories(analysisText, timestamp, extractedData);
    this.extractSources(analysisText, timestamp, extractedData);
    this.extractConnections(analysisText, timestamp, extractedData);
    this.generateInsights(analysisText, timestamp, extractedData);
  }

  /**
   * Extrait les données depuis la structure JSON réelle
   */
  private extractFromJSON(data: any, timestamp: string, extractedData: AIExtractedData) {
    // Extraire le titre de la quête
    if (data.quest_title) {
      extractedData.theories.push({
        id: `quest-title-${timestamp}`,
        title: data.quest_title,
        description: data.quest_title,
        confidence: 1.0,
        timestamp,
        evidence: [],
        category: 'historical'
      });
    }

    // Extraire l'analyse de l'investigation et en extraire les personnages historiques
    if (data.investigation) {
      extractedData.insights.push({
        id: `investigation-${timestamp}`,
        type: 'discovery',
        title: 'Analyse détaillée',
        description: data.investigation,
        confidence: 0.9,
        timestamp,
        relatedEntities: []
      });

      // Extraire les personnages historiques mentionnés dans l'analyse
      this.extractHistoricalFigures(data.investigation, timestamp, extractedData);
    }

    // Extraire des données du quest_data si disponible
    if (data.quest_data) {
      // Extraire le titre du quest_data aussi
      if (data.quest_data.title) {
        const questTitle = data.quest_data.title;
        // Extraire les personnages historiques du titre
        this.extractHistoricalFigures(questTitle, timestamp, extractedData);
        
        // Extraire des indices si disponibles
        if (data.quest_data.clues && Array.isArray(data.quest_data.clues)) {
          data.quest_data.clues.forEach((clue: any) => {
            if (clue.title && clue.description) {
              this.extractHistoricalFigures(`${clue.title} ${clue.description}`, timestamp, extractedData);
            }
          });
        }
      }
    }

    // Extraire les preuves utilisées (evidence_used au lieu de submitted_proofs)
    if (data.evidence_used && Array.isArray(data.evidence_used)) {
      data.evidence_used.forEach((evidence: any, index: number) => {
        if (evidence.title && evidence.description) {
          extractedData.sources.push({
            id: `evidence-${timestamp}-${index}`,
            title: evidence.title,
            excerpt: evidence.description,
            relevance: 0.9,
            type: 'document',
            date: evidence.period || evidence.date
          });
          
          // Extraire les personnages historiques des preuves
          this.extractHistoricalFigures(`${evidence.title} ${evidence.description}`, timestamp, extractedData);
        }
      });
    }

    // Extraire les connexions historiques
    if (data.historical_connections && Array.isArray(data.historical_connections)) {
      data.historical_connections.forEach((connection: any, index: number) => {
        // Ajouter les personnages historiques
        if (connection.figure && connection.period) {
          const existingFigure = extractedData.historicalFigures.find(f => f.name === connection.figure);
          if (!existingFigure) {
            extractedData.historicalFigures.push({
              id: `figure-${connection.figure.replace(/\s+/g, '-').toLowerCase()}`,
              name: connection.figure,
              period: connection.period,
              role: connection.role || 'Personnage historique',
              relevance: 0.9,
              connections: [],
              description: connection.significance || `Personnage lié à ${data.quest_title || 'cette quête'}`
            });
          }
        }

        // Ajouter les lieux
        if (connection.location) {
          const existingLocation = extractedData.locations.find(l => l.name === connection.location);
          if (!existingLocation) {
            extractedData.locations.push({
              id: `location-${connection.location.replace(/\s+/g, '-').toLowerCase()}`,
              name: connection.location,
              period: connection.period || 'Historique',
              significance: connection.significance || 'Lieu d\'intérêt historique',
              confidence: 0.8,
              description: connection.significance || `Lieu lié à ${connection.figure || 'cette investigation'}`
            });
          }
        }

        // Ajouter la connexion elle-même
        if (connection.figure && connection.location) {
          extractedData.connections.push({
            id: `connection-${timestamp}-${index}`,
            fromEntity: connection.figure,
            toEntity: connection.location,
            relationshipType: 'historical_link',
            strength: 0.8,
            description: connection.significance || `Connexion entre ${connection.figure} et ${connection.location}`,
            evidence: [connection.significance || '']
          });
        }
      });
    }

    // Extraire les artefacts et objets
    if (data.submitted_proofs) {
      data.submitted_proofs.forEach((proof: any, index: number) => {
        if (proof.type && proof.type.includes('Fragment')) {
          extractedData.theories.push({
            id: `artifact-${timestamp}-${index}`,
            title: proof.type,
            description: proof.description || 'Artefact historique identifié',
            confidence: 0.7,
            timestamp,
            evidence: [proof.description || ''],
            category: 'archaeological'
          });
        }
      });
    }
  }

  private extractHistoricalFigures(text: string, timestamp: string, data: AIExtractedData, source?: string) {
    const figurePatterns = [
      { name: 'François Ier', pattern: /françois\s*i(er)?/gi, period: 'Renaissance', role: 'Roi de France' },
      { name: 'Napoléon Bonaparte', pattern: /napoléon/gi, period: 'Empire', role: 'Empereur' },
      { name: 'Louis XIV', pattern: /louis\s*xiv/gi, period: 'Ancien Régime', role: 'Roi-Soleil' },
      { name: 'Catherine de Médicis', pattern: /catherine\s*de\s*médicis/gi, period: 'Renaissance', role: 'Reine de France' },
      { name: 'Cardinal de Richelieu', pattern: /richelieu/gi, period: 'XVIIe siècle', role: 'Cardinal' },
      { name: 'Pierre Bontemps', pattern: /pierre\s*bontemps/gi, period: 'Renaissance', role: 'Architecte royal' },
      { name: 'Henri II', pattern: /henri\s*ii/gi, period: 'Renaissance', role: 'Roi de France' },
      { name: 'Henri IV', pattern: /henri\s*iv/gi, period: 'Renaissance', role: 'Roi de France' },
      { name: 'Marie-Antoinette', pattern: /marie[-\s]*antoinette/gi, period: 'XVIIIe siècle', role: 'Reine de France' },
      { name: 'Louis XVI', pattern: /louis\s*xvi/gi, period: 'XVIIIe siècle', role: 'Roi de France' }
    ];

    figurePatterns.forEach(({ name, pattern, period, role }) => {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const existing = data.historicalFigures.find(f => f.name === name);
        if (!existing) {
          data.historicalFigures.push({
            id: `figure-${name.replace(/\s+/g, '-').toLowerCase()}`,
            name,
            period,
            role,
            relevance: matches.length * 0.2,
            connections: [],
            description: `Personnage historique mentionné ${matches.length} fois dans ${source || 'l\'analyse'}`
          });
        }
      }
    });
  }

  private extractLocations(text: string, timestamp: string, data: AIExtractedData) {
    const locationPatterns = [
      { name: 'Château de Fontainebleau', pattern: /fontainebleau/gi, coords: { lat: 48.4024, lng: 2.7002 } },
      { name: 'Louvre', pattern: /louvre/gi, coords: { lat: 48.8606, lng: 2.3376 } },
      { name: 'Versailles', pattern: /versailles/gi, coords: { lat: 48.8049, lng: 2.1204 } },
      { name: 'Château de Chambord', pattern: /chambord/gi, coords: { lat: 47.6161, lng: 1.5167 } },
      { name: 'Paris', pattern: /paris/gi, coords: { lat: 48.8566, lng: 2.3522 } }
    ];

    locationPatterns.forEach(({ name, pattern, coords }) => {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const existing = data.locations.find(l => l.name === name);
        if (!existing) {
          data.locations.push({
            id: `location-${name.replace(/\s+/g, '-').toLowerCase()}`,
            name,
            coordinates: coords,
            period: 'Historique',
            significance: `Lieu mentionné ${matches.length} fois dans l'analyse IA`,
            confidence: Math.min(matches.length * 0.3, 1),
            description: `Localisation identifiée par l'analyse IA`
          });
        }
      }
    });
  }

  private extractTheories(text: string, timestamp: string, data: AIExtractedData) {
    // Recherche de sections de théories dans le texte
    const theoryIndicators = [
      'théorie', 'hypothèse', 'supposer', 'pourrait être', 'il est possible', 
      'suggère que', 'indique que', 'laisse penser'
    ];

    const sentences = text.split(/[.!?]+/);
    sentences.forEach((sentence, index) => {
      const hasTheoryIndicator = theoryIndicators.some(indicator => 
        sentence.toLowerCase().includes(indicator)
      );

      if (hasTheoryIndicator && sentence.length > 50) {
        data.theories.push({
          id: `theory-${Date.now()}-${index}`,
          title: `Théorie IA #${data.theories.length + 1}`,
          description: sentence.trim(),
          confidence: 0.7,
          timestamp,
          evidence: [],
          category: 'historical'
        });
      }
    });
  }

  private extractSources(text: string, timestamp: string, data: AIExtractedData) {
    // Recherche de références à des sources
    const sourcePatterns = [
      /selon\s+(.+?)(?=,|\.|$)/gi,
      /d'après\s+(.+?)(?=,|\.|$)/gi,
      /source:?\s*(.+?)(?=,|\.|$)/gi,
      /référence:?\s*(.+?)(?=,|\.|$)/gi
    ];

    sourcePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach((match, index) => {
        if (match[1] && match[1].length > 10) {
          data.sources.push({
            id: `source-${Date.now()}-${index}`,
            title: match[1].trim(),
            excerpt: match[0],
            relevance: 0.8,
            type: 'document'
          });
        }
      });
    });
  }

  private extractConnections(text: string, timestamp: string, data: AIExtractedData) {
    // Recherche de mots de liaison indiquant des connexions
    const connectionWords = [
      'lié à', 'connecté à', 'en relation avec', 'associé à', 
      'correspond à', 'rappelle', 'évoque', 'similaire à'
    ];

    connectionWords.forEach(connectionWord => {
      const pattern = new RegExp(`(.+?)\\s+${connectionWord}\\s+(.+?)(?=,|\\.|$)`, 'gi');
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach((match, index) => {
        if (match[1] && match[2]) {
          data.connections.push({
            id: `connection-${Date.now()}-${index}`,
            fromEntity: match[1].trim(),
            toEntity: match[2].trim(),
            relationshipType: connectionWord,
            strength: 0.6,
            description: match[0],
            evidence: []
          });
        }
      });
    });
  }

  private generateInsights(text: string, timestamp: string, data: AIExtractedData) {
    // Générer des insights basés sur le contenu
    if (data.historicalFigures.length > 0) {
      data.insights.push({
        id: `insight-figures-${Date.now()}`,
        type: 'discovery',
        title: `${data.historicalFigures.length} personnage(s) historique(s) identifié(s)`,
        description: `L'IA a identifié des références à ${data.historicalFigures.map(f => f.name).join(', ')}`,
        confidence: 0.8,
        timestamp,
        relatedEntities: data.historicalFigures.map(f => f.id)
      });
    }

    if (data.locations.length > 0) {
      data.insights.push({
        id: `insight-locations-${Date.now()}`,
        type: 'discovery',
        title: `${data.locations.length} lieu(x) d'intérêt identifié(s)`,
        description: `L'IA a identifié des références géographiques importantes`,
        confidence: 0.7,
        timestamp,
        relatedEntities: data.locations.map(l => l.id)
      });
    }

    if (data.connections.length > 2) {
      data.insights.push({
        id: `insight-connections-${Date.now()}`,
        type: 'connection',
        title: 'Réseau de connexions détecté',
        description: `L'IA a identifié ${data.connections.length} connexions potentielles entre les éléments`,
        confidence: 0.6,
        timestamp,
        relatedEntities: data.connections.map(c => c.id)
      });
    }
  }

  /**
   * Obtient les données IA les plus récentes pour une quête
   */
  async getLatestAIInsights(questId: string, limit: number = 10): Promise<AIInsight[]> {
    const data = await this.extractAIData(questId);
    return data.insights
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Obtient les personnages historiques identifiés
   */
  async getHistoricalFigures(questId: string): Promise<AIHistoricalFigure[]> {
    const figures: AIHistoricalFigure[] = [];
    
    // 1. Récupérer les figures de la table historical_figures_metadata (données réelles vérifiées)
    const { data: metadataFigures, error: metadataError } = await supabase
      .from('historical_figures_metadata')
      .select('*')
      .eq('quest_id', questId)
      .eq('status', 'verified');

    if (!metadataError && metadataFigures) {
      metadataFigures.forEach(figure => {
        figures.push({
          id: `metadata-${figure.id}`,
          name: figure.figure_name,
          period: figure.figure_period,
          role: figure.figure_role,
          relevance: 0.9, // Haute relevance pour les données vérifiées
          connections: [],
          description: figure.description || `Personnage historique vérifié`,
          wikipediaUrl: figure.wikipedia_url,
          imageUrl: figure.image_url
        });
      });
    }

    // 2. Récupérer les figures des investigations IA (si elles n'existent pas déjà)
    const { data: investigations, error: investigationError } = await supabase
      .from('ai_investigations')
      .select('result_content')
      .eq('quest_id', questId)
      .not('result_content', 'is', null);

    if (!investigationError && investigations) {
      investigations.forEach((investigation, index) => {
        if (investigation.result_content && typeof investigation.result_content === 'object') {
          const content = investigation.result_content as any;
          if (content.historical_figures && Array.isArray(content.historical_figures)) {
            content.historical_figures.forEach((figure: any) => {
              if (figure.name && figure.period && figure.role) {
                // Vérifier si cette figure n'existe pas déjà dans les métadonnées
                const existingFigure = figures.find(f => f.name === figure.name);
                if (!existingFigure) {
                  figures.push({
                    id: `ai-figure-${index}-${figure.name.replace(/\s+/g, '-').toLowerCase()}`,
                    name: figure.name,
                    period: figure.period,
                    role: figure.role,
                    relevance: figure.relevance || 0.7,
                    connections: figure.connections || [],
                    description: figure.description || `Personnage historique identifié par l'IA`
                  });
                }
              }
            });
          }
        }
      });
    }

    return figures.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Obtient les lieux d'intérêt identifiés
   */
  async getAILocations(questId: string): Promise<AILocation[]> {
    const data = await this.extractAIData(questId);
    return data.locations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Obtient les connexions identifiées
   */
  async getAIConnections(questId: string): Promise<AIConnection[]> {
    const data = await this.extractAIData(questId);
    return data.connections.sort((a, b) => b.strength - a.strength);
  }

  /**
   * Obtient les théories IA
   */
  async getAITheories(questId: string): Promise<AITheory[]> {
    const data = await this.extractAIData(questId);
    return data.theories.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extrait l'objectif spécifique du trésor depuis les données IA
   */
  async getSpecificTreasureObjective(questId: string): Promise<string> {
    try {
      const { data: investigations, error } = await supabase
        .from('ai_investigations')
        .select('result_content')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !investigations || investigations.length === 0) {
        return 'Découvrir l\'emplacement d\'un trésor historique';
      }

      const latestResult = investigations[0].result_content;
      let content: any;

      try {
        content = typeof latestResult === 'string' ? JSON.parse(latestResult) : latestResult;
      } catch {
        return 'Découvrir l\'emplacement d\'un trésor historique';
      }

      // Extraire les éléments clés pour créer un objectif captivant
      const questData = content.quest_data || content;
      const storyBackground = questData.story_background || '';
      const evidenceUsed = content.evidence_used || [];
      const clues = questData.clues || [];

      // Identifier les éléments spécifiques dans le story_background
      const hasFragmentKey = storyBackground.includes('fragment') || evidenceUsed.some((e: any) => e.description?.includes('fragment'));
      const hasCode = storyBackground.includes('FONTAINEBLEAU_1814') || storyBackground.includes('code');
      const hasFrancoisI = storyBackground.includes('François Ier') || storyBackground.includes('François I');
      const hasNapoleon = storyBackground.includes('Napoléon');
      const hasSecretCache = storyBackground.includes('cache') || storyBackground.includes('trésor');
      const hasRoyalFortune = storyBackground.includes('fortune') || storyBackground.includes('richesse');

      // Construire un objectif captivant basé sur les vraies données
      if (hasFragmentKey && hasCode && hasFrancoisI && hasNapoleon) {
        return `Découvrir la cache royale secrète contenant la fortune dissimulée par François Ier et Napoléon, en assemblant le fragment de clé royale du XVIe siècle et en déchiffrant le code FONTAINEBLEAU_1814`;
      }

      if (hasSecretCache && hasRoyalFortune && (hasFrancoisI || hasNapoleon)) {
        const rulers = hasFrancoisI && hasNapoleon ? 'François Ier et Napoléon' : hasFrancoisI ? 'François Ier' : 'Napoléon';
        const evidenceCount = evidenceUsed.length;
        const evidenceText = evidenceCount > 0 ? ` en utilisant ${evidenceCount} preuve${evidenceCount > 1 ? 's' : ''} authentifiée${evidenceCount > 1 ? 's' : ''}` : '';
        return `Localiser la fortune royale secrète de ${rulers} cachée dans les passages du Château de Fontainebleau${evidenceText}`;
      }

      if (hasCode && clues.length > 0) {
        const location = clues[0].location || 'Château de Fontainebleau';
        return `Percer le mystère du code FONTAINEBLEAU_1814 et découvrir le trésor caché dans ${location} grâce à ${clues.length} indice${clues.length > 1 ? 's' : ''} localisé${clues.length > 1 ? 's' : ''}`;
      }

      if (evidenceUsed.length > 0 && (hasFrancoisI || hasNapoleon)) {
        const rulers = hasFrancoisI && hasNapoleon ? 'François Ier et Napoléon' : hasFrancoisI ? 'François Ier' : 'Napoléon';
        const firstEvidence = evidenceUsed[0];
        const evidenceName = firstEvidence.title || firstEvidence.description || 'artefact royal';
        return `Assembler les ${evidenceUsed.length} fragment${evidenceUsed.length > 1 ? 's' : ''} découvert${evidenceUsed.length > 1 ? 's' : ''} (${evidenceName}...) pour révéler le trésor de ${rulers}`;
      }

      if (clues.length > 2) {
        const location = clues[0].location || questData.title || 'Château de Fontainebleau';
        return `Explorer les ${clues.length} indices cachés dans ${location} pour reconstituer l'emplacement du trésor légendaire`;
      }

      // Fallback avec les données disponibles
      const title = questData.title || questData.quest_title || '';
      if (title.includes('François') && title.includes('Napoléon')) {
        return `Révéler les secrets partagés entre François Ier et Napoléon dans les passages oubliés de Fontainebleau`;
      }

      return questData.description || title || 'Découvrir l\'emplacement d\'un trésor historique';
    } catch (error) {
      console.error('Error getting specific treasure objective:', error);
      return 'Découvrir l\'emplacement d\'un trésor historique';
    }
  }
}

export const aiDataExtractionService = new AIDataExtractionService();