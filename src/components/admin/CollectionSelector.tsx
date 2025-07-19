
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

export function CollectionSelector({ symbolId, selectedCollections, onCollectionsChange }: CollectionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableCollections, setAvailableCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchCollections();
    } else {
      setAvailableCollections([]);
    }
  }, [searchTerm]);

  const searchCollections = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections_with_symbols')
        .select('*')
        .ilike('slug', `%${searchTerm}%`)
        .limit(10);

      if (error) throw error;

      const collections = (data || []).map(item => ({
        id: item.id,
        slug: item.slug,
        collection_translations: Array.isArray(item.collection_translations) 
          ? item.collection_translations as any[] 
          : []
      }));

      setAvailableCollections(collections);
    } catch (error) {
      console.error('Error searching collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCollection = (collection: Collection) => {
    if (!selectedCollections.find(c => c.id === collection.id)) {
      onCollectionsChange([...selectedCollections, collection]);
    }
    setSearchTerm('');
    setAvailableCollections([]);
  };

  const removeCollection = (collectionId: string) => {
    onCollectionsChange(selectedCollections.filter(c => c.id !== collectionId));
  };

  const getCollectionTitle = (collection: Collection) => {
    const frTranslation = collection.collection_translations.find(t => t.language === 'fr');
    return frTranslation?.title || collection.slug;
  };

  return (
    <div className="space-y-2">
      <Label>Collections associées</Label>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une collection..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        
        {availableCollections.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {availableCollections.map((collection) => (
              <div
                key={collection.id}
                className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => addCollection(collection)}
              >
                <div className="font-medium">{getCollectionTitle(collection)}</div>
                <div className="text-sm text-gray-500">{collection.slug}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedCollections.map((collection) => (
          <Badge
            key={collection.id}
            variant="secondary"
            className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
          >
            {getCollectionTitle(collection)}
            <X
              className="h-3 w-3 cursor-pointer hover:text-blue-900"
              onClick={() => removeCollection(collection.id)}
            />
          </Badge>
        ))}
      </div>

      {selectedCollections.length === 0 && (
        <div className="text-sm text-gray-500 italic">
          Aucune collection associée
        </div>
      )}
    </div>
  );
}
