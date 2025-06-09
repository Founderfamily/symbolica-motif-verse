
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X, Search, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Collection {
  id: string;
  slug: string;
  collection_translations: Array<{
    language: string;
    title: string;
    description?: string;
  }>;
}

interface CollectionSelectorProps {
  symbolId?: string;
  selectedCollections: Collection[];
  onCollectionsChange: (collections: Collection[]) => void;
}

export const CollectionSelector: React.FC<CollectionSelectorProps> = ({
  symbolId,
  selectedCollections,
  onCollectionsChange
}) => {
  const [availableCollections, setAvailableCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger toutes les collections disponibles
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data, error } = await supabase
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
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAvailableCollections(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des collections:', error);
        toast.error('Erreur lors du chargement des collections');
      }
    };

    fetchCollections();
  }, []);

  // Filtrer les collections selon le terme de recherche
  const filteredCollections = availableCollections.filter(collection => {
    const frenchTitle = collection.collection_translations.find(t => t.language === 'fr')?.title || '';
    const englishTitle = collection.collection_translations.find(t => t.language === 'en')?.title || '';
    return !selectedCollections.some(sc => sc.id === collection.id) &&
           (frenchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            englishTitle.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const addCollection = (collection: Collection) => {
    onCollectionsChange([...selectedCollections, collection]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const removeCollection = (collectionId: string) => {
    onCollectionsChange(selectedCollections.filter(c => c.id !== collectionId));
  };

  const getCollectionTitle = (collection: Collection, language: string = 'fr') => {
    return collection.collection_translations.find(t => t.language === language)?.title || 
           collection.collection_translations[0]?.title || 
           'Sans titre';
  };

  return (
    <div className="space-y-3">
      <Label>Collections associées</Label>
      
      {/* Collections sélectionnées */}
      {selectedCollections.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedCollections.map((collection) => (
            <Badge key={collection.id} variant="secondary" className="gap-1">
              {getCollectionTitle(collection)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeCollection(collection.id)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Champ de recherche */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une collection..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Dropdown des collections disponibles */}
        {showDropdown && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
            {filteredCollections.length > 0 ? (
              <div className="p-2">
                {filteredCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
                    onClick={() => addCollection(collection)}
                  >
                    <div className="font-medium">{getCollectionTitle(collection)}</div>
                    {collection.collection_translations.find(t => t.language === 'fr')?.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {collection.collection_translations.find(t => t.language === 'fr')?.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchTerm ? 'Aucune collection trouvée' : 'Aucune collection disponible'}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Fermer le dropdown en cliquant à l'extérieur */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};
