import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Database, Image, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ExportData {
  title: string;
  authors: string;
  institution: string;
  abstract: string;
  keywords: string;
  format: 'pdf' | 'word' | 'latex' | 'csv' | 'json';
  includeImages: boolean;
  includeStatistics: boolean;
  citationStyle: 'apa' | 'mla' | 'chicago' | 'ieee';
}

const AcademicExporter: React.FC = () => {
  const { profile } = useAuth();
  const [exportData, setExportData] = useState<ExportData>({
    title: '',
    authors: '',
    institution: '',
    abstract: '',
    keywords: '',
    format: 'pdf',
    includeImages: true,
    includeStatistics: true,
    citationStyle: 'apa'
  });

  const [isExporting, setIsExporting] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setExportData(prev => ({
        ...prev,
        authors: profile.full_name || profile.username || '',
        institution: profile.location || ''
      }));
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExportData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setExportData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setExportData(prev => ({ ...prev, [name]: checked }));
  };

  const handleExport = async () => {
    if (!exportData.title) {
      toast.error('Please provide a title for your export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Successfully exported as ${exportData.format.toUpperCase()}`);
      
      // In a real implementation, you would:
      // 1. Call an API to generate the export
      // 2. Provide a download link or trigger download
      
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Academic Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={exportData.title}
              onChange={handleInputChange}
              placeholder="Export title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="authors">Authors</Label>
            <Input
              id="authors"
              name="authors"
              value={exportData.authors}
              onChange={handleInputChange}
              placeholder="Author names"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              name="institution"
              value={exportData.institution}
              onChange={handleInputChange}
              placeholder="Your institution"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              name="keywords"
              value={exportData.keywords}
              onChange={handleInputChange}
              placeholder="Comma-separated keywords"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="abstract">Abstract</Label>
          <Textarea
            id="abstract"
            name="abstract"
            value={exportData.abstract}
            onChange={handleInputChange}
            placeholder="Brief description of your research"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select
              value={exportData.format}
              onValueChange={(value) => handleSelectChange('format', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="word">Word Document</SelectItem>
                <SelectItem value="latex">LaTeX Source</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="citationStyle">Citation Style</Label>
            <Select
              value={exportData.citationStyle}
              onValueChange={(value) => handleSelectChange('citationStyle', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select citation style" />
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
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeImages"
              checked={exportData.includeImages}
              onChange={(e) => handleCheckboxChange('includeImages', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="includeImages" className="flex items-center gap-1">
              <Image className="h-4 w-4" />
              Include images
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeStatistics"
              checked={exportData.includeStatistics}
              onChange={(e) => handleCheckboxChange('includeStatistics', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="includeStatistics" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              Include statistics
            </Label>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicExporter;
