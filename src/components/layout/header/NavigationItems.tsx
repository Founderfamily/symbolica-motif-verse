
import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';

export const NavigationItems: React.FC = () => {
  const auth = useAuth();

  // Menus de base accessibles à tous
  const baseNavigationItems = [
    { 
      name: 'Symbols', 
      href: '/symbols',
      icon: <I18nText translationKey="navigation.symbols">Symbols</I18nText>
    },
    { 
      name: 'Collections', 
      href: '/collections',
      icon: <I18nText translationKey="navigation.collections">Collections</I18nText>
    },
    { 
      name: 'Community', 
      href: '/community',
      icon: <Users className="h-4 w-4 inline mr-1" />,
      badge: 'New'
    }
  ];

  // Menus supplémentaires pour les utilisateurs connectés
  const userNavigationItems = auth?.user ? [
    { 
      name: 'Map', 
      href: '/map',
      icon: <I18nText translationKey="navigation.map">Map</I18nText>
    },
    { 
      name: 'Contributions', 
      href: '/contributions',
      icon: <I18nText translationKey="navigation.contributions">Contributions</I18nText>
    }
  ] : [];

  // Combiner les éléments de navigation
  const navigationItems = [...baseNavigationItems, ...userNavigationItems];

  return (
    <nav className="hidden md:flex space-x-6">
      {navigationItems.map((item) => (
        <Link 
          key={item.name} 
          to={item.href} 
          className="text-slate-600 hover:text-slate-900 transition-colors relative"
        >
          {item.icon}
          {item.badge && (
            <span className="absolute -top-2 -right-2 px-1 py-0.5 text-xs rounded-full text-white bg-amber-500">
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};
