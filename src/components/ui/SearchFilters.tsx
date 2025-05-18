
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface Filter {
  id: string;
  name: string;
  options: { value: string; label: string }[];
}

interface SearchFiltersProps {
  filters: Filter[];
  onFilterChange: (filterId: string, selectedOptions: string[]) => void;
  onYearRangeChange: (range: [number, number]) => void;
  yearRange: [number, number];
  selectedFilters: Record<string, string[]>;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onYearRangeChange,
  yearRange,
  selectedFilters,
  onClearFilters
}) => {
  const { t } = useTranslation();
  const [tempYearRange, setTempYearRange] = useState<[number, number]>(yearRange);
  const [openPopoverIds, setOpenPopoverIds] = useState<string[]>([]);
  
  const handleYearRangeChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setTempYearRange(newRange);
  };
  
  const applyYearRange = () => {
    onYearRangeChange(tempYearRange);
  };
  
  const handleFilterOptionToggle = (filterId: string, optionValue: string) => {
    const currentOptions = selectedFilters[filterId] || [];
    const newOptions = currentOptions.includes(optionValue)
      ? currentOptions.filter(value => value !== optionValue)
      : [...currentOptions, optionValue];
      
    onFilterChange(filterId, newOptions);
  };
  
  const clearFilter = (filterId: string) => {
    onFilterChange(filterId, []);
  };
  
  const togglePopover = (filterId: string) => {
    setOpenPopoverIds(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };
  
  const anyFiltersSelected = Object.values(selectedFilters).some(values => values.length > 0) || 
    yearRange[0] !== 0 || yearRange[1] !== 2000;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-700 flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          <I18nText translationKey="search.filters.title">Filters</I18nText>:
        </span>
        
        {filters.map(filter => (
          <Popover 
            key={filter.id} 
            open={openPopoverIds.includes(filter.id)} 
            onOpenChange={() => togglePopover(filter.id)}
          >
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="text-sm h-8 px-3 py-1"
                aria-expanded={openPopoverIds.includes(filter.id)}
              >
                <I18nText translationKey={`search.filters.${filter.id}`}>{filter.name}</I18nText>
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="start">
              <Command>
                <CommandInput>
                  <I18nText translationKey="search.filters.search">Search</I18nText>...
                </CommandInput>
                <CommandList>
                  <CommandEmpty>
                    <I18nText translationKey="search.filters.noResults">No results found</I18nText>
                  </CommandEmpty>
                  <CommandGroup>
                    {filter.options.map(option => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleFilterOptionToggle(filter.id, option.value)}
                      >
                        <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                          (selectedFilters[filter.id] || []).includes(option.value) 
                            ? 'bg-primary border-primary' : 'border-primary'}`
                        }>
                          {(selectedFilters[filter.id] || []).includes(option.value) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ))}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="text-sm h-8 px-3 py-1">
              <I18nText translationKey="search.filters.yearRange">Year Range</I18nText>
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">
                <I18nText translationKey="search.filters.selectYearRange">Select Year Range</I18nText>
              </h4>
              
              <div className="pt-4">
                <Slider
                  defaultValue={yearRange}
                  value={tempYearRange}
                  min={0}
                  max={2000}
                  step={10}
                  onValueChange={handleYearRangeChange}
                />
                
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                  <span>{tempYearRange[0]}</span>
                  <span>{tempYearRange[1]}</span>
                </div>
              </div>
              
              <Button size="sm" onClick={applyYearRange} className="w-full">
                <I18nText translationKey="search.filters.apply">Apply</I18nText>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {anyFiltersSelected && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters} 
            className="text-slate-500 h-8 px-2"
          >
            <I18nText translationKey="search.filters.clearAll">Clear All</I18nText>
            <X className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      
      {/* Display selected filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(selectedFilters).map(([filterId, values]) => 
          values.map(value => {
            const filterName = filters.find(f => f.id === filterId)?.name || filterId;
            const optionLabel = filters
              .find(f => f.id === filterId)?.options
              .find(o => o.value === value)?.label || value;
              
            return (
              <Badge 
                key={`${filterId}-${value}`} 
                variant="outline" 
                className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1"
              >
                <span className="font-medium">{filterName}:</span> {optionLabel}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleFilterOptionToggle(filterId, value)} 
                />
              </Badge>
            );
          })
        )}
        
        {(yearRange[0] !== 0 || yearRange[1] !== 2000) && (
          <Badge 
            variant="outline" 
            className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1"
          >
            <span className="font-medium">
              <I18nText translationKey="search.filters.year">Year</I18nText>:
            </span> {yearRange[0]} - {yearRange[1]}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => onYearRangeChange([0, 2000])} 
            />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
