
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

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useAuth();
  const { t } = useTranslation();

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
                alt="Cultural Symbols" 
                className="h-8 w-8"
              />
              <span className="font-bold text-xl text-slate-900 hidden sm:block">
                Cultural Symbols
              </span>
            </Link>
            
            {/* Main Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/symbols" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <I18nText translationKey="navigation.symbols">Symbols</I18nText>
              </Link>
              <Link 
                to="/map" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <I18nText translationKey="navigation.map">Map</I18nText>
              </Link>
              <Link 
                to="/collections" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <I18nText translationKey="navigation.collections">Collections</I18nText>
              </Link>
              <Link 
                to="/analysis" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <I18nText translationKey="navigation.analysis">Analysis</I18nText>
              </Link>
              <Link 
                to="/community" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Users className="h-4 w-4 inline mr-1" />
                <I18nText translationKey="navigation.community">Community</I18nText>
              </Link>
              <Link 
                to="/contributions" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <I18nText translationKey="navigation.contributions">Contributions</I18nText>
              </Link>
            </nav>
          </div>

          {/* Search, Language Selector, and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="search"
                placeholder={t('header.search')}
                className="pl-10 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu */}
            {auth?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={auth.user.avatar_url || `https://avatar.vercel.sh/${auth.user.username}.png`} alt={auth.user.username || 'Avatar'} />
                      <AvatarFallback>{auth.user.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    <I18nText translationKey="header.myAccount">My Account</I18nText>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <I18nText translationKey="header.profile">Profile</I18nText>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/contribute">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <I18nText translationKey="header.contribute">Contribute</I18nText>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      <I18nText translationKey="header.adminDashboard">Admin Dashboard</I18nText>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => auth.signOut()}>
                    <I18nText translationKey="header.logout">Log out</I18nText>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={onAuthClick}>
                <I18nText translationKey="header.login">Log In</I18nText>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
