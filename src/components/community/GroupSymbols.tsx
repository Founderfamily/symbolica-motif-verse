
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupSymbol } from '@/types/interest-groups';
import { getGroupSymbols, removeSymbolFromGroup } from '@/services/communityService';
import { toast } from 'sonner';
import GroupSymbolCard from './GroupSymbolCard';
import AddSymbolDialog from './AddSymbolDialog';

interface GroupSymbolsProps {
  groupId: string;
  isMember: boolean;
}

const GroupSymbols: React.FC<GroupSymbolsProps> = ({ groupId, isMember }) => {
  const [symbols, setSymbols] = useState<GroupSymbol[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    loadSymbols();
  }, [groupId]);

  const loadSymbols = async () => {
    try {
      const symbolsData = await getGroupSymbols(groupId);
      setSymbols(symbolsData);
    } catch (error) {
      console.error('Error loading group symbols:', error);
      toast.error('Erreur lors du chargement des symboles');
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
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex space-x-3 animate-pulse">
                <div className="h-16 w-16 bg-slate-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const existingSymbolIds = symbols.map(gs => gs.symbol_id);

  return (
    <div className="space-y-6">
      {/* Header with Add Symbol Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            <I18nText translationKey="community.groupSymbols">Symboles du groupe</I18nText>
          </h3>
          <p className="text-sm text-slate-600">
            <I18nText translationKey="community.symbolsDescription">
              Symboles associés à ce groupe d'intérêt
            </I18nText>
          </p>
        </div>
        
        {isMember && auth?.user && (
          <AddSymbolDialog
            groupId={groupId}
            userId={auth.user.id}
            existingSymbolIds={existingSymbolIds}
            onSymbolAdded={loadSymbols}
          >
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <I18nText translationKey="community.addSymbol">Ajouter un symbole</I18nText>
            </Button>
          </AddSymbolDialog>
        )}
      </div>

      {/* Symbols List */}
      <div className="space-y-4">
        {symbols.map((groupSymbol) => (
          <GroupSymbolCard
            key={groupSymbol.id}
            groupSymbol={groupSymbol}
            onView={handleSymbolView}
            onRemove={handleRemoveSymbol}
          />
        ))}
      </div>

      {symbols.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Eye className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h4 className="font-medium text-slate-900 mb-2">
              <I18nText translationKey="community.noSymbols">Aucun symbole associé</I18nText>
            </h4>
            <p className="text-slate-600 mb-4">
              <I18nText translationKey="community.noSymbolsDescription">
                Ce groupe n'a pas encore de symboles associés
              </I18nText>
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
                  <I18nText translationKey="community.addFirstSymbol">Ajouter le premier symbole</I18nText>
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
