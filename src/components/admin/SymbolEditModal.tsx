import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, X, Images } from 'lucide-react';
import { SymbolData, SymbolImage } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageGalleryEditor } from './ImageGalleryEditor';
import { useSymbolImages } from '@/hooks/useSupabaseSymbols';
import { CollectionSelector } from './CollectionSelector';

interface SymbolEditModalProps {
  symbol: SymbolData;
  onSymbolUpdated: (updatedSymbol: SymbolData) => void;
  trigger?: React.ReactNode;
}

interface Collection {
  id: string;
  slug: string;
  collection_translations: Array<{
    language: string;
    title: string;
    description?: string;
  }>;
}

export const SymbolEditModal: React.FC<SymbolEditModalProps> = ({
  symbol,
  onSymbolUpdated,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: symbol.name,
    culture: symbol.culture,
    period: symbol.period,
    description: symbol.description || '',
    significance: symbol.significance || '',
    historical_context: symbol.historical_context || '',
    tags: symbol.tags || [],
    medium: symbol.medium || [],
    technique: symbol.technique || [],
    function: symbol.function || []
  });
  const [saving, setSaving] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<Collection[]>([]);
  
  // Champs de texte pour la saisie par virgules
  const [tagsInput, setTagsInput] = useState('');
  const [mediumInput, setMediumInput] = useState('');
  const [techniqueInput, setTechniqueInput] = useState('');
  const [functionInput, setFunctionInput] = useState('');

  // Récupérer les images du symbole
  const { data: symbolImages, refetch: refetchImages } = useSymbolImages(symbol.id);
  const [localImages, setLocalImages] = useState<SymbolImage[]>([]);

  // Mettre à jour les images locales quand les données changent
  React.useEffect(() => {
    if (symbolImages) {
      setLocalImages(symbolImages);
    }
  }, [symbolImages]);

  // Charger les collections associées au symbole
  React.useEffect(() => {
    const fetchSymbolCollections = async () => {
      if (!symbol.id) return;
      
      try {
        const { data, error } = await supabase
          .from('collection_symbols')
          .select(`
            collections (
              id,
              slug,
              collection_translations (
                language,
                title,
                description
              )
            )
          `)
          .eq('symbol_id', symbol.id);

        if (error) throw error;
        
        const collections = data
          ?.filter(item => item.collections)
          .map(item => item.collections) || [];
        
        setSelectedCollections(collections);
      } catch (error) {
        console.error('Erreur lors du chargement des collections:', error);
      }
    };

    if (open) {
      fetchSymbolCollections();
    }
  }, [symbol.id, open]);

  // Fonction pour parser les valeurs séparées par des virgules
  const parseCommaSeparatedValues = (input: string): string[] => {
    if (!input.trim()) return [];
    return input
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .filter((item, index, array) => array.indexOf(item) === index);
  };

  // Fonction pour ajouter des valeurs depuis l'input texte
  const addValuesFromInput = (field: string, input: string, setInput: (value: string) => void) => {
    const newValues = parseCommaSeparatedValues(input);
    if (newValues.length > 0) {
      const currentValues = formData[field as keyof typeof formData] as string[];
      const updatedValues = [...currentValues, ...newValues].filter((item, index, array) => array.indexOf(item) === index);
      setFormData(prev => ({
        ...prev,
        [field]: updatedValues
      }));
      setInput('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Sauvegarder les informations du symbole
      const { data, error } = await supabase
        .from('symbols')
        .update({
          name: formData.name,
          culture: formData.culture,
          period: formData.period,
          description: formData.description,
          significance: formData.significance,
          historical_context: formData.historical_context,
          tags: formData.tags,
          medium: formData.medium,
          technique: formData.technique,
          function: formData.function,
          updated_at: new Date().toISOString()
        })
        .eq('id', symbol.id)
        .select()
        .single();

      if (error) throw error;

      // Sauvegarder les associations de collections
      await saveCollectionAssociations();

      onSymbolUpdated(data);
      setOpen(false);
      toast.success('Symbole mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du symbole');
    } finally {
      setSaving(false);
    }
  };

  const saveCollectionAssociations = async () => {
    try {
      // Supprimer les anciennes associations
      await supabase
        .from('collection_symbols')
        .delete()
        .eq('symbol_id', symbol.id);

      // Ajouter les nouvelles associations
      if (selectedCollections.length > 0) {
        const associations = selectedCollections.map((collection, index) => ({
          collection_id: collection.id,
          symbol_id: symbol.id,
          position: index + 1
        }));

        const { error } = await supabase
          .from('collection_symbols')
          .insert(associations);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des collections:', error);
      throw error;
    }
  };

  const removeFromArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof formData] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleImagesUpdated = (updatedImages: SymbolImage[]) => {
    setLocalImages(updatedImages);
    refetchImages();
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Edit className="h-4 w-4" />
      Éditer
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Éditer le symbole</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="images" className="gap-2">
              <Images className="h-4 w-4" />
              Images ({localImages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="culture">Culture</Label>
                  <Input
                    id="culture"
                    value={formData.culture}
                    onChange={(e) => setFormData(prev => ({ ...prev, culture: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="period">Période</Label>
                  <Input
                    id="period"
                    value={formData.period}
                    onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Collections */}
                <CollectionSelector
                  symbolId={symbol.id}
                  selectedCollections={selectedCollections}
                  onCollectionsChange={setSelectedCollections}
                />
              </div>

              {/* Informations détaillées */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="significance">Signification</Label>
                  <Textarea
                    id="significance"
                    rows={3}
                    value={formData.significance}
                    onChange={(e) => setFormData(prev => ({ ...prev, significance: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="historical_context">Contexte historique</Label>
                  <Textarea
                    id="historical_context"
                    rows={3}
                    value={formData.historical_context}
                    onChange={(e) => setFormData(prev => ({ ...prev, historical_context: e.target.value }))}
                  />
                </div>

                {/* Tags avec saisie par virgules */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Ex: Spirituel, Protection, Harmonie"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addValuesFromInput('tags', tagsInput, setTagsInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addValuesFromInput('tags', tagsInput, setTagsInput)}
                    >
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeFromArray('tags', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Supports, Techniques, Fonctions avec saisie par virgules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Supports</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Ex: Bois, Pierre, Cuir, Coquillage, Céramique"
                    value={mediumInput}
                    onChange={(e) => setMediumInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addValuesFromInput('medium', mediumInput, setMediumInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addValuesFromInput('medium', mediumInput, setMediumInput)}
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.medium.map((medium, index) => (
                    <Badge key={index} variant="outline" className="gap-1 text-xs">
                      {medium}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFromArray('medium', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Techniques</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Ex: Sculpture, Gravure, Peinture, Tissage"
                    value={techniqueInput}
                    onChange={(e) => setTechniqueInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addValuesFromInput('technique', techniqueInput, setTechniqueInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addValuesFromInput('technique', techniqueInput, setTechniqueInput)}
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.technique.map((technique, index) => (
                    <Badge key={index} variant="outline" className="gap-1 text-xs bg-green-50 text-green-700">
                      {technique}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFromArray('technique', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Fonctions</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Ex: Religieux, Décoratif, Protecteur, Rituel"
                    value={functionInput}
                    onChange={(e) => setFunctionInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addValuesFromInput('function', functionInput, setFunctionInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addValuesFromInput('function', functionInput, setFunctionInput)}
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.function.map((func, index) => (
                    <Badge key={index} variant="outline" className="gap-1 text-xs">
                      {func}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFromArray('function', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <ImageGalleryEditor
              symbolId={symbol.id}
              images={localImages}
              onImagesUpdated={handleImagesUpdated}
            />
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
