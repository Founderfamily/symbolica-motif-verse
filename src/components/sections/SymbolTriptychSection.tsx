
import React, { useState } from 'react';
import SymbolList from '@/components/symbols/SymbolList';
import SymbolTriptych from '@/components/symbols/SymbolTriptych';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Database } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const SymbolTriptychSection: React.FC = () => {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const auth = useAuth();
  const isAdmin = auth?.isAdmin || false;
  const { t } = useTranslation();

  return (
    <section className="relative mt-12 mb-20">
      {/* Decorative background elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Museum & community banner */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur shadow-2xl shadow-slate-200/50 px-6 py-3 rounded-full border border-slate-100 z-10 flex items-center space-x-6 animate-fade-in">
        <div>
          <p className="text-lg font-serif font-medium text-slate-800">
            <span className="mr-1 inline-block">
              <Sparkles className="w-4 h-4 text-amber-500 inline" />
            </span>
            <I18nText translationKey="sections.museumPortal" />
          </p>
          <p className="text-sm text-slate-600"><I18nText translationKey="sections.communityPortal" /></p>
        </div>
        {isAdmin ? (
          <a href="/admin" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:shadow-md hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Database className="w-4 h-4" />
            <I18nText translationKey="auth.admin" />
          </a>
        ) : (
          <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-full hover:shadow-md hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all">
            <I18nText translationKey="sections.joinCommunity" />
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden pt-12 relative z-0">
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-amber-50 to-amber-100/50"></div>
        
        <div className="px-6 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar with symbol list */}
            <div className="md:col-span-1 border-r border-slate-200 pr-4 bg-slate-50/50 rounded-l-lg">
              <h3 className="text-lg font-serif text-slate-800 mb-4 flex items-center">
                <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block mr-2"></span>
                <I18nText translationKey="navigation.symbols" />
              </h3>
              <div className="bg-white shadow-inner rounded-lg p-2">
                <SymbolList 
                  onSelectSymbol={setSelectedSymbolId} 
                  selectedSymbolId={selectedSymbolId} 
                />
              </div>
            </div>
            
            {/* Triptych display */}
            <div className="md:col-span-3">
              <SymbolTriptych symbolId={selectedSymbolId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymbolTriptychSection;
