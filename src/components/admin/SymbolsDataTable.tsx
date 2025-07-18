import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Trash2,
  Edit,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { PaginatedSymbol, SymbolFilters, SymbolSortConfig } from '@/hooks/useAdminSymbols';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SymbolsDataTableProps {
  data: PaginatedSymbol[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: SymbolFilters;
  sort: SymbolSortConfig;
  availableFilters: {
    cultures: Array<{ filter_value: string; count: number }>;
    periods: Array<{ filter_value: string; count: number }>;
  };
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: SymbolFilters) => void;
  onSortChange: (sort: SymbolSortConfig) => void;
  onSymbolEdit: (symbol: PaginatedSymbol) => void;
  onSymbolView: (symbol: PaginatedSymbol) => void;
  onSymbolsDelete: (symbolIds: string[]) => void;
}

export default function SymbolsDataTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  filters,
  sort,
  availableFilters,
  isLoading,
  onPageChange,
  onFiltersChange,
  onSortChange,
  onSymbolEdit,
  onSymbolView,
  onSymbolsDelete
}: SymbolsDataTableProps) {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSort = (column: SymbolSortConfig['column']) => {
    const direction = sort.column === column && sort.direction === 'ASC' ? 'DESC' : 'ASC';
    onSortChange({ column, direction });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSymbols(data.map(symbol => symbol.id));
    } else {
      setSelectedSymbols([]);
    }
  };

  const handleSelectSymbol = (symbolId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymbols([...selectedSymbols, symbolId]);
    } else {
      setSelectedSymbols(selectedSymbols.filter(id => id !== symbolId));
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const getSortIcon = (column: SymbolSortConfig['column']) => {
    if (sort.column !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sort.direction === 'ASC' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gestion des Symboles</span>
          <Badge variant="secondary">
            {totalCount.toLocaleString()} symboles
          </Badge>
        </CardTitle>
        
        {/* Filtres et recherche */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, description ou culture..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filters.culture || 'all'}
              onValueChange={(value) => onFiltersChange({ 
                ...filters, 
                culture: value === 'all' ? undefined : value 
              })}
            >
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Culture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les cultures</SelectItem>
                {availableFilters.cultures.map((culture) => (
                  <SelectItem key={culture.filter_value} value={culture.filter_value}>
                    {culture.filter_value} ({culture.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.period || 'all'}
              onValueChange={(value) => onFiltersChange({ 
                ...filters, 
                period: value === 'all' ? undefined : value 
              })}
            >
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                {availableFilters.periods.map((period) => (
                  <SelectItem key={period.filter_value} value={period.filter_value}>
                    {period.filter_value} ({period.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions sur sélection */}
        {selectedSymbols.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <span className="text-sm font-medium">
              {selectedSymbols.length} symbole(s) sélectionné(s)
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onSymbolsDelete(selectedSymbols);
                setSelectedSymbols([]);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Tableau */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSymbols.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Nom
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('culture')}
                >
                  <div className="flex items-center">
                    Culture
                    {getSortIcon('culture')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('period')}
                >
                  <div className="flex items-center">
                    Période
                    {getSortIcon('period')}
                  </div>
                </TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Vérifications</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Créé le
                    {getSortIcon('created_at')}
                  </div>
                </TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton rows
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><div className="h-4 w-4 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Aucun symbole trouvé
                  </TableCell>
                </TableRow>
              ) : (
                data.map((symbol) => (
                  <TableRow key={symbol.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedSymbols.includes(symbol.id)}
                        onCheckedChange={(checked) => handleSelectSymbol(symbol.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="max-w-48 truncate" title={symbol.name}>
                        {symbol.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {symbol.culture || 'Non définie'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {symbol.period || 'Non définie'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={symbol.image_count > 0 ? 'default' : 'secondary'}>
                        {symbol.image_count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={symbol.verification_count > 0 ? 'default' : 'secondary'}>
                        {symbol.verification_count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(symbol.created_at), 'dd/MM/yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSymbolView(symbol)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSymbolEdit(symbol)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, totalCount)} sur {totalCount} symboles
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}