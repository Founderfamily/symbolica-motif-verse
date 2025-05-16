
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { FilterCategory, FilterOptions } from '@/types/filters';

interface SearchFiltersProps {
  availableFilters: FilterOptions;
  selectedFilters: FilterOptions;
  onFilterChange: (type: FilterCategory, values: string[]) => void;
  // New prop for translated values
  translatedFilters?: Record<FilterCategory, Record<string, string>>;
}

// Translation keys for filter categories
const filterTranslations: Record<FilterCategory, string> = {
  cultures: 'searchFilters.cultures',
  periods: 'searchFilters.periods',
  medium: 'searchFilters.medium',
  technique: 'searchFilters.technique',
  function: 'searchFilters.function',
};

// Display names for filter categories (when translation is not available)
const filterDisplayNames: Record<FilterCategory, string> = {
  cultures: 'Cultures',
  periods: 'Periods',
  medium: 'Medium / Support',
  technique: 'Technique',
  function: 'Symbolic Function',
};

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  availableFilters,
  selectedFilters,
  onFilterChange,
  translatedFilters = {}
}) => {
  const { currentLanguage } = useTranslation();
  
  // Handle checkbox changes for any filter category
  const handleFilterChange = (category: FilterCategory, value: string, checked: boolean) => {
    if (checked) {
      onFilterChange(category, [...selectedFilters[category], value]);
    } else {
      onFilterChange(category, selectedFilters[category].filter(v => v !== value));
    }
  };

  // Get translated value if available, otherwise use original
  const getTranslatedValue = (category: FilterCategory, value: string): string => {
    if (translatedFilters && 
        translatedFilters[category] && 
        translatedFilters[category][value]) {
      return translatedFilters[category][value];
    }
    return value;
  };

  // Generate accordion items for each filter category
  const renderFilterCategory = (category: FilterCategory) => {
    const values = availableFilters[category];
    if (!values || values.length === 0) return null;

    return (
      <AccordionItem key={category} value={category}>
        <AccordionTrigger className="text-sm font-medium">
          <I18nText translationKey={filterTranslations[category]}>
            {filterDisplayNames[category]}
          </I18nText>
        </AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-48 pr-4">
            <div className="space-y-2">
              {values.map((value) => (
                <div key={`${category}-${value}`} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${category}-${value}`} 
                    checked={selectedFilters[category].includes(value)}
                    onCheckedChange={(checked) => handleFilterChange(category, value, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`${category}-${value}`}
                    className="text-sm cursor-pointer"
                  >
                    {getTranslatedValue(category, value)}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    );
  };

  // Define the default open accordion values
  const defaultOpenValues = Object.keys(availableFilters)
    .filter(key => availableFilters[key as FilterCategory]?.length > 0)
    .slice(0, 3) as FilterCategory[]; // Open first three categories by default
  
  return (
    <Accordion type="multiple" defaultValue={defaultOpenValues} className="w-full">
      {Object.keys(filterTranslations).map(category => 
        renderFilterCategory(category as FilterCategory)
      )}
    </Accordion>
  );
};
