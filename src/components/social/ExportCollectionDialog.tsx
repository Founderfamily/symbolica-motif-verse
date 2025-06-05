
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, FileText, Table } from 'lucide-react';
import { toast } from 'sonner';

interface ExportCollectionDialogProps {
  collectionId: string;
  collectionName: string;
  symbols: any[];
  className?: string;
}

export const ExportCollectionDialog: React.FC<ExportCollectionDialogProps> = ({
  collectionId,
  collectionName,
  symbols,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  const exportAsJSON = () => {
    const exportData = {
      collection: {
        id: collectionId,
        name: collectionName,
        exportedAt: new Date().toISOString(),
        totalSymbols: symbols.length
      },
      symbols: symbols.map(symbol => ({
        id: symbol.id,
        name: symbol.name,
        culture: symbol.culture,
        period: symbol.period,
        description: symbol.description,
        medium: symbol.medium,
        technique: symbol.technique,
        function: symbol.function
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    downloadFile(blob, `${collectionName}.json`);
  };

  const exportAsCSV = () => {
    const headers = [
      'ID',
      'Nom',
      'Culture',
      'Période',
      'Description',
      'Médium',
      'Technique',
      'Fonction'
    ];

    const csvContent = [
      headers.join(','),
      ...symbols.map(symbol => [
        symbol.id,
        `"${symbol.name || ''}"`,
        `"${symbol.culture || ''}"`,
        `"${symbol.period || ''}"`,
        `"${(symbol.description || '').replace(/"/g, '""')}"`,
        `"${Array.isArray(symbol.medium) ? symbol.medium.join('; ') : ''}"`,
        `"${Array.isArray(symbol.technique) ? symbol.technique.join('; ') : ''}"`,
        `"${Array.isArray(symbol.function) ? symbol.function.join('; ') : ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${collectionName}.csv`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (exportFormat === 'json') {
        exportAsJSON();
      } else {
        exportAsCSV();
      }
      
      toast.success(`Collection exportée en ${exportFormat.toUpperCase()} !`);
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter "{collectionName}"
          </DialogTitle>
          <DialogDescription>
            Choisissez le format d'export pour votre collection de {symbols.length} symboles.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                JSON (données structurées)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center gap-2">
                <Table className="w-4 h-4" />
                CSV (tableau Excel/Google Sheets)
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Export...' : 'Télécharger'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportCollectionDialog;
