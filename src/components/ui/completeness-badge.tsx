
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { CompletenessLevel } from '@/services/symbolCompletenessService';

interface CompletenessBadgeProps {
  level: CompletenessLevel;
  score?: number;
  completionPercentage?: number;
  missingFields?: string[];
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

const levelConfig = {
  complete: {
    label: 'COMPLET',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
    description: 'Toutes les informations sont renseignées'
  },
  well_documented: {
    label: 'BIEN DOCUMENTÉ',
    icon: CheckCircle2,
    className: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
    description: 'Documentation complète avec informations essentielles'
  },
  partially_documented: {
    label: 'PARTIELLEMENT DOCUMENTÉ',
    icon: AlertTriangle,
    className: 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200',
    description: 'Quelques informations manquantes'
  },
  to_complete: {
    label: 'À COMPLÉTER',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
    description: 'Informations importantes manquantes'
  }
};

export const CompletenessBadge: React.FC<CompletenessBadgeProps> = ({
  level,
  score,
  completionPercentage,
  missingFields = [],
  size = 'sm',
  showPercentage = false,
  className = ''
}) => {
  const config = levelConfig[level];
  const Icon = config.icon;
  
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

  const getMissingFieldsText = () => {
    if (missingFields.length === 0) return '';
    
    const fieldLabels: Record<string, string> = {
      image: 'Image',
      description: 'Description',
      significance: 'Signification',
      historical_context: 'Contexte historique',
      tags: 'Tags'
    };
    
    return missingFields.map(field => fieldLabels[field] || field).join(', ');
  };

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${sizeClasses[size]} ${className} border-2 font-medium flex items-center gap-1 transition-colors`}
      title={`${config.description}${missingFields.length > 0 ? ` - Manque: ${getMissingFieldsText()}` : ''}`}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
      {showPercentage && completionPercentage !== undefined && (
        <span className="ml-1 font-bold">
          {Math.round(completionPercentage)}%
        </span>
      )}
      {score !== undefined && size !== 'sm' && (
        <span className="ml-1 text-xs opacity-75">
          ({score})
        </span>
      )}
    </Badge>
  );
};

// Badge simple pour affichage compact
export const SimpleCompletenessBadge: React.FC<{ level: CompletenessLevel; className?: string }> = ({ 
  level, 
  className = '' 
}) => {
  const config = levelConfig[level];
  const Icon = config.icon;
  
  return (
    <div 
      className={`${config.className} ${className} inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border-2 transition-colors`}
      title={config.description}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
};
