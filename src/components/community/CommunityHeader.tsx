
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import CreateGroupDialog from './CreateGroupDialog';
import { useAuth } from '@/hooks/useAuth';

interface CommunityHeaderProps {
  onGroupCreated: () => void;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ onGroupCreated }) => {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">
            {t('community:title', 'Hub Communautaire')}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('community:subtitle', 'Rejoignez des groupes d\'intérêt et connectez-vous avec d\'autres chercheurs')}
          </p>
        </div>
        {auth?.user && (
          <CreateGroupDialog onGroupCreated={onGroupCreated} />
        )}
      </div>
    </div>
  );
};

export default CommunityHeader;
