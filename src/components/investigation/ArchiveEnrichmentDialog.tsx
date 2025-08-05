import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, MessageCircle, FileEdit, MapPin, ExternalLink } from 'lucide-react';
import { archiveContributionService } from '@/services/archiveContributionService';
import { toast } from 'sonner';

interface ArchiveEnrichmentDialogProps {
  archiveId: string;
  archiveTitle: string;
  onContributionAdded?: () => void;
}

export const ArchiveEnrichmentDialog: React.FC<ArchiveEnrichmentDialogProps> = ({
  archiveId,
  archiveTitle,
  onContributionAdded
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contributionType, setContributionType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contributionTypes = [
    { value: 'photo', label: 'Photo historique', icon: Camera },
    { value: 'comment', label: 'Commentaire / Analyse', icon: MessageCircle },
    { value: 'correction', label: 'Correction d\'information', icon: FileEdit },
    { value: 'source', label: 'Source complémentaire', icon: ExternalLink },
    { value: 'location', label: 'Localisation précise', icon: MapPin }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributionType || !description.trim()) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (selectedFile) {
        imageUrl = await archiveContributionService.uploadImage(selectedFile, archiveId);
      }

      await archiveContributionService.createContribution({
        archive_id: archiveId,
        user_id: '', // Will be handled by RLS
        contribution_type: contributionType,
        title: title.trim() || undefined,
        description: description.trim(),
        image_url: imageUrl || undefined,
        metadata: {}
      });

      toast.success('Contribution soumise pour validation');
      setIsOpen(false);
      setContributionType('');
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      onContributionAdded?.();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la soumission de la contribution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTypeInfo = contributionTypes.find(t => t.value === contributionType);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Enrichir ce document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enrichir le document : {archiveTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contribution-type">Type de contribution *</Label>
            <Select value={contributionType} onValueChange={setContributionType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de contribution" />
              </SelectTrigger>
              <SelectContent>
                {contributionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {contributionType && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Titre (optionnel)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de votre contribution"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {contributionType === 'photo' ? 'Description de la photo *' :
                   contributionType === 'comment' ? 'Votre analyse *' :
                   contributionType === 'correction' ? 'Correction proposée *' :
                   contributionType === 'source' ? 'Détails de la source *' :
                   'Description de la localisation *'}
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    contributionType === 'photo' ? 'Décrivez le contexte et l\'origine de cette photo...' :
                    contributionType === 'comment' ? 'Partagez votre analyse historique...' :
                    contributionType === 'correction' ? 'Expliquez la correction et ses sources...' :
                    contributionType === 'source' ? 'Référence bibliographique, lien, archive...' :
                    'Coordonnées précises, adresse, contexte géographique...'
                  }
                  rows={4}
                  required
                />
              </div>

              {(contributionType === 'photo' || contributionType === 'source') && (
                <div className="space-y-2">
                  <Label htmlFor="file">
                    {contributionType === 'photo' ? 'Photo à ajouter' : 'Document / Image (optionnel)'}
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Fichier sélectionné : {selectedFile.name}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  {selectedTypeInfo && <selectedTypeInfo.icon className="h-5 w-5 mt-0.5 text-primary" />}
                  <div className="space-y-1">
                    <p className="font-medium">{selectedTypeInfo?.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {contributionType === 'photo' && 'Ajoutez des photos historiques pour enrichir les archives'}
                      {contributionType === 'comment' && 'Partagez votre expertise et vos analyses historiques'}
                      {contributionType === 'correction' && 'Proposez des corrections basées sur vos sources'}
                      {contributionType === 'source' && 'Ajoutez des références et sources complémentaires'}
                      {contributionType === 'location' && 'Précisez la localisation géographique du document'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours...' : 'Soumettre la contribution'}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};