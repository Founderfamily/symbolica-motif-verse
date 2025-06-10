
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Camera, FileText, MapPin, Archive, Brain } from 'lucide-react';
import { useSubmitEvidence } from '@/hooks/useQuests';
import { toast } from 'sonner';

interface ContributeEvidenceDialogProps {
  questId: string;
  className?: string;
}

export const ContributeEvidenceDialog: React.FC<ContributeEvidenceDialogProps> = ({
  questId,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [evidenceType, setEvidenceType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const submitEvidenceMutation = useSubmitEvidence();

  const evidenceTypes = [
    { value: 'document', label: 'Document historique', icon: FileText },
    { value: 'photo', label: 'Photographie', icon: Camera },
    { value: 'archive', label: 'Lien d\'archive', icon: Archive },
    { value: 'location', label: 'Localisation', icon: MapPin },
    { value: 'theory', label: 'Théorie/Analyse', icon: Brain }
  ];

  const handleSubmit = async () => {
    if (!evidenceType || !title.trim()) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    const location = latitude && longitude ? {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: locationName
    } : undefined;

    try {
      await submitEvidenceMutation.mutateAsync({
        questId,
        evidenceType,
        title: title.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        location
      });

      toast.success('Votre contribution a été soumise avec succès !');
      setIsOpen(false);
      
      // Reset form
      setEvidenceType('');
      setTitle('');
      setDescription('');
      setImageUrl('');
      setLocationName('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error submitting evidence:', error);
      toast.error('Erreur lors de la soumission de votre contribution');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white ${className}`}>
          <Plus className="w-4 h-4 mr-2" />
          Contribuer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Contribuer à la recherche
          </DialogTitle>
          <DialogDescription>
            Partagez vos découvertes, preuves, théories ou liens d'archives pour faire avancer cette recherche collaborative.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="evidence-type">Type de contribution *</Label>
            <Select value={evidenceType} onValueChange={setEvidenceType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de contribution" />
              </SelectTrigger>
              <SelectContent>
                {evidenceTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Titre de votre contribution *</Label>
            <Input
              id="title"
              placeholder="Ex: Nouveau document sur les Templiers..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre découverte, son contexte, sa pertinence pour la recherche..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {(evidenceType === 'photo' || evidenceType === 'document' || evidenceType === 'archive') && (
            <div className="grid gap-2">
              <Label htmlFor="image-url">URL de l'image/document</Label>
              <Input
                id="image-url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          )}

          {(evidenceType === 'location' || evidenceType === 'photo') && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location-name">Nom du lieu</Label>
                <Input
                  id="location-name"
                  placeholder="Ex: Château de Gisors, France"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="49.2764"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="1.7767"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitEvidenceMutation.isPending || !evidenceType || !title.trim()}
          >
            {submitEvidenceMutation.isPending ? 'Envoi...' : 'Soumettre la contribution'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContributeEvidenceDialog;
