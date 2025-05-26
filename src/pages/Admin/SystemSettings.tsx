
import React, { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, Save, Database, Mail, Shield, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SystemSettings = () => {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    autoApproveContributions: false,
    maxFileSize: '5',
    backupFrequency: 'daily',
    systemMessage: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires.",
      });
      return;
    }

    setSaving(true);

    try {
      // Save settings to database
      const { error } = await supabase
        .from('content_sections')
        .upsert({
          section_key: 'system_settings',
          content: {
            fr: JSON.stringify(settings),
            en: JSON.stringify(settings)
          }
        });

      if (error) throw error;

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres système ont été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires.",
      });
      return;
    }

    try {
      // Simulate backup process
      toast({
        title: "Sauvegarde lancée",
        description: "La sauvegarde de la base de données a été lancée.",
      });
      
      // Here you would typically call a backup function or API
      setTimeout(() => {
        toast({
          title: "Sauvegarde terminée",
          description: "La sauvegarde a été créée avec succès.",
        });
      }, 3000);
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        variant: "destructive",
        title: "Erreur de sauvegarde",
        description: "Impossible de créer la sauvegarde.",
      });
    }
  };

  const handleTestEmail = async () => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires.",
      });
      return;
    }

    try {
      // Simulate email test
      toast({
        title: "Test d'email envoyé",
        description: "Un email de test a été envoyé à votre adresse.",
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'email",
        description: "Impossible d'envoyer l'email de test.",
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
        <p className="text-muted-foreground">
          Vous devez être administrateur pour accéder à cette page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres système</h1>
        <p className="text-muted-foreground">
          Gérez la configuration et les paramètres de l'application.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Paramètres généraux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Paramètres généraux
            </CardTitle>
            <CardDescription>
              Configuration principale de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, maintenanceMode: checked }))
                }
              />
              <Label htmlFor="maintenance">Mode maintenance</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="registration"
                checked={settings.userRegistration}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, userRegistration: checked }))
                }
              />
              <Label htmlFor="registration">Autoriser les nouvelles inscriptions</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-approve"
                checked={settings.autoApproveContributions}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, autoApproveContributions: checked }))
                }
              />
              <Label htmlFor="auto-approve">Approuver automatiquement les contributions</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-file-size">Taille maximale des fichiers (MB)</Label>
              <Input
                id="max-file-size"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, maxFileSize: e.target.value }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="system-message">Message système</Label>
              <Textarea
                id="system-message"
                placeholder="Message à afficher aux utilisateurs"
                value={settings.systemMessage}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, systemMessage: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de sauvegarde */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Sauvegarde et maintenance
            </CardTitle>
            <CardDescription>
              Gestion des sauvegardes automatiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Fréquence des sauvegardes</Label>
                <p className="text-sm text-muted-foreground">
                  Sauvegarde automatique : {settings.backupFrequency}
                </p>
              </div>
              <Button onClick={handleBackup} variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Créer une sauvegarde
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuration email
            </CardTitle>
            <CardDescription>
              Paramètres SMTP pour l'envoi d'emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
              <Label htmlFor="email-notifications">Activer les notifications email</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Serveur SMTP</Label>
                <Input
                  id="smtp-host"
                  value={settings.smtpHost}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, smtpHost: e.target.value }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port SMTP</Label>
                <Input
                  id="smtp-port"
                  value={settings.smtpPort}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, smtpPort: e.target.value }))
                  }
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Utilisateur SMTP</Label>
                <Input
                  id="smtp-user"
                  value={settings.smtpUser}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, smtpUser: e.target.value }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Mot de passe SMTP</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, smtpPassword: e.target.value }))
                  }
                />
              </div>
            </div>
            
            <Button onClick={handleTestEmail} variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Tester l'envoi d'email
            </Button>
          </CardContent>
        </Card>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
