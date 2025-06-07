
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { userManagementService, UpdateUserData, UserDetails } from '@/services/admin/userManagementService';

interface EditUserDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  userId,
  open,
  onOpenChange,
  onUserUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({
    username: '',
    full_name: '',
    is_admin: false
  });

  useEffect(() => {
    if (open && userId) {
      loadUserDetails();
    }
  }, [open, userId]);

  const loadUserDetails = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const details = await userManagementService.getUserDetails(userId);
      if (details) {
        setUserDetails(details);
        setFormData({
          username: details.username || '',
          full_name: details.full_name || '',
          is_admin: details.is_admin || false
        });
      }
    } catch (error) {
      console.error('Error loading user details:', error);
      toast.error('Erreur lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      await userManagementService.updateUser(userId, formData);
      toast.success('Utilisateur mis à jour avec succès');
      onOpenChange(false);
      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateUserData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!userDetails && !loading) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        
        {loading && !userDetails ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="nom_utilisateur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Prénom Nom"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_admin"
                checked={formData.is_admin}
                onCheckedChange={(checked) => handleInputChange('is_admin', checked)}
              />
              <Label htmlFor="is_admin">Administrateur</Label>
            </div>

            {userDetails && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div><strong>Contributions:</strong> {userDetails.contributions_count}</div>
                <div><strong>Points:</strong> {userDetails.total_points}</div>
                <div><strong>Abonnés:</strong> {userDetails.followers_count}</div>
                <div><strong>Abonnements:</strong> {userDetails.following_count}</div>
                <div><strong>Réussites:</strong> {userDetails.achievements_count}</div>
                {userDetails.last_activity && (
                  <div><strong>Dernière activité:</strong> {new Date(userDetails.last_activity).toLocaleDateString('fr-FR')}</div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  'Sauvegarder'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
