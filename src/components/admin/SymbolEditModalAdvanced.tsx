
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Trash2, Save, Eye, ExternalLink, Star, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateSymbol } from '@/hooks/useAdminSymbols';
import { useSymbolImages } from '@/hooks/useSupabaseSymbols';
import { useSymbolSources, useAddSymbolSource, useDeleteSymbolSource } from '@/hooks/useSymbolSources';
import { useSymbolCommunityVerification, useAddCommunityVerificationComment } from '@/hooks/useSymbolCommunityVerification';
import { useSymbolVerification } from '@/hooks/useSymbolVerification';
import { useSymbolImageUpload, useDeleteSymbolImage, useSetPrimaryImage } from '@/hooks/useSymbolImageUpload';
import { SymbolData } from '@/types/supabase';
import { PaginatedSymbol } from '@/hooks/useAdminSymbols';

interface SymbolEditModalAdvancedProps {
  symbol: SymbolData | PaginatedSymbol | null;
  isOpen: boolean;
  onClose: () => void;
  onSymbolUpdated?: (symbol: SymbolData) => void;
}

export function SymbolEditModalAdvanced({ 
  symbol, 
  isOpen, 
  onClose, 
  onSymbolUpdated 
}: SymbolEditModalAdvancedProps) {
  const [formData, setFormData] = useState({
    name: '',
    culture: '',
    period: '',
    description: '',
    significance: '',
    historical_context: '',
    tags: [] as string[],
    medium: [] as string[],
    technique: [] as string[],
    function: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [newMedium, setNewMedium] = useState('');
  const [newTechnique, setNewTechnique] = useState('');
  const [newFunction, setNewFunction] = useState('');

  // Sources state
  const [newSource, setNewSource] = useState({
    title: '',
    url: '',
    source_type: '',
    description: ''
  });

  // Verification state
  const [newVerification, setNewVerification] = useState({
    comment: '',
    verification_rating: '',
    expertise_level: ''
  });

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSymbol = useUpdateSymbol();
  const { data: images, isLoading: imagesLoading } = useSymbolImages(symbol?.id);
  const { data: sources } = useSymbolSources(symbol?.id || null);
  const { data: verificationData } = useSymbolVerification(symbol?.id || '');
  const { data: communityVerification } = useSymbolCommunityVerification(symbol?.id || null);
  
  const addSource = useAddSymbolSource();
  const deleteSource = useDeleteSymbolSource();
  const addVerificationComment = useAddCommunityVerificationComment();
  const uploadImage = useSymbolImageUpload();
  const deleteImage = useDeleteSymbolImage();
  const setPrimaryImage = useSetPrimaryImage();

  useEffect(() => {
    if (symbol) {
      setFormData({
        name: symbol.name || '',
        culture: symbol.culture || '',
        period: symbol.period || '',
        description: symbol.description || '',
        significance: (symbol as SymbolData).significance || '',
        historical_context: (symbol as SymbolData).historical_context || '',
        tags: (symbol as SymbolData).tags || [],
        medium: (symbol as SymbolData).medium || [],
        technique: (symbol as SymbolData).technique || [],
        function: (symbol as SymbolData).function || []
      });
    }
  }, [symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    try {
      await updateSymbol.mutateAsync({
        id: symbol.id,
        updates: formData
      });
      
      toast.success('Symbole mis à jour avec succès');
      onSymbolUpdated?.({
        ...symbol,
        ...formData,
        updated_at: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Error updating symbol:', error);
      toast.error('Erreur lors de la mise à jour du symbole');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: 'tags' | 'medium' | 'technique' | 'function', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: 'tags' | 'medium' | 'technique' | 'function', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleAddSource = async () => {
    if (!symbol || !newSource.title || !newSource.url || !newSource.source_type) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await addSource.mutateAsync({
        symbol_id: symbol.id,
        title: newSource.title,
        url: newSource.url,
        source_type: newSource.source_type,
        description: newSource.description,
        created_by: 'current-user' // This should be replaced with actual user ID
      });
      
      setNewSource({ title: '', url: '', source_type: '', description: '' });
    } catch (error) {
      console.error('Error adding source:', error);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!symbol) return;
    
    try {
      await deleteSource.mutateAsync({ id: sourceId, symbolId: symbol.id });
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  const handleAddVerificationComment = async () => {
    if (!symbol || !newVerification.comment || !newVerification.verification_rating || !newVerification.expertise_level) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await addVerificationComment.mutateAsync({
        symbolId: symbol.id,
        comment: newVerification.comment,
        verificationRating: newVerification.verification_rating,
        expertiseLevel: newVerification.expertise_level
      });
      
      setNewVerification({ comment: '', verification_rating: '', expertise_level: '' });
    } catch (error) {
      console.error('Error adding verification comment:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !symbol) return;

    try {
      await uploadImage.mutateAsync({
        symbolId: symbol.id,
        file,
        imageType: 'original',
        title: `Image de ${symbol.name}`
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!symbol) return;
    
    try {
      await deleteImage.mutateAsync({ id: imageId, symbolId: symbol.id });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!symbol) return;
    
    try {
      await setPrimaryImage.mutateAsync({ id: imageId, symbolId: symbol.id });
    } catch (error) {
      console.error('Error setting primary image:', error);
    }
  };

  const imagesArray = images ? (Array.isArray(images) ? images : Object.values(images)) : [];
  const primaryImage = imagesArray.find(img => img?.is_primary) || 
                      imagesArray.find(img => img?.image_type === 'original') || 
                      imagesArray[0];

  if (!symbol) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Modifier le symbole : {symbol.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image du symbole */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Image principale</CardTitle>
              </CardHeader>
              <CardContent>
                <AspectRatio ratio={1} className="bg-slate-100 rounded-lg overflow-hidden">
                  {primaryImage ? (
                    <img
                      src={primaryImage.image_url}
                      alt={symbol.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-500">
                      Aucune image
                    </div>
                  )}
                </AspectRatio>
              </CardContent>
            </Card>

            {/* Galerie d'images */}
            {imagesArray.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Galerie ({imagesArray.length} images)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {imagesArray.slice(0, 6).map((image, index) => (
                      <div key={image?.id || index} className="relative aspect-square bg-slate-100 rounded overflow-hidden">
                        {image && (
                          <img
                            src={image.image_url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {imagesArray.length > 6 && (
                    <p className="text-xs text-slate-500 mt-2">
                      +{imagesArray.length - 6} autres images
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Statut de vérification */}
            {verificationData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Statut de vérification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        verificationData.status === 'verified' ? 'default' :
                        verificationData.status === 'uncertain' ? 'secondary' : 'outline'
                      }>
                        {verificationData.status === 'verified' ? 'Vérifié' :
                         verificationData.status === 'uncertain' ? 'Incertain' : 'Non vérifié'}
                      </Badge>
                      <span className="text-sm text-slate-600">
                        {verificationData.averageConfidence}% confiance
                      </span>
                    </div>
                    {verificationData.verificationCount > 0 && (
                      <p className="text-xs text-slate-500">
                        {verificationData.verificationCount} vérification(s)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Formulaire d'édition */}
          <ScrollArea className="h-[70vh]">
            <form onSubmit={handleSubmit} className="space-y-6 pr-4">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">Informations générales</TabsTrigger>
                  <TabsTrigger value="sources">Sources ({sources?.length || 0})</TabsTrigger>
                  <TabsTrigger value="images">Images ({imagesArray.length})</TabsTrigger>
                  <TabsTrigger value="verification">Vérification</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du symbole *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="culture">Culture</Label>
                      <Input
                        id="culture"
                        value={formData.culture}
                        onChange={(e) => handleChange('culture', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="period">Période</Label>
                      <Input
                        id="period"
                        value={formData.period}
                        onChange={(e) => handleChange('period', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="significance">Signification</Label>
                    <Textarea
                      id="significance"
                      value={formData.significance}
                      onChange={(e) => handleChange('significance', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="historical_context">Contexte historique</Label>
                    <Textarea
                      id="historical_context"
                      value={formData.historical_context}
                      onChange={(e) => handleChange('historical_context', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('tags', newTag);
                            setNewTag('');
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          addArrayItem('tags', newTag);
                          setNewTag('');
                        }}
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeArrayItem('tags', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Supports */}
                  <div className="space-y-2">
                    <Label>Supports</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un support..."
                        value={newMedium}
                        onChange={(e) => setNewMedium(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('medium', newMedium);
                            setNewMedium('');
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          addArrayItem('medium', newMedium);
                          setNewMedium('');
                        }}
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.medium.map((item, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {item}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeArrayItem('medium', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Techniques */}
                  <div className="space-y-2">
                    <Label>Techniques</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter une technique..."
                        value={newTechnique}
                        onChange={(e) => setNewTechnique(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('technique', newTechnique);
                            setNewTechnique('');
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          addArrayItem('technique', newTechnique);
                          setNewTechnique('');
                        }}
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.technique.map((item, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {item}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeArrayItem('technique', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Fonctions */}
                  <div className="space-y-2">
                    <Label>Fonctions</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter une fonction..."
                        value={newFunction}
                        onChange={(e) => setNewFunction(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('function', newFunction);
                            setNewFunction('');
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          addArrayItem('function', newFunction);
                          setNewFunction('');
                        }}
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.function.map((item, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {item}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeArrayItem('function', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sources" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Ajouter une nouvelle source</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Titre de la source *</Label>
                        <Input
                          value={newSource.title}
                          onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Titre de la source..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Type de source *</Label>
                        <Select value={newSource.source_type} onValueChange={(value) => setNewSource(prev => ({ ...prev, source_type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="book">Livre</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="website">Site web</SelectItem>
                            <SelectItem value="academic">Article académique</SelectItem>
                            <SelectItem value="museum">Musée</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>URL *</Label>
                        <Input
                          type="url"
                          value={newSource.url}
                          onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newSource.description}
                          onChange={(e) => setNewSource(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description de la source..."
                          rows={2}
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddSource}
                        disabled={addSource.isPending}
                        className="w-full"
                      >
                        {addSource.isPending ? 'Ajout...' : 'Ajouter la source'}
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-3">Sources existantes</h3>
                      <div className="space-y-3">
                        {sources?.map((source) => (
                          <Card key={source.id} className="p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-medium">{source.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {source.source_type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <ExternalLink className="h-3 w-3" />
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {source.url}
                                  </a>
                                </div>
                                {source.description && (
                                  <p className="text-xs text-slate-600 mt-1">{source.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                  <span>{source.upvotes} votes positifs</span>
                                  <span>{source.downvotes} votes négatifs</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSource(source.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Gestion des images</h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadImage.isPending}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadImage.isPending ? 'Upload...' : 'Ajouter une image'}
                      </Button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {imagesArray.map((image, index) => (
                        <Card key={image?.id || index} className="overflow-hidden">
                          <div className="relative aspect-square bg-slate-100">
                            {image && (
                              <>
                                <img
                                  src={image.image_url}
                                  alt={image.title || `Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                  {image.is_primary && (
                                    <Badge variant="default" className="text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      Principale
                                    </Badge>
                                  )}
                                </div>
                                <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                                  {!image.is_primary && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => handleSetPrimaryImage(image.id)}
                                      className="flex-1 text-xs"
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      Principale
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteImage(image.id)}
                                    className="text-xs"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                          {image?.title && (
                            <CardContent className="p-2">
                              <p className="text-xs text-slate-600 truncate">{image.title}</p>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>

                    {imagesArray.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucune image pour ce symbole</p>
                        <p className="text-xs">Cliquez sur "Ajouter une image" pour commencer</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="verification" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Ajouter un commentaire de vérification</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Niveau de confiance</Label>
                          <Select value={newVerification.verification_rating} onValueChange={(value) => setNewVerification(prev => ({ ...prev, verification_rating: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="very_confident">Très sûr</SelectItem>
                              <SelectItem value="somewhat_confident">Moyennement sûr</SelectItem>
                              <SelectItem value="not_confident">Peu sûr</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Niveau d'expertise</Label>
                          <Select value={newVerification.expertise_level} onValueChange={(value) => setNewVerification(prev => ({ ...prev, expertise_level: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="expert">Expert</SelectItem>
                              <SelectItem value="knowledgeable">Connaisseur</SelectItem>
                              <SelectItem value="amateur">Amateur</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Commentaire</Label>
                        <Textarea
                          value={newVerification.comment}
                          onChange={(e) => setNewVerification(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Votre commentaire de vérification..."
                          rows={3}
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddVerificationComment}
                        disabled={addVerificationComment.isPending}
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {addVerificationComment.isPending ? 'Ajout...' : 'Ajouter le commentaire'}
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-3">Commentaires de vérification</h3>
                      <div className="space-y-3">
                        {communityVerification?.map((comment) => (
                          <Card key={comment.id} className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {comment.profiles?.full_name || comment.profiles?.username || 'Utilisateur'}
                                </span>
                                {comment.profiles?.is_admin && (
                                  <Badge variant="default" className="text-xs">Admin</Badge>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Badge variant={
                                  comment.verification_rating === 'very_confident' ? 'default' :
                                  comment.verification_rating === 'somewhat_confident' ? 'secondary' : 'outline'
                                } className="text-xs">
                                  {comment.verification_rating === 'very_confident' ? 'Très sûr' :
                                   comment.verification_rating === 'somewhat_confident' ? 'Moyennement sûr' : 'Peu sûr'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {comment.expertise_level === 'expert' ? 'Expert' :
                                   comment.expertise_level === 'knowledgeable' ? 'Connaisseur' : 'Amateur'}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-slate-700">{comment.comment}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </Card>
                        ))}
                        
                        {(!communityVerification || communityVerification.length === 0) && (
                          <div className="text-center py-4 text-slate-500">
                            <MessageCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Aucun commentaire de vérification</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updateSymbol.isPending} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {updateSymbol.isPending ? 'Mise à jour...' : 'Sauvegarder'}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
