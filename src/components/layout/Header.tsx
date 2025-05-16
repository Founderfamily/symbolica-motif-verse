import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import OpenSourceBadge from '@/components/ui/open-source-badge';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const Header = () => {
  const { t } = useTranslation();
  const { user, signOut, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Update your navigation menu items array to include the map
  const menuItems = [
    { text: 'header.home', route: '/' },
    { text: 'header.explore', route: '/explore' },
    { text: 'header.map', route: '/map' }, // Add this line
    { text: 'header.about', route: '/about' },
    { text: 'header.contribute', route: '/contributions' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <img src="/logo.svg" alt={t('app.name')} className="h-8 w-8 mr-2" />
          {t('app.name')}
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.route}
              to={item.route}
              className={({ isActive }) =>
                `text-slate-700 hover:text-slate-900 transition-colors ${isActive ? 'font-medium' : ''}`
              }
            >
              <I18nText translationKey={item.text} />
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url || undefined} alt={user?.full_name || user?.username || 'Profile'} />
                    <AvatarFallback className="bg-amber-600 text-white">{user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel><I18nText translationKey="profile.profile" /></DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/profile"><I18nText translationKey="profile.viewProfile" /></Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><I18nText translationKey="admin.dashboard" /></Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}><I18nText translationKey="profile.signOut" /></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button><I18nText translationKey="auth.login" /></Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="outline" onClick={toggleMenu}>
            {isMenuOpen ? t('header.close') : t('header.menu')}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-50 py-2 border-b border-slate-200">
          <nav className="flex flex-col items-center space-y-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.route}
                to={item.route}
                className={({ isActive }) =>
                  `text-slate-700 hover:text-slate-900 transition-colors ${isActive ? 'font-medium' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <I18nText translationKey={item.text} />
              </NavLink>
            ))}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-slate-700 hover:text-slate-900 transition-colors">
                  <I18nText translationKey="profile.profile" />
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-slate-700 hover:text-slate-900 transition-colors">
                    <I18nText translationKey="admin.dashboard" />
                  </Link>
                )}
                <Button variant="ghost" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                  <I18nText translationKey="profile.signOut" />
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button><I18nText translationKey="auth.login" /></Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
