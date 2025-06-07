
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

interface CommunityEmptyStateProps {
  filteredGroupsLength: number;
  loading: boolean;
}

const CommunityEmptyState: React.FC<CommunityEmptyStateProps> = ({ 
  filteredGroupsLength, 
  loading 
}) => {
  const { t } = useTranslation();

  if (filteredGroupsLength > 0 || loading) return null;

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          {t('community:noGroups', 'Aucun groupe trouvé')}
        </h3>
        <p className="text-slate-600">
          {t('community:noGroupsDescription', 'Essayez d\'ajuster votre recherche ou créez un nouveau groupe')}
        </p>
      </CardContent>
    </Card>
  );
};

export default CommunityEmptyState;
