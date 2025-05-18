
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  CircleUser,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronDown,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/ui/language-selector';
import { useTranslation } from '@/i18n/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useBreakpoint } from '@/hooks/use-breakpoints';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useBreakpoint('md');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isLoggedIn = !!user;

  const navLinks = [
    { to: '/', label: t('navigation.home') },
    { to: '/explore', label: t('navigation.explore') },
    { to: '/map', label: t('navigation.map') },
    { to: '/contribute', label: t('navigation.contribute') },
    { to: '/groups', label: t('navigation.groups') },
    { to: '/about', label: t('navigation.about') },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="text-amber-600 font-bold text-xl flex items-center">
              <img src="/logo.svg" alt="Logo" className="h-8 w-auto mr-2" />
              CulturalPatterns.ai
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 mx-4 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium hover:text-amber-500 transition-colors ${
                  location.pathname === link.to
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Account & Language Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <LanguageSelector />
            {!loading && (
              <>
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <CircleUser className="h-5 w-5" />
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem disabled className="text-sm opacity-70">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t('navigation.account')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/groups')}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>{t('navigation.groups')}</span>
                      </DropdownMenuItem>
                      {user?.app_metadata?.isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t('navigation.admin')}</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t('navigation.logout')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/auth?mode=login')}
                    >
                      {t('navigation.login')}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/auth?mode=signup')}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    >
                      {t('navigation.signup')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-amber-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.to
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!loading && (
              <>
                {isLoggedIn ? (
                  <>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="px-3 py-2 text-sm text-gray-500">{user.email}</div>
                      <Link
                        to="/profile"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t('navigation.account')}</span>
                        </div>
                      </Link>
                      <Link
                        to="/groups"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          <span>{t('navigation.groups')}</span>
                        </div>
                      </Link>
                      {user?.app_metadata?.isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t('navigation.admin')}</span>
                          </div>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>{t('navigation.logout')}</span>
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-gray-200 pt-2">
                    <Link
                      to="/auth?mode=login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('navigation.login')}
                    </Link>
                    <Link
                      to="/auth?mode=signup"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white m-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('navigation.signup')}
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
