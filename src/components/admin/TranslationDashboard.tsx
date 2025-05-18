
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Edit, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TranslatableObject } from '@/utils/translationUtils';
import { useContentTranslation } from '@/hooks/useContentTranslation';

type TranslationItem = {
  id: string;
  name: string;
  description?: string;
  translations?: Record<string, any>;
  table: string;
  hasFrenchName: boolean;
  hasEnglishName: boolean;
  hasFrenchDescription: boolean;
  hasEnglishDescription: boolean;
  completionPercentage: number;
};

const TranslationDashboard: React.FC = () => {
  const [items, setItems] = useState<TranslationItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<TranslationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    total: 0,
    complete: 0,
    partialFr: 0,
    partialEn: 0,
    missing: 0,
  });
  const { toast } = useToast();
  const { t, currentLanguage } = useTranslation();
  const { tf } = useContentTranslation();

  // Function to check if a translation field exists
  const hasTranslationField = (item: TranslatableObject, lang: string, field: string): boolean => {
    return !!item.translations?.[lang]?.[field];
  };

  // Calculate completion percentage for an item
  const calculateCompletion = (item: TranslatableObject): number => {
    const fields = ['name', 'description'];
    const languages = ['fr', 'en'];
    let total = fields.length * languages.length;
    let completed = 0;
    
    languages.forEach(lang => {
      fields.forEach(field => {
        if (hasTranslationField(item, lang, field)) {
          completed++;
        }
      });
    });
    
    return Math.round((completed / total) * 100);
  };

  // Process items from database into display format
  const processItems = (data: any[], table: string): TranslationItem[] => {
    return data.map(item => ({
      id: item.id,
      name: item.name || '',
      description: item.description || '',
      translations: item.translations || {},
      table,
      hasFrenchName: hasTranslationField(item, 'fr', 'name'),
      hasEnglishName: hasTranslationField(item, 'en', 'name'),
      hasFrenchDescription: hasTranslationField(item, 'fr', 'description'),
      hasEnglishDescription: hasTranslationField(item, 'en', 'description'),
      completionPercentage: calculateCompletion(item)
    }));
  };

  // Fetch all items that might need translations
  const fetchItems = async () => {
    setIsLoading(true);
    
    try {
      // Fetch symbols
      const { data: symbols, error: symbolsError } = await supabase
        .from('symbols')
        .select('id, name, description, translations');
        
      if (symbolsError) throw symbolsError;

      // Could extend to other tables like groups, taxonomies, etc.
      // const { data: groups, error: groupsError } = await supabase
      //   .from('interest_groups')
      //   .select('id, name, description, translations');
      // if (groupsError) throw groupsError;
      
      // Process and combine all items
      const processedSymbols = processItems(symbols || [], 'symbols');
      // const processedGroups = processItems(groups || [], 'groups');
      // const allItems = [...processedSymbols, ...processedGroups];
      const allItems = processedSymbols;
      
      // Calculate statistics
      const complete = allItems.filter(item => item.completionPercentage === 100).length;
      const missing = allItems.filter(item => item.completionPercentage === 0).length;
      const partialFr = allItems.filter(item => 
        (item.hasFrenchName || item.hasFrenchDescription) && 
        item.completionPercentage < 100
      ).length;
      const partialEn = allItems.filter(item => 
        (item.hasEnglishName || item.hasEnglishDescription) && 
        item.completionPercentage < 100
      ).length;
      
      setStats({
        total: allItems.length,
        complete,
        partialFr,
        partialEn,
        missing
      });
      
      setItems(allItems);
      setFilteredItems(allItems);
    } catch (error) {
      console.error('Error fetching translation data:', error);
      toast({
        title: t('admin.translations.error.title'),
        description: t('admin.translations.error.description'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  // Export data as CSV
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'Type', 'FR Name', 'EN Name', 'FR Description', 'EN Description', 'Completion %'];
    
    const csvData = [
      headers.join(','),
      ...filteredItems.map(item => [
        item.id,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${(item.description || '').replace(/"/g, '""')}"`,
        item.table,
        item.hasFrenchName ? '✓' : '✗',
        item.hasEnglishName ? '✓' : '✗',
        item.hasFrenchDescription ? '✓' : '✗',
        item.hasEnglishDescription ? '✓' : '✗',
        `${item.completionPercentage}%`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `translations-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: t('admin.translations.export.success.title'),
      description: t('admin.translations.export.success.description')
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle><I18nText translationKey="admin.translations.statistics.title" /></CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-slate-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.total}</div>
              <div className="text-sm text-slate-600"><I18nText translationKey="admin.translations.statistics.total" /></div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
              <div className="text-sm text-slate-600"><I18nText translationKey="admin.translations.statistics.complete" /></div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.partialFr}</div>
              <div className="text-sm text-slate-600"><I18nText translationKey="admin.translations.statistics.partialFr" /></div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.partialEn}</div>
              <div className="text-sm text-slate-600"><I18nText translationKey="admin.translations.statistics.partialEn" /></div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-red-600">{stats.missing}</div>
              <div className="text-sm text-slate-600"><I18nText translationKey="admin.translations.statistics.missing" /></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle><I18nText translationKey="admin.translations.items.title" /></CardTitle>
          <CardDescription><I18nText translationKey="admin.translations.items.description" /></CardDescription>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder={t('admin.translations.search')}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchItems()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <I18nText translationKey="admin.translations.refresh" />
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm"
                onClick={exportCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                <I18nText translationKey="admin.translations.export" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: '30%' }}><I18nText translationKey="admin.translations.table.name" /></TableHead>
                  <TableHead><I18nText translationKey="admin.translations.table.type" /></TableHead>
                  <TableHead className="text-center"><I18nText translationKey="admin.translations.table.status" /></TableHead>
                  <TableHead><I18nText translationKey="admin.translations.table.languages" /></TableHead>
                  <TableHead className="text-right"><I18nText translationKey="admin.translations.table.actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-3"></div>
                        <I18nText translationKey="admin.translations.loading" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <I18nText translationKey="admin.translations.noResults" />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={`${item.table}-${item.id}`}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.table.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                            <div 
                              className={`h-2 rounded-full ${
                                item.completionPercentage === 100 
                                  ? 'bg-green-500' 
                                  : item.completionPercentage > 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${item.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500">{item.completionPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          <Badge 
                            variant={item.hasFrenchName && item.hasFrenchDescription ? "default" : "outline"}
                            className={item.hasFrenchName && item.hasFrenchDescription 
                              ? "bg-blue-500" 
                              : item.hasFrenchName || item.hasFrenchDescription
                              ? "text-blue-500 border-blue-500" 
                              : "text-slate-500 border-slate-300"
                            }
                          >
                            FR
                          </Badge>
                          <Badge 
                            variant={item.hasEnglishName && item.hasEnglishDescription ? "default" : "outline"}
                            className={item.hasEnglishName && item.hasEnglishDescription 
                              ? "bg-purple-500" 
                              : item.hasEnglishName || item.hasEnglishDescription
                              ? "text-purple-500 border-purple-500" 
                              : "text-slate-500 border-slate-300"
                            }
                          >
                            EN
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title={t('admin.translations.edit')}
                          asChild
                        >
                          <a href={`/admin/${item.table}/${item.id}`}>
                            <Edit className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationDashboard;
