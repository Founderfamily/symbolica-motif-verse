import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { investigationService } from '@/services/investigationService';
import { supabase } from '@/integrations/supabase/client';

interface EvidenceUploadDialogProps {
  questId: string;
  children: React.ReactNode;
  onEvidenceUploaded: () => void;
}

const EvidenceUploadDialog: React.FC<EvidenceUploadDialogProps> = ({ 
  questId, 
  children, 
  onEvidenceUploaded 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    evidence_type: '',
    location_name: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          toast({
            title: "Position obtenue",
            description: "Votre position actuelle a été ajoutée à la preuve",
          });
        },
        (error) => {
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position",
            variant: "destructive",
          });
        }
      );
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `quest-evidence/${questId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('quest-evidence')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('quest-evidence')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.evidence_type || !selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Upload image
      const imageUrl = await uploadImage(selectedFile);

      // Submit evidence
      const evidenceData = {
        quest_id: questId,
        submitted_by: user.id,
        evidence_type: formData.evidence_type,
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        latitude: formData.latitude,
        longitude: formData.longitude,
        location_name: formData.location_name,
        metadata: {
          file_size: selectedFile.size,
          file_type: selectedFile.type,
        }
      };

      const result = await investigationService.submitEvidence(evidenceData);
      
      if (result.success) {
        toast({
          title: "Preuve soumise",
          description: "Votre preuve a été soumise avec succès",
        });
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          evidence_type: '',
          location_name: '',
          latitude: null,
          longitude: null,
        });
        setSelectedFile(null);
        onEvidenceUploaded();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error submitting evidence:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la soumission",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Soumettre une Preuve</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de la preuve"
              required
            />
          </div>

          <div>
            <Label htmlFor="evidence_type">Type de preuve *</Label>
            <Select 
              value={formData.evidence_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, evidence_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photo">Photo</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="artifact">Artefact</SelectItem>
                <SelectItem value="testimony">Témoignage</SelectItem>
                <SelectItem value="measurement">Mesure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez votre découverte"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="file">Image *</Label>
            <div className="flex gap-2">
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file')?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground mt-1">
                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="location_name">Lieu</Label>
            <div className="flex gap-2">
              <Input
                id="location_name"
                value={formData.location_name}
                onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                placeholder="Nom du lieu"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {formData.latitude && formData.longitude && (
              <p className="text-sm text-muted-foreground mt-1">
                Position: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Envoi...' : 'Soumettre'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceUploadDialog;