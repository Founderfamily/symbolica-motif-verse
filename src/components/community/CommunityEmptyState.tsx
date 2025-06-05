
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface CommunityEmptyStateProps {
  filteredGroupsLength: number;
  loading: boolean;
}

const CommunityEmptyState: React.FC<CommunityEmptyStateProps> = ({ 
  filteredGroupsLength, 
  loading 
}) => {
  if (filteredGroupsLength > 0 || loading) return null;

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          <I18nText translationKey="community.noGroups">No groups found</I18nText>
        </h3>
        <p className="text-slate-600">
          <I18nText translationKey="community.noGroupsDescription">
            Try adjusting your search or create a new group
          </I18nText>
        </p>
      </CardContent>
    </Card>
  );
};

export default CommunityEmptyState;
