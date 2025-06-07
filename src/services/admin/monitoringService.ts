
import { supabase } from '@/integrations/supabase/client';

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  database: 'healthy' | 'warning' | 'critical';
  storage: 'healthy' | 'warning' | 'critical';
  auth: 'healthy' | 'warning' | 'critical';
  lastCheck: string;
  issues: string[];
}

export interface PerformanceMetrics {
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  dbConnections: number;
  storageUsage: number;
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  source: string;
  timestamp: string;
  resolved: boolean;
}

export const monitoringService = {
  async checkSystemHealth(): Promise<SystemHealth> {
    const issues: string[] = [];
    let dbStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    let storageStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    let authStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    try {
      // Test de la base de données
      const { error: dbError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
      
      if (dbError) {
        dbStatus = 'critical';
        issues.push('Connexion à la base de données échouée');
      }
      
      // Test de l'authentification
      const { error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        authStatus = 'warning';
        issues.push('Problème avec le service d\'authentification');
      }
      
      // Simuler des vérifications de stockage
      const storageUsage = Math.random() * 100;
      if (storageUsage > 90) {
        storageStatus = 'critical';
        issues.push('Espace de stockage critique (>90%)');
      } else if (storageUsage > 75) {
        storageStatus = 'warning';
        issues.push('Espace de stockage élevé (>75%)');
      }
      
    } catch (error) {
      issues.push('Erreur lors de la vérification système');
      dbStatus = 'critical';
    }
    
    const overall = issues.length === 0 ? 'healthy' :
                   issues.some(i => i.includes('critique') || dbStatus === 'critical') ? 'critical' : 'warning';
    
    const healthCheck: SystemHealth = {
      overall,
      database: dbStatus,
      storage: storageStatus,
      auth: authStatus,
      lastCheck: new Date().toISOString(),
      issues
    };
    
    // Enregistrer dans la nouvelle table
    await supabase
      .from('system_health_checks')
      .insert({
        overall_status: overall,
        database_status: dbStatus,
        storage_status: storageStatus,
        auth_status: authStatus,
        issues,
        details: {
          checkType: 'automated',
          timestamp: new Date().toISOString()
        }
      });
    
    return healthCheck;
  },

  async collectMetrics(): Promise<PerformanceMetrics> {
    try {
      // Simuler la collecte de métriques réelles
      const responseTime = Math.floor(Math.random() * 500) + 100;
      const errorRate = Math.random() * 5;
      const activeUsers = Math.floor(Math.random() * 100) + 10;
      const dbConnections = Math.floor(Math.random() * 50) + 5;
      const storageUsage = Math.floor(Math.random() * 80) + 10;
      
      const metrics: PerformanceMetrics = {
        responseTime,
        errorRate: Number(errorRate.toFixed(2)),
        activeUsers,
        dbConnections,
        storageUsage
      };
      
      // Enregistrer dans la nouvelle table
      await supabase
        .from('system_metrics')
        .insert({
          metric_type: 'performance',
          values: metrics
        });
      
      return metrics;
      
    } catch (error) {
      console.error('Erreur collecte métriques:', error);
      
      return {
        responseTime: 0,
        errorRate: 0,
        activeUsers: 0,
        dbConnections: 0,
        storageUsage: 0
      };
    }
  },

  async createAlert(type: 'error' | 'warning' | 'info', title: string, message: string, source: string = 'system'): Promise<void> {
    try {
      const alertKey = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await supabase
        .from('system_alerts')
        .insert({
          alert_key: alertKey,
          type,
          title,
          message,
          source,
          metadata: {
            createdBy: 'monitoring_service',
            timestamp: new Date().toISOString()
          }
        });
      
    } catch (error) {
      console.error('Erreur création alerte:', error);
    }
  },

  async getActiveAlerts(): Promise<Alert[]> {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Erreur récupération alertes:', error);
        return [];
      }
      
      return (data || []).map(alert => ({
        id: alert.id,
        type: alert.type as 'error' | 'warning' | 'info',
        title: alert.title,
        message: alert.message,
        source: alert.source,
        timestamp: alert.created_at,
        resolved: alert.resolved
      }));
      
    } catch (error) {
      console.error('Exception récupération alertes:', error);
      return [];
    }
  },

  async resolveAlert(alertId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);
      
      if (error) {
        console.error('Erreur résolution alerte:', error);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('Exception résolution alerte:', error);
      return false;
    }
  },

  async checkThresholds(): Promise<void> {
    try {
      const metrics = await this.collectMetrics();
      
      // Vérifier les seuils critiques
      if (metrics.responseTime > 2000) {
        await this.createAlert(
          'warning',
          'Temps de réponse élevé',
          `Temps de réponse: ${metrics.responseTime}ms (seuil: 2000ms)`,
          'performance_monitor'
        );
      }
      
      if (metrics.errorRate > 5) {
        await this.createAlert(
          'error',
          'Taux d\'erreur élevé',
          `Taux d'erreur: ${metrics.errorRate}% (seuil: 5%)`,
          'error_monitor'
        );
      }
      
      if (metrics.storageUsage > 90) {
        await this.createAlert(
          'error',
          'Stockage critique',
          `Utilisation du stockage: ${metrics.storageUsage}% (seuil: 90%)`,
          'storage_monitor'
        );
      }
      
    } catch (error) {
      console.error('Erreur vérification seuils:', error);
      await this.createAlert(
        'error',
        'Erreur système',
        'Impossible de vérifier les seuils de performance',
        'threshold_monitor'
      );
    }
  }
};
