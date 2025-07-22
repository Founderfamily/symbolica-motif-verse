
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, MoreHorizontal } from 'lucide-react';
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
import { Settings, Users, Database, Shield, BarChart3, Flag, Lightbulb, Network, Layout, Trophy, Compass, Clock, History, Search, TrendingUp, Map, BarChart2, Building2, Route, Phone, Smartphone, PenTool } from 'lucide-react';

export const MobileNavigation = () => {
  const location = useLocation();
  const { isAdmin, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [innovationOpen, setInnovationOpen] = useState(false);
  const [parcoursOpen, setParcoursOpen] = useState(false);
  const [symbolsOpen, setSymbolsOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', translationKey: 'home' },
    { name: 'Collections', href: '/collections', translationKey: 'collections' },
    { name: 'Quests', href: '/quests', translationKey: 'quests' },
    { name: 'Community', href: '/community', translationKey: 'community' },
  ];

  // Menu Parcours (sous Accueil)
  const parcoursMenuItems = [
    { 
      name: 'Parcours Académique', 
      href: '/parcours/academique', 
      icon: Database,
      description: 'Exploration scientifique et recherche approfondie'
    },
    { 
      name: 'Parcours Aventure', 
      href: '/parcours/aventure', 
      icon: Compass,
      description: 'Quêtes gamifiées et découvertes ludiques'
    },
  ];

  // Menu Symboles
  const symbolsMenuItems = [
    { name: 'Explorer les symboles', href: '/symbols', icon: Database },
    { name: 'Explorateur avancé', href: '/symbol-explorer', icon: Search },
    { name: 'Timeline Interactive', href: '/symbols/timeline', icon: History },
    { name: 'Recherche', href: '/search', icon: Search },
    { name: 'Tendances', href: '/trending', icon: TrendingUp },
    { name: 'Carte Interactive', href: '/map', icon: Map },
    { name: 'Analyse', href: '/analysis', icon: BarChart2 },
  ];

  // Pages supplémentaires (sous Plus)
  const additionalPagesItems = [
    { name: 'Enterprise', href: '/enterprise', icon: Building2 },
    { name: 'Feuille de Route', href: '/roadmap', icon: Route },
    { name: 'Contact', href: '/contact', icon: Phone },
    { name: 'App Mobile', href: '/mobile', icon: Smartphone },
  ];

  const userNavigation = user ? [
    { name: 'Contribute', href: '/propose-symbol', translationKey: 'contribute' },
  ] : [];

  const allNavigation = [...navigation, ...userNavigation];

  const adminMenuItems = [
    { name: 'Tableau de bord', href: '/admin', icon: BarChart3 },
    { name: 'Gestion des utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Modération', href: '/admin/moderation', icon: Flag },
    { name: 'Modération contributions', href: '/admin/contributions/moderation', icon: Shield },
    { name: 'Gestion des symboles', href: '/admin/symbols', icon: Database },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  const innovationMenuItems = [
    { 
      name: 'Vue d\'ensemble', 
      href: '/innovation', 
      icon: Lightbulb,
      description: 'Découvrez toutes les approches'
    },
    { 
      name: 'Navigateur de Graphe', 
      href: '/innovation/graph', 
      icon: Network,
      description: 'Navigation par relations sémantiques'
    },
    { 
      name: 'Onglets Métaphoriques', 
      href: '/innovation/tabs', 
      icon: Layout,
      description: 'Interface inspirée des navigateurs web'
    },
    { 
      name: 'Progression Gamifiée', 
      href: '/innovation/gamify', 
      icon: Trophy,
      description: 'Système de progression et achievements'
    },
    { 
      name: 'Exploration Immersive', 
      href: '/innovation/immersion', 
      icon: Compass,
      description: 'Terrier de lapin interactif'
    },
    { 
      name: 'Timeline Vivante', 
      href: '/innovation/timeline', 
      icon: Clock,
      description: 'Navigation temporelle intelligente'
    },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    setAdminOpen(false);
    setInnovationOpen(false);
    setParcoursOpen(false);
    setSymbolsOpen(false);
    setPlusOpen(false);
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
              {/* Menu Accueil avec sous-menu Parcours */}
              <Collapsible open={parcoursOpen} onOpenChange={setParcoursOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <I18nText translationKey="home" ns="navigation">Accueil</I18nText>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", parcoursOpen && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-4">
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                      location.pathname === '/'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    Page d'accueil
                  </Link>
                  {parcoursMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'flex items-start gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                        location.pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Navigation principale */}
              {navigation.slice(1).map((item) => (
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
                </Link>
              ))}

              {/* Menu Symboles */}
              <Collapsible open={symbolsOpen} onOpenChange={setSymbolsOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <I18nText translationKey="symbols" ns="navigation">Symboles</I18nText>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", symbolsOpen && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-4">
                  {symbolsMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                        location.pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4 text-blue-500" />
                      {item.name}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Contribuer pour utilisateurs connectés */}
              {user && (
                <Link
                  to="/propose-symbol"
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    location.pathname === '/propose-symbol'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  <I18nText translationKey="contribute" ns="navigation">
                    Contribuer
                  </I18nText>
                  <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                    <I18nText translationKey="new" ns="navigation">Nouveau</I18nText>
                  </span>
                </Link>
              )}
              {/* Menu Innovation */}
              <Collapsible open={innovationOpen} onOpenChange={setInnovationOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Innovation
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                        Beta
                      </span>
                    </div>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", innovationOpen && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-4">
                  {innovationMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'flex items-start gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                        location.pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        item.href === '/innovation' && 'font-semibold bg-gradient-to-r from-purple-100 to-pink-100'
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 mt-0.5 flex-shrink-0",
                        item.href === '/innovation' ? "text-purple-600" : "text-purple-500"
                      )} />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Menu Plus */}
              <Collapsible open={plusOpen} onOpenChange={setPlusOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <div className="flex items-center gap-2">
                      <MoreHorizontal className="h-4 w-4" />
                      Plus
                    </div>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", plusOpen && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-4">
                  {additionalPagesItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                        location.pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4 text-blue-500" />
                      {item.name}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Menu Admin pour mobile */}
              {isAdmin && (
                <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
                  <CollapsibleTrigger asChild>
                     <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                       <I18nText translationKey="admin" ns="header">
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
