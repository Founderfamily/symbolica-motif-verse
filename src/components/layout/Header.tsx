
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User, Settings, HelpCircle, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { LanguageSelector } from '@/components/ui/language-selector';
import { I18nText } from '@/components/ui/i18n-text';
import { useNavigate } from 'react-router-dom';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo.svg" 
                alt="Symbolica" 
                className="h-8 w-8"
              />
              <span className="font-bold text-xl text-slate-900 hidden sm:block">
                Symbolica
              </span>
            </Link>
            
            {/* Main Navigation */}
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
          </div>

          {/* Search, Notifications, Language Selector, and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="search"
                placeholder={t('search.placeholder', { ns: 'header' })}
                className="pl-10 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Notifications - only for authenticated users */}
            {auth?.user && <NotificationCenter />}

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu or Auth Buttons */}
            {auth?.user && auth?.profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={auth.profile.avatar_url || `https://avatar.vercel.sh/${auth.profile.username}.png`} alt={auth.profile.username || 'Avatar'} />
                      <AvatarFallback>{auth.profile.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    {t('myAccount', { ns: 'header' })}
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      {t('profile', { ns: 'header' })}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/contribute">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      {t('contribute', { ns: 'header' })}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {auth.profile.is_admin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          {t('adminDashboard', { ns: 'header' })}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => auth.signOut()}>
                    {t('logout', { ns: 'header' })}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/auth">
                    <I18nText translationKey="auth.buttons.login">Log In</I18nText>
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">
                    <I18nText translationKey="auth.buttons.register">Sign Up</I18nText>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
