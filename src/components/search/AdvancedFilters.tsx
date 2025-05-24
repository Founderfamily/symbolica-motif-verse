
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { I18nText } from '@/components/ui/i18n-text';

interface AdvancedFiltersProps {
  cultures: string[];
  periods: string[];
  functions: string[];
  techniques: string[];
  mediums: string[];
  selectedFilters: {
    cultures: string[];
    periods: string[];
    functions: string[];
    techniques: string[];
    mediums: string[];
  };
  onFilterChange: (type: keyof AdvancedFiltersProps['selectedFilters'], values: string[]) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  cultures,
  periods,
  functions,
  techniques,
  mediums,
  selectedFilters,
  onFilterChange,
}) => {
  const handleCheckboxChange = (
    type: keyof AdvancedFiltersProps['selectedFilters'],
    value: string,
    checked: boolean
  ) => {
    const currentValues = selectedFilters[type];
    if (checked) {
      onFilterChange(type, [...currentValues, value]);
    } else {
      onFilterChange(type, currentValues.filter(v => v !== value));
    }
  };

  const FilterSection = ({ 
    title, 
    items, 
    type 
  }: { 
    title: string; 
    items: string[]; 
    type: keyof AdvancedFiltersProps['selectedFilters'] 
  }) => (
    <AccordionItem value={type}>
      <AccordionTrigger className="text-sm font-medium">
        <I18nText translationKey={`searchFilters.${type}`}>{title}</I18nText>
        {selectedFilters[type].length > 0 && (
          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            {selectedFilters[type].length}
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <ScrollArea className="h-48 pr-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${type}-${item}`} 
                  checked={selectedFilters[type].includes(item)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(type, item, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`${type}-${item}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <Accordion type="multiple" defaultValue={['cultures', 'periods']} className="w-full">
      <FilterSection 
        title="Cultures" 
        items={cultures} 
        type="cultures" 
      />
      <FilterSection 
        title="Périodes" 
        items={periods} 
        type="periods" 
      />
      <FilterSection 
        title="Fonctions" 
        items={functions} 
        type="functions" 
      />
      <FilterSection 
        title="Techniques" 
        items={techniques} 
        type="techniques" 
      />
      <FilterSection 
        title="Supports" 
        items={mediums} 
        type="mediums" 
      />
    </Accordion>
  );
};
