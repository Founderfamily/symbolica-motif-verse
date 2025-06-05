
import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounceCallback } from 'usehooks-ts';

interface OptimizedCommunitySearchProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export const OptimizedCommunitySearch: React.FC<OptimizedCommunitySearchProps> = ({ 
  onSearchChange,
  placeholder = "Search groups..."
}) => {
  const [localQuery, setLocalQuery] = useState('');

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounceCallback((query: string) => {
    onSearchChange(query);
  }, 300);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setLocalQuery('');
    onSearchChange('');
  }, [onSearchChange]);

  const searchIcon = useMemo(() => (
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
  ), []);

  return (
    <div className="relative max-w-md">
      {searchIcon}
      <Input
        placeholder={placeholder}
        value={localQuery}
        onChange={handleInputChange}
        className="pl-10 pr-10"
      />
      {localQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default OptimizedCommunitySearch;
