
import React from 'react';
import { ArrowRight, Compass, Brain, Trophy, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const symbols = [
  { id: 'mandala', name: 'Mandala', culture: 'Hindu & Buddhist', category: 'religious' },
  { id: 'triskelion', name: 'Triskelion', culture: 'Celtic', category: 'identity' },
  { id: 'fleur-de-lys', name: 'Fleur-de-lis', culture: 'French', category: 'identity' },
  { id: 'viking', name: 'Viking Compass', culture: 'Norse', category: 'navigation' },
  { id: 'arabesque', name: 'Arabesque', culture: 'Islamic', category: 'geometric' },
  { id: 'aztec', name: 'Aztec Calendar', culture: 'Aztec', category: 'cosmic' },
];

const categories = [
  { key: 'all', translationKey: 'symbolExplorerPreview.all' },
  { key: 'religious', translationKey: 'discover.categories.religious' },
  { key: 'geometric', translationKey: 'discover.categories.geometric' },
  { key: 'identity', translationKey: 'discover.categories.identity' },
  { key: 'cosmic', translationKey: 'discover.categories.cosmic' },
];

const SymbolExplorerPreview = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = React.useState('all');
  
  const filteredSymbols = activeCategory === 'all' 
    ? symbols 
    : symbols.filter(symbol => symbol.category === activeCategory);

  return (
    <section className="py-16 bg-white px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 inline-block mb-2">
            <I18nText translationKey="symbolExplorerPreview.discover" />
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="symbolExplorerPreview.title" />
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="symbolExplorerPreview.description" />
          </p>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={activeCategory === category.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.key)}
              className={activeCategory === category.key 
                ? "bg-amber-600 hover:bg-amber-700" 
                : "border-slate-200 text-slate-600 hover:text-slate-900"}
            >
              <I18nText translationKey={category.translationKey} />
            </Button>
          ))}
        </div>
        
        {/* Symbols grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {filteredSymbols.map((symbol) => (
            <Link to={`/symbols/${symbol.id}`} key={symbol.id} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-slate-100 group-hover:-translate-y-1">
                <div className="aspect-square overflow-hidden bg-slate-50">
                  <img 
                    src={`/images/symbols/${symbol.id}.png`}
                    alt={symbol.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-slate-900 mb-1">{symbol.name}</h3>
                  <p className="text-xs text-slate-500">{symbol.culture}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/explore">
            <Button size="lg" className="px-6">
              <I18nText translationKey="symbolExplorerPreview.viewAll" /> 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SymbolExplorerPreview;
