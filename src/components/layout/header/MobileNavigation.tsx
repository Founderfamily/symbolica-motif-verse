
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Settings, Users, Database, Shield, BarChart3 } from 'lucide-react';

export const MobileNavigation = () => {
  const location = useLocation();
  const { isAdmin, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '/', translationKey: 'home' },
    { name: 'Symboles', href: '/symbols', translationKey: 'symbols' },
    { name: 'Collections', href: '/collections', translationKey: 'collections' },
    { name: 'Quêtes', href: '/quests', translationKey: 'quests' },
    { name: 'Communauté', href: '/community', translationKey: 'community' },
    { name: 'À propos', href: '/about', translationKey: 'about' },
  ];

  const userNavigation = user ? [
    { name: 'Contribuer', href: '/propose-symbol', translationKey: 'contribute' },
  ] : [];

  const allNavigation = [...navigation.slice(0, -1), ...userNavigation, navigation[navigation.length - 1]];

  const adminMenuItems = [
    { name: 'Tableau de bord', href: '/admin', icon: BarChart3 },
    { name: 'Gestion des utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Modération', href: '/admin/contributions/moderation', icon: Shield },
    { name: 'Gestion des symboles', href: '/admin/symbols', icon: Database },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    setAdminOpen(false);
  };

  return (
    <div className="md:hidden">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Menu className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Navigation</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            <nav className="space-y-2">
              {allNavigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    location.pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <I18nText translationKey={item.translationKey} ns="navigation">
                    {item.name}
                  </I18nText>
                  {item.href === '/propose-symbol' && (
                    <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      Nouveau
                    </span>
                  )}
                </Link>
              ))}

              {/* Menu Admin pour mobile */}
              {isAdmin && (
                <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <I18nText translationKey="navigation.admin" ns="navigation">
                        Administration
                      </I18nText>
                      <ChevronDown className={cn("h-3 w-3 transition-transform", adminOpen && "rotate-180")} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-4">
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                          location.pathname === item.href
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
