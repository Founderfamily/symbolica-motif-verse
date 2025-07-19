
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { PaginatedSymbol, useUpdateSymbol } from '@/hooks/useAdminSymbols';
import { SymbolData } from '@/types/supabase';
import { CollectionSelector } from './CollectionSelector';

interface Collection {
  id: string;
  slug: string;
  collection_translations: Array<{
    language: string;
    title: string;
    description?: string;
  }>;
}

interface SymbolEditModalProps {
  symbol: PaginatedSymbol | SymbolData | null;
  isOpen: boolean;
  onClose: () => void;
  onSymbolUpdated?: (updatedSymbol: SymbolData) => void;
}

export function SymbolEditModal({ symbol, isOpen, onClose, onSymbolUpdated }: SymbolEditModalProps) {
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

  const [selectedCollections, setSelectedCollections] = useState<Collection[]>([]);

  // Input states for adding new items
  const [newTag, setNewTag] = useState('');
  const [newMedium, setNewMedium] = useState('');
  const [newTechnique, setNewTechnique] = useState('');
  const [newFunction, setNewFunction] = useState('');

  const updateSymbol = useUpdateSymbol();

  useEffect(() => {
    if (symbol) {
      setFormData({
        name: symbol.name || '',
        culture: symbol.culture || '',
        period: symbol.period || '',
        description: symbol.description || '',
        significance: symbol.significance || '',
        historical_context: symbol.historical_context || '',
        tags: Array.isArray(symbol.tags) ? symbol.tags : [],
        medium: Array.isArray(symbol.medium) ? symbol.medium : [],
        technique: Array.isArray(symbol.technique) ? symbol.technique : [],
        function: Array.isArray(symbol.function) ? symbol.function : []
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
      onClose();
    } catch (error) {
      console.error('Error updating symbol:', error);
      toast.error('Erreur lors de la mise à jour du symbole');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: keyof typeof formData, value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = formData[field];
      if (Array.isArray(currentArray) && !currentArray.includes(value.trim())) {
        setFormData(prev => ({
          ...prev,
          [field]: [...currentArray, value.trim()]
        }));
        setValue('');
      }
    }
  };

  const removeFromArray = (field: keyof typeof formData, index: number) => {
    const currentArray = formData[field];
    if (Array.isArray(currentArray)) {
      setFormData(prev => ({
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le symbole</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Layout en 2 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du symbole *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <CollectionSelector
                symbolId={symbol?.id}
                selectedCollections={selectedCollections}
                onCollectionsChange={setSelectedCollections}
              />
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="significance">Signification</Label>
                <Textarea
                  id="significance"
                  value={formData.significance}
                  onChange={(e) => handleChange('significance', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="historical_context">Contexte historique</Label>
                <Textarea
                  id="historical_context"
                  value={formData.historical_context}
                  onChange={(e) => handleChange('historical_context', e.target.value)}
                  rows={4}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Spirituel, Protection, Harmonie"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('tags', newTag, setNewTag);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addToArray('tags', newTag, setNewTag)}
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
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

          {/* Section en bas : 3 colonnes pour Supports, Techniques, Fonctions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
            {/* Supports */}
            <div className="space-y-2">
              <Label>Supports</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Bois, Pierre, Cuir, Coton"
                  value={newMedium}
                  onChange={(e) => setNewMedium(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('medium', newMedium, setNewMedium);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addToArray('medium', newMedium, setNewMedium)}
                >
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.medium.map((item, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                    {item}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFromArray('medium', index)}
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
                  placeholder="Ex: Sculpture, Gravure, Peinture"
                  value={newTechnique}
                  onChange={(e) => setNewTechnique(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('technique', newTechnique, setNewTechnique);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addToArray('technique', newTechnique, setNewTechnique)}
                >
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.technique.map((item, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                    {item}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFromArray('technique', index)}
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
                  placeholder="Ex: Religieux, Décoratif, Protecteur"
                  value={newFunction}
                  onChange={(e) => setNewFunction(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('function', newFunction, setNewFunction);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addToArray('function', newFunction, setNewFunction)}
                >
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.function.map((item, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-orange-50 text-orange-700 border-orange-200">
                    {item}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFromArray('function', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={updateSymbol.isPending}>
              {updateSymbol.isPending ? 'Mise à jour...' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
