
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { I18nText } from '@/components/ui/i18n-text';
import { ToolsDropdown } from './ToolsDropdown';
import { useAuth } from '@/hooks/useAuth';

export const NavigationItems = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
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

      {/* Tools Dropdown pour les admins */}
      <ToolsDropdown />

      {/* Menu Admin pour les administrateurs */}
      {isAdmin && (
        <Link
          to="/admin"
          className={cn(
            'px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
            location.pathname.startsWith('/admin')
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          <I18nText translationKey="navigation.admin" ns="navigation">
            Administration
          </I18nText>
        </Link>
      )}
    </div>
  );
};

export default NavigationItems;
