
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface SearchResultItemProps {
  id: string;
  name: string;
  culture: string;
  period: string;
  imageUrl?: string;
  tags?: string[];
  matchScore?: number;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  id,
  name,
  culture,
  period,
  imageUrl,
  tags = [],
  matchScore
}) => {
  const { currentLanguage } = useTranslation();
  
  // Format match score as percentage
  const formattedMatchScore = matchScore 
    ? `${Math.round(matchScore * 100)}%` 
    : null;
  
  return (
    <Link to={`/symbols/${id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow border-slate-200">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Image part */}
          <div 
            className="h-32 sm:h-auto sm:w-32 bg-slate-100 relative" 
            style={{
              backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <I18nText translationKey="search.noImage">No image</I18nText>
              </div>
            )}
            
            {matchScore && (
              <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {formattedMatchScore}
              </div>
            )}
          </div>
          
          {/* Content part */}
          <CardContent className="p-4 flex-1">
            <h3 className="font-medium text-lg mb-1">{name}</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-slate-600">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                {culture}
              </div>
              
              <div className="flex items-center text-slate-600">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {period}
              </div>
              
              {tags && tags.length > 0 && (
                <div className="flex items-start gap-1.5">
                  <Tag className="h-3.5 w-3.5 mr-0.5 mt-0.5 text-slate-600" />
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-2 py-0.5 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default SearchResultItem;
