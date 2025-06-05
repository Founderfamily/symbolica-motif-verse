
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';

interface EmptyCategoryProps {
  message: string;
}

export const EmptyCategory: React.FC<EmptyCategoryProps> = React.memo(({ message }) => (
  <div className="text-center py-12 bg-slate-50 rounded-lg">
    <p className="text-slate-500">
      <I18nText translationKey={message}>
        Aucune collection pour le moment
      </I18nText>
    </p>
  </div>
));

EmptyCategory.displayName = 'EmptyCategory';
