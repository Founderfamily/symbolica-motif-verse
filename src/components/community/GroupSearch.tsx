
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface GroupSearchProps {
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  className?: string;
}

export interface SearchFilters {
  type?: 'all' | 'posts' | 'discoveries' | 'comments';
  timeRange?: 'all' | 'today' | 'week' | 'month';
  entityType?: 'all' | 'symbol' | 'collection' | 'contribution';
}

const GroupSearch: React.FC<GroupSearchProps> = ({ 
  onSearchChange, 
  onFilterChange, 
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    timeRange: 'all',
    entityType: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearchChange]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      timeRange: 'all',
      entityType: 'all'
    });
    setSearchQuery('');
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== 'all') || searchQuery.length > 0;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search in group..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-12"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-600">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchQuery}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchQuery('')}
              />
            </Badge>
          )}
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.type}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('type', 'all')}
              />
            </Badge>
          )}
          {filters.timeRange !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Time: {filters.timeRange}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('timeRange', 'all')}
              />
            </Badge>
          )}
          {filters.entityType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Entity: {filters.entityType}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('entityType', 'all')}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-slate-50 border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                <I18nText translationKey="community.contentType">Content Type</I18nText>
              </label>
              <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="posts">Posts</SelectItem>
                  <SelectItem value="discoveries">Discoveries</SelectItem>
                  <SelectItem value="comments">Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                <I18nText translationKey="community.timeRange">Time Range</I18nText>
              </label>
              <Select value={filters.timeRange} onValueChange={(value) => updateFilter('timeRange', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                <I18nText translationKey="community.entityType">Entity Type</I18nText>
              </label>
              <Select value={filters.entityType} onValueChange={(value) => updateFilter('entityType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="symbol">Symbols</SelectItem>
                  <SelectItem value="collection">Collections</SelectItem>
                  <SelectItem value="contribution">Contributions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSearch;
