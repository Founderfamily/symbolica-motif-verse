
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Grid, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TaxonomyService } from '@/services/taxonomyService';

interface AdvancedFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    cultures: string[];
    themes: string[];
    sortBy: string;
    viewMode: string;
    maxItems: number;
  };
  onFiltersChange: (filters: any) => void;
}

export function AdvancedFiltersPanel({ isOpen, onClose, filters, onFiltersChange }: AdvancedFiltersPanelProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCulture = (code: string) => {
    const cultures = filters.cultures.includes(code)
      ? filters.cultures.filter(c => c !== code)
      : [...filters.cultures, code];
    updateFilter('cultures', cultures);
  };

  const toggleTheme = (code: string) => {
    const themes = filters.themes.includes(code)
      ? filters.themes.filter(t => t !== code)
      : [...filters.themes, code];
    updateFilter('themes', themes);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      cultures: [],
      themes: [],
      sortBy: 'name',
      viewMode: 'grid',
      maxItems: 50
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <Card className="h-full rounded-none border-0">
              <CardHeader className="sticky top-0 bg-background border-b z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filtres Avancés
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Effacer tout
                  </Button>
                  <div className="flex gap-1">
                    {filters.cultures.length > 0 && (
                      <Badge variant="secondary">{filters.cultures.length} cultures</Badge>
                    )}
                    {filters.themes.length > 0 && (
                      <Badge variant="secondary">{filters.themes.length} thèmes</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Cultures */}
                <div>
                  <h3 className="font-medium mb-3">Cultures</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Object.entries(TaxonomyService.CULTURAL_CODES).map(([code, name]) => (
                      <div key={code} className="flex items-center space-x-2">
                        <Checkbox
                          id={`culture-${code}`}
                          checked={filters.cultures.includes(code)}
                          onCheckedChange={() => toggleCulture(code)}
                        />
                        <Label htmlFor={`culture-${code}`} className="text-sm cursor-pointer flex-1">
                          {name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Thématiques */}
                <div>
                  <h3 className="font-medium mb-3">Thématiques</h3>
                  <div className="space-y-2">
                    {Object.entries(TaxonomyService.THEMATIC_CODES).map(([code, name]) => (
                      <div key={code} className="flex items-center space-x-2">
                        <Checkbox
                          id={`theme-${code}`}
                          checked={filters.themes.includes(code)}
                          onCheckedChange={() => toggleTheme(code)}
                        />
                        <Label htmlFor={`theme-${code}`} className="text-sm cursor-pointer flex-1">
                          {name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tri */}
                <div>
                  <h3 className="font-medium mb-3">Trier par</h3>
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nom</SelectItem>
                      <SelectItem value="culture">Culture</SelectItem>
                      <SelectItem value="period">Période</SelectItem>
                      <SelectItem value="recent">Plus récent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Mode d'affichage */}
                <div>
                  <h3 className="font-medium mb-3">Mode d'affichage</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={filters.viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('viewMode', 'grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={filters.viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('viewMode', 'list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={filters.viewMode === 'mosaic' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('viewMode', 'mosaic')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Nombre d'éléments */}
                <div>
                  <h3 className="font-medium mb-3">Nombre d'éléments max</h3>
                  <div className="space-y-2">
                    <Slider
                      value={[filters.maxItems]}
                      onValueChange={([value]) => updateFilter('maxItems', value)}
                      max={100}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-muted-foreground">
                      {filters.maxItems} symboles
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
