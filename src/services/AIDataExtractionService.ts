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
   * Extrait et structure les données IA d'une quête
   */
  async extractAIData(questId: string): Promise<AIExtractedData> {
    try {
      // Récupérer toutes les investigations IA pour cette quête
      const { data: investigations, error } = await supabase
        .from('ai_investigations')
        .select('*')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const extractedData: AIExtractedData = {
        theories: [],
        sources: [],
        connections: [],
        historicalFigures: [],
        locations: [],
        insights: []
      };

      investigations?.forEach(investigation => {
        if (investigation.result_content) {
          if (typeof investigation.result_content === 'object') {
            // Si c'est déjà un objet JSON, l'utiliser directement
            this.extractFromJSON(investigation.result_content as any, investigation.created_at, extractedData);
          } else if (typeof investigation.result_content === 'string') {
            // Si c'est une string, tenter de parser le JSON ou utiliser le parsing texte
            this.parseAnalysisResult(investigation.result_content, investigation.created_at, extractedData);
          }
        }
      });

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

    // Extraire l'analyse de l'investigation
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

  private extractHistoricalFigures(text: string, timestamp: string, data: AIExtractedData) {
    const figurePatterns = [
      { name: 'François Ier', pattern: /françois\s*i(er)?/gi, period: 'Renaissance', role: 'Roi de France' },
      { name: 'Napoléon Bonaparte', pattern: /napoléon/gi, period: 'Empire', role: 'Empereur' },
      { name: 'Louis XIV', pattern: /louis\s*xiv/gi, period: 'Ancien Régime', role: 'Roi-Soleil' },
      { name: 'Catherine de Médicis', pattern: /catherine\s*de\s*médicis/gi, period: 'Renaissance', role: 'Reine de France' },
      { name: 'Cardinal de Richelieu', pattern: /richelieu/gi, period: 'XVIIe siècle', role: 'Cardinal' }
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
            description: `Personnage historique mentionné ${matches.length} fois dans l'analyse`
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
    const data = await this.extractAIData(questId);
    return data.historicalFigures.sort((a, b) => b.relevance - a.relevance);
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
    const data = await this.extractAIData(questId);
    const defaultObjective = "Découvrir l'emplacement d'un trésor historique";
    
    // Chercher dans les insights pour des mentions spécifiques
    const treasureInsight = data.insights.find(insight => 
      insight.description.toLowerCase().includes('cache') ||
      insight.description.toLowerCase().includes('trésor') ||
      insight.description.toLowerCase().includes('fortune') ||
      insight.description.toLowerCase().includes('royal') ||
      insight.description.toLowerCase().includes('secret')
    );

    if (treasureInsight) {
      const description = treasureInsight.description;
      
      // Extraire les éléments spécifiques
      const cacheMatch = description.match(/cache\s+([^.!?]+)/i);
      const treasureMatch = description.match(/trésor\s+([^.!?]+)/i);
      const fortuneMatch = description.match(/fortune\s+([^.!?]+)/i);
      
      if (cacheMatch) return `Découvrir la cache ${cacheMatch[1].trim()}`;
      if (treasureMatch) return `Découvrir le trésor ${treasureMatch[1].trim()}`;
      if (fortuneMatch) return `Découvrir la fortune ${fortuneMatch[1].trim()}`;
    }

    // Si on a des personnages et lieux, construire un objectif spécifique
    if (data.locations.length > 0 && data.historicalFigures.length > 0) {
      const mainLocation = data.locations[0]?.name || "lieu secret";
      const mainFigure = data.historicalFigures[0]?.name || "personnage historique";
      
      // Construire un objectif spécifique basé sur les données
      if (mainFigure.includes('François') && mainFigure.includes('Napoléon')) {
        return `Découvrir la cache royale de François Ier et Napoléon dans ${mainLocation}`;
      } else if (mainFigure.includes('François')) {
        return `Découvrir les trésors cachés de François Ier dans ${mainLocation}`;
      } else if (mainFigure.includes('Napoléon')) {
        return `Découvrir la fortune secrète de Napoléon dans ${mainLocation}`;
      } else {
        return `Découvrir les trésors cachés de ${mainFigure} dans ${mainLocation}`;
      }
    }

    return defaultObjective;
  }
}

export const aiDataExtractionService = new AIDataExtractionService();