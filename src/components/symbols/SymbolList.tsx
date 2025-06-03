
import React, { useState, useEffect } from 'react';
import { SymbolData } from '@/types/supabase';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface SymbolListProps {
  onSelectSymbol: (symbolId: string) => void;
  selectedSymbolId: string | null;
}

const SymbolList: React.FC<SymbolListProps> = ({ onSelectSymbol, selectedSymbolId }) => {
  const { currentLanguage } = useTranslation();
  
  // Static symbols data - no API calls
  const staticSymbols: SymbolData[] = [
    {
      id: 'triskele-1',
      name: 'Triskèle Celtique',
      culture: 'Celtique',
      period: 'Antiquité',
      description: 'Symbole celtique à trois branches représentant l\'éternité, le mouvement et l\'équilibre.',
      significance: 'Représente les trois domaines : terre, mer et ciel',
      historical_context: 'Utilisé par les druides celtes',
      related_symbols: [],
      tags: ['celtique', 'spirituel', 'éternité'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Celtic Triskele',
          culture: 'Celtic',
          period: 'Antiquity',
          description: 'Celtic symbol with three branches representing eternity, movement and balance.'
        }
      }
    },
    {
      id: 'fleur-lys-2',
      name: 'Fleur de Lys',
      culture: 'Française',
      period: 'Moyen Âge',
      description: 'Emblème royal français symbolisant la pureté, la souveraineté et la royauté.',
      significance: 'Symbole de la monarchie française',
      historical_context: 'Adopté par les rois de France',
      related_symbols: [],
      tags: ['royal', 'français', 'monarchie'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Fleur-de-lis',
          culture: 'French',
          period: 'Middle Ages',
          description: 'French royal emblem symbolizing purity, sovereignty and royalty.'
        }
      }
    },
    {
      id: 'mandala-3',
      name: 'Mandala',
      culture: 'Indienne',
      period: 'Antiquité',
      description: 'Diagramme cosmique circulaire utilisé pour la méditation et les rituels spirituels.',
      significance: 'Représente l\'univers et l\'harmonie cosmique',
      historical_context: 'Tradition hindoue et bouddhiste',
      related_symbols: [],
      tags: ['spirituel', 'méditation', 'cosmique'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Mandala',
          culture: 'Indian',
          period: 'Antiquity',
          description: 'Circular cosmic diagram used for meditation and spiritual rituals.'
        }
      }
    },
    {
      id: 'meandre-4',
      name: 'Méandre Grec',
      culture: 'Grecque',
      period: 'Antiquité',
      description: 'Motif géométrique représentant l\'éternité et l\'infini dans l\'art grec ancien.',
      significance: 'Symbole de l\'éternité et du labyrinthe de la vie',
      historical_context: 'Décorations grecques et romaines',
      related_symbols: [],
      tags: ['géométrique', 'éternité', 'grec'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Greek Meander',
          culture: 'Greek',
          period: 'Antiquity',
          description: 'Geometric pattern representing eternity and infinity in ancient Greek art.'
        }
      }
    },
    {
      id: 'adinkra-5',
      name: 'Symbole Adinkra',
      culture: 'Africaine',
      period: 'Traditionnel',
      description: 'Symboles visuels akan du Ghana véhiculant des proverbes et concepts philosophiques.',
      significance: 'Transmission de sagesse et valeurs culturelles',
      historical_context: 'Tradition akan du Ghana',
      related_symbols: [],
      tags: ['africain', 'sagesse', 'proverbe'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Adinkra Symbol',
          culture: 'African',
          period: 'Traditional',
          description: 'Akan visual symbols from Ghana conveying proverbs and philosophical concepts.'
        }
      }
    }
  ];
  
  // Helper function to get translated value or fallback to default
  const getSymbolTranslation = (symbol: SymbolData, field: 'name' | 'culture' | 'period' | 'description') => {
    if (symbol.translations && symbol.translations[currentLanguage]?.[field]) {
      return symbol.translations[currentLanguage][field];
    }
    return symbol[field];
  };
  
  // Auto-select first symbol on component mount
  useEffect(() => {
    if (staticSymbols.length > 0 && !selectedSymbolId) {
      onSelectSymbol(staticSymbols[0].id);
    }
  }, [onSelectSymbol, selectedSymbolId]);
  
  return (
    <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
      {staticSymbols.map((symbol) => (
        <button
          key={symbol.id}
          onClick={() => onSelectSymbol(symbol.id)}
          className={`w-full text-left px-4 py-2 rounded-md transition ${
            selectedSymbolId === symbol.id
              ? 'bg-amber-100 text-amber-800 font-medium'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="text-sm">{getSymbolTranslation(symbol, 'name')}</div>
          <div className="text-xs text-slate-500">{getSymbolTranslation(symbol, 'culture')}</div>
        </button>
      ))}
    </div>
  );
};

export default SymbolList;
