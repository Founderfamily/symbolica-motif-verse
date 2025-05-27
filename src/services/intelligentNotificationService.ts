
import { supabase } from '@/integrations/supabase/client';

export interface IntelligentNotification {
  id: string;
  type: 'discovery' | 'analysis_complete' | 'collaboration_invite' | 'system_alert' | 'cultural_insight';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  data: any;
  created_at: Date;
  read: boolean;
  action_required: boolean;
  related_symbols: string[];
  user_id: string;
}

export interface NotificationPreferences {
  discoveries: boolean;
  analysis_completion: boolean;
  collaboration_requests: boolean;
  system_alerts: boolean;
  cultural_insights: boolean;
  delivery_method: 'push' | 'email' | 'both';
  quiet_hours: { start: string; end: string };
}

export interface AIInsight {
  type: 'pattern_discovered' | 'cultural_connection' | 'temporal_trend' | 'anomaly_detected';
  confidence: number;
  description: string;
  impact: 'low' | 'medium' | 'high';
  symbols_involved: string[];
  suggested_actions: string[];
}

export const intelligentNotificationService = {
  /**
   * Génère des notifications intelligentes basées sur l'IA
   */
  generateAINotifications: async (userId: string): Promise<IntelligentNotification[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-notification-generator', {
        body: {
          userId,
          analysisType: 'smart_notifications',
          features: [
            'pattern_recognition',
            'cultural_analysis',
            'collaboration_opportunities',
            'research_suggestions'
          ]
        }
      });

      if (error) throw error;

      return data.notifications?.map((notif: any) => ({
        id: `notif_${Date.now()}_${Math.random()}`,
        type: notif.type || 'cultural_insight',
        priority: notif.priority || 'medium',
        title: notif.title || 'Nouvelle découverte',
        message: notif.message || 'Une nouvelle analyse est disponible',
        data: notif.data || {},
        created_at: new Date(),
        read: false,
        action_required: notif.action_required || false,
        related_symbols: notif.symbols || [],
        user_id: userId
      })) || [];
    } catch (error) {
      console.error('Error generating AI notifications:', error);
      return [];
    }
  },

  /**
   * Analyse les patterns et génère des insights
   */
  analyzeAndNotify: async (userId: string, recentAnalyses: any[]): Promise<AIInsight[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-insight-analyzer', {
        body: {
          userId,
          analyses: recentAnalyses,
          lookback_days: 7,
          insight_types: [
            'cross_cultural_patterns',
            'temporal_anomalies',
            'similarity_clusters',
            'research_opportunities'
          ]
        }
      });

      if (error) throw error;

      return data.insights?.map((insight: any) => ({
        type: insight.type || 'pattern_discovered',
        confidence: insight.confidence || 0.75,
        description: insight.description || 'Pattern détecté dans vos analyses récentes',
        impact: insight.impact || 'medium',
        symbols_involved: insight.symbols || [],
        suggested_actions: insight.actions || [
          'Approfondir l\'analyse comparative',
          'Explorer les connexions culturelles',
          'Collaborer avec des experts'
        ]
      })) || [];
    } catch (error) {
      console.error('Error analyzing insights:', error);
      return [];
    }
  },

  /**
   * Système de recommandations personnalisées
   */
  getPersonalizedRecommendations: async (userId: string): Promise<any> => {
    try {
      const { data: userActivity } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      const { data, error } = await supabase.functions.invoke('personalized-recommendations', {
        body: {
          userId,
          userActivity: userActivity || [],
          recommendation_types: [
            'similar_symbols',
            'cultural_exploration',
            'temporal_analysis',
            'collaboration_opportunities',
            'learning_paths'
          ]
        }
      });

      if (error) throw error;

      return {
        symbol_recommendations: data.symbols || [],
        cultural_paths: data.cultural_paths || [],
        learning_opportunities: data.learning || [],
        collaboration_matches: data.collaborations || [],
        research_directions: data.research || []
      };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return {
        symbol_recommendations: [],
        cultural_paths: [],
        learning_opportunities: [],
        collaboration_matches: [],
        research_directions: []
      };
    }
  },

  /**
   * Détection d'anomalies et alertes intelligentes
   */
  detectAnomaliesAndAlert: async (systemMetrics: any): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('anomaly-detector', {
        body: {
          metrics: systemMetrics,
          detection_types: [
            'performance_degradation',
            'unusual_patterns',
            'data_inconsistencies',
            'security_anomalies',
            'user_behavior_changes'
          ],
          sensitivity: 'medium'
        }
      });

      if (error) throw error;

      return {
        anomalies_detected: data.anomalies || [],
        severity_levels: data.severities || {},
        recommended_actions: data.actions || [],
        auto_resolved: data.auto_resolved || [],
        requires_attention: data.attention_needed || []
      };
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      return {
        anomalies_detected: [],
        severity_levels: {},
        recommended_actions: [],
        auto_resolved: [],
        requires_attention: []
      };
    }
  },

  /**
   * Optimisation automatique des performances
   */
  autoOptimizePerformance: async (): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('performance-optimizer', {
        body: {
          optimization_targets: [
            'query_performance',
            'cache_efficiency',
            'resource_allocation',
            'user_experience',
            'analysis_speed'
          ],
          auto_apply: true,
          backup_before_changes: true
        }
      });

      if (error) throw error;

      return {
        optimizations_applied: data.applied || [],
        performance_improvements: data.improvements || {},
        rollback_points: data.rollback_points || [],
        monitoring_enabled: data.monitoring || false,
        next_optimization: data.next_run || null
      };
    } catch (error) {
      console.error('Error in auto optimization:', error);
      return {
        optimizations_applied: [],
        performance_improvements: {},
        rollback_points: [],
        monitoring_enabled: false,
        next_optimization: null
      };
    }
  }
};
