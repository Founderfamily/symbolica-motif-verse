import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Upload, Trash2, Eye, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';
import { CollectionSelector } from '@/components/admin/CollectionSelector';

interface Collection {
  id: string;
  slug: string;
  collection_translations: Array<{
    language: string;
    title: string;
    description?: string;
  }>;
}

const SymbolEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewSymbol = id === 'new';
  
  const [symbol, setSymbol] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<Collection[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    culture: '',
    period: '',
    description: '',
    medium: [] as string[],
    technique: [] as string[],
    function: [] as string[],
  });

  // Champs de texte pour la saisie par virgules
  const [mediumInput, setMediumInput] = useState('');
  const [techniqueInput, setTechniqueInput] = useState('');
  const [functionInput, setFunctionInput] = useState('');

  useEffect(() => {
    if (isNewSymbol) {
      setLoading(false);
      return;
    }

    const fetchSymbolData = async () => {
      try {
        console.log('🔍 Chargement des données du symbole:', id);
        
        const { data: symbolData, error: symbolError } = await supabase
          .from('symbols')
          .select('*')
          .eq('id', id)
          .single();

        if (symbolError) {
          console.error('❌ Erreur lors du chargement du symbole:', symbolError);
          throw symbolError;
        }

        console.log('✅ Données du symbole chargées:', symbolData);
        
        setSymbol(symbolData);
        setFormData({
          name: symbolData.name || '',
          culture: symbolData.culture || '',
          period: symbolData.period || '',
          description: symbolData.description || '',
          medium: Array.isArray(symbolData.medium) ? symbolData.medium : [],
          technique: Array.isArray(symbolData.technique) ? symbolData.technique : [],
          function: Array.isArray(symbolData.function) ? symbolData.function : [],
        });

        // Charger les collections associées - nouvelle approche
        const { data: symbolCollectionLinks, error: linksError } = await supabase
          .from('collection_symbols')
          .select('collection_id')
          .eq('symbol_id', id);

        if (linksError) {
          console.error('❌ Erreur lors du chargement des liens collections:', linksError);
        } else if (symbolCollectionLinks && symbolCollectionLinks.length > 0) {
          const collectionIds = symbolCollectionLinks.map(link => link.collection_id);
          
          const { data: collectionsData, error: collectionsError } = await supabase
            .from('collections_with_symbols')
            .select('*')
            .in('id', collectionIds);

          if (collectionsError) {
            console.error('❌ Erreur lors du chargement des collections:', collectionsError);
          } else {
            const collections = (collectionsData || []).map(item => ({
              id: item.id,
              slug: item.slug,
              collection_translations: Array.isArray(item.collection_translations) 
                ? item.collection_translations as any[] 
                : []
            }));
            setSelectedCollections(collections);
          }
        } else {
          setSelectedCollections([]);
        }

        const { data: imagesData, error: imagesError } = await supabase
          .from('symbol_images')
          .select('*')
          .eq('symbol_id', id);

        if (imagesError) {
          console.error('❌ Erreur lors du chargement des images:', imagesError);
          throw imagesError;
        }

        console.log('✅ Images chargées:', imagesData?.length || 0);
        setImages(imagesData || []);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des données du symbole:', error);
        toast.error('Erreur lors du chargement des données du symbole');
        navigate('/admin/symbols');
      } finally {
        setLoading(false);
      }
    };

    fetchSymbolData();
  }, [id, isNewSymbol, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('📝 Modification du champ:', name, '=', value);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fonction pour parser les valeurs séparées par des virgules
  const parseCommaSeparatedValues = (input: string): string[] => {
    if (!input.trim()) return [];
    return input
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .filter((item, index, array) => array.indexOf(item) === index); // Éviter les doublons
  };

  // Fonction pour ajouter des valeurs depuis l'input texte
  const addValuesFromInput = (field: 'medium' | 'technique' | 'function', input: string, setInput: (value: string) => void) => {
    const newValues = parseCommaSeparatedValues(input);
    if (newValues.length > 0) {
      const currentValues = formData[field];
      const updatedValues = [...currentValues, ...newValues].filter((item, index, array) => array.indexOf(item) === index);
      setFormData(prev => ({
        ...prev,
        [field]: updatedValues
      }));
      setInput('');
    }
  };

  const removeFromArray = (field: 'medium' | 'technique' | 'function', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const saveCollectionAssociations = async (symbolId: string) => {
    try {
      // Supprimer les anciennes associations
      await supabase
        .from('collection_symbols')
        .delete()
        .eq('symbol_id', symbolId);

      // Ajouter les nouvelles associations
      if (selectedCollections.length > 0) {
        const associations = selectedCollections.map((collection, index) => ({
          collection_id: collection.id,
          symbol_id: symbolId,
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

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('💾 Début de la sauvegarde avec les données:', formData);

      // Validation des champs requis
      if (!formData.name.trim()) {
        toast.error('Le nom du symbole est requis');
        return;
      }

      if (!formData.culture.trim()) {
        toast.error('La culture est requise');
        return;
      }

      if (!formData.period.trim()) {
        toast.error('La période est requise');
        return;
      }

      // Préparer les données pour la sauvegarde
      const dataToSave = {
        name: formData.name.trim(),
        culture: formData.culture.trim(),
        period: formData.period.trim(),
        description: formData.description.trim() || null,
        medium: formData.medium.length > 0 ? formData.medium : null,
        technique: formData.technique.length > 0 ? formData.technique : null,
        function: formData.function.length > 0 ? formData.function : null,
        updated_at: new Date().toISOString()
      };

      console.log('📋 Données préparées pour la sauvegarde:', dataToSave);

      if (isNewSymbol) {
        const { data, error } = await supabase
          .from('symbols')
          .insert([dataToSave])
          .select()
          .single();

        if (error) {
          console.error('❌ Erreur lors de la création:', error);
          throw error;
        }

        console.log('✅ Symbole créé avec succès:', data);
        
        // Sauvegarder les associations de collections
        await saveCollectionAssociations(data.id);
        
        toast.success('Symbole créé avec succès');
        navigate(`/admin/symbols/${data.id}/edit`);
      } else {
        console.log('🔄 Mise à jour du symbole avec ID:', id);
        
        const { data, error } = await supabase
          .from('symbols')
          .update(dataToSave)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('❌ Erreur lors de la mise à jour:', error);
          throw error;
        }

        console.log('✅ Symbole mis à jour avec succès:', data);
        
        // Sauvegarder les associations de collections
        await saveCollectionAssociations(id!);
        
        toast.success('Symbole mis à jour avec succès');
        
        // Recharger les données pour vérifier la sauvegarde
        setSymbol(data);
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast.error(`Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleViewSymbol = () => {
    if (id && !isNewSymbol) {
      // Ouvrir dans un nouvel onglet pour permettre de revenir facilement à l'administration
      window.open(`/symbols/${id}`, '_blank');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isNewSymbol) return;

    try {
      console.log('📷 Début du téléchargement d\'image:', file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `symbols/${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('symbol-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Erreur lors du téléchargement:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('symbol-images')
        .getPublicUrl(filePath);

      console.log('🔗 URL publique générée:', publicUrl);

      const { error: insertError } = await supabase
        .from('symbol_images')
        .insert([
          {
            symbol_id: id,
            image_url: publicUrl,
            image_type: 'original',
            title: file.name,
          }
        ]);

      if (insertError) {
        console.error('❌ Erreur lors de l\'insertion en base:', insertError);
        throw insertError;
      }

      // Recharger les images
      const { data: imagesData } = await supabase
        .from('symbol_images')
        .select('*')
        .eq('symbol_id', id);

      setImages(imagesData || []);
      toast.success('Image ajoutée avec succès');
    } catch (error: any) {
      console.error('❌ Erreur lors du téléchargement de l\'image:', error);
      toast.error(`Erreur lors du téléchargement de l'image: ${error.message}`);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('symbol_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image supprimée avec succès');
    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression de l\'image:', error);
      toast.error('Erreur lors de la suppression de l\'image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/symbols')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">
          {isNewSymbol ? 'Nouveau Symbole' : 'Modifier le Symbole'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nom du symbole"
                />
              </div>

              <div>
                <Label htmlFor="culture">Culture *</Label>
                <Input
                  id="culture"
                  name="culture"
                  value={formData.culture}
                  onChange={handleInputChange}
                  required
                  placeholder="Culture d'origine"
                />
              </div>

              <div>
                <Label htmlFor="period">Période *</Label>
                <Input
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  required
                  placeholder="Période historique"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Description du symbole"
                />
              </div>

              {/* Collections */}
              <CollectionSelector
                symbolId={isNewSymbol ? undefined : id}
                selectedCollections={selectedCollections}
                onCollectionsChange={setSelectedCollections}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Matériaux ({formData.medium.length} sélectionné{formData.medium.length > 1 ? 's' : ''})</Label>
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
                <Label>Techniques ({formData.technique.length} sélectionné{formData.technique.length > 1 ? 's' : ''})</Label>
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
                <Label>Fonctions ({formData.function.length} sélectionné{formData.function.length > 1 ? 's' : ''})</Label>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleSave} 
                className="w-full" 
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isNewSymbol ? 'Créer le symbole' : 'Sauvegarder'}
                  </>
                )}
              </Button>

              {/* Nouveau bouton pour voir le symbole en frontend */}
              {!isNewSymbol && id && (
                <Button 
                  onClick={handleViewSymbol}
                  variant="outline"
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir le symbole
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>

          {!isNewSymbol && (
            <Card>
              <CardHeader>
                <CardTitle>Images du symbole ({images.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image-upload">Ajouter une image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt={image.title || 'Symbol image'}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {images.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p>Aucune image pour ce symbole</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolEditor;
