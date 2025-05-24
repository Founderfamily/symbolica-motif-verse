
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCollection, useCreateCollection, useUpdateCollection } from '@/hooks/useCollections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const CollectionEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewCollection = id === 'new';
  
  const { data: collection } = useCollection(isNewCollection ? '' : id || '');
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();

  const [formData, setFormData] = useState({
    slug: '',
    is_featured: false,
    translations: {
      fr: { title: '', description: '' },
      en: { title: '', description: '' }
    }
  });

  useEffect(() => {
    if (collection && !isNewCollection) {
      const frTranslation = collection.collection_translations?.find(t => t.language === 'fr');
      const enTranslation = collection.collection_translations?.find(t => t.language === 'en');
      
      setFormData({
        slug: collection.slug,
        is_featured: collection.is_featured,
        translations: {
          fr: {
            title: frTranslation?.title || '',
            description: frTranslation?.description || ''
          },
          en: {
            title: enTranslation?.title || '',
            description: enTranslation?.description || ''
          }
        }
      });
    }
  }, [collection, isNewCollection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isNewCollection) {
        const result = await createCollection.mutateAsync(formData);
        if (result) {
          toast.success('Collection créée avec succès');
          navigate('/admin/collections');
        }
      } else {
        const success = await updateCollection.mutateAsync({ 
          id: id!, 
          updates: formData 
        });
        if (success) {
          toast.success('Collection mise à jour avec succès');
          navigate('/admin/collections');
        }
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const updateTranslation = (language: 'fr' | 'en', field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations[language],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/collections')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">
          {isNewCollection ? 'Nouvelle Collection' : 'Modifier la Collection'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="da-vinci-code"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="featured">Collection en vedette</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traductions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fr">
              <TabsList>
                <TabsTrigger value="fr">Français</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title-fr">Titre (Français)</Label>
                  <Input
                    id="title-fr"
                    value={formData.translations.fr.title}
                    onChange={(e) => updateTranslation('fr', 'title', e.target.value)}
                    placeholder="Le Code Da Vinci"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description-fr">Description (Français)</Label>
                  <Textarea
                    id="description-fr"
                    value={formData.translations.fr.description}
                    onChange={(e) => updateTranslation('fr', 'description', e.target.value)}
                    placeholder="Découvrez les symboles mystérieux..."
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title-en">Title (English)</Label>
                  <Input
                    id="title-en"
                    value={formData.translations.en.title}
                    onChange={(e) => updateTranslation('en', 'title', e.target.value)}
                    placeholder="The Da Vinci Code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description-en">Description (English)</Label>
                  <Textarea
                    id="description-en"
                    value={formData.translations.en.description}
                    onChange={(e) => updateTranslation('en', 'description', e.target.value)}
                    placeholder="Discover the mysterious symbols..."
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={createCollection.isPending || updateCollection.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isNewCollection ? 'Créer la collection' : 'Sauvegarder'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/collections')}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CollectionEditor;
