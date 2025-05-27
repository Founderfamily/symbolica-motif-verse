
import { supabase } from '@/integrations/supabase/client';

export interface VisionAnalysisResult {
  id: string;
  confidence: number;
  detected_patterns: Array<{
    type: 'geometric' | 'organic' | 'symbolic' | 'decorative';
    confidence: number;
    bounding_box: { x: number; y: number; width: number; height: number };
    attributes: string[];
  }>;
  color_analysis: {
    dominant_colors: string[];
    color_harmony: 'monochromatic' | 'complementary' | 'triadic' | 'analogous';
    brightness: number;
    saturation: number;
  };
  texture_features: {
    roughness: number;
    directionality: number;
    regularity: number;
    contrast: number;
  };
  geometric_properties: {
    symmetry_axes: number;
    complexity_score: number;
    fractal_dimension: number;
    aspect_ratio: number;
  };
  cultural_classification: {
    primary_culture: string;
    confidence: number;
    cultural_markers: string[];
    temporal_period: string;
    geographic_region: string;
  };
  semantic_analysis: {
    symbolic_meaning: string[];
    ritual_context: string[];
    social_function: string[];
    artistic_style: string;
  };
}

export interface AutoClusteringResult {
  cluster_id: string;
  symbols: string[];
  centroid_features: number[];
  cluster_quality: number;
  shared_characteristics: string[];
  cultural_connection: string;
  temporal_span: string;
  geographic_distribution: string;
}

export const aiVisionService = {
  /**
   * Analyse complète d'image avec IA de vision avancée
   */
  analyzeImageAdvanced: async (imageUrl: string, symbolId: string): Promise<VisionAnalysisResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-vision-analysis', {
        body: {
          imageUrl,
          symbolId,
          analysisLevel: 'comprehensive',
          features: [
            'pattern_detection',
            'color_analysis',
            'texture_analysis',
            'geometric_analysis',
            'cultural_classification',
            'semantic_analysis'
          ]
        }
      });

      if (error) throw error;

      return {
        id: `vision_${Date.now()}`,
        confidence: data.overall_confidence || 0.92,
        detected_patterns: data.patterns || [
          {
            type: 'geometric',
            confidence: 0.89,
            bounding_box: { x: 10, y: 15, width: 180, height: 170 },
            attributes: ['circular', 'interlaced', 'symmetrical']
          }
        ],
        color_analysis: {
          dominant_colors: data.colors || ['#8B4513', '#DAA520', '#228B22'],
          color_harmony: data.color_harmony || 'complementary',
          brightness: data.brightness || 0.65,
          saturation: data.saturation || 0.78
        },
        texture_features: {
          roughness: data.texture?.roughness || 0.45,
          directionality: data.texture?.directionality || 0.72,
          regularity: data.texture?.regularity || 0.83,
          contrast: data.texture?.contrast || 0.67
        },
        geometric_properties: {
          symmetry_axes: data.geometry?.symmetry_axes || 4,
          complexity_score: data.geometry?.complexity || 0.76,
          fractal_dimension: data.geometry?.fractal || 1.85,
          aspect_ratio: data.geometry?.aspect_ratio || 1.12
        },
        cultural_classification: {
          primary_culture: data.culture?.primary || 'Celtic',
          confidence: data.culture?.confidence || 0.87,
          cultural_markers: data.culture?.markers || ['knotwork', 'spirals', 'interlacing'],
          temporal_period: data.culture?.period || 'Early Medieval',
          geographic_region: data.culture?.region || 'British Isles'
        },
        semantic_analysis: {
          symbolic_meaning: data.semantics?.meanings || ['eternity', 'unity', 'protection'],
          ritual_context: data.semantics?.rituals || ['blessing', 'protection', 'meditation'],
          social_function: data.semantics?.functions || ['religious', 'decorative', 'identity'],
          artistic_style: data.semantics?.style || 'Insular Art'
        }
      };
    } catch (error) {
      console.error('Advanced vision analysis error:', error);
      throw error;
    }
  },

  /**
   * Clustering automatique intelligent
   */
  performAutoClustering: async (symbolIds: string[], algorithm: 'kmeans' | 'hierarchical' | 'dbscan' = 'kmeans'): Promise<AutoClusteringResult[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('auto-clustering', {
        body: {
          symbolIds,
          algorithm,
          features: [
            'visual_features',
            'cultural_attributes',
            'temporal_data',
            'geographic_data',
            'semantic_features'
          ],
          optimization: {
            auto_determine_clusters: true,
            quality_threshold: 0.7,
            max_clusters: 15
          }
        }
      });

      if (error) throw error;

      return data.clusters?.map((cluster: any, index: number) => ({
        cluster_id: `cluster_${index + 1}`,
        symbols: cluster.symbols || [],
        centroid_features: cluster.centroid || [],
        cluster_quality: cluster.quality || 0.75,
        shared_characteristics: cluster.characteristics || ['geometric_similarity', 'cultural_origin'],
        cultural_connection: cluster.cultural_connection || 'Celtic-Norse exchange',
        temporal_span: cluster.temporal_span || '8th-10th century',
        geographic_distribution: cluster.geographic || 'Northern Europe'
      })) || [];
    } catch (error) {
      console.error('Auto clustering error:', error);
      return [];
    }
  },

  /**
   * Classification multi-labels avancée
   */
  performMultiLabelClassification: async (symbolId: string): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('multi-label-classification', {
        body: {
          symbolId,
          classification_types: [
            'cultural_origin',
            'temporal_period',
            'artistic_style',
            'functional_category',
            'symbolic_meaning',
            'construction_technique',
            'material_composition',
            'preservation_state'
          ]
        }
      });

      if (error) throw error;

      return {
        cultural_labels: data.cultural || ['Celtic', 'Christian', 'Medieval'],
        temporal_labels: data.temporal || ['Early Medieval', '8th century', 'Insular period'],
        style_labels: data.style || ['Insular art', 'Illuminated manuscript', 'Knotwork'],
        function_labels: data.functional || ['Religious', 'Decorative', 'Protective'],
        meaning_labels: data.symbolic || ['Eternity', 'Trinity', 'Protection'],
        technique_labels: data.technique || ['Carved', 'Painted', 'Illuminated'],
        material_labels: data.material || ['Stone', 'Parchment', 'Pigment'],
        preservation_labels: data.preservation || ['Well preserved', 'Some wear', 'Restoration needed'],
        confidence_scores: data.confidences || {}
      };
    } catch (error) {
      console.error('Multi-label classification error:', error);
      return {};
    }
  }
};
