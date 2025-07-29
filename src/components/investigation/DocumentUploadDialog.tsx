import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { investigationService } from '@/services/investigationService';
import { useToast } from '@/components/ui/use-toast';

interface DocumentUploadDialogProps {
  questId: string;
  children: React.ReactNode;
  onDocumentAdded?: () => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ 
  questId, 
  children, 
  onDocumentAdded 
}) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: '',
    author: '',
    source: '',
    date_created: '',
    credibility_score: 0.5
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const result = await investigationService.uploadDocument({
        quest_id: questId,
        title: formData.title,
        description: formData.description,
        document_type: formData.document_type,
        author: formData.author,
        source: formData.source,
        date_created: formData.date_created,
        credibility_score: formData.credibility_score,
        translations: {
          en: {},
          fr: {}
        }
      });

      if (result.success) {
        toast({
          title: "Document ajouté",
          description: "Le document a été ajouté avec succès",
        });
        
        setFormData({
          title: '',
          description: '',
          document_type: '',
          author: '',
          source: '',
          date_created: '',
          credibility_score: 0.5
        });
        
        setOpen(false);
        onDocumentAdded?.();
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
      setUploading(false);
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
            <FileText className="h-5 w-5" />
            Ajouter un Document Historique
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du document *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Registre paroissial de 1204"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document_type">Type de document *</Label>
              <Select
                value={formData.document_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, document_type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manuscript">Manuscrit</SelectItem>
                  <SelectItem value="map">Carte/Plan</SelectItem>
                  <SelectItem value="chronicle">Chronique</SelectItem>
                  <SelectItem value="inventory">Inventaire</SelectItem>
                  <SelectItem value="letter">Lettre</SelectItem>
                  <SelectItem value="archive">Archive officielle</SelectItem>
                  <SelectItem value="image">Image/Photo</SelectItem>
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
              placeholder="Décrivez le contenu et la pertinence de ce document..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Ex: Frère Antoine, Architecte Royal..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_created">Date de création</Label>
              <Input
                id="date_created"
                value={formData.date_created}
                onChange={(e) => setFormData(prev => ({ ...prev, date_created: e.target.value }))}
                placeholder="Ex: 1204-03-15, XIIIe siècle..."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="source">Source/Provenance</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              placeholder="Ex: Archives Départementales, Bibliothèque Nationale..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="credibility">Score de crédibilité (0-1)</Label>
            <Input
              id="credibility"
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={formData.credibility_score}
              onChange={(e) => setFormData(prev => ({ ...prev, credibility_score: parseFloat(e.target.value) }))}
            />
            <p className="text-xs text-muted-foreground">
              0 = Peu fiable, 0.5 = Modérément fiable, 1 = Très fiable
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter le document
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;