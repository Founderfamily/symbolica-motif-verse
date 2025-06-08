
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Trash2, Eye } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupSymbol } from '@/types/interest-groups';
import { getGroupSymbols, addSymbolToGroup, removeSymbolFromGroup, searchSymbolsForGroup } from '@/services/communityService';
import { toast } from 'sonner';

interface GroupSymbolsProps {
  groupId: string;
  isMember: boolean;
}

const GroupSymbols: React.FC<GroupSymbolsProps> = ({ groupId, isMember }) => {
  const [symbols, setSymbols] = useState<GroupSymbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    loadSymbols();
  }, [groupId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchSymbols();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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

  const searchSymbols = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const results = await searchSymbolsForGroup(searchQuery);
      // Filter out symbols already in the group
      const existingSymbolIds = symbols.map(gs => gs.symbol_id);
      const filteredResults = results.filter(symbol => !existingSymbolIds.includes(symbol.id));
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching symbols:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setSearching(false);
    }
  };

  const handleAddSymbol = async () => {
    if (!auth?.user || !selectedSymbol) return;

    try {
      await addSymbolToGroup(groupId, selectedSymbol.id, auth.user.id, notes);
      toast.success('Symbole ajouté au groupe');
      setIsAddDialogOpen(false);
      setSelectedSymbol(null);
      setNotes('');
      setSearchQuery('');
      setSearchResults([]);
      await loadSymbols();
    } catch (error) {
      console.error('Error adding symbol to group:', error);
      toast.error('Erreur lors de l\'ajout du symbole');
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <I18nText translationKey="community.addSymbol">Ajouter un symbole</I18nText>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  <I18nText translationKey="community.addSymbolToGroup">Ajouter un symbole au groupe</I18nText>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher des symboles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {searchResults.map((symbol) => (
                      <div
                        key={symbol.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSymbol?.id === symbol.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setSelectedSymbol(symbol)}
                      >
                        <div className="font-medium">{symbol.name}</div>
                        <div className="text-sm text-slate-600">
                          {symbol.culture} • {symbol.period}
                        </div>
                        {symbol.description && (
                          <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {symbol.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes Input */}
                {selectedSymbol && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <I18nText translationKey="community.notes">Notes (optionnel)</I18nText>
                    </label>
                    <Textarea
                      placeholder="Pourquoi ce symbole est-il pertinent pour ce groupe..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setSelectedSymbol(null);
                      setNotes('');
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <I18nText translationKey="common.cancel">Annuler</I18nText>
                  </Button>
                  <Button
                    onClick={handleAddSymbol}
                    disabled={!selectedSymbol}
                  >
                    <I18nText translationKey="community.addSymbol">Ajouter</I18nText>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Symbols List */}
      <div className="space-y-4">
        {symbols.map((groupSymbol) => (
          <Card key={groupSymbol.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Symbol Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg text-slate-900">
                        {groupSymbol.symbol?.name || 'Symbole inconnu'}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">
                          {groupSymbol.symbol?.culture}
                        </Badge>
                        <Badge variant="outline">
                          {groupSymbol.symbol?.period}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSymbolView(groupSymbol.symbol_id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {auth?.user?.id === groupSymbol.added_by && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSymbol(groupSymbol.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {groupSymbol.symbol?.description && (
                    <p className="text-slate-600 mb-3">
                      {groupSymbol.symbol.description}
                    </p>
                  )}

                  {groupSymbol.notes && (
                    <div className="bg-slate-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-slate-700">{groupSymbol.notes}</p>
                    </div>
                  )}

                  {/* Additional Symbol Info */}
                  {(groupSymbol.symbol?.medium || groupSymbol.symbol?.technique || groupSymbol.symbol?.function) && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {groupSymbol.symbol?.medium?.map((m, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {m}
                        </Badge>
                      ))}
                      {groupSymbol.symbol?.technique?.map((t, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                      {groupSymbol.symbol?.function?.map((f, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Added by info */}
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Avatar className="h-6 w-6">
                      <AvatarImage 
                        src={`https://avatar.vercel.sh/${groupSymbol.added_by_profile?.username || 'user'}.png`} 
                        alt={groupSymbol.added_by_profile?.username || 'User'} 
                      />
                      <AvatarFallback>
                        {groupSymbol.added_by_profile?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      Ajouté par {groupSymbol.added_by_profile?.full_name || groupSymbol.added_by_profile?.username || 'Utilisateur inconnu'}
                    </span>
                    <span>•</span>
                    <span>{new Date(groupSymbol.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                <I18nText translationKey="community.addFirstSymbol">Ajouter le premier symbole</I18nText>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupSymbols;
