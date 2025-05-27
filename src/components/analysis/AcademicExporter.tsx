
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Database, Image, BookOpen, Settings } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { SymbolData } from '@/types/supabase';

interface ExportConfig {
  format: 'pdf' | 'json' | 'csv' | 'bibtex';
  includeImages: boolean;
  includeMetadata: boolean;
  includeAnalysis: boolean;
  citationStyle: 'apa' | 'mla' | 'chicago' | 'ieee';
  customFields: string[];
}

interface AcademicExporterProps {
  symbols?: SymbolData[];
  analysisData?: any;
}

const AcademicExporter: React.FC<AcademicExporterProps> = ({ 
  symbols = [], 
  analysisData 
}) => {
  const { user } = useAuth();
  const [config, setConfig] = useState<ExportConfig>({
    format: 'pdf',
    includeImages: true,
    includeMetadata: true,
    includeAnalysis: false,
    citationStyle: 'apa',
    customFields: []
  });
  const [authorName, setAuthorName] = useState(user?.full_name || '');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        metadata: {
          title: title || 'Symbol Analysis Export',
          author: authorName,
          abstract,
          keywords: keywords.split(',').map(k => k.trim()),
          created: new Date().toISOString(),
          format: config.format,
          citationStyle: config.citationStyle
        },
        symbols: config.includeMetadata ? symbols : symbols.map(s => ({
          id: s.id,
          name: s.name,
          culture: s.culture,
          period: s.period
        })),
        analysis: config.includeAnalysis ? analysisData : null,
        citation: generateCitation(),
        bibliography: generateBibliography()
      };

      switch (config.format) {
        case 'json':
          downloadJSON(exportData);
          break;
        case 'csv':
          downloadCSV(symbols);
          break;
        case 'pdf':
          await generatePDF(exportData);
          break;
        case 'bibtex':
          downloadBibTeX();
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateCitation = (): string => {
    const year = new Date().getFullYear();
    const date = new Date().toLocaleDateString();
    
    switch (config.citationStyle) {
      case 'apa':
        return `${authorName} (${year}). ${title}. Cultural Symbols Database. Retrieved ${date}`;
      case 'mla':
        return `${authorName}. "${title}." Cultural Symbols Database, ${date}.`;
      case 'chicago':
        return `${authorName}. "${title}." Cultural Symbols Database. Accessed ${date}.`;
      case 'ieee':
        return `${authorName}, "${title}," Cultural Symbols Database, ${date}.`;
      default:
        return `${authorName}. ${title}. ${year}.`;
    }
  };

  const generateBibliography = (): string[] => {
    return symbols.map(symbol => {
      const year = symbol.created_at ? new Date(symbol.created_at).getFullYear() : 'n.d.';
      return `${symbol.name}. (${year}). ${symbol.culture} culture, ${symbol.period} period. Cultural Symbols Database.`;
    });
  };

  const downloadJSON = (data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `symbols-export-${Date.now()}.json`);
  };

  const downloadCSV = (symbols: SymbolData[]) => {
    const headers = ['Name', 'Culture', 'Period', 'Description', 'Function', 'Medium', 'Technique'];
    const rows = symbols.map(symbol => [
      symbol.name,
      symbol.culture,
      symbol.period,
      symbol.description || '',
      (symbol.function || []).join('; '),
      (symbol.medium || []).join('; '),
      (symbol.technique || []).join('; ')
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadBlob(blob, `symbols-export-${Date.now()}.csv`);
  };

  const generatePDF = async (data: any) => {
    // Note: In a real implementation, you would use a PDF library like jsPDF or PDFKit
    // For now, we'll create a formatted text version
    const content = `
${data.metadata.title}
Author: ${data.metadata.author}

Abstract:
${data.metadata.abstract}

Keywords: ${data.metadata.keywords.join(', ')}

Symbols Analyzed:
${symbols.map(s => `- ${s.name} (${s.culture}, ${s.period})`).join('\n')}

Citation:
${data.citation}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();
    
    const blob = new Blob([content], { type: 'text/plain' });
    downloadBlob(blob, `symbols-export-${Date.now()}.txt`);
  };

  const downloadBibTeX = () => {
    const bibtex = `@misc{symbols_${Date.now()},
  author = {${authorName}},
  title = {${title}},
  year = {${new Date().getFullYear()}},
  howpublished = {Cultural Symbols Database},
  note = {Accessed ${new Date().toLocaleDateString()}}
}`;
    
    const blob = new Blob([bibtex], { type: 'text/plain' });
    downloadBlob(blob, `symbols-export-${Date.now()}.bib`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <I18nText translationKey="analysis.academicExporter">Academic Exporter</I18nText>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Publication Info */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <I18nText translationKey="analysis.publicationInfo">Publication Information</I18nText>
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  <I18nText translationKey="analysis.title">Title</I18nText>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Analysis of Cultural Symbols"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">
                  <I18nText translationKey="analysis.author">Author</I18nText>
                </Label>
                <Input
                  id="author"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abstract">
                <I18nText translationKey="analysis.abstract">Abstract</I18nText>
              </Label>
              <Textarea
                id="abstract"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Brief description of your analysis..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keywords">
                <I18nText translationKey="analysis.keywords">Keywords (comma-separated)</I18nText>
              </Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="cultural symbols, analysis, patterns"
              />
            </div>
          </div>

          {/* Export Configuration */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <I18nText translationKey="analysis.exportConfig">Export Configuration</I18nText>
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  <I18nText translationKey="analysis.format">Format</I18nText>
                </Label>
                <Select value={config.format} onValueChange={(value: any) => setConfig({...config, format: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                    <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                    <SelectItem value="bibtex">BibTeX Citation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>
                  <I18nText translationKey="analysis.citationStyle">Citation Style</I18nText>
                </Label>
                <Select value={config.citationStyle} onValueChange={(value: any) => setConfig({...config, citationStyle: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apa">APA</SelectItem>
                    <SelectItem value="mla">MLA</SelectItem>
                    <SelectItem value="chicago">Chicago</SelectItem>
                    <SelectItem value="ieee">IEEE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeImages"
                  checked={config.includeImages}
                  onCheckedChange={(checked) => setConfig({...config, includeImages: !!checked})}
                />
                <Label htmlFor="includeImages" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <I18nText translationKey="analysis.includeImages">Include Images</I18nText>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetadata"
                  checked={config.includeMetadata}
                  onCheckedChange={(checked) => setConfig({...config, includeMetadata: !!checked})}
                />
                <Label htmlFor="includeMetadata" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <I18nText translationKey="analysis.includeMetadata">Include Full Metadata</I18nText>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAnalysis"
                  checked={config.includeAnalysis}
                  onCheckedChange={(checked) => setConfig({...config, includeAnalysis: !!checked})}
                />
                <Label htmlFor="includeAnalysis">
                  <I18nText translationKey="analysis.includeAnalysisData">Include Analysis Data</I18nText>
                </Label>
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h5 className="font-medium mb-2">
              <I18nText translationKey="analysis.exportSummary">Export Summary</I18nText>
            </h5>
            <div className="text-sm text-slate-600 space-y-1">
              <p>• {symbols.length} symbols selected</p>
              <p>• Format: {config.format.toUpperCase()}</p>
              <p>• Citation style: {config.citationStyle.toUpperCase()}</p>
              <p>• Generated citation: {generateCitation()}</p>
            </div>
          </div>

          {/* Export Button */}
          <Button 
            onClick={handleExport}
            disabled={isExporting || symbols.length === 0}
            className="w-full flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? (
              <I18nText translationKey="analysis.exporting">Exporting...</I18nText>
            ) : (
              <I18nText translationKey="analysis.exportData">Export Data</I18nText>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicExporter;
