
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Save, Clock, Star, BookmarkPlus, X } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';

interface SavedSearch {
  id: string;
  name: string;
  query: AdvancedSearchQuery;
  createdAt: Date;
}

interface AdvancedSearchQuery {
  fullText: string;
  titleOnly: boolean;
  descriptionOnly: boolean;
  includeComments: boolean;
  cultures: string[];
  periods: string[];
  statuses: string[];
  dateFrom?: Date;
  dateTo?: Date;
  hasImages: boolean;
  minComments: number;
  tags: string[];
}

interface AdvancedSearchProps {
  contributions: CompleteContribution[];
  onSearchResults: (results: CompleteContribution[]) => void;
  cultures: string[];
  periods: string[];
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  contributions,
  onSearchResults,
  cultures,
  periods
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState<AdvancedSearchQuery>({
    fullText: '',
    titleOnly: false,
    descriptionOnly: false,
    includeComments: false,
    cultures: [],
    periods: [],
    statuses: [],
    hasImages: false,
    minComments: 0,
    tags: []
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Extract all unique tags
  const allTags = Array.from(new Set(
    contributions.flatMap(c => c.tags.map(t => t.tag))
  ));

  const performSearch = () => {
    let results = [...contributions];

    // Full text search
    if (query.fullText) {
      const searchTerm = query.fullText.toLowerCase();
      results = results.filter(contribution => {
        const titleMatch = query.titleOnly && contribution.title.toLowerCase().includes(searchTerm);
        const descMatch = query.descriptionOnly && contribution.description?.toLowerCase().includes(searchTerm);
        const commentMatch = query.includeComments && contribution.comments.some(c => 
          c.comment.toLowerCase().includes(searchTerm)
        );
        
        if (query.titleOnly) return titleMatch;
        if (query.descriptionOnly) return descMatch;
        
        return titleMatch || descMatch || commentMatch ||
          (!query.titleOnly && !query.descriptionOnly && (
            contribution.title.toLowerCase().includes(searchTerm) ||
            contribution.description?.toLowerCase().includes(searchTerm) ||
            contribution.cultural_context?.toLowerCase().includes(searchTerm) ||
            contribution.location_name?.toLowerCase().includes(searchTerm)
          ));
      });
    }

    // Culture filter
    if (query.cultures.length > 0) {
      results = results.filter(c => 
        c.cultural_context && query.cultures.includes(c.cultural_context)
      );
    }

    // Period filter
    if (query.periods.length > 0) {
      results = results.filter(c => 
        c.period && query.periods.includes(c.period)
      );
    }

    // Status filter
    if (query.statuses.length > 0) {
      results = results.filter(c => query.statuses.includes(c.status));
    }

    // Date range filter
    if (query.dateFrom) {
      results = results.filter(c => new Date(c.created_at) >= query.dateFrom!);
    }
    if (query.dateTo) {
      results = results.filter(c => new Date(c.created_at) <= query.dateTo!);
    }

    // Has images filter
    if (query.hasImages) {
      results = results.filter(c => c.images.length > 0);
    }

    // Minimum comments filter
    if (query.minComments > 0) {
      results = results.filter(c => c.comments.length >= query.minComments);
    }

    // Tags filter
    if (query.tags.length > 0) {
      results = results.filter(c => 
        query.tags.some(tag => c.tags.some(t => t.tag === tag))
      );
    }

    onSearchResults(results);
  };

  const saveSearch = () => {
    if (!saveSearchName.trim()) return;

    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveSearchName,
      query: { ...query },
      createdAt: new Date()
    };

    setSavedSearches(prev => [...prev, newSavedSearch]);
    setSaveSearchName('');
    setShowSaveDialog(false);
  };

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query);
    performSearch();
  };

  const clearSearch = () => {
    setQuery({
      fullText: '',
      titleOnly: false,
      descriptionOnly: false,
      includeComments: false,
      cultures: [],
      periods: [],
      statuses: [],
      hasImages: false,
      minComments: 0,
      tags: []
    });
    onSearchResults(contributions);
  };

  useEffect(() => {
    if (Object.values(query).some(val => 
      typeof val === 'string' ? val !== '' : 
      Array.isArray(val) ? val.length > 0 : 
      typeof val === 'number' ? val > 0 : val
    )) {
      const debounceTimer = setTimeout(performSearch, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [query]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche avancée
          </CardTitle>
          <div className="flex items-center gap-2">
            {savedSearches.length > 0 && (
              <Select onValueChange={(value) => {
                const savedSearch = savedSearches.find(s => s.id === value);
                if (savedSearch) loadSavedSearch(savedSearch);
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Recherches sauvées" />
                </SelectTrigger>
                <SelectContent>
                  {savedSearches.map(search => (
                    <SelectItem key={search.id} value={search.id}>
                      {search.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Réduire' : 'Étendre'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="space-y-2">
          <Input
            placeholder="Recherche dans le contenu..."
            value={query.fullText}
            onChange={(e) => setQuery(prev => ({ ...prev, fullText: e.target.value }))}
            className="text-base"
          />
          
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={query.titleOnly}
                onCheckedChange={(checked) => 
                  setQuery(prev => ({ ...prev, titleOnly: checked as boolean }))
                }
              />
              Titre uniquement
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={query.descriptionOnly}
                onCheckedChange={(checked) => 
                  setQuery(prev => ({ ...prev, descriptionOnly: checked as boolean }))
                }
              />
              Description uniquement
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={query.includeComments}
                onCheckedChange={(checked) => 
                  setQuery(prev => ({ ...prev, includeComments: checked as boolean }))
                }
              />
              Inclure les commentaires
            </label>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cultures */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Cultures</label>
                <Select onValueChange={(value) => {
                  if (!query.cultures.includes(value)) {
                    setQuery(prev => ({ ...prev, cultures: [...prev.cultures, value] }));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter une culture" />
                  </SelectTrigger>
                  <SelectContent>
                    {cultures.map(culture => (
                      <SelectItem key={culture} value={culture}>
                        {culture}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {query.cultures.map(culture => (
                    <Badge key={culture} variant="secondary" className="flex items-center gap-1">
                      {culture}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setQuery(prev => ({
                          ...prev, 
                          cultures: prev.cultures.filter(c => c !== culture)
                        }))}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Periods */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Périodes</label>
                <Select onValueChange={(value) => {
                  if (!query.periods.includes(value)) {
                    setQuery(prev => ({ ...prev, periods: [...prev.periods, value] }));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter une période" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map(period => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {query.periods.map(period => (
                    <Badge key={period} variant="secondary" className="flex items-center gap-1">
                      {period}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setQuery(prev => ({
                          ...prev, 
                          periods: prev.periods.filter(p => p !== period)
                        }))}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Statuts</label>
                <Select onValueChange={(value) => {
                  if (!query.statuses.includes(value)) {
                    setQuery(prev => ({ ...prev, statuses: [...prev.statuses, value] }));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {query.statuses.map(status => (
                    <Badge key={status} variant="secondary" className="flex items-center gap-1">
                      {status}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setQuery(prev => ({
                          ...prev, 
                          statuses: prev.statuses.filter(s => s !== status)
                        }))}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={query.hasImages}
                  onCheckedChange={(checked) => 
                    setQuery(prev => ({ ...prev, hasImages: checked as boolean }))
                  }
                />
                Avec images
              </label>
              
              <div className="flex items-center gap-2">
                <label className="text-sm">Commentaires min:</label>
                <Input
                  type="number"
                  value={query.minComments}
                  onChange={(e) => setQuery(prev => ({ 
                    ...prev, 
                    minComments: parseInt(e.target.value) || 0 
                  }))}
                  className="w-20"
                  min="0"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button onClick={performSearch} className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                Rechercher
              </Button>
              
              <Button 
                variant="outline" 
                onClick={clearSearch}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Effacer
              </Button>

              {!showSaveDialog ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowSaveDialog(true)}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nom de la recherche"
                    value={saveSearchName}
                    onChange={(e) => setSaveSearchName(e.target.value)}
                    className="w-40"
                  />
                  <Button size="sm" onClick={saveSearch}>
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowSaveDialog(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
