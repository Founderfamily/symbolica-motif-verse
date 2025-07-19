
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Upload, Trash2, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateSymbol } from '@/hooks/useAdminSymbols';
import { useSymbolImages } from '@/hooks/useSupabaseSymbols';
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

  const updateSymbol = useUpdateSymbol();
  const { data: images, isLoading: imagesLoading } = useSymbolImages(symbol?.id);

  useEffect(() => {
    if (symbol) {
      setFormData({
        name: symbol.name || '',
        culture: symbol.culture || '',
        period: symbol.period || '',
        description: symbol.description || '',
        significance: symbol.significance || '',
        historical_context: symbol.historical_context || '',
        tags: symbol.tags || [],
        medium: symbol.medium || [],
        technique: symbol.technique || [],
        function: symbol.function || []
      });
    }
  }, [symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    try {
      const updatedSymbol = await updateSymbol.mutateAsync({
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

  const imagesArray = images ? (Array.isArray(images) ? images : Object.values(images)) : [];
  const primaryImage = imagesArray.find(img => img?.is_primary) || 
                      imagesArray.find(img => img?.image_type === 'original') || 
                      imagesArray[0];

  if (!symbol) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
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
          </div>

          {/* Formulaire d'édition */}
          <ScrollArea className="h-[60vh]">
            <form onSubmit={handleSubmit} className="space-y-6 pr-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Informations</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="technical">Technique</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
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
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
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
                </TabsContent>

                <TabsContent value="technical" className="space-y-4 mt-4">
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
