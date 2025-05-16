
export type FilterCategory = 
  | 'cultures'
  | 'periods'
  | 'medium'
  | 'technique'
  | 'function';

export interface FilterOptions {
  cultures: string[];
  periods: string[];
  medium: string[];
  technique: string[];
  function: string[];
}

export interface FilterState {
  selectedFilters: FilterOptions;
  availableFilters: FilterOptions;
}
