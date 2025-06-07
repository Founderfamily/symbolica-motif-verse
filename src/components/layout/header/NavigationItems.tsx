
import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { ToolsDropdown } from './ToolsDropdown';

export const NavigationItems: React.FC = () => {
  const auth = useAuth();

  // Pages publiques accessibles à tous
  const publicNavigationItems = [
    { 
      name: 'Symbols', 
      href: '/symbols',
      icon: <I18nText translationKey="navigation.symbols" ns="header">Symbols</I18nText>
    },
    { 
      name: 'Collections', 
      href: '/collections',
      icon: <I18nText translationKey="navigation.collections" ns="header">Collections</I18nText>
    },
    { 
      name: 'Community', 
      href: '/community',
      icon: <Users className="h-4 w-4 inline mr-1" />,
      badge: 'New'
    }
  ];

  // Pages protégées, visibles uniquement pour les utilisateurs connectés
  const protectedNavigationItems = auth?.user ? [
    { 
      name: 'Map', 
      href: '/map',
      icon: <I18nText translationKey="navigation.map" ns="header">Map</I18nText>
    },
    { 
      name: 'Contributions', 
      href: '/contributions',
      icon: <I18nText translationKey="navigation.contributions" ns="header">Contributions</I18nText>
    }
  ] : [];

  // Combiner les éléments de navigation selon le statut de connexion
  const navigationItems = [...publicNavigationItems, ...protectedNavigationItems];

  return (
    <nav className="hidden md:flex space-x-6 items-center">
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
      
      {/* Menu déroulant Outils */}
      <ToolsDropdown />
    </nav>
  );
};
