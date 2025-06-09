
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { I18nText } from '@/components/ui/i18n-text';

const NavigationItems = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Accueil', href: '/', translationKey: 'home' },
    { name: 'Symboles', href: '/symbols', translationKey: 'symbols' },
    { name: 'Collections', href: '/collections', translationKey: 'collections' },
    { name: 'Quêtes', href: '/quests', translationKey: 'quests' },
    { name: 'Communauté', href: '/community', translationKey: 'community' },
    { name: 'À propos', href: '/about', translationKey: 'about' },
  ];

  return (
    <div className="hidden md:flex items-center space-x-8">
      {navigation.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
            location.pathname === item.href
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          <I18nText translationKey={item.translationKey} ns="navigation">
            {item.name}
          </I18nText>
        </Link>
      ))}
    </div>
  );
};

export default NavigationItems;
