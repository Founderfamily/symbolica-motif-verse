
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { I18nText } from '@/components/ui/i18n-text';

interface SearchFiltersProps {
  cultures: string[];
  periods: string[];
  selectedFilters: {
    cultures: string[];
    periods: string[];
  };
  onFilterChange: (type: 'cultures' | 'periods', values: string[]) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  cultures,
  periods,
  selectedFilters,
  onFilterChange,
}) => {
  // Handle checkbox changes for cultures
  const handleCultureChange = (culture: string, checked: boolean) => {
    if (checked) {
      onFilterChange('cultures', [...selectedFilters.cultures, culture]);
    } else {
      onFilterChange('cultures', selectedFilters.cultures.filter(c => c !== culture));
    }
  };
  
  // Handle checkbox changes for periods
  const handlePeriodChange = (period: string, checked: boolean) => {
    if (checked) {
      onFilterChange('periods', [...selectedFilters.periods, period]);
    } else {
      onFilterChange('periods', selectedFilters.periods.filter(p => p !== period));
    }
  };
  
  return (
    <Accordion type="multiple" defaultValue={['cultures', 'periods']} className="w-full">
      <AccordionItem value="cultures">
        <AccordionTrigger className="text-sm font-medium">
          <I18nText translationKey="searchFilters.cultures">Cultures</I18nText>
        </AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-48 pr-4">
            <div className="space-y-2">
              {cultures.map((culture) => (
                <div key={culture} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`culture-${culture}`} 
                    checked={selectedFilters.cultures.includes(culture)}
                    onCheckedChange={(checked) => handleCultureChange(culture, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`culture-${culture}`}
                    className="text-sm cursor-pointer"
                  >
                    {culture}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="periods">
        <AccordionTrigger className="text-sm font-medium">
          <I18nText translationKey="searchFilters.periods">Periods</I18nText>
        </AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-48 pr-4">
            <div className="space-y-2">
              {periods.map((period) => (
                <div key={period} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`period-${period}`} 
                    checked={selectedFilters.periods.includes(period)}
                    onCheckedChange={(checked) => handlePeriodChange(period, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`period-${period}`}
                    className="text-sm cursor-pointer"
                  >
                    {period}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
