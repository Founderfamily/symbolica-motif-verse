
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SymbolsManagement = () => {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    culture: '',
    period: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSymbols();
  }, []);

  const fetchSymbols = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .order('name');

      if (error) throw error;
      setSymbols(data || []);
    } catch (error: any) {
      console.error('Error fetching symbols:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les symboles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSymbol = (symbol: SymbolData) => {
    setSelectedSymbol(symbol);
    setFormData({
      name: symbol.name,
      culture: symbol.culture,
      period: symbol.period,
      description: symbol.description || '',
    });
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setSelectedSymbol(null);
    setFormData({
      name: '',
      culture: '',
      period: '',
      description: '',
    });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSymbol) {
        // Mise à jour
        const { error } = await supabase
          .from('symbols')
          .update({
            name: formData.name,
            culture: formData.culture,
            period: formData.period,
            description: formData.description || null,
          })
          .eq('id', selectedSymbol.id);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Symbole mis à jour avec succès',
        });
      } else {
        // Création
        const { error } = await supabase.from('symbols').insert([
          {
            name: formData.name,
            culture: formData.culture,
            period: formData.period,
            description: formData.description || null,
          },
        ]);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Symbole créé avec succès',
        });
      }

      // Rafraîchir la liste
      fetchSymbols();
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error saving symbol:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedSymbol) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce symbole ?')) return;

    try {
      const { error } = await supabase
        .from('symbols')
        .delete()
        .eq('id', selectedSymbol.id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Symbole supprimé avec succès',
      });

      fetchSymbols();
      setIsEditing(false);
      setSelectedSymbol(null);
    } catch (error: any) {
      console.error('Error deleting symbol:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedSymbol) {
      setFormData({
        name: selectedSymbol.name,
        culture: selectedSymbol.culture,
        period: selectedSymbol.period,
        description: selectedSymbol.description || '',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-slate-800">Gestion des Symboles</h2>
        <Button onClick={handleCreateNew}>Nouveau symbole</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-3">Liste des symboles</h3>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                  {symbols.map((symbol) => (
                    <button
                      key={symbol.id}
                      onClick={() => handleSelectSymbol(symbol)}
                      className={`w-full text-left px-3 py-2 rounded-md transition ${
                        selectedSymbol?.id === symbol.id
                          ? 'bg-amber-100 text-amber-800 font-medium'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="text-sm">{symbol.name}</div>
                      <div className="text-xs text-slate-500">{symbol.culture}</div>
                    </button>
                  ))}
                  
                  {symbols.length === 0 && (
                    <p className="text-center text-slate-500 py-4">Aucun symbole trouvé</p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {isEditing
                  ? selectedSymbol
                    ? 'Modifier le symbole'
                    : 'Nouveau symbole'
                  : 'Sélectionnez un symbole ou créez-en un nouveau'}
              </h3>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="culture">Culture</Label>
                    <Input
                      id="culture"
                      name="culture"
                      value={formData.culture}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="period">Période</Label>
                    <Input
                      id="period"
                      name="period"
                      value={formData.period}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    {selectedSymbol && (
                      <Button
                        type="button"
                        onClick={handleDelete}
                        variant="destructive"
                      >
                        Supprimer
                      </Button>
                    )}
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Annuler
                    </Button>
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              ) : (
                <p className="text-slate-500 text-center py-8">
                  Sélectionnez un symbole dans la liste ou créez-en un nouveau
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SymbolsManagement;
