
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Camera, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoStatusBadgeProps {
  hasPhoto: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PhotoStatusBadge: React.FC<PhotoStatusBadgeProps> = ({ 
  hasPhoto, 
  className,
  size = 'sm'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (hasPhoto) {
    return (
      <Badge 
        className={cn(
          'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 flex items-center gap-1',
          sizeClasses[size],
          className
        )}
      >
        <Camera className={iconSizes[size]} />
        <span>AVEC PHOTO</span>
      </Badge>
    );
  }

  return (
    <Badge 
      className={cn(
        'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 flex items-center gap-1',
        sizeClasses[size],
        className
      )}
    >
      <ImageOff className={iconSizes[size]} />
      <span>SANS PHOTO</span>
    </Badge>
  );
};
