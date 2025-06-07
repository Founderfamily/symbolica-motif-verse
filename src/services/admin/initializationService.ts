
import { monitoringService } from './monitoringService';
import { backupService } from './backupService';

/**
 * Service d'initialisation automatique des tâches de maintenance
 */
export const initializationService = {
  /**
   * Initialise les services automatiques au démarrage de l'application
   */
  initializeAutoServices: async () => {
    try {
      // Charger la configuration depuis localStorage
      const savedConfig = localStorage.getItem('maintenance-config');
      
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        // Configurer le monitoring automatique si activé
        if (config.autoMonitoring && config.monitoringInterval) {
          setInterval(async () => {
            try {
              await monitoringService.checkThresholds();
            } catch (error) {
              console.error('Erreur monitoring automatique:', error);
            }
          }, config.monitoringInterval * 60 * 1000);
          
          console.log(`Monitoring automatique activé (${config.monitoringInterval} min)`);
        }
        
        // Configurer les sauvegardes automatiques si activées
        if (config.autoBackup && config.backupFrequency) {
          setInterval(async () => {
            try {
              const result = await backupService.createFullBackup();
              console.log(`Sauvegarde automatique: ${result.status}`);
            } catch (error) {
              console.error('Erreur sauvegarde automatique:', error);
            }
          }, config.backupFrequency * 60 * 60 * 1000);
          
          console.log(`Sauvegardes automatiques activées (${config.backupFrequency}h)`);
        }
        
        // Configurer le nettoyage automatique si activé
        if (config.autoCleanup && config.cleanupRetentionDays) {
          // Exécuter une fois par jour
          setInterval(async () => {
            try {
              const deletedCount = await backupService.cleanupOldBackups(config.cleanupRetentionDays);
              if (deletedCount > 0) {
                console.log(`Nettoyage automatique: ${deletedCount} sauvegardes supprimées`);
              }
            } catch (error) {
              console.error('Erreur nettoyage automatique:', error);
            }
          }, 24 * 60 * 60 * 1000);
          
          console.log(`Nettoyage automatique activé (${config.cleanupRetentionDays} jours)`);
        }
      }
      
      // Exécuter une vérification initiale
      await monitoringService.checkThresholds();
      console.log('Services de maintenance initialisés avec succès');
      
    } catch (error) {
      console.error('Erreur initialisation services automatiques:', error);
    }
  },

  /**
   * Effectue une vérification de santé initiale
   */
  performInitialHealthCheck: async () => {
    try {
      const health = await monitoringService.checkSystemHealth();
      
      if (health.overall !== 'healthy') {
        await monitoringService.createAlert(
          health.overall === 'critical' ? 'error' : 'warning',
          'Problème détecté au démarrage',
          `État système: ${health.overall}. Problèmes: ${health.issues.join(', ')}`,
          'startup_check'
        );
      }
      
      return health;
    } catch (error) {
      console.error('Erreur vérification santé initiale:', error);
      return null;
    }
  }
};
