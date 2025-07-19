import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PaginatedSymbol, useUpdateSymbol } from '@/hooks/useAdminSymbols';

interface SymbolEditModalProps {
  symbol: PaginatedSymbol | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SymbolEditModal({ symbol, isOpen, onClose }: SymbolEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    culture: '',
    period: '',
    description: ''
  });

  const updateSymbol = useUpdateSymbol();

  useEffect(() => {
    if (symbol) {
      setFormData({
        name: symbol.name || '',
        culture: symbol.culture || '',
        period: symbol.period || '',
        description: symbol.description || ''
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
      onClose();
    } catch (error) {
      console.error('Error updating symbol:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le symbole</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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