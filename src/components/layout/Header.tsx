
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Globe, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="py-4 px-4 md:px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-bold text-2xl text-amber-700">
            Symbolica
          </Link>
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Alpha</span>
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
          <Button variant="outline" size="sm" className="border-amber-700 text-amber-700 hover:bg-amber-50">
            Connexion
          </Button>
          <Button size="sm" className="bg-amber-700 hover:bg-amber-800">
            Inscription
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
