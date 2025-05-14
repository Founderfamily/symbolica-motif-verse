
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Globe, LogOut, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/services/logService';

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  
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
          <Link to="/" className="font-bold text-2xl text-amber-700">
            Symbolica
          </Link>
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Alpha</span>
          {isAdmin && (
            <button
              onClick={handleAdminAccess}
              className="bg-amber-200 text-amber-900 text-xs px-2 py-0.5 rounded-full hover:bg-amber-300 transition"
            >
              Admin
            </button>
          )}
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-700 hover:text-amber-700 flex items-center gap-1">
            <Globe className="h-4 w-4" />
            Explorer
          </Link>
          <Link to="/" className="text-slate-700 hover:text-amber-700 flex items-center gap-1">
            <Search className="h-4 w-4" />
            Rechercher
          </Link>
          <Link to="/" className="text-slate-700 hover:text-amber-700 flex items-center gap-1">
            <Book className="h-4 w-4" />
            À propos
          </Link>
          <Link to="/" className="text-slate-700 hover:text-amber-700 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Communauté
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-2">
            <Link to="/" className="text-sm font-medium hover:text-amber-700">FR</Link>
            <span className="text-slate-300">|</span>
            <Link to="/" className="text-sm font-medium hover:text-amber-700">EN</Link>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-700">
                {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-amber-700 text-amber-700 hover:bg-amber-50 flex items-center gap-1"
                onClick={handleAuth}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-amber-700 text-amber-700 hover:bg-amber-50"
                onClick={() => navigate('/auth')}
              >
                Connexion
              </Button>
              <Button 
                size="sm" 
                className="bg-amber-700 hover:bg-amber-800"
                onClick={() => navigate('/auth')}
              >
                Inscription
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
