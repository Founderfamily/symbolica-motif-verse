
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateSymbolSuggestion } from '@/services/aiSymbolGeneratorService';
import { SymbolData } from '@/types/supabase';
import { Loader2, Sparkle, Plus } from 'lucide-react';

const fields: Record<string, { label: string; type: 'text' | 'textarea' | 'list' }> = {
  name: { label: 'Nom du symbole', type: 'text' },
  culture: { label: 'Culture', type: 'text' },
  period: { label: 'Période', type: 'text' },
  description: { label: 'Description', type: 'textarea' },
  function: { label: 'Fonction(s)', type: 'list' },
  tags: { label: 'Étiquettes', type: 'list' },
  medium: { label: 'Matériaux', type: 'list' },
  technique: { label: 'Techniques', type: 'list' },
  significance: { label: 'Signification', type: 'textarea' },
  historical_context: { label: 'Contexte historique', type: 'textarea' },
  // Intentionally omitting 'translations' and 'related_symbols' from the input list form here
};

const SymbolMCPGenerator: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiSymbol, setAiSymbol] = useState<Partial<SymbolData> | null>(null);
  const [editSymbol, setEditSymbol] = useState<Partial<SymbolData> | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setAiSymbol(null);
    setEditSymbol(null);
    try {
      const suggestion = await generateSymbolSuggestion(theme.trim());
      setAiSymbol(suggestion || null);
      setEditSymbol({ ...suggestion });
    } catch (e: any) {
      toast({
        title: 'Erreur de génération',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setEditSymbol((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleListChange = (key: string, value: string, index: number) => {
    setEditSymbol((prev) => {
      const arr = Array.isArray(prev?.[key]) ? [...(prev as any)[key]] : [];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };

  const handleAddToList = (key: string) => {
    setEditSymbol((prev) => {
      const arr = Array.isArray(prev?.[key]) ? [...(prev as any)[key]] : [];
      arr.push('');
      return { ...prev, [key]: arr };
    });
  };

  const handleRemoveFromList = (key: string, idx: number) => {
    setEditSymbol((prev) => {
      const arr = Array.isArray(prev?.[key]) ? [...(prev as any)[key]] : [];
      arr.splice(idx, 1);
      return { ...prev, [key]: arr };
    });
  };

  const handleSave = async () => {
    // Validate required fields
    if (
      !editSymbol?.name ||
      !editSymbol?.culture ||
      !editSymbol?.period
    ) {
      toast({
        title: 'Champs manquants',
        description: 'Remplissez au moins le nom, la culture et la période.',
        variant: 'destructive',
      });
      return;
    }

    // Enforce at least required fields as non-undefined
    const data: {
      name: string;
      culture: string;
      period: string;
      description?: string | null;
      function?: string[];
      tags?: string[];
      medium?: string[];
      technique?: string[];
      significance?: string | null;
      historical_context?: string | null;
    } = {
      name: editSymbol.name,
      culture: editSymbol.culture,
      period: editSymbol.period,
    };

    // Add optional fields if they exist and are strings or arrays
    for (const key of [
      'description', 'function', 'tags', 'medium', 'technique', 'significance', 'historical_context'
    ]) {
      const value = editSymbol[key as keyof SymbolData];
      if (
        typeof value === 'string' ||
        (Array.isArray(value) && value.length > 0)
      ) {
        // @ts-expect-error - direct assignment
        data[key] = value;
      }
    }

    try {
      const { error } = await supabase.from('symbols').insert([data]);
      if (error) throw error;
      toast({
        title: 'Symbole créé 🎉',
        description: `Le symbole "${editSymbol.name}" a été ajouté à la base de données.`,
      });
      setAiSymbol(null);
      setEditSymbol(null);
      setTheme('');
    } catch (e: any) {
      toast({
        title: 'Erreur de création',
        description: e.message || 'Impossible de créer le symbole.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkle className="w-5 h-5 text-yellow-500" />
            Générateur MCP de Symboles
          </CardTitle>
          <div className="text-sm text-stone-600 mt-2">
            Proposez un thème, générez un symbole complet grâce à l’IA, puis validez en un clic !
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-5">
            <Input
              placeholder="Thème (optionnel, ex : Sagesse, Éternité...)"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              onClick={handleGenerate} 
              variant="default" 
              className="gap-2" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkle className="w-4 h-4" />}
              Générer
            </Button>
          </div>
          {editSymbol && (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              {Object.entries(fields).map(([key, field]) => (
                <div key={key}>
                  <Label htmlFor={key}>{field.label}</Label>
                  {field.type === 'text' && (
                    <Input
                      id={key}
                      value={(editSymbol[key as keyof SymbolData] ?? '') as string}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      required={['name', 'culture', 'period'].includes(key)}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      id={key}
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                      value={(editSymbol[key as keyof SymbolData] ?? '') as string}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  )}
                  {field.type === 'list' && (
                    <div>
                      {Array.isArray(editSymbol[key as keyof SymbolData]) 
                        ? (editSymbol[key as keyof SymbolData] as string[]).map((item, idx) => (
                          <div key={idx} className="flex gap-2 mb-1">
                            <Input
                              value={item}
                              onChange={(e) => handleListChange(key, e.target.value, idx)}
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveFromList(key, idx)}
                            >
                              ✕
                            </Button>
                          </div>
                        ))
                        : null}
                      <Button 
                        type="button"
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleAddToList(key)}
                        className="mt-1"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {/* Display related_symbols and translations in readonly blocks if present */}
              {'related_symbols' in (editSymbol as any) && Array.isArray(editSymbol.related_symbols) && (
                <div>
                  <Label>Liens associés</Label>
                  <div className="p-2 bg-stone-100 rounded mb-2 text-xs select-all focus:outline-none" style={{ fontFamily: 'monospace' }}>
                    {(editSymbol.related_symbols as string[]).join(', ')}
                  </div>
                </div>
              )}

              {'translations' in (editSymbol as any) && editSymbol.translations && (
                <div>
                  <Label>Traductions (lecture seule)</Label>
                  <pre className="p-2 bg-stone-100 rounded mb-2 text-xs select-all overflow-x-auto" style={{ fontFamily: 'monospace' }}>
                    {JSON.stringify(editSymbol.translations, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Créer ce symbole
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SymbolMCPGenerator;
