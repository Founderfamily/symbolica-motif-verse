
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const mockResults = [
    {
      id: '1',
      title: 'Celtic Triskelion',
      type: 'symbol',
      culture: 'Celtic',
      period: 'Ancient',
      description: 'Ancient Celtic symbol representing the triple goddess'
    },
    {
      id: '2',
      title: 'Sacred Geometry Collection',
      type: 'collection',
      culture: 'Universal',
      period: 'Timeless',
      description: 'Mathematical patterns found in nature and spirituality'
    }
  ];

  const filterCategories = [
    { id: 'culture', label: 'Culture', options: ['Celtic', 'Greek', 'Egyptian', 'Norse'] },
    { id: 'period', label: 'Period', options: ['Ancient', 'Medieval', 'Renaissance', 'Modern'] },
    { id: 'type', label: 'Type', options: ['Symbol', 'Collection', 'Pattern'] }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <I18nText translationKey="search.title">Recherche</I18nText>
        </h1>
        <p className="text-muted-foreground">
          <I18nText translationKey="search.subtitle">
            Explorez notre collection de symboles et collections culturelles
          </I18nText>
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <I18nText translationKey="search.filters">Filtres</I18nText>
        </Button>
        <Button>
          <I18nText translationKey="search.search">Rechercher</I18nText>
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <I18nText translationKey="search.advancedFilters">Filtres avancés</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filterCategories.map((category) => (
                <div key={category.id}>
                  <h4 className="font-medium mb-3">{category.label}</h4>
                  <div className="space-y-2">
                    {category.options.map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFilters([...selectedFilters, option]);
                            } else {
                              setSelectedFilters(selectedFilters.filter(f => f !== option));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">
            {mockResults.length} résultats trouvés
          </span>
          {selectedFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="text-xs">
              {filter}
              <button
                onClick={() => setSelectedFilters(selectedFilters.filter(f => f !== filter))}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>

        {mockResults.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{result.title}</h3>
                <Badge variant="outline">{result.type}</Badge>
              </div>
              <p className="text-muted-foreground mb-3">{result.description}</p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">{result.culture}</Badge>
                <Badge variant="secondary" className="text-xs">{result.period}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
