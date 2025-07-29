import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { investigationService } from '@/services/investigationService';
import { useToast } from '@/components/ui/use-toast';

interface AddLocationDialogProps {
  questId: string;
  children: React.ReactNode;
  onLocationAdded?: () => void;
}

const AddLocationDialog: React.FC<AddLocationDialogProps> = ({ 
  questId, 
  children, 
  onLocationAdded 
}) => {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location_type: '',
    latitude: '',
    longitude: '',
    historical_significance: '',
    current_status: 'accessible'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Coordonnées invalides');
      }

      const result = await investigationService.addQuestLocation({
        quest_id: questId,
        name: formData.name,
        description: formData.description,
        location_type: formData.location_type,
        latitude: lat,
        longitude: lng,
        historical_significance: formData.historical_significance,
        current_status: formData.current_status,
        images: [],
        sources: []
      });

      if (result.success) {
        toast({
          title: "Lieu ajouté",
          description: "Le lieu a été ajouté avec succès à la carte",
        });
        
        setFormData({
          name: '',
          description: '',
          location_type: '',
          latitude: '',
          longitude: '',
          historical_significance: '',
          current_status: 'accessible'
        });
        
        setOpen(false);
        onLocationAdded?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'ajout",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ajouter un Lieu d'Intérêt
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du lieu *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Château de Vincennes"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location_type">Type de lieu *</Label>
              <Select
                value={formData.location_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, location_type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="archaeological_site">Site archéologique</SelectItem>
                  <SelectItem value="historical_monument">Monument historique</SelectItem>
                  <SelectItem value="church">Église/Monastère</SelectItem>
                  <SelectItem value="castle">Château/Fortification</SelectItem>
                  <SelectItem value="landmark">Point de repère</SelectItem>
                  <SelectItem value="excavation_site">Site de fouilles</SelectItem>
                  <SelectItem value="reference_point">Point de référence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez l'importance de ce lieu pour la quête..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                placeholder="Ex: 48.8566"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                placeholder="Ex: 2.3522"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="historical_significance">Signification historique</Label>
            <Textarea
              id="historical_significance"
              value={formData.historical_significance}
              onChange={(e) => setFormData(prev => ({ ...prev, historical_significance: e.target.value }))}
              placeholder="Contexte historique et importance du lieu..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current_status">Statut actuel</Label>
            <Select
              value={formData.current_status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, current_status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accessible">Accessible</SelectItem>
                <SelectItem value="restricted">Accès restreint</SelectItem>
                <SelectItem value="private">Propriété privée</SelectItem>
                <SelectItem value="ruins">En ruines</SelectItem>
                <SelectItem value="demolished">Démoli</SelectItem>
                <SelectItem value="unknown">État inconnu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={adding}>
              {adding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Ajouter le lieu
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationDialog;