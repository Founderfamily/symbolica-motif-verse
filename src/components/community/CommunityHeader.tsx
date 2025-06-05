
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';
import CreateGroupDialog from './CreateGroupDialog';
import { useAuth } from '@/hooks/useAuth';

interface CommunityHeaderProps {
  onGroupCreated: () => void;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ onGroupCreated }) => {
  const auth = useAuth();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">
            <I18nText translationKey="community.title">Community Hub</I18nText>
          </h1>
          <p className="text-slate-600 mt-1">
            <I18nText translationKey="community.subtitle">
              Join interest groups and connect with fellow researchers
            </I18nText>
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
