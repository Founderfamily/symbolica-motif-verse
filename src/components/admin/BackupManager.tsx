
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Database, Download, Trash2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { backupService, BackupResult } from '@/services/admin/backupService';
import { useAuth } from '@/hooks/useAuth';

const BackupManager: React.FC = () => {
  const { isAdmin } = useAuth();
  const [backups, setBackups] = useState<BackupResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadBackups();
    }
  }, [isAdmin]);

  const loadBackups = async () => {
    try {
      const backupList = await backupService.listBackups();
      setBackups(backupList);
    } catch (error) {
      console.error('Erreur chargement sauvegardes:', error);
      toast.error('Impossible de charger les sauvegardes');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setCreating(true);
    try {
      const result = await backupService.createFullBackup();
      toast.success(`Sauvegarde créée: ${result.status}`);
      await loadBackups();
    } catch (error) {
      console.error('Erreur création sauvegarde:', error);
      toast.error('Erreur lors de la création de la sauvegarde');
    } finally {
      setCreating(false);
    }
  };

  const cleanupOldBackups = async () => {
    try {
      const deletedCount = await backupService.cleanupOldBackups(30);
      toast.success(`${deletedCount} anciennes sauvegardes supprimées`);
      await loadBackups();
    } catch (error) {
      console.error('Erreur nettoyage:', error);
      toast.error('Erreur lors du nettoyage');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'partial': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'partial': return <AlertCircle className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
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
            <Database className="h-5 w-5" />
            Gestionnaire de sauvegardes
          </CardTitle>
          <CardDescription>
            Créez et gérez les sauvegardes automatiques du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={createBackup} 
              disabled={creating}
              className="flex items-center gap-2"
            >
              {creating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              {creating ? 'Création...' : 'Créer une sauvegarde'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={cleanupOldBackups}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Nettoyer anciennes sauvegardes
            </Button>
            
            <Button 
              variant="outline" 
              onClick={loadBackups}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </div>

          {creating && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Création de la sauvegarde en cours...</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Chargement des sauvegardes...</p>
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune sauvegarde trouvée</p>
              </div>
            ) : (
              backups.map((backup) => (
                <Card key={backup.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(backup.status)}
                        <div>
                          <div className="font-medium">
                            Sauvegarde {backup.id.split('_')[1]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(backup.timestamp).toLocaleString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status}
                      </Badge>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{formatSize(backup.size)}</span>
                        <span className="mx-2">•</span>
                        <span>{backup.tables.length} tables</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {backup.errors && backup.errors.length > 0 && (
                    <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                      <div className="text-sm text-red-700 font-medium mb-1">Erreurs:</div>
                      <ul className="text-sm text-red-600 space-y-1">
                        {backup.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupManager;
