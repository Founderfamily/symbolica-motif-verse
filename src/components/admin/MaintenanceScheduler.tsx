import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Clock, Play, Pause, Settings, Activity } from 'lucide-react';
import { backupService } from '@/services/admin/backupService';
import { monitoringService } from '@/services/admin/monitoringService';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ScheduleConfig {
  autoBackup: boolean;
  backupFrequency: number; // heures
  autoMonitoring: boolean;
  monitoringInterval: number; // minutes
  autoCleanup: boolean;
  cleanupRetentionDays: number;
}

const MaintenanceScheduler: React.FC = () => {
  const { isAdmin } = useAuth();
  const [config, setConfig] = useState<ScheduleConfig>({
    autoBackup: false,
    backupFrequency: 24,
    autoMonitoring: true,
    monitoringInterval: 5,
    autoCleanup: false,
    cleanupRetentionDays: 30
  });
  const [intervals, setIntervals] = useState<{[key: string]: NodeJS.Timeout | null}>({
    backup: null,
    monitoring: null,
    cleanup: null
  });

  useEffect(() => {
    if (isAdmin) {
      loadConfig();
    }
    return () => {
      // Nettoyer les intervals lors du démontage
      Object.values(intervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [isAdmin]);

  const loadConfig = async () => {
    try {
      // Charger la configuration depuis content_sections
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_key', 'maintenance_config')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur chargement config:', error);
        return;
      }

      if (data?.content) {
        const content = data.content as { fr?: string };
        if (content.fr) {
          try {
            const savedConfig = JSON.parse(content.fr);
            setConfig(prev => ({ ...prev, ...savedConfig }));
          } catch (parseError) {
            console.error('Erreur parsing config:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Exception chargement config:', error);
    }
  };

  const saveConfig = async (newConfig: ScheduleConfig) => {
    try {
      setConfig(newConfig);
      
      // Sauvegarder dans content_sections
      const { error } = await supabase
        .from('content_sections')
        .upsert({
          section_key: 'maintenance_config',
          content: {
            fr: JSON.stringify(newConfig),
            en: JSON.stringify(newConfig)
          }
        });

      if (error) {
        console.error('Erreur sauvegarde config:', error);
        toast.error('Erreur lors de la sauvegarde de la configuration');
        return;
      }
      
      setupSchedules(newConfig);
      toast.success('Configuration sauvegardée');
    } catch (error) {
      console.error('Exception sauvegarde config:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const setupSchedules = (newConfig: ScheduleConfig) => {
    // Nettoyer les anciens intervals
    Object.values(intervals).forEach(interval => {
      if (interval) clearInterval(interval);
    });

    const newIntervals: {[key: string]: NodeJS.Timeout | null} = {
      backup: null,
      monitoring: null,
      cleanup: null
    };

    // Configurer la sauvegarde automatique
    if (newConfig.autoBackup) {
      newIntervals.backup = setInterval(async () => {
        try {
          const result = await backupService.createFullBackup();
          toast.success(`Sauvegarde automatique: ${result.status}`);
        } catch (error) {
          console.error('Erreur sauvegarde auto:', error);
          toast.error('Erreur lors de la sauvegarde automatique');
        }
      }, newConfig.backupFrequency * 60 * 60 * 1000);
    }

    // Configurer le monitoring automatique
    if (newConfig.autoMonitoring) {
      newIntervals.monitoring = setInterval(async () => {
        try {
          await monitoringService.checkThresholds();
        } catch (error) {
          console.error('Erreur monitoring auto:', error);
        }
      }, newConfig.monitoringInterval * 60 * 1000);
    }

    // Configurer le nettoyage automatique
    if (newConfig.autoCleanup) {
      newIntervals.cleanup = setInterval(async () => {
        try {
          const deletedBackups = await backupService.cleanupOldBackups(newConfig.cleanupRetentionDays);
          
          // Nettoyer aussi les données système anciennes
          await supabase.rpc('cleanup_old_system_data');
          
          if (deletedBackups > 0) {
            toast.success(`Nettoyage automatique: ${deletedBackups} sauvegardes supprimées`);
          }
        } catch (error) {
          console.error('Erreur nettoyage auto:', error);
          toast.error('Erreur lors du nettoyage automatique');
        }
      }, 24 * 60 * 60 * 1000);
    }

    setIntervals(newIntervals);
  };

  const runManualBackup = async () => {
    try {
      const result = await backupService.createFullBackup();
      toast.success(`Sauvegarde manuelle: ${result.status}`);
    } catch (error) {
      console.error('Erreur sauvegarde manuelle:', error);
      toast.error('Erreur lors de la sauvegarde manuelle');
    }
  };

  const runManualMonitoring = async () => {
    try {
      await monitoringService.checkThresholds();
      toast.success('Vérification manuelle des seuils effectuée');
    } catch (error) {
      console.error('Erreur monitoring manuel:', error);
      toast.error('Erreur lors du monitoring manuel');
    }
  };

  const runManualCleanup = async () => {
    try {
      const deletedCount = await backupService.cleanupOldBackups(config.cleanupRetentionDays);
      await supabase.rpc('cleanup_old_system_data');
      toast.success(`Nettoyage manuel: ${deletedCount} sauvegardes supprimées`);
    } catch (error) {
      console.error('Erreur nettoyage manuel:', error);
      toast.error('Erreur lors du nettoyage manuel');
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accès refusé</CardTitle>
          <CardDescription>Vous devez être administrateur pour accéder à cette fonctionnalité.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Planification de maintenance
          </CardTitle>
          <CardDescription>
            Configurez l'automatisation des tâches de maintenance système
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sauvegarde automatique */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-base font-medium">Sauvegarde automatique</Label>
                <p className="text-sm text-gray-600">Créer des sauvegardes à intervalles réguliers</p>
              </div>
              <Switch
                checked={config.autoBackup}
                onCheckedChange={(checked) => {
                  const newConfig = { ...config, autoBackup: checked };
                  saveConfig(newConfig);
                }}
              />
            </div>
            {config.autoBackup && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="backup-frequency">Fréquence (heures)</Label>
                  <Input
                    id="backup-frequency"
                    type="number"
                    min="1"
                    max="168"
                    value={config.backupFrequency}
                    onChange={(e) => {
                      const newConfig = { ...config, backupFrequency: parseInt(e.target.value) || 24 };
                      saveConfig(newConfig);
                    }}
                    className="w-24"
                  />
                </div>
                <Button onClick={runManualBackup} variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Exécuter maintenant
                </Button>
              </div>
            )}
          </div>

          {/* Monitoring automatique */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-base font-medium">Monitoring automatique</Label>
                <p className="text-sm text-gray-600">Vérifier les seuils et alertes automatiquement</p>
              </div>
              <Switch
                checked={config.autoMonitoring}
                onCheckedChange={(checked) => {
                  const newConfig = { ...config, autoMonitoring: checked };
                  saveConfig(newConfig);
                }}
              />
            </div>
            {config.autoMonitoring && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="monitoring-interval">Intervalle (minutes)</Label>
                  <Input
                    id="monitoring-interval"
                    type="number"
                    min="1"
                    max="60"
                    value={config.monitoringInterval}
                    onChange={(e) => {
                      const newConfig = { ...config, monitoringInterval: parseInt(e.target.value) || 5 };
                      saveConfig(newConfig);
                    }}
                    className="w-24"
                  />
                </div>
                <Button onClick={runManualMonitoring} variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Exécuter maintenant
                </Button>
              </div>
            )}
          </div>

          {/* Nettoyage automatique */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-base font-medium">Nettoyage automatique</Label>
                <p className="text-sm text-gray-600">Supprimer automatiquement les anciennes données</p>
              </div>
              <Switch
                checked={config.autoCleanup}
                onCheckedChange={(checked) => {
                  const newConfig = { ...config, autoCleanup: checked };
                  saveConfig(newConfig);
                }}
              />
            </div>
            {config.autoCleanup && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cleanup-retention">Rétention (jours)</Label>
                  <Input
                    id="cleanup-retention"
                    type="number"
                    min="1"
                    max="365"
                    value={config.cleanupRetentionDays}
                    onChange={(e) => {
                      const newConfig = { ...config, cleanupRetentionDays: parseInt(e.target.value) || 30 };
                      saveConfig(newConfig);
                    }}
                    className="w-24"
                  />
                </div>
                <Button onClick={runManualCleanup} variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Exécuter maintenant
                </Button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-gray-600">
              <p><strong>État des services automatiques:</strong></p>
              <ul className="mt-2 space-y-1">
                <li>• Sauvegarde: {config.autoBackup ? '✅ Activée' : '⏸️ Désactivée'}</li>
                <li>• Monitoring: {config.autoMonitoring ? '✅ Activé' : '⏸️ Désactivé'}</li>
                <li>• Nettoyage: {config.autoCleanup ? '✅ Activé' : '⏸️ Désactivé'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceScheduler;
