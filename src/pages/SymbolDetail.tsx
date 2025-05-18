
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SymbolDisplay from '@/components/symbols/SymbolDisplay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/i18n/useTranslation';
import { getTranslatedField, getTranslatedArray, TranslatableObject } from '@/utils/translationUtils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ArrowLeft, Share2, Tag } from 'lucide-react';

const SymbolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, currentLanguage } = useTranslation();
  
  // Fetch symbol data
  const { data: symbol, isLoading: loading, error } = useQuery({
    queryKey: ['symbol', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });
  
  // Related symbols query
  const { data: relatedSymbols } = useQuery({
    queryKey: ['relatedSymbols', id],
    queryFn: async () => {
      if (!symbol) return [];
      
      const { data, error } = await supabase
        .from('symbols')
        .select('id, name, culture, translations')
        .eq('culture', symbol.culture)
        .neq('id', id)
        .limit(3);
        
      if (error) throw error;
      return data;
    },
    enabled: !!symbol
  });
  
  // Get translated value using the utility function
  const getTranslatedValue = (field: 'name' | 'description' | 'culture' | 'period') => {
    return getTranslatedField<string>(symbol as TranslatableObject, field, 'en');
  };
  
  // For arrays like medium, technique, function
  const getTranslatedArrayValue = (field: 'medium' | 'technique' | 'function') => {
    return getTranslatedArray(symbol as TranslatableObject, field, 'en');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !symbol) {
    return (
      <div className="container mx-auto p-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-medium text-slate-800 mb-4">
          {t('symbolDetail.errorTitle')}
        </h2>
        <p className="text-slate-600 mb-6">
          {t('symbolDetail.errorMessage')}
        </p>
        <Button asChild>
          <Link to="/explore">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('symbolDetail.backToExplorer')}
          </Link>
        </Button>
      </div>
    );
  }
  
  // Get symbol name using the translation utility
  const symbolName = getTranslatedValue('name');
  
  return (
    <div className="container mx-auto p-4 pt-12 pb-20">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                {t('breadcrumb.home')}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/explore">
                {t('breadcrumb.symbolExplorer')}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{symbolName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Back button */}
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/explore" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('symbolDetail.backToExplorer')}
          </Link>
        </Button>
      </div>
      
      {/* Symbol header section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium text-slate-900">{symbolName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-sm px-2 py-0.5 bg-slate-50">
              {getTranslatedValue('culture')}
            </Badge>
            <Badge variant="outline" className="text-sm px-2 py-0.5 bg-slate-50">
              {getTranslatedValue('period')}
            </Badge>
          </div>
        </div>
        
        {/* Share button */}
        <Button variant="outline" size="sm" onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: symbolName,
              url: window.location.href
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert(t('symbolDetail.linkCopied'));
          }
        }} className="flex items-center">
          <Share2 className="mr-2 h-4 w-4" />
          {t('symbolDetail.share')}
        </Button>
      </div>
      
      {/* Symbol description */}
      {getTranslatedValue('description') && (
        <div className="mb-8">
          <h2 className="text-xl font-medium text-slate-800 mb-2">
            {t('symbolDetail.description')}
          </h2>
          <p className="text-slate-700 leading-relaxed">{getTranslatedValue('description')}</p>
        </div>
      )}
      
      {/* Symbol metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Medium */}
        {getTranslatedArrayValue('medium')?.length > 0 && (
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('symbolDetail.medium')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {getTranslatedArrayValue('medium').map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-white">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Technique */}
        {getTranslatedArrayValue('technique')?.length > 0 && (
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('symbolDetail.technique')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {getTranslatedArrayValue('technique').map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-white">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Function */}
        {getTranslatedArrayValue('function')?.length > 0 && (
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('symbolDetail.function')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {getTranslatedArrayValue('function').map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-white">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Symbol images section */}
      <h2 className="text-xl font-medium text-slate-800 mb-4">
        {t('symbolDetail.visualRepresentations')}
      </h2>
      <SymbolDisplay symbolId={id || null} />
      
      {/* Related symbols section */}
      {relatedSymbols && relatedSymbols.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-medium text-slate-800 mb-4 flex items-center">
            <Tag className="mr-2 h-5 w-5 text-slate-600" />
            {t('symbolDetail.relatedSymbols')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {relatedSymbols.map(relatedSymbol => {
              // Get translated name using the utility function
              const translatedName = getTranslatedField<string>(relatedSymbol as TranslatableObject, 'name');
              const translatedCulture = getTranslatedField<string>(relatedSymbol as TranslatableObject, 'culture');
              
              return (
                <Link 
                  key={relatedSymbol.id} 
                  to={`/symbols/${relatedSymbol.id}`}
                  className="p-4 border rounded-lg hover:border-purple-300 hover:bg-slate-50 transition-colors"
                >
                  <h3 className="font-medium text-slate-900">{translatedName}</h3>
                  <p className="text-sm text-slate-600 mt-1">{translatedCulture}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolDetail;
