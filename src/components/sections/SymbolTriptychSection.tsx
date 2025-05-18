
import React, { useState } from 'react';
import SymbolList from '@/components/symbols/SymbolList';
import SymbolDisplay from '@/components/symbols/SymbolDisplay';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Database, ChevronRight, ChevronLeft } from 'lucide-react';
import { useBreakpoint } from '@/hooks/use-breakpoints';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { Link } from 'react-router-dom';

const SymbolTriptychSection: React.FC = () => {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const [showSymbolList, setShowSymbolList] = useState(true);
  const { isAdmin } = useAuth();
  const isMobile = useBreakpoint('md');
  const { t } = useTranslation();

  // Toggle symbol list visibility on mobile
  const toggleSymbolList = () => {
    setShowSymbolList(!showSymbolList);
  };

  return (
    <section className="relative mt-12 mb-20 px-4 sm:px-6">
      {/* Decorative background elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Museum & community banner */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur shadow-2xl shadow-slate-200/50 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-slate-100 z-10 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 animate-fade-in text-center sm:text-left">
        <div>
          <p className="text-lg font-serif font-medium text-slate-800">
            <span className="mr-1 inline-block">
              <Sparkles className="w-4 h-4 text-amber-500 inline" />
            </span>
            {t('triptych.title')}
          </p>
          <p className="text-xs sm:text-sm text-slate-600">{t('triptych.subtitle')}</p>
        </div>
        {isAdmin ? (
          <Link to="/admin" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:shadow-md hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Database className="w-4 h-4" />
            {t('auth.admin')}
          </Link>
        ) : (
          <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-full hover:shadow-md hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all">
            {t('triptych.learnMore')}
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden pt-12 relative z-0">
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-amber-50 to-amber-100/50"></div>
        
        <div className="px-4 sm:px-6 pb-8 relative z-10">
          {/* Mobile toggle for symbol list */}
          {isMobile && (
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-serif text-slate-800 flex items-center">
                <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block mr-2"></span>
                {t('triptych.block1.title')}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSymbolList}
                className="text-slate-600 hover:bg-slate-100"
              >
                {showSymbolList ? <ChevronLeft className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                {showSymbolList ? t('actions.hide') : t('actions.show')}
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar with symbol list - conditionally shown on mobile */}
            {(!isMobile || (isMobile && showSymbolList)) && (
              <div className={`${isMobile ? 'col-span-1' : 'md:col-span-1'} border-r border-slate-200 pr-4 bg-slate-50/50 rounded-lg ${isMobile ? 'mb-6' : ''}`}>
                {!isMobile && (
                  <h3 className="text-lg font-serif text-slate-800 mb-4 flex items-center">
                    <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block mr-2"></span>
                    {t('triptych.block2.title')}
                  </h3>
                )}
                <div className="bg-white shadow-inner rounded-lg p-2 max-h-80 md:max-h-none overflow-y-auto">
                  <SymbolList 
                    onSelectSymbol={(id) => { 
                      setSelectedSymbolId(id);
                      // On mobile, hide the symbol list after selection
                      if (isMobile) setShowSymbolList(false);
                    }} 
                    selectedSymbolId={selectedSymbolId} 
                  />
                </div>
              </div>
            )}
            
            {/* Symbol display */}
            <div className={`${isMobile ? 'col-span-1' : 'md:col-span-3'}`}>
              <h3 className="text-lg font-serif text-slate-800 mb-4 flex items-center">
                <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block mr-2"></span>
                {t('triptych.block3.title')}
              </h3>
              <SymbolDisplay symbolId={selectedSymbolId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymbolTriptychSection;
