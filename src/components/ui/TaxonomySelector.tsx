
import React, { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface TaxonomyOption {
  value: string;
  label: string;
}

interface TaxonomySelectorProps {
  options: TaxonomyOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
  translationPrefix?: string;
  placeholder?: string;
  maxItems?: number;
}

const TaxonomySelector: React.FC<TaxonomySelectorProps> = ({
  options,
  selectedValues,
  onChange,
  label,
  translationPrefix,
  placeholder = 'Select...',
  maxItems = 5,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(item => item !== value));
    } else if (selectedValues.length < maxItems) {
      onChange([...selectedValues, value]);
    }
  };
  
  const removeValue = (value: string) => {
    onChange(selectedValues.filter(item => item !== value));
  };
  
  const selectedLabels = selectedValues.map(value => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  });
  
  // Use translated placeholder if translationPrefix is provided
  const translatedPlaceholder = translationPrefix
    ? t(`${translationPrefix}.placeholder`, placeholder)
    : placeholder;
    
  // Use translated label if translationPrefix is provided
  const translatedLabel = translationPrefix
    ? <I18nText translationKey={`${translationPrefix}.label`}>{label}</I18nText>
    : label;
  
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-700">{translatedLabel}</div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
          >
            {selectedLabels.length > 0 ? (
              <div className="flex flex-wrap gap-1 py-1">
                {selectedLabels.map((label, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-0">
                    {label}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer text-slate-500 hover:text-slate-900" 
                      onClick={(e) => { 
                        e.stopPropagation();
                        removeValue(selectedValues[index]); 
                      }} 
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-slate-500">{translatedPlaceholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={t('common.search', 'Search...')}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                <I18nText translationKey="common.noResults">No results found.</I18nText>
              </CommandEmpty>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleSelect(option.value);
                      setSearchQuery('');
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedValues.length >= maxItems && (
        <p className="text-xs text-amber-600">
          <I18nText 
            translationKey="common.maxItemsReached" 
            params={{ count: maxItems }}
          >
            Maximum of {maxItems} items reached
          </I18nText>
        </p>
      )}
    </div>
  );
};

export default TaxonomySelector;
