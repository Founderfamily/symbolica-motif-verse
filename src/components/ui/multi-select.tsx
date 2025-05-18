
import React, { useState } from 'react';
import { X, Check, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { I18nText } from '@/components/ui/i18n-text';

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  badgeClassName?: string;
  allowAddNew?: boolean;
  onAddNewOption?: (value: string) => void;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  emptyMessage = "No options available",
  className,
  badgeClassName,
  allowAddNew = false,
  onAddNewOption
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [newOption, setNewOption] = useState("");

  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const handleAddNewOption = (inputValue: string) => {
    setOpen(false);
    if (onAddNewOption) {
      onAddNewOption(inputValue);
    }
    // Add the new option to the selected values if it doesn't exist
    if (!selected.includes(inputValue)) {
      onChange([...selected, inputValue]);
    }
    setNewOption("");
  };

  // Create a map of labels by value for selected items
  const selectedLabels = selected.map(value => {
    const option = options.find(option => option.value === value);
    return option ? option.label : value; // Use the value itself if label not found
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between hover:bg-transparent",
            selected.length > 0 ? "h-auto" : "",
            className
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1 py-1">
            {selected.length === 0 && <span className="text-slate-500">{placeholder}</span>}
            {selectedLabels.map((label, i) => (
              <Badge
                key={`${label}-${i}`}
                variant="secondary"
                className={badgeClassName}
              >
                {label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(selected[i]);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUnselect(selected[i]);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="w-full">
          <CommandInput 
            placeholder={placeholder}
            value={newOption}
            onValueChange={setNewOption}
            className="h-9"
          />
          <CommandEmpty className="py-2 px-2 text-sm">
            {allowAddNew && newOption ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-xs py-1 h-auto"
                onClick={() => handleAddNewOption(newOption)}
              >
                <Plus className="h-3 w-3 mr-1" />
                <I18nText translationKey="multiSelect.addOption">Add "{newOption}"</I18nText>
              </Button>
            ) : (
              emptyMessage
            )}
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    if (isSelected) {
                      handleUnselect(option.value);
                    } else {
                      onChange([...selected, option.value]);
                    }
                  }}
                >
                  <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  {option.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default MultiSelect;
