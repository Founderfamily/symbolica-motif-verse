
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useCreateCollection } from '@/hooks/useCollections';
import { useToast } from '@/hooks/use-toast';
import { I18nText } from '@/components/ui/i18n-text';

const CreateCollectionDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    is_featured: false,
    translations: {
      fr: { title: '', description: '' },
      en: { title: '', description: '' }
    }
  });
  
  const createCollection = useCreateCollection();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !formData.translations.fr.title) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCollection.mutateAsync(formData);
      toast({
        title: "Succès",
        description: "Collection créée avec succès",
      });
      setOpen(false);
      setFormData({
        slug: '',
        is_featured: false,
        translations: {
          fr: { title: '', description: '' },
          en: { title: '', description: '' }
        }
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la collection",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" />
          <I18nText translationKey="collections.create">Créer une collection</I18nText>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <I18nText translationKey="collections.createTitle">Créer une nouvelle collection</I18nText>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Identifiant URL (slug) *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="mon-super-collection"
              required
            />
          </div>

          {/* French fields */}
          <div className="space-y-4">
            <h3 className="font-medium">Version française</h3>
            <div className="space-y-2">
              <Label htmlFor="title-fr">Titre *</Label>
              <Input
                id="title-fr"
                value={formData.translations.fr.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    fr: { ...prev.translations.fr, title: e.target.value }
                  }
                }))}
                placeholder="Titre de la collection"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description-fr">Description</Label>
              <Textarea
                id="description-fr"
                value={formData.translations.fr.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    fr: { ...prev.translations.fr, description: e.target.value }
                  }
                }))}
                placeholder="Description de la collection..."
                rows={3}
              />
            </div>
          </div>

          {/* English fields */}
          <div className="space-y-4">
            <h3 className="font-medium">English version</h3>
            <div className="space-y-2">
              <Label htmlFor="title-en">Title</Label>
              <Input
                id="title-en"
                value={formData.translations.en.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    en: { ...prev.translations.en, title: e.target.value }
                  }
                }))}
                placeholder="Collection title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description-en">Description</Label>
              <Textarea
                id="description-en"
                value={formData.translations.en.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    en: { ...prev.translations.en, description: e.target.value }
                  }
                }))}
                placeholder="Collection description..."
                rows={3}
              />
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
            />
            <Label htmlFor="featured">Collection en vedette</Label>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createCollection.isPending}>
              {createCollection.isPending ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollectionDialog;
