
import React from 'react';
import { Shield, Lock, Eye, Award } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

export const SecurityBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      text: <I18nText translationKey="auth.security.dataSecure" />,
      subtext: <I18nText translationKey="auth.security.sslEncryption" />
    },
    {
      icon: Lock,
      text: <I18nText translationKey="auth.security.privacy" />,
      subtext: <I18nText translationKey="auth.security.gdprCompliant" />
    },
    {
      icon: Eye,
      text: <I18nText translationKey="auth.security.noSpam" />,
      subtext: <I18nText translationKey="auth.security.noUnwantedEmails" />
    },
    {
      icon: Award,
      text: <I18nText translationKey="auth.security.free" />,
      subtext: <I18nText translationKey="auth.security.noCommitment" />
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-100">
          <badge.icon className="h-4 w-4 text-green-600 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-green-800">{badge.text}</div>
            <div className="text-xs text-green-600">{badge.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
