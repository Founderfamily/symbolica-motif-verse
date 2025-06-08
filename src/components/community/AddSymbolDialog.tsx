
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { searchSymbolsForGroup, addSymbolToGroup } from '@/services/communityService';
import { toast } from 'sonner';

interface AddSymbolDialogProps {
  groupId: string;
  userId: string;
  existingSymbolIds: string[];
  onSymbolAdded: () => void;
  children: React.ReactNode;
}

const AddSymbolDialog: React.FC<AddSymbolDialogProps> = ({
  groupId,
  userId,
  existingSymbolIds,
  onSymbolAdded,
  children
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);

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

  const searchSymbols = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const results = await searchSymbolsForGroup(searchQuery);
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
    if (!selectedSymbol) return;

    try {
      await addSymbolToGroup(groupId, selectedSymbol.id, userId, notes);
      toast.success('Symbole ajouté au groupe');
      setIsOpen(false);
      setSelectedSymbol(null);
      setNotes('');
      setSearchQuery('');
      setSearchResults([]);
      onSymbolAdded();
    } catch (error) {
      console.error('Error adding symbol to group:', error);
      toast.error('Erreur lors de l\'ajout du symbole');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSymbol(null);
    setNotes('');
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
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
            <Button variant="outline" onClick={handleClose}>
              <I18nText translationKey="common.cancel">Annuler</I18nText>
            </Button>
            <Button onClick={handleAddSymbol} disabled={!selectedSymbol}>
              <I18nText translationKey="community.addSymbol">Ajouter</I18nText>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSymbolDialog;
