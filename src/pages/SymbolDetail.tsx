import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSymbolImages } from '@/hooks/useSymbolImages';
import SymbolTriptych from '@/components/symbols/SymbolTriptych';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
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
  const { symbol, images, loading, error } = useSymbolImages(id || null);
  
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
  
  // Get translated value or original fallback
  const getTranslatedValue = (field: 'name' | 'description' | 'culture' | 'period') => {
    if (symbol?.translations && symbol.translations[currentLanguage]?.[field]) {
      return symbol.translations[currentLanguage][field];
    }
    return symbol?.[field] || '';
  };
  
  // For arrays like medium, technique, function
  const getTranslatedArray = (field: 'medium' | 'technique' | 'function') => {
    if (!symbol?.[field]) return [];
    
    if (symbol.translations && symbol.translations[currentLanguage]?.[field]) {
      return symbol.translations[currentLanguage][field] || symbol[field];
    }
    
    return symbol[field] || [];
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
          <I18nText translationKey="symbolDetail.errorTitle">Symbol not found</I18nText>
        </h2>
        <p className="text-slate-600 mb-6">
          <I18nText translationKey="symbolDetail.errorMessage">
            We couldn't find the symbol you're looking for.
          </I18nText>
        </p>
        <Button asChild>
          <Link to="/explore">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <I18nText translationKey="symbolDetail.backToExplorer">Back to Explorer</I18nText>
          </Link>
        </Button>
      </div>
    );
  }
  
  // Get symbol name in current language
  const symbolName = getTranslatedValue('name');
  
  return (
    <div className="container mx-auto p-4 pt-12 pb-20">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <I18nText translationKey="breadcrumb.home">Home</I18nText>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/explore">
                <I18nText translationKey="breadcrumb.symbolExplorer">Symbol Explorer</I18nText>
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
            <I18nText translationKey="symbolDetail.backToExplorer">Back to Explorer</I18nText>
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
            alert(t('symbolDetail.linkCopied', 'Link copied to clipboard!'));
          }
        }} className="flex items-center">
          <Share2 className="mr-2 h-4 w-4" />
          <I18nText translationKey="symbolDetail.share">Share</I18nText>
        </Button>
      </div>
      
      {/* Symbol description */}
      {getTranslatedValue('description') && (
        <div className="mb-8">
          <h2 className="text-xl font-medium text-slate-800 mb-2">
            <I18nText translationKey="symbolDetail.description">Description</I18nText>
          </h2>
          <p className="text-slate-700 leading-relaxed">{getTranslatedValue('description')}</p>
        </div>
      )}
      
      {/* Symbol metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Medium */}
        {getTranslatedArray('medium')?.length > 0 && (
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              <I18nText translationKey="symbolDetail.medium">Medium / Support</I18nText>
            </h3>
            <div className="flex flex-wrap gap-2">
              {getTranslatedArray('medium').map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-white">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Technique */}
        {getTranslatedArray('technique')?.length > 0 && (
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              <I18nText translationKey="symbolDetail.technique">Technique</I18nText>
            </h3>
            <div className="flex flex-wrap gap-2">
              {getTranslatedArray('technique').map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-white">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Function */}
        {getTranslatedArray('function')?.length > 0 && (
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              <I18nText translationKey="symbolDetail.function">Function</I18nText>
            </h3>
            <div className="flex flex-wrap gap-2">
              {getTranslatedArray('function').map((item, index) => (
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
        <I18nText translationKey="symbolDetail.visualRepresentations">Visual Representations</I18nText>
      </h2>
      <SymbolTriptych symbolId={id || null} />
      
      {/* Related symbols section */}
      {relatedSymbols && relatedSymbols.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-medium text-slate-800 mb-4 flex items-center">
            <Tag className="mr-2 h-5 w-5 text-slate-600" />
            <I18nText translationKey="symbolDetail.relatedSymbols">Related Symbols</I18nText>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {relatedSymbols.map(relatedSymbol => {
              // Get translated name for related symbol
              const translatedName = 
                relatedSymbol.translations?.[currentLanguage]?.name || 
                relatedSymbol.name;
                
              // Get translated culture for related symbol  
              const translatedCulture =
                relatedSymbol.translations?.[currentLanguage]?.culture || 
                relatedSymbol.culture;
                
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
