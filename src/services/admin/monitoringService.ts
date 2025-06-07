
import { supabase } from '@/integrations/supabase/client';
import { adminLogsService } from './logsService';

export interface SystemHealth {
  database: 'healthy' | 'warning' | 'critical';
  storage: 'healthy' | 'warning' | 'critical';
  auth: 'healthy' | 'warning' | 'critical';
  overall: 'healthy' | 'warning' | 'critical';
  lastCheck: string;
  issues: string[];
}

export interface PerformanceMetrics {
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  dbConnections: number;
  storageUsage: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  source: string;
  [key: string]: any; // Index signature pour compatibilité Json
}

interface AlertData {
  alert_data: Alert;
}

/**
 * Service de monitoring et d'alertes système
 */
export const monitoringService = {
  /**
   * Vérifie la santé générale du système
   */
  checkSystemHealth: async (): Promise<SystemHealth> => {
    const issues: string[] = [];
    let dbHealth: SystemHealth['database'] = 'healthy';
    let storageHealth: SystemHealth['storage'] = 'healthy';
    let authHealth: SystemHealth['auth'] = 'healthy';

    try {
      // Test de la base de données
      const dbStart = Date.now();
      const { error: dbError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
      
      const dbTime = Date.now() - dbStart;
      
      if (dbError) {
        dbHealth = 'critical';
        issues.push(`Base de données: ${dbError.message}`);
      } else if (dbTime > 2000) {
        dbHealth = 'warning';
        issues.push(`Base de données lente: ${dbTime}ms`);
      }

      // Test de l'authentification
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError && authError.message !== 'Invalid JWT') {
          authHealth = 'warning';
          issues.push(`Auth: ${authError.message}`);
        }
      } catch (error) {
        authHealth = 'critical';
        issues.push(`Auth critique: ${error}`);
      }

      // Test du stockage (simulation)
      try {
        const { data, error: storageError } = await supabase.storage.listBuckets();
        if (storageError) {
          storageHealth = 'warning';
          issues.push(`Stockage: ${storageError.message}`);
        }
      } catch (error) {
        storageHealth = 'warning';
        issues.push(`Stockage inaccessible`);
      }

      const overall: SystemHealth['overall'] = 
        [dbHealth, storageHealth, authHealth].includes('critical') ? 'critical' :
        [dbHealth, storageHealth, authHealth].includes('warning') ? 'warning' : 'healthy';

      const health: SystemHealth = {
        database: dbHealth,
        storage: storageHealth,
        auth: authHealth,
        overall,
        lastCheck: new Date().toISOString(),
        issues
      };

      // Logger si problème détecté
      if (overall !== 'healthy') {
        await adminLogsService.logAction(
          'system',
          'health_check_warning',
          'monitoring',
          undefined,
          health
        );
      }

      return health;
    } catch (error) {
      console.error('Erreur vérification santé:', error);
      return {
        database: 'critical',
        storage: 'critical', 
        auth: 'critical',
        overall: 'critical',
        lastCheck: new Date().toISOString(),
        issues: [`Erreur critique: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  },

  /**
   * Collecte les métriques de performance
   */
  collectMetrics: async (): Promise<PerformanceMetrics> => {
    try {
      const timestamp = new Date().toISOString();
      
      // Mesurer le temps de réponse
      const start = Date.now();
      await supabase.from('profiles').select('count', { count: 'exact', head: true });
      const responseTime = Date.now() - start;

      // Compter les utilisateurs actifs (simulation)
      const { count: activeUsers } = await supabase
        .from('user_activities')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Simuler d'autres métriques (en production, ces valeurs viendraient de vrais services)
      const metrics: PerformanceMetrics = {
        responseTime,
        errorRate: 0.1, // 0.1%
        activeUsers: activeUsers || 0,
        dbConnections: 5, // Simulation
        storageUsage: 45.2, // Pourcentage
        timestamp
      };

      return metrics;
    } catch (error) {
      console.error('Erreur collecte métriques:', error);
      return {
        responseTime: 9999,
        errorRate: 100,
        activeUsers: 0,
        dbConnections: 0,
        storageUsage: 0,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Crée une alerte système
   */
  createAlert: async (
    type: Alert['type'],
    title: string,
    message: string,
    source: string = 'system'
  ): Promise<string> => {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const alert: Alert = {
        id: alertId,
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        resolved: false,
        source
      };

      const alertData: AlertData = { alert_data: alert };

      // Stocker l'alerte
      await supabase
        .from('content_sections')
        .upsert({
          section_key: alertId,
          content: alertData as any
        });

      // Logger l'alerte
      await adminLogsService.logAction(
        'system',
        'create_alert',
        'alert',
        alertId,
        alert
      );

      return alertId;
    } catch (error) {
      console.error('Erreur création alerte:', error);
      return '';
    }
  },

  /**
   * Résout une alerte
   */
  resolveAlert: async (alertId: string): Promise<boolean> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_key', alertId)
        .single();

      if (fetchError || !data) return false;

      const content = data.content as any;
      const alertData = content?.alert_data;
      if (!alertData) return false;

      alertData.resolved = true;
      alertData.resolvedAt = new Date().toISOString();

      const updatedContent: AlertData = { alert_data: alertData };

      const { error: updateError } = await supabase
        .from('content_sections')
        .update({ content: updatedContent as any })
        .eq('section_key', alertId);

      if (updateError) throw updateError;

      await adminLogsService.logAction(
        'system',
        'resolve_alert',
        'alert',
        alertId,
        { resolved_at: alertData.resolvedAt }
      );

      return true;
    } catch (error) {
      console.error('Erreur résolution alerte:', error);
      return false;
    }
  },

  /**
   * Liste les alertes actives
   */
  getActiveAlerts: async (): Promise<Alert[]> => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('section_key, content, created_at')
        .like('section_key', 'alert_%')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data?.map(item => {
        const content = item.content as any;
        return content?.alert_data;
      }).filter(alert => alert && !alert.resolved) || [];
    } catch (error) {
      console.error('Erreur récupération alertes:', error);
      return [];
    }
  },

  /**
   * Vérifie automatiquement les seuils et crée des alertes
   */
  checkThresholds: async (): Promise<void> => {
    try {
      const metrics = await monitoringService.collectMetrics();
      const health = await monitoringService.checkSystemHealth();

      // Vérifier le temps de réponse
      if (metrics.responseTime > 3000) {
        await monitoringService.createAlert(
          'warning',
          'Temps de réponse élevé',
          `Le temps de réponse de la base de données est de ${metrics.responseTime}ms`,
          'performance_monitor'
        );
      }

      // Vérifier les erreurs système
      if (health.overall === 'critical') {
        await monitoringService.createAlert(
          'error',
          'Système critique',
          `Problèmes détectés: ${health.issues.join(', ')}`,
          'health_monitor'
        );
      }

      // Vérifier l'utilisation du stockage
      if (metrics.storageUsage > 80) {
        await monitoringService.createAlert(
          'warning',
          'Stockage saturé',
          `Utilisation du stockage: ${metrics.storageUsage}%`,
          'storage_monitor'
        );
      }
    } catch (error) {
      console.error('Erreur vérification seuils:', error);
    }
  }
};
