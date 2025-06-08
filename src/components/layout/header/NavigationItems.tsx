
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Bookmark, Hexagon, Map, FileText } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactElement;
  badge?: string;
}

export const NavigationItems: React.FC = () => {
  const auth = useAuth();

  // Menus de base accessibles à tous
  const baseNavigationItems: NavigationItem[] = [
    { 
      name: 'Symbols', 
      href: '/symbols',
      icon: <Hexagon className="h-4 w-4 inline mr-2" />
    },
    { 
      name: 'Collections', 
      href: '/collections',
      icon: <Bookmark className="h-4 w-4 inline mr-2" />
    },
    { 
      name: 'Community', 
      href: '/community',
      icon: <Users className="h-4 w-4 inline mr-2" />,
      badge: 'New'
    },
    { 
      name: 'Trending', 
      href: '/trending',
      icon: <TrendingUp className="h-4 w-4 inline mr-2" />
    }
  ];

  // Menus supplémentaires pour les utilisateurs connectés
  const userNavigationItems: NavigationItem[] = auth?.user ? [
    { 
      name: 'Map', 
      href: '/map',
      icon: <Map className="h-4 w-4 inline mr-2" />
    },
    { 
      name: 'Contributions', 
      href: '/contributions',
      icon: <FileText className="h-4 w-4 inline mr-2" />
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
          className="text-slate-600 hover:text-slate-900 transition-colors relative flex items-center font-medium"
        >
          {item.icon}
          <I18nText translationKey={`navigation.${item.name.toLowerCase()}`} ns="header">
            {item.name}
          </I18nText>
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
