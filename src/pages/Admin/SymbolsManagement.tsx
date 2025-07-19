
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { 
  useAdminSymbols, 
  useSymbolStats, 
  useSymbolFilters, 
  useDeleteSymbols,
  SymbolFilters, 
  SymbolSortConfig,
  PaginatedSymbol 
} from '@/hooks/useAdminSymbols';
import SymbolsDataTable from '@/components/admin/SymbolsDataTable';
import { SymbolEditModal } from '@/components/admin/SymbolEditModal';
import { SymbolViewModal } from '@/components/admin/SymbolViewModal';
import { Database, Eye, Image, CheckCircle, Calendar, TrendingUp } from 'lucide-react';

export default function SymbolsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [filters, setFilters] = useState<SymbolFilters>({});
  const [sort, setSort] = useState<SymbolSortConfig>({ column: 'created_at', direction: 'DESC' });
  const [selectedSymbol, setSelectedSymbol] = useState<PaginatedSymbol | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: symbolsData, isLoading, refetch } = useAdminSymbols(currentPage, pageSize, filters, sort);
  const { data: stats } = useSymbolStats();
  const { data: availableFilters } = useSymbolFilters();
  const deleteSymbols = useDeleteSymbols();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: SymbolFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSort: SymbolSortConfig) => {
    setSort(newSort);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handleSymbolEdit = (symbol: PaginatedSymbol) => {
    setSelectedSymbol(symbol);
    setIsEditModalOpen(true);
  };

  const handleSymbolView = (symbol: PaginatedSymbol) => {
    setSelectedSymbol(symbol);
    setIsViewModalOpen(true);
  };

  const handleSymbolsDelete = async (symbolIds: string[]) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${symbolIds.length} symbole(s) ? Cette action est irréversible.`)) {
      await deleteSymbols.mutateAsync(symbolIds);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestion des Symboles</h1>
        <p className="text-muted-foreground">
          Interface optimisée pour gérer des milliers de symboles avec recherche, filtres et pagination avancée.
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Symboles</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_symbols.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cultures</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cultures_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Périodes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.periods_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vérifiés</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verified_symbols}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_symbols > 0 ? ((stats.verified_symbols / stats.total_symbols) * 100).toFixed(1) : '0'}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avec Images</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.symbols_with_images}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_symbols > 0 ? ((stats.symbols_with_images / stats.total_symbols) * 100).toFixed(1) : '0'}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recent_symbols_count}</div>
              <Badge variant="secondary" className="text-xs">
                7 derniers jours
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table principale */}
      <SymbolsDataTable
        data={symbolsData?.data || []}
        totalCount={symbolsData?.totalCount || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        filters={filters}
        sort={sort}
        availableFilters={availableFilters || { cultures: [], periods: [] }}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onSymbolEdit={handleSymbolEdit}
        onSymbolView={handleSymbolView}
        onSymbolsDelete={handleSymbolsDelete}
      />

      {/* Modales */}
      {selectedSymbol && isEditModalOpen && (
        <SymbolEditModal
          symbol={selectedSymbol}
          onSymbolUpdated={(updatedSymbol) => {
            // Refresh the symbols list
            refetch();
            setIsEditModalOpen(false);
            setSelectedSymbol(null);
          }}
        />
      )}

      <SymbolViewModal
        symbol={selectedSymbol}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSymbol(null);
        }}
      />
    </div>
  );
}
