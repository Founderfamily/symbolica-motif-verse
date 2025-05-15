import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Globe, LogOut, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/services/logService';
import { useTranslation } from '@/i18n/useTranslation';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleAuth = () => {
    if (user) {
      // Si l'utilisateur est connecté, le déconnecter
      logger.info('User signing out from header');
      signOut().then(() => {
        navigate('/');
      });
    } else {
      // Sinon, rediriger vers la page d'authentification
      navigate('/auth');
    }
  };

  const handleAdminAccess = () => {
    if (isAdmin) {
      navigate('/admin');
    }
  };
  
  return (
    <header className="py-4 px-4 md:px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-serif font-bold text-slate-800">
            {t('app.name')}
          </Link>
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
            {t('app.version')}
          </span>
          {isAdmin && (
            <button
              onClick={handleAdminAccess}
              className="bg-amber-200 text-amber-900 text-xs px-2 py-0.5 rounded-full hover:bg-amber-300 transition"
            >
              {t('auth.admin')}
            </button>
          )}
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-600 hover:text-amber-700 transition-colors">
            {t('navigation.home')}
          </Link>
          <Link to="/" className="text-slate-600 hover:text-amber-700 transition-colors">
            {t('navigation.explore')}
          </Link>
          <Link to="/" className="text-slate-600 hover:text-amber-700 transition-colors">
            {t('navigation.symbols')}
          </Link>
          <Link to="/about" className="text-slate-600 hover:text-amber-700 transition-colors">
            {t('navigation.about')}
          </Link>
          <Link to="/" className="text-slate-600 hover:text-amber-700 transition-colors">
            {t('navigation.community')}
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <LanguageSelector />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="bg-amber-600 text-white">
                    {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  {t('header.profile')}
                </DropdownMenuItem>
                {user.is_admin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    {t('header.admin')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={signOut}>
                  {t('header.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
              {t('header.signIn')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
