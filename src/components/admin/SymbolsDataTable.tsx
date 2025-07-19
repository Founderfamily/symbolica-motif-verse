
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, Search, Filter, ChevronUp, ChevronDown, Image } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteSymbol, type PaginatedSymbol } from '@/hooks/useAdminSymbols';
import { SymbolEditModalAdvanced } from './SymbolEditModalAdvanced';
import { SymbolViewModal } from './SymbolViewModal';
import { SymbolData } from '@/types/supabase';

interface SymbolsDataTableProps {
  symbols: PaginatedSymbol[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function SymbolsDataTable({ symbols, isLoading, onRefresh }: SymbolsDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof PaginatedSymbol>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterImages, setFilterImages] = useState<'all' | 'with' | 'without'>('all');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const deleteSymbol = useDeleteSymbol();

  const filteredAndSortedSymbols = useMemo(() => {
    let filtered = symbols.filter(symbol => {
      const matchesSearch = !searchTerm || 
        symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symbol.culture.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symbol.period.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesImageFilter = 
        filterImages === 'all' ||
        (filterImages === 'with' && symbol.image_count > 0) ||
        (filterImages === 'without' && symbol.image_count === 0);

      return matchesSearch && matchesImageFilter;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });
  }, [symbols, searchTerm, sortField, sortDirection, filterImages]);

  const handleSort = (field: keyof PaginatedSymbol) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (symbol: PaginatedSymbol) => {
    const symbolData: SymbolData = {
      id: symbol.id,
      name: symbol.name,
      culture: symbol.culture,
      period: symbol.period,
      description: symbol.description,
      created_at: symbol.created_at,
      updated_at: symbol.updated_at,
      significance: symbol.significance,
      historical_context: symbol.historical_context,
      related_symbols: symbol.related_symbols,
      tags: symbol.tags,
      medium: symbol.medium,
      technique: symbol.technique,
      function: symbol.function,
      cultural_taxonomy_code: symbol.cultural_taxonomy_code,
      temporal_taxonomy_code: symbol.temporal_taxonomy_code,
      thematic_taxonomy_codes: symbol.thematic_taxonomy_codes,
      sources: symbol.sources,
      translations: symbol.translations
    };
    setSelectedSymbol(symbolData);
    setIsEditModalOpen(true);
  };

  const handleView = (symbol: PaginatedSymbol) => {
    const symbolData: SymbolData = {
      id: symbol.id,
      name: symbol.name,
      culture: symbol.culture,
      period: symbol.period,
      description: symbol.description,
      created_at: symbol.created_at,
      updated_at: symbol.updated_at,
      significance: symbol.significance,
      historical_context: symbol.historical_context,
      related_symbols: symbol.related_symbols,
      tags: symbol.tags,
      medium: symbol.medium,
      technique: symbol.technique,
      function: symbol.function,
      cultural_taxonomy_code: symbol.cultural_taxonomy_code,
      temporal_taxonomy_code: symbol.temporal_taxonomy_code,
      thematic_taxonomy_codes: symbol.thematic_taxonomy_codes,
      sources: symbol.sources,
      translations: symbol.translations
    };
    setSelectedSymbol(symbolData);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (symbolId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce symbole ?')) {
      try {
        await deleteSymbol.mutateAsync(symbolId);
        toast.success('Symbole supprimé avec succès');
        onRefresh();
      } catch (error) {
        console.error('Error deleting symbol:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleSymbolUpdated = () => {
    onRefresh();
    setIsEditModalOpen(false);
    setSelectedSymbol(null);
  };

  const SortableHeader = ({ field, children }: { field: keyof PaginatedSymbol; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-slate-50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Symboles ({filteredAndSortedSymbols.length})</CardTitle>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher un symbole..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterImages} onValueChange={(value: 'all' | 'with' | 'without') => setFilterImages(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par images" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les symboles</SelectItem>
                <SelectItem value="with">Avec images</SelectItem>
                <SelectItem value="without">Sans images</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="name">Nom</SortableHeader>
                  <SortableHeader field="culture">Culture</SortableHeader>
                  <SortableHeader field="period">Période</SortableHeader>
                  <SortableHeader field="image_count">Images</SortableHeader>
                  <SortableHeader field="verification_count">Vérifications</SortableHeader>
                  <SortableHeader field="created_at">Créé le</SortableHeader>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedSymbols.map((symbol) => (
                  <TableRow key={symbol.id}>
                    <TableCell className="font-medium">{symbol.name}</TableCell>
                    <TableCell>{symbol.culture}</TableCell>
                    <TableCell>{symbol.period}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        <Badge variant={symbol.image_count > 0 ? "default" : "secondary"}>
                          {symbol.image_count}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{symbol.verification_count}</Badge>
                    </TableCell>
                    <TableCell>
                      {symbol.created_at ? new Date(symbol.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(symbol)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(symbol)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(symbol.id)}
                          disabled={deleteSymbol.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SymbolEditModalAdvanced
        symbol={selectedSymbol}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSymbol(null);
        }}
        onSymbolUpdated={handleSymbolUpdated}
      />

      <SymbolViewModal
        symbol={selectedSymbol}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSymbol(null);
        }}
      />
    </>
  );
}
