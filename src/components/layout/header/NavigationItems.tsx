
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';

export const NavigationItems = () => {
  const location = useLocation();
  const { isAdmin, user } = useAuth();
  
  // Ordre du menu : Accueil, Symboles, Collections, Quêtes, Communauté, Contribuer (si connecté), À propos
  const navigation = [
    { name: 'Accueil', href: '/', translationKey: 'home' },
    { name: 'Symboles', href: '/symbols', translationKey: 'symbols' },
    { name: 'Collections', href: '/collections', translationKey: 'collections' },
    { name: 'Quêtes', href: '/quests', translationKey: 'quests' },
    { name: 'Communauté', href: '/community', translationKey: 'community' },
    { name: 'À propos', href: '/about', translationKey: 'about' },
  ];

  // Navigation pour utilisateurs connectés
  const userNavigation = user ? [
    { name: 'Contribuer', href: '/propose-symbol', translationKey: 'contribute' },
  ] : [];

  const allNavigation = [...navigation.slice(0, -1), ...userNavigation, navigation[navigation.length - 1]];

  return (
    <div className="hidden md:flex items-center space-x-8">
      {allNavigation.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'px-3 py-2 text-sm font-medium transition-colors hover:text-primary relative',
            location.pathname === item.href
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          <I18nText translationKey={item.translationKey} ns="navigation">
            {item.name}
          </I18nText>
          {item.href === '/propose-symbol' && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
              Nouveau
            </span>
          )}
        </Link>
      ))}

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
