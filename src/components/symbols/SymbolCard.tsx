
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface SymbolCardProps {
  id: string;
  name: string;
  culture: string;
  period?: string;
  imageUrl?: string;
  tags?: string[];
  onClick?: () => void;
  className?: string;
  compact?: boolean;
  creator?: string;
  createdAt?: string;
}

const SymbolCard: React.FC<SymbolCardProps> = ({
  id,
  name,
  culture,
  period,
  imageUrl,
  tags = [],
  onClick,
  className = '',
  compact = false,
  creator,
  createdAt
}) => {
  const { currentLanguage } = useTranslation();
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Format date if provided
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : null;
  
  return (
    <Link to={`/symbols/${id}`} onClick={handleClick} className={`block ${className}`}>
      <Card className={`overflow-hidden hover:shadow-md transition-shadow border-slate-200 h-full ${compact ? 'flex flex-row' : ''}`}>
        <div
          className={`${compact ? 'w-20 h-auto' : 'aspect-square h-32 sm:h-40'} bg-slate-100 relative`}
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
              <I18nText translationKey="symbols.noImage">No image</I18nText>
            </div>
          )}
        </div>
        
        <CardContent className={`p-3 sm:p-4 ${compact ? 'flex-1' : ''}`}>
          <h3 className={`font-medium ${compact ? 'text-sm' : 'text-lg'} mb-1 line-clamp-2`}>{name}</h3>
          
          <div className={`text-slate-600 ${compact ? 'text-xs' : 'text-sm'}`}>
            <p>{culture}</p>
            {period && <p>{period}</p>}
            
            {creator && (
              <p className="text-xs mt-1 text-slate-500">
                <I18nText translationKey="symbolCard.creator" />: {creator}
              </p>
            )}
            
            {formattedDate && (
              <p className="text-xs text-slate-400">
                <I18nText translationKey="symbolCard.date" />: {formattedDate}
              </p>
            )}
          </div>
          
          {!compact && tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {!compact && (
            <div className="mt-2 text-xs text-amber-600 hover:text-amber-700">
              <I18nText translationKey="symbolCard.viewDetails" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default SymbolCard;
