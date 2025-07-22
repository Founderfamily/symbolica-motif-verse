
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
import { ChevronDown, Settings, Users, Database, Shield, BarChart3, Flag, Lightbulb, Network, Layout, Trophy, Compass, Clock, History, PenTool } from 'lucide-react'; 

export const NavigationItems = () => {
  const location = useLocation();
  const { isAdmin, user } = useAuth();
  
  // Navigation principale
  const navigation = [
    { name: 'Accueil', href: '/', translationKey: 'home' },
    { name: 'Collections', href: '/collections', translationKey: 'collections' },
    { name: 'Quêtes', href: '/quests', translationKey: 'quests' },
    { name: 'Communauté', href: '/community', translationKey: 'community' },
  ];

  // Menu Parcours avec 2 voies
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

  // Menu Symboles avec timeline
  const symbolsMenuItems = [
    { 
      name: 'Explorer les symboles', 
      href: '/symbols', 
      icon: Database,
      description: 'Découvrez notre collection de symboles'
    },
    { 
      name: 'Timeline Interactive', 
      href: '/symbols/timeline', 
      icon: History,
      description: 'Explorez les symboles à travers l\'histoire'
    },
  ];

  // Navigation pour utilisateurs connectés - maintenant vide
  const userNavigation = [];

  const allNavigation = [...navigation, ...userNavigation];

  const adminMenuItems = [
    { name: 'Tableau de bord', href: '/admin', icon: BarChart3 },
    { name: 'Gestion des utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Modération', href: '/admin/moderation', icon: Flag },
    { name: 'Modération contributions', href: '/admin/contributions/moderation', icon: Shield },
    { name: 'Gestion des symboles', href: '/admin/symbols', icon: Database },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  // Menu Innovation avec les 5 approches
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

  return (
    <div className="hidden md:flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
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
          </Link>
        ))}

      {/* Menu Parcours dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'px-2 py-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1',
              location.pathname.startsWith('/parcours')
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            Parcours
            <ChevronDown className="h-3 w-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-white border shadow-md z-[100]">
          <DropdownMenuLabel className="text-center font-bold text-emerald-600">
            🎯 Choisissez Votre Parcours
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {parcoursMenuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                to={item.href}
                className="flex items-start gap-3 cursor-pointer p-3 hover:bg-emerald-50"
              >
                <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-emerald-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu Symboles dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'px-2 py-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1',
              location.pathname.startsWith('/symbols')
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <I18nText translationKey="symbols" ns="navigation">
              Symboles
            </I18nText>
            <ChevronDown className="h-3 w-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 bg-white border shadow-md z-[100]">
          <DropdownMenuLabel className="text-center font-bold text-blue-600">
            🔍 Exploration des Symboles
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {symbolsMenuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                to={item.href}
                className="flex items-start gap-3 cursor-pointer p-3 hover:bg-blue-50"
              >
                <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu Innovation dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'px-2 py-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 relative',
              location.pathname.startsWith('/innovation')
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Lightbulb className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold animate-pulse">
              Beta
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-white border shadow-md z-[100]">
          <DropdownMenuLabel className="text-center font-bold text-purple-600">
            🚀 Laboratoire d'Innovation
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-1 text-xs text-muted-foreground text-center">
            5 nouvelles façons révolutionnaires d'explorer les symboles culturels
          </div>
          <DropdownMenuSeparator />
          {innovationMenuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                to={item.href}
                className={cn(
                  "flex items-start gap-3 cursor-pointer p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50",
                  item.href === '/innovation' && "bg-gradient-to-r from-purple-100 to-pink-100 font-semibold"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 mt-0.5 flex-shrink-0",
                  item.href === '/innovation' ? "text-purple-600" : "text-purple-500"
                )} />
                <div className="flex-1">
                  <div className={cn(
                    "text-sm",
                    item.href === '/innovation' ? "font-semibold text-purple-800" : "font-medium"
                  )}>
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <div className="px-3 py-2 text-xs text-center text-muted-foreground">
            💡 Trouvez votre style d'exploration préféré
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

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
              <Shield className="h-4 w-4" />
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

      {/* Bouton Contribuer à droite */}
      {user && (
        <Link
          to="/propose-symbol"
          className={cn(
            'p-2 text-sm font-medium transition-colors hover:text-primary relative',
            location.pathname === '/propose-symbol'
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
          title="Contribuer"
        >
          <PenTool className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
            Nouveau
          </span>
        </Link>
      )}
    </div>
  );
};

export default NavigationItems;
