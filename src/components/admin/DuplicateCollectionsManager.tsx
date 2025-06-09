
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Merge, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DuplicateGroup {
  title: string;
  language: string;
  collections: Array<{
    id: string;
    slug: string;
    symbol_count: number;
    is_featured: boolean;
  }>;
}

export const DuplicateCollectionsManager: React.FC = () => {
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      
      // Récupérer toutes les collections avec leurs traductions
      const { data: collectionsData, error } = await supabase
        .from('collection_translations')
        .select(`
          title,
          language,
          collections!inner (
            id,
            slug,
            is_featured
          )
        `);

      if (error) throw error;

      // Grouper par titre et langue pour trouver les doublons
      const groupedByTitleAndLang = collectionsData?.reduce((acc, item) => {
        const key = `${item.title.toLowerCase().trim()}-${item.language}`;
        if (!acc[key]) {
          acc[key] = {
            title: item.title,
            language: item.language,
            collections: []
          };
        }
        acc[key].collections.push({
          id: item.collections.id,
          slug: item.collections.slug,
          symbol_count: 0, // Will be populated separately
          is_featured: item.collections.is_featured
        });
        return acc;
      }, {} as Record<string, DuplicateGroup>);

      // Filtrer seulement les vrais doublons (plus d'une collection)
      const duplicateGroups = Object.values(groupedByTitleAndLang || {})
        .filter(group => group.collections.length > 1);

      // Récupérer le nombre de symboles pour chaque collection
      for (const group of duplicateGroups) {
        for (const collection of group.collections) {
          const { count } = await supabase
            .from('collection_symbols')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);
          
          collection.symbol_count = count || 0;
        }
      }

      setDuplicates(duplicateGroups);
    } catch (error) {
      console.error('Erreur lors de la récupération des doublons:', error);
      toast.error('Erreur lors de la récupération des doublons');
    } finally {
      setLoading(false);
    }
  };

  const mergeCollections = async (group: DuplicateGroup) => {
    if (group.collections.length < 2) return;

    const groupKey = `${group.title}-${group.language}`;
    setProcessing(groupKey);

    try {
      // Choisir la collection à conserver (celle avec le plus de symboles ou featured)
      const targetCollection = group.collections.reduce((best, current) => {
        if (current.is_featured && !best.is_featured) return current;
        if (current.symbol_count > best.symbol_count) return current;
        return best;
      });

      const collectionsToMerge = group.collections.filter(c => c.id !== targetCollection.id);

      for (const collection of collectionsToMerge) {
        // Récupérer la position maximale actuelle dans la collection cible
        const { data: maxPositionData } = await supabase
          .from('collection_symbols')
          .select('position')
          .eq('collection_id', targetCollection.id)
          .order('position', { ascending: false })
          .limit(1);

        const maxPosition = maxPositionData?.[0]?.position || 0;

        // Récupérer tous les symboles à transférer avec leurs positions
        const { data: symbolsToTransfer, error: fetchError } = await supabase
          .from('collection_symbols')
          .select('symbol_id, position')
          .eq('collection_id', collection.id)
          .order('position');

        if (fetchError) throw fetchError;

        // Supprimer les anciens liens
        const { error: deleteError } = await supabase
          .from('collection_symbols')
          .delete()
          .eq('collection_id', collection.id);

        if (deleteError) throw deleteError;

        // Créer les nouveaux liens avec des positions mises à jour
        if (symbolsToTransfer && symbolsToTransfer.length > 0) {
          const newLinks = symbolsToTransfer.map((symbol, index) => ({
            collection_id: targetCollection.id,
            symbol_id: symbol.symbol_id,
            position: maxPosition + index + 1
          }));

          const { error: insertError } = await supabase
            .from('collection_symbols')
            .insert(newLinks);

          if (insertError) throw insertError;
        }

        // Supprimer les traductions
        const { error: deleteTransError } = await supabase
          .from('collection_translations')
          .delete()
          .eq('collection_id', collection.id);

        if (deleteTransError) throw deleteTransError;

        // Supprimer la collection
        const { error: deleteCollError } = await supabase
          .from('collections')
          .delete()
          .eq('id', collection.id);

        if (deleteCollError) throw deleteCollError;
      }

      toast.success(`Collections fusionnées avec succès vers "${targetCollection.slug}"`);
      fetchDuplicates(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la fusion:', error);
      toast.error('Erreur lors de la fusion des collections');
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Collections Doublons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Merge className="h-5 w-5" />
          Gestion des Collections Doublons
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {duplicates.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Aucun doublon détecté ! Toutes les collections sont uniques.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {duplicates.length} groupe(s) de doublons détecté(s). 
                Vérifiez et fusionnez si nécessaire.
              </AlertDescription>
            </Alert>

            {duplicates.map((group, index) => {
              const groupKey = `${group.title}-${group.language}`;
              const isProcessing = processing === groupKey;
              
              return (
                <Card key={index} className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{group.title}</h4>
                          <Badge variant="outline">{group.language.toUpperCase()}</Badge>
                        </div>
                        
                        <div className="space-y-1">
                          {group.collections.map((collection) => (
                            <div key={collection.id} className="flex items-center gap-2 text-sm">
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {collection.slug}
                              </code>
                              <span className="text-gray-600">
                                {collection.symbol_count} symbole(s)
                              </span>
                              {collection.is_featured && (
                                <Badge variant="secondary" className="text-xs">
                                  En vedette
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => mergeCollections(group)}
                        disabled={isProcessing}
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                      >
                        {isProcessing ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <Merge className="h-4 w-4" />
                        )}
                        Fusionner
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}

        <div className="pt-4 border-t">
          <Button 
            onClick={fetchDuplicates} 
            variant="outline" 
            disabled={loading}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Actualiser la recherche
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
