
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings, Users, Database, Shield, BarChart3 } from 'lucide-react';

export const NavigationItems = () => {
  const location = useLocation();
  const { isAdmin, user } = useAuth();
  
  // Navigation principale sans "À propos" (déplacé vers le footer)
  const navigation = [
    { name: 'Accueil', href: '/', translationKey: 'home' },
    { name: 'Symboles', href: '/symbols', translationKey: 'symbols' },
    { name: 'Collections', href: '/collections', translationKey: 'collections' },
    { name: 'Quêtes', href: '/quests', translationKey: 'quests' },
    { name: 'Communauté', href: '/community', translationKey: 'community' },
  ];

  // Navigation pour utilisateurs connectés
  const userNavigation = user ? [
    { name: 'Contribuer', href: '/propose-symbol', translationKey: 'contribute' },
  ] : [];

  const allNavigation = [...navigation, ...userNavigation];

  const adminMenuItems = [
    { name: 'Tableau de bord', href: '/admin', icon: BarChart3 },
    { name: 'Gestion des utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Modération', href: '/admin/contributions/moderation', icon: Shield },
    { name: 'Gestion des symboles', href: '/admin/symbols', icon: Database },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex items-center space-x-4">
      {allNavigation.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'px-2 py-2 text-sm font-medium transition-colors hover:text-primary relative',
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

      {/* Menu Admin dropdown pour les administrateurs */}
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'px-2 py-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1',
                location.pathname.startsWith('/admin')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <I18nText translationKey="navigation.admin" ns="navigation">
                Administration
              </I18nText>
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border shadow-md z-[100]">
            <DropdownMenuLabel>Administration</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {adminMenuItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  to={item.href}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default NavigationItems;
