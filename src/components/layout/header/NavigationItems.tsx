
import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';

export const NavigationItems: React.FC = () => {
  const auth = useAuth();

  // Pages publiques accessibles à tous
  const publicNavigationItems = [
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

  // Pages protégées, visibles uniquement pour les utilisateurs connectés
  const protectedNavigationItems = auth?.user ? [
    { 
      name: 'Map', 
      href: '/map',
      icon: <I18nText translationKey="navigation.map">Map</I18nText>
    },
    { 
      name: 'Analysis', 
      href: '/analysis',
      icon: <I18nText translationKey="navigation.analysis">Analysis</I18nText>
    },
    { 
      name: 'MCP Search', 
      href: '/mcp-search',
      icon: <span className="flex items-center gap-1">
        <span className="text-purple-600">🧠</span>
        <span>MCP Search</span>
      </span>,
      badge: 'AI'
    },
    { 
      name: 'Contributions', 
      href: '/contributions',
      icon: <I18nText translationKey="navigation.contributions">Contributions</I18nText>
    }
  ] : [];

  // Admin items - only visible to admin users
  const adminNavigationItems = (auth?.user && auth?.profile?.is_admin) ? [
    { 
      name: 'Enterprise', 
      href: '/enterprise',
      icon: <span className="flex items-center gap-1">
        <span>🏢</span>
        <span>Enterprise</span>
      </span>,
      badge: 'New'
    }
  ] : [];

  // Combiner les éléments de navigation selon le statut de connexion
  const navigationItems = [...publicNavigationItems, ...protectedNavigationItems, ...adminNavigationItems];

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
            <span className={`absolute -top-2 -right-2 px-1 py-0.5 text-xs rounded-full text-white ${
              item.badge === 'AI' ? 'bg-purple-500' : 'bg-amber-500'
            }`}>
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};
