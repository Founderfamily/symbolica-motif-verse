
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  X, 
  ChevronDown, 
  LogIn, 
  LogOut, 
  User, 
  Settings,
  Plus,
  Users,
  Map,
  Search
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/use-breakpoints';
import { I18nText } from '@/components/ui/i18n-text';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isMobile = useBreakpoint('lg');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profileData, isLoading, isAdmin, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu on navigation
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const headerClasses = cn(
    "fixed top-0 w-full z-50 transition-all duration-200",
    {
      "bg-white/80 backdrop-blur-md shadow-sm": scrolled,
      "bg-transparent": !scrolled
    }
  );

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          </div>
          <span className="font-semibold text-lg">
            <I18nText translationKey="app.name" />
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden lg:flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <I18nText translationKey="navigation.explore" />
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem asChild>
                  <Link to="/explore" className="flex items-center gap-2">
                    <Search size={14} />
                    <I18nText translationKey="navigation.symbolExplorer" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/map" className="flex items-center gap-2">
                    <Map size={14} />
                    <I18nText translationKey="navigation.mapExplorer" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/groups">
              <Button variant="ghost" className="flex items-center gap-1">
                <Users size={16} className="mr-1" />
                <I18nText translationKey="navigation.groups" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <I18nText translationKey="navigation.contribute" />
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem asChild>
                  <Link to="/upload" className="flex items-center gap-2">
                    <Plus size={14} />
                    <I18nText translationKey="navigation.upload" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contributions" className="flex items-center gap-2">
                    <Users size={14} />
                    <I18nText translationKey="navigation.community" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/about">
              <Button variant="ghost">
                <I18nText translationKey="navigation.about" />
              </Button>
            </Link>
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* User menu or Auth buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-2" aria-label="User Menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profileData?.avatar_url || undefined} />
                    <AvatarFallback className="bg-amber-100 text-amber-800">
                      {profileData?.username?.substring(0, 2).toUpperCase() || 
                       profileData?.full_name?.substring(0, 2).toUpperCase() || 
                       'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User size={14} />
                    <I18nText translationKey="auth.profile" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings size={14} />
                    <I18nText translationKey="auth.settings" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
                  <LogOut size={14} />
                  <I18nText translationKey="auth.signOut" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" className="hidden md:flex items-center gap-1">
                <LogIn size={16} className="mr-1" />
                <I18nText translationKey="auth.signIn" />
              </Button>
              <Button variant="ghost" className="md:hidden p-2" aria-label="Sign In">
                <LogIn size={20} />
              </Button>
            </Link>
          )}

          {/* Mobile menu trigger */}
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="lg:hidden">
                <div className="flex flex-col gap-6 py-6">
                  <h2 className="text-lg font-medium">
                    <I18nText translationKey="navigation.menu" />
                  </h2>
                  <nav className="flex flex-col space-y-4">
                    <div className="space-y-3">
                      <div className="font-medium text-sm text-slate-500">
                        <I18nText translationKey="navigation.explore" />
                      </div>
                      <Link 
                        to="/explore"
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Search size={16} />
                        <I18nText translationKey="navigation.symbolExplorer" />
                      </Link>
                      <Link 
                        to="/map"
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Map size={16} />
                        <I18nText translationKey="navigation.mapExplorer" />
                      </Link>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="font-medium text-sm text-slate-500">
                        <I18nText translationKey="navigation.community" />
                      </div>
                      <Link 
                        to="/groups"
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users size={16} />
                        <I18nText translationKey="navigation.groups" />
                      </Link>
                      <Link 
                        to="/contributions"
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users size={16} />
                        <I18nText translationKey="navigation.community" />
                      </Link>
                    </div>
                    
                    <Link 
                      to="/upload"
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus size={16} />
                      <I18nText translationKey="navigation.upload" />
                    </Link>
                    
                    <Link 
                      to="/about"
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <I18nText translationKey="navigation.about" />
                    </Link>
                  </nav>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <I18nText translationKey="settings.language" />
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
