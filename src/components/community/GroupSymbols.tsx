import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, ExternalLink } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupSymbol } from '@/types/interest-groups';
import { getGroupSymbols, removeSymbolFromGroup } from '@/services/communityService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import GroupSymbolCard from './GroupSymbolCard';
import AddSymbolDialog from './AddSymbolDialog';

interface GroupSymbolsProps {
  groupId: string;
  groupSlug: string;
  isMember: boolean;
}

const GroupSymbols: React.FC<GroupSymbolsProps> = ({ groupId, groupSlug, isMember }) => {
  const [symbols, setSymbols] = useState<GroupSymbol[]>([]);
  const [collectionSymbols, setCollectionSymbols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    loadSymbols();
    loadCollectionSymbols();
  }, [groupId, groupSlug]);

  const loadSymbols = async () => {
    try {
      const symbolsData = await getGroupSymbols(groupId);
      setSymbols(symbolsData);
    } catch (error) {
      console.error('Error loading group symbols:', error);
      toast.error('Erreur lors du chargement des symboles');
    }
  };

  const loadCollectionSymbols = async () => {
    try {
      console.log('🔍 [GroupSymbols] Loading collection symbols for slug:', groupSlug);
      
      // Charger les symboles de la collection correspondante
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('id')
        .eq('slug', groupSlug)
        .single();

      if (collectionError || !collectionData) {
        console.log('📝 [GroupSymbols] No collection found for slug:', groupSlug);
        setLoading(false);
        return;
      }

      const { data: symbolsData, error: symbolsError } = await supabase
        .from('symbols')
        .select(`
          id,
          name,
          culture,
          description,
          collection_symbols!inner(collection_id)
        `)
        .eq('collection_symbols.collection_id', collectionData.id);

      if (symbolsError) {
        console.error('Error loading collection symbols:', symbolsError);
      } else {
        console.log('✅ [GroupSymbols] Loaded', symbolsData?.length || 0, 'symbols from collection');
        setCollectionSymbols(symbolsData || []);
      }
    } catch (error) {
      console.error('Error loading collection symbols:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSymbol = async (groupSymbolId: string) => {
    if (!auth?.user) return;

    try {
      await removeSymbolFromGroup(groupSymbolId, auth.user.id);
      toast.success('Symbole retiré du groupe');
      await loadSymbols();
    } catch (error) {
      console.error('Error removing symbol from group:', error);
      toast.error('Erreur lors de la suppression du symbole');
    }
  };

  const handleSymbolView = (symbolId: string) => {
    window.open(`/symbols/${symbolId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const existingSymbolIds = symbols.map(gs => gs.symbol_id);

  return (
    <div className="space-y-6">
      {/* En-tête avec lien vers la collection */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            <I18nText translationKey="community.symbols">Symboles du Groupe</I18nText>
          </h3>
          <p className="text-sm text-slate-600">
            <I18nText translationKey="community.symbolsDescription">
              Symboles liés à la culture de ce groupe
            </I18nText>
          </p>
        </div>
        
        {collectionSymbols.length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => window.open(`/collections/${groupSlug}`, '_blank')}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Voir la Collection Complète
          </Button>
        )}
      </div>

      {/* Symboles de la collection */}
      {collectionSymbols.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-slate-700">
              Symboles de la Collection "{groupSlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}"
              <span className="text-sm text-slate-500 ml-2">({collectionSymbols.length} symboles)</span>
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectionSymbols.slice(0, 6).map((symbol) => (
              <Card key={symbol.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h5 className="font-medium text-slate-900 mb-2">{symbol.name}</h5>
                  <p className="text-sm text-slate-600 mb-2">{symbol.culture}</p>
                  <p className="text-xs text-slate-500 line-clamp-3">{symbol.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`/symbols/${symbol.id}`, '_blank')}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    {isMember && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          toast.info('Fonctionnalité à venir : ajouter au groupe');
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Ajouter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {collectionSymbols.length > 6 && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => window.open(`/collections/${groupSlug}`, '_blank')}
              >
                Voir tous les {collectionSymbols.length} symboles
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Symboles ajoutés spécifiquement au groupe */}
      {symbols.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-slate-700">
            Symboles Ajoutés par les Membres ({symbols.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {symbols.map((groupSymbol) => (
              <GroupSymbolCard 
                key={groupSymbol.id} 
                groupSymbol={groupSymbol}
                onRemove={handleRemoveSymbol}
                onView={handleSymbolView}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bouton pour ajouter des symboles */}
      {isMember && auth?.user && (
        <div className="flex justify-center">
          <AddSymbolDialog
            groupId={groupId}
            userId={auth.user.id}
            existingSymbolIds={existingSymbolIds}
            onSymbolAdded={loadSymbols}
          >
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <I18nText translationKey="community.addSymbol">Ajouter un Symbole</I18nText>
            </Button>
          </AddSymbolDialog>
        </div>
      )}

      {/* État vide */}
      {symbols.length === 0 && collectionSymbols.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Eye className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucun symbole pour l'instant
            </h3>
            <p className="text-slate-600 mb-6">
              Ce groupe n'a pas encore de symboles associés.
            </p>
            {isMember && auth?.user && (
              <AddSymbolDialog
                groupId={groupId}
                userId={auth.user.id}
                existingSymbolIds={existingSymbolIds}
                onSymbolAdded={loadSymbols}
              >
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <I18nText translationKey="community.addSymbol">Ajouter le Premier Symbole</I18nText>
                </Button>
              </AddSymbolDialog>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupSymbols;