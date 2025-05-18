
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Paintbrush, Tag, Target } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface SymbolMetadataProps {
  culture?: string;
  period?: string;
  location?: { lat: number; lng: number; name?: string };
  techniques?: string[];
  functions?: string[];
  mediums?: string[];
}

const SymbolMetadata: React.FC<SymbolMetadataProps> = ({
  culture,
  period,
  location,
  techniques = [],
  functions = [],
  mediums = []
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="p-4 space-y-3">
            {/* Culture and Period */}
            {culture && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">
                    <I18nText translationKey="symbolMetadata.culture">Culture</I18nText>
                  </p>
                  <p className="text-sm font-medium">{culture}</p>
                </div>
              </div>
            )}
            
            {period && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">
                    <I18nText translationKey="symbolMetadata.period">Period</I18nText>
                  </p>
                  <p className="text-sm font-medium">{period}</p>
                </div>
              </div>
            )}
            
            {location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">
                    <I18nText translationKey="symbolMetadata.location">Location</I18nText>
                  </p>
                  <p className="text-sm font-medium">
                    {location.name || `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-3">
            {/* Techniques, Functions, and Mediums */}
            {techniques && techniques.length > 0 && (
              <div className="flex items-start gap-2">
                <Paintbrush className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">
                    <I18nText translationKey="symbolMetadata.techniques">Techniques</I18nText>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {techniques.map((technique, index) => (
                      <Badge key={index} variant="outline" className="bg-slate-50">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {functions && functions.length > 0 && (
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">
                    <I18nText translationKey="symbolMetadata.functions">Functions</I18nText>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {functions.map((func, index) => (
                      <Badge key={index} variant="outline" className="bg-slate-50">
                        {func}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {mediums && mediums.length > 0 && (
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">
                    <I18nText translationKey="symbolMetadata.medium">Medium/Support</I18nText>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mediums.map((medium, index) => (
                      <Badge key={index} variant="outline" className="bg-slate-50">
                        {medium}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SymbolMetadata;
