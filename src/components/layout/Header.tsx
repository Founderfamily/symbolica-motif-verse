
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { I18nText } from '@/components/ui/i18n-text';
import LanguageSelector from '@/components/ui/language-selector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-serif font-bold text-slate-900">Symbolica</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/collections"
              className={`text-sm font-medium transition-colors ${
                isActive('/collections') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <I18nText translationKey="navigation.collections" />
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                <I18nText translationKey="navigation.explore" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link
                    to="/symbols"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <I18nText translationKey="navigation.allSymbols" />
                  </Link>
                  <Link
                    to="/map"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <I18nText translationKey="navigation.map" />
                  </Link>
                </div>
              </div>
            </div>
            <Link
              to="/contributions"
              className={`text-sm font-medium transition-colors ${
                isActive('/contributions') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <I18nText translationKey="navigation.contributions" />
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <I18nText translationKey="navigation.about" />
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <I18nText translationKey="navigation.profile" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <I18nText translationKey="navigation.signOut" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm">
                  <I18nText translationKey="navigation.signIn" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="space-y-2">
              <Link
                to="/collections"
                className="block py-2 text-base font-medium text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <I18nText translationKey="navigation.collections" />
              </Link>
              <Link
                to="/symbols"
                className="block py-2 text-base font-medium text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <I18nText translationKey="navigation.allSymbols" />
              </Link>
              <Link
                to="/map"
                className="block py-2 text-base font-medium text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <I18nText translationKey="navigation.map" />
              </Link>
              <Link
                to="/contributions"
                className="block py-2 text-base font-medium text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <I18nText translationKey="navigation.contributions" />
              </Link>
              <Link
                to="/about"
                className="block py-2 text-base font-medium text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <I18nText translationKey="navigation.about" />
              </Link>
              
              <div className="pt-4 border-t border-slate-200">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="block py-2 text-base font-medium text-slate-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <I18nText translationKey="navigation.profile" />
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-base font-medium text-slate-900"
                    >
                      <I18nText translationKey="navigation.signOut" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="block py-2 text-base font-medium text-slate-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <I18nText translationKey="navigation.signIn" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
