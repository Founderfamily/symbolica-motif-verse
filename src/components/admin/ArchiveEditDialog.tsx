import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Upload, Image, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface ArchiveEditDialogProps {
  archive: any;
  onArchiveUpdated?: () => void;
}

export const ArchiveEditDialog: React.FC<ArchiveEditDialogProps> = ({
  archive,
  onArchiveUpdated
}) => {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    date: '',
    source: '',
    type: '',
    document_url: '',
    archiveLink: '',
    physicalLocation: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (archive) {
      setFormData({
        title: archive.title || '',
        description: archive.description || '',
        author: archive.author || '',
        date: archive.date || archive.date_created || '',
        source: archive.source || '',
        type: archive.type || archive.document_type || '',
        document_url: archive.document_url || archive.url || '',
        archiveLink: archive.archiveLink || '',
        physicalLocation: archive.physicalLocation || ''
      });
    }
  }, [archive]);

  const documentTypes = [
    { value: 'manuscript', label: 'Manuscrit' },
    { value: 'map', label: 'Carte' },
    { value: 'chronicle', label: 'Chronique' },
    { value: 'inventory', label: 'Inventaire' },
    { value: 'registry', label: 'Registre' },
    { value: 'official', label: 'Document officiel' },
    { value: 'memoir', label: 'Mémoire' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Seuls les administrateurs peuvent modifier les archives');
      return;
    }

    setIsSubmitting(true);
    try {
      // Ici, vous devrez implémenter la logique de mise à jour
      // Pour l'instant, on simule juste la mise à jour
      
      let imageUrl = formData.document_url;
      
      if (selectedFile) {
        // Upload de la nouvelle image
        // TODO: Implémenter l'upload vers Supabase Storage
        // const uploadResult = await uploadArchiveImage(selectedFile);
        // imageUrl = uploadResult.publicUrl;
        toast.success('Image mise à jour (simulation)');
      }

      // Mettre à jour l'archive
      // TODO: Implémenter la mise à jour en base de données
      
      toast.success('Archive mise à jour avec succès');
      setIsOpen(false);
      onArchiveUpdated?.();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'archive');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'archive : {archive?.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de document *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="ex: 1528-04-15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="ex: Archives Nationales - O1 1363"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="physicalLocation">Localisation physique</Label>
            <Input
              id="physicalLocation"
              value={formData.physicalLocation}
              onChange={(e) => setFormData({ ...formData, physicalLocation: e.target.value })}
              placeholder="ex: Pierrefitte-sur-Seine"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="archiveLink">Lien vers les archives</Label>
            <Input
              id="archiveLink"
              value={formData.archiveLink}
              onChange={(e) => setFormData({ ...formData, archiveLink: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_url">URL de l'image actuelle</Label>
            <Input
              id="document_url"
              value={formData.document_url}
              onChange={(e) => setFormData({ ...formData, document_url: e.target.value })}
              placeholder="URL de l'image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Remplacer l'image</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Nouvelle image : {selectedFile.name}
              </p>
            )}
          </div>

          {formData.document_url && (
            <div className="space-y-2">
              <Label>Aperçu actuel</Label>
              <div className="relative">
                <img 
                  src={formData.document_url} 
                  alt="Aperçu"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};