import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X, Images, ShieldCheck, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { SymbolData, SymbolImage } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageGalleryEditor } from './ImageGalleryEditor';
import { useSymbolImages } from '@/hooks/useSupabaseSymbols';
import { CollectionSelector } from './CollectionSelector';
import { SymbolVerificationAdmin } from './SymbolVerificationAdmin';

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
  const [open, setOpen] = useState(trigger ? false : true);
  
  // Helper function to ensure sources is an array
  const getSourcesArray = (sources: any): Array<{title: string, url: string, type: string}> => {
    if (!sources) return [];
    if (Array.isArray(sources)) return sources;
    return [];
  };
  
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
    function: symbol.function || [],
    sources: getSourcesArray(symbol.sources)
  });
  const [saving, setSaving] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<Collection[]>([]);
  
  // Champs de texte pour la saisie par virgules
  const [tagsInput, setTagsInput] = useState('');
  const [mediumInput, setMediumInput] = useState('');
  const [techniqueInput, setTechniqueInput] = useState('');
  const [functionInput, setFunctionInput] = useState('');
  
  // États pour les sources
  const [newSource, setNewSource] = useState({ title: '', url: '', type: 'article' });

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
        // Simplified query without JOIN since the relationship might not exist
        const { data, error } = await supabase
          .from('collection_symbols')
          .select('collection_id')
          .eq('symbol_id', symbol.id);

        if (error) {
          console.error('Database error:', error);
          setSelectedCollections([]);
          return;
        }
        
        if (data && data.length > 0) {
          // Get collection details separately
          const collectionIds = data.map(item => item.collection_id);
          const { data: collectionsData, error: collectionsError } = await supabase
            .from('collections')
            .select(`
              id,
              slug,
              collection_translations (
                language,
                title,
                description
              )
            `)
            .in('id', collectionIds);

          if (collectionsError) {
            console.error('Collections error:', collectionsError);
            setSelectedCollections([]);
            return;
          }

          setSelectedCollections(collectionsData || []);
        } else {
          setSelectedCollections([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des collections:', error);
        setSelectedCollections([]);
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
          sources: formData.sources,
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

  // Fonctions pour gérer les sources
  const addSource = () => {
    if (newSource.title.trim() && newSource.url.trim()) {
      setFormData(prev => ({
        ...prev,
        sources: [...prev.sources, { ...newSource }]
      }));
      setNewSource({ title: '', url: '', type: 'article' });
    }
  };

  const removeSource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index)
    }));
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Edit className="h-4 w-4" />
      Éditer
    </Button>
  );

  // For controlled usage, open the modal when symbol changes
  React.useEffect(() => {
    if (symbol && !trigger) {
      setOpen(true);
    }
  }, [symbol, trigger]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Éditer le symbole</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="sources" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Sources ({formData.sources.length})
            </TabsTrigger>
            <TabsTrigger value="images" className="gap-2">
              <Images className="h-4 w-4" />
              Images ({localImages.length})
            </TabsTrigger>
            <TabsTrigger value="verification" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Vérification
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

          <TabsContent value="sources" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Sources de référence</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ajoutez des liens vers des sources externes (articles, documents académiques, sites officiels) 
                  qui aideront l'IA à mieux vérifier et contextualiser ce symbole.
                </p>
              </div>

              {/* Formulaire d'ajout de source */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter une nouvelle source
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="source-title">Titre de la source</Label>
                      <Input
                        id="source-title"
                        placeholder="Ex: Article France Bleu sur l'Aigle de Reims"
                        value={newSource.title}
                        onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="source-type">Type de source</Label>
                      <Select 
                        value={newSource.type} 
                        onValueChange={(value) => setNewSource(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article de presse</SelectItem>
                          <SelectItem value="academic">Document académique</SelectItem>
                          <SelectItem value="museum">Site de musée</SelectItem>
                          <SelectItem value="official">Site officiel</SelectItem>
                          <SelectItem value="book">Livre/Ouvrage</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="source-url">URL de la source</Label>
                    <Input
                      id="source-url"
                      type="url"
                      placeholder="https://..."
                      value={newSource.url}
                      onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                      className={newSource.url && !isValidUrl(newSource.url) ? 'border-destructive' : ''}
                    />
                    {newSource.url && !isValidUrl(newSource.url) && (
                      <p className="text-sm text-destructive mt-1">Veuillez entrer une URL valide</p>
                    )}
                  </div>
                  <Button 
                    onClick={addSource}
                    disabled={!newSource.title.trim() || !newSource.url.trim() || !isValidUrl(newSource.url)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter la source
                  </Button>
                </CardContent>
              </Card>

              {/* Liste des sources existantes */}
              <div className="space-y-3">
                <h4 className="font-medium">Sources ajoutées ({formData.sources.length})</h4>
                {formData.sources.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Aucune source ajoutée pour le moment</p>
                ) : (
                  formData.sources.map((source, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              <h5 className="font-medium">{source.title}</h5>
                              <Badge variant="outline" className="text-xs">
                                {source.type === 'article' && 'Article'}
                                {source.type === 'academic' && 'Académique'}
                                {source.type === 'museum' && 'Musée'}
                                {source.type === 'official' && 'Officiel'}
                                {source.type === 'book' && 'Livre'}
                                {source.type === 'other' && 'Autre'}
                              </Badge>
                            </div>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-primary hover:underline break-all"
                            >
                              {source.url}
                            </a>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSource(index)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
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
              symbolName={formData.name}
              culture={formData.culture}
              period={formData.period}
            />
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <SymbolVerificationAdmin
              symbol={{
                id: symbol.id,
                name: formData.name
              }}
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