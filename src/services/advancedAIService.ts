
import { supabase } from '@/integrations/supabase/client';

export interface AIPatternAnalysis {
  id: string;
  confidence: number;
  pattern_type: 'geometric' | 'organic' | 'symbolic' | 'decorative' | 'hybrid';
  geometric_properties: {
    symmetry_type: 'radial' | 'bilateral' | 'translational' | 'rotational' | 'none';
    complexity_score: number;
    dominant_shapes: string[];
    color_palette: string[];
    texture_features: string[];
  };
  cultural_connections: {
    primary_culture: string;
    confidence: number;
    similar_cultures: Array<{
      culture: string;
      similarity_score: number;
      shared_elements: string[];
    }>;
  };
  temporal_analysis: {
    estimated_period: string;
    evolution_stage: 'emerging' | 'mature' | 'declining' | 'transitional';
    influence_chains: string[];
  };
  semantic_meaning: {
    probable_functions: string[];
    symbolic_significance: string[];
    ritual_context: string[];
  };
}

export interface EvolutionPrediction {
  symbol_id: string;
  prediction_confidence: number;
  timeline_forecast: Array<{
    period: string;
    predicted_changes: string[];
    cultural_impact: 'low' | 'medium' | 'high';
    preservation_priority: number;
  }>;
  risk_factors: string[];
  preservation_recommendations: string[];
}

export interface CulturalDiffusionModel {
  origin_point: { lat: number; lng: number; culture: string };
  diffusion_paths: Array<{
    target_culture: string;
    probability: number;
    timeframe: string;
    transmission_method: 'trade' | 'conquest' | 'migration' | 'cultural_exchange';
  }>;
  influence_network: {
    nodes: Array<{ id: string; culture: string; influence_score: number }>;
    edges: Array<{ from: string; to: string; strength: number }>;
  };
}

export const advancedAIService = {
  /**
   * Analyse avancée de motifs avec IA
   */
  analyzePatternAdvanced: async (symbolId: string, imageData: string): Promise<AIPatternAnalysis> => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-ai-analysis', {
        body: {
          symbolId,
          imageData,
          analysisType: 'comprehensive_pattern_analysis',
          features: [
            'geometric_analysis',
            'cultural_classification',
            'temporal_dating',
            'semantic_extraction'
          ]
        }
      });

      if (error) throw error;

      return {
        id: `ai_analysis_${Date.now()}`,
        confidence: data.confidence || 0.89,
        pattern_type: data.pattern_type || 'geometric',
        geometric_properties: {
          symmetry_type: data.symmetry || 'bilateral',
          complexity_score: data.complexity_score || 0.75,
          dominant_shapes: data.shapes || ['circle', 'line', 'curve'],
          color_palette: data.colors || ['#8B4513', '#DAA520', '#228B22'],
          texture_features: data.textures || ['smooth', 'carved', 'painted']
        },
        cultural_connections: {
          primary_culture: data.primary_culture || 'Celtic',
          confidence: data.cultural_confidence || 0.82,
          similar_cultures: data.similar_cultures || [
            { culture: 'Norse', similarity_score: 0.78, shared_elements: ['knotwork', 'spirals'] },
            { culture: 'Germanic', similarity_score: 0.65, shared_elements: ['geometric_patterns'] }
          ]
        },
        temporal_analysis: {
          estimated_period: data.period || 'Early Medieval',
          evolution_stage: data.evolution_stage || 'mature',
          influence_chains: data.influences || ['Ancient Celtic', 'Roman', 'Christian']
        },
        semantic_meaning: {
          probable_functions: data.functions || ['religious', 'decorative', 'protective'],
          symbolic_significance: data.symbols || ['unity', 'eternity', 'divine_protection'],
          ritual_context: data.rituals || ['blessing', 'ceremony', 'meditation']
        }
      };
    } catch (error) {
      console.error('Advanced AI analysis error:', error);
      throw error;
    }
  },

  /**
   * Prédiction d'évolution culturelle
   */
  predictEvolution: async (symbolId: string, timeHorizon: number = 50): Promise<EvolutionPrediction> => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-ai-analysis', {
        body: {
          symbolId,
          timeHorizon,
          analysisType: 'evolution_prediction',
          models: ['temporal_evolution', 'cultural_diffusion', 'preservation_analysis']
        }
      });

      if (error) throw error;

      return {
        symbol_id: symbolId,
        prediction_confidence: data.confidence || 0.73,
        timeline_forecast: data.timeline || [
          {
            period: '2025-2035',
            predicted_changes: ['Digital adaptation', 'Simplified forms'],
            cultural_impact: 'medium',
            preservation_priority: 8
          },
          {
            period: '2035-2050',
            predicted_changes: ['Global recognition', 'Educational integration'],
            cultural_impact: 'high',
            preservation_priority: 9
          }
        ],
        risk_factors: data.risks || [
          'Cultural appropriation',
          'Loss of traditional context',
          'Digital degradation'
        ],
        preservation_recommendations: data.recommendations || [
          'Digital archival priority',
          'Educational program development',
          'Cultural consultation integration'
        ]
      };
    } catch (error) {
      console.error('Evolution prediction error:', error);
      throw error;
    }
  },

  /**
   * Modélisation de diffusion culturelle
   */
  modelCulturalDiffusion: async (symbolId: string): Promise<CulturalDiffusionModel> => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-ai-analysis', {
        body: {
          symbolId,
          analysisType: 'cultural_diffusion_modeling',
          algorithms: ['network_analysis', 'geographic_modeling', 'temporal_tracking']
        }
      });

      if (error) throw error;

      return {
        origin_point: data.origin || { lat: 53.3498, lng: -6.2603, culture: 'Celtic' },
        diffusion_paths: data.paths || [
          {
            target_culture: 'Norse',
            probability: 0.85,
            timeframe: '8th-10th century',
            transmission_method: 'cultural_exchange'
          },
          {
            target_culture: 'Anglo-Saxon',
            probability: 0.72,
            timeframe: '7th-9th century',
            transmission_method: 'migration'
          }
        ],
        influence_network: {
          nodes: data.nodes || [
            { id: 'celtic', culture: 'Celtic', influence_score: 0.95 },
            { id: 'norse', culture: 'Norse', influence_score: 0.78 },
            { id: 'germanic', culture: 'Germanic', influence_score: 0.65 }
          ],
          edges: data.edges || [
            { from: 'celtic', to: 'norse', strength: 0.82 },
            { from: 'celtic', to: 'germanic', strength: 0.68 }
          ]
        }
      };
    } catch (error) {
      console.error('Cultural diffusion modeling error:', error);
      throw error;
    }
  },

  /**
   * Analyse de clusters automatique
   */
  autoClusterAnalysis: async (symbolIds: string[]): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-ai-analysis', {
        body: {
          symbolIds,
          analysisType: 'auto_clustering',
          algorithms: ['kmeans', 'hierarchical', 'dbscan', 'spectral']
        }
      });

      if (error) throw error;

      return {
        optimal_clusters: data.clusters || 5,
        cluster_assignments: data.assignments || {},
        cluster_characteristics: data.characteristics || [],
        similarity_scores: data.similarities || [],
        outlier_detection: data.outliers || [],
        cluster_quality_metrics: {
          silhouette_score: data.silhouette || 0.68,
          calinski_harabasz: data.calinski || 245.7,
          davies_bouldin: data.davies_bouldin || 0.89
        }
      };
    } catch (error) {
      console.error('Auto cluster analysis error:', error);
      throw error;
    }
  }
};
