
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSelector } from '@/components/ui/language-selector';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { NavigationItems } from './header/NavigationItems';
import { SearchBar } from './header/SearchBar';
import { UserMenu } from './header/UserMenu';
import { AuthButtons } from './header/AuthButtons';
import { I18nText } from '@/components/ui/i18n-text';

const Header: React.FC = () => {
  const auth = useAuth();

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
                <I18nText translationKey="name" ns="app">Symbolica</I18nText>
              </span>
            </Link>
            
            {/* Main Navigation */}
            <NavigationItems />
          </div>

          {/* Search, Notifications, Language Selector, and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <SearchBar />

            {/* Notifications - only for authenticated users */}
            {auth?.user && <NotificationCenter />}

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu or Auth Buttons */}
            {auth?.user && auth?.profile ? (
              <UserMenu />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
