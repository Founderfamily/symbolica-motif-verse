
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Clock, Tag } from 'lucide-react';
import { SymbolData } from '@/types/supabase';

interface TaxonomyDisplayProps {
  symbol: SymbolData;
}

// Mappings pour décoder les codes taxonomiques
const CULTURAL_CODES: Record<string, string> = {
  'ASI-CHN': 'Asie - Chine',
  'ASI-IND': 'Asie - Inde',
  'ASI-JPN': 'Asie - Japon',
  'EUR-FRA': 'Europe - France',
  'EUR-CEL': 'Europe - Celtique',
  'EUR-GRE': 'Europe - Grèce',
  'EUR-ROM': 'Europe - Rome',
  'AFR-EGY': 'Afrique - Égypte',
  'AME-NAT': 'Amérique - Autochtone',
  'AME-AZT': 'Amérique - Aztèque',
  'AME-MAY': 'Amérique - Maya',
  'OCE-ABO': 'Océanie - Aborigène',
  'ASI': 'Asie',
  'EUR': 'Europe',
  'AFR': 'Afrique',
  'AME': 'Amérique',
  'OCE': 'Océanie'
};

const TEMPORAL_CODES: Record<string, string> = {
  'PRE': 'Préhistoire',
  'ANT': 'Antiquité',
  'MED': 'Moyen Âge',
  'MOD': 'Époque moderne',
  'CON': 'Époque contemporaine'
};

const THEMATIC_CODES: Record<string, string> = {
  'REL': 'Religion & Spiritualité',
  'SCI-GEO': 'Sciences - Géométrie',
  'SOC': 'Société & Pouvoir',
  'NAT': 'Nature & Cosmos',
  'ART': 'Arts & Esthétique',
  'MIL': 'Militaire & Guerre',
  'COM': 'Commerce & Échange',
  'MYT': 'Mythologie',
  'RIT': 'Rituels & Cérémonies'
};

export const TaxonomyDisplay: React.FC<TaxonomyDisplayProps> = ({ symbol }) => {
  // Vérifier si des codes taxonomiques existent
  const hasTaxonomy = symbol.cultural_taxonomy_code || 
                     symbol.temporal_taxonomy_code || 
                     (symbol.thematic_taxonomy_codes && symbol.thematic_taxonomy_codes.length > 0);

  if (!hasTaxonomy) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="h-5 w-5 text-amber-600" />
          Classification UNESCO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Code culturel */}
        {symbol.cultural_taxonomy_code && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Origine géo-culturelle</span>
            </div>
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-800 hover:bg-blue-200"
              title={`Code UNESCO: ${symbol.cultural_taxonomy_code}`}
            >
              {CULTURAL_CODES[symbol.cultural_taxonomy_code] || symbol.cultural_taxonomy_code}
            </Badge>
          </div>
        )}

        {/* Code temporel */}
        {symbol.temporal_taxonomy_code && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Période historique</span>
            </div>
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-800 hover:bg-green-200"
              title={`Code UNESCO: ${symbol.temporal_taxonomy_code}`}
            >
              {TEMPORAL_CODES[symbol.temporal_taxonomy_code] || symbol.temporal_taxonomy_code}
            </Badge>
          </div>
        )}

        {/* Codes thématiques */}
        {symbol.thematic_taxonomy_codes && symbol.thematic_taxonomy_codes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">Thématiques</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {symbol.thematic_taxonomy_codes.map((code, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                  title={`Code UNESCO: ${code}`}
                >
                  {THEMATIC_CODES[code] || code}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Note explicative */}
        <div className="text-xs text-slate-500 mt-4 p-3 bg-slate-50 rounded-lg">
          <strong>Classification UNESCO :</strong> Ces codes suivent les standards internationaux 
          de l'UNESCO pour la classification du patrimoine culturel immatériel, facilitant 
          l'identification et la préservation des symboles culturels mondiaux.
        </div>
      </CardContent>
    </Card>
  );
};
