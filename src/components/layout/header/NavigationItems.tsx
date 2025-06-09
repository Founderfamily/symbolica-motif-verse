
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Bookmark, Hexagon, Map, FileText, ChevronDown, LayoutDashboard, RefreshCw, Star, Folder, Settings, MapPin, BarChart3, Brain, Building2 } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactElement;
  badge?: string;
}

export const NavigationItems: React.FC = () => {
  const auth = useAuth();
  const isAdmin = auth?.profile?.is_admin;

  return (
    <nav className="hidden md:flex space-x-6">
      {/* Symbols Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900 font-medium">
            <Hexagon className="h-4 w-4 inline mr-2" />
            <I18nText translationKey="navigation.symbols" ns="header">
              Symbols
            </I18nText>
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/symbols" className="flex items-center">
              <Hexagon className="mr-2 h-4 w-4" />
              <I18nText translationKey="navigation.symbols" ns="header">
                Symbols
              </I18nText>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/collections" className="flex items-center">
              <Bookmark className="mr-2 h-4 w-4" />
              <I18nText translationKey="navigation.collections" ns="header">
                Collections
              </I18nText>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Community Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900 font-medium relative">
            <Users className="h-4 w-4 inline mr-2" />
            <I18nText translationKey="navigation.community" ns="header">
              Community
            </I18nText>
            <ChevronDown className="ml-1 h-4 w-4" />
            <span className="absolute -top-2 -right-2 px-1 py-0.5 text-xs rounded-full text-white bg-amber-500">
              New
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/community" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <I18nText translationKey="navigation.community" ns="header">
                Community
              </I18nText>
            </Link>
          </DropdownMenuItem>
          {auth?.user && (
            <DropdownMenuItem asChild>
              <Link to="/contributions" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                <I18nText translationKey="navigation.contributions" ns="header">
                  Contributions
                </I18nText>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link to="/trending" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              <I18nText translationKey="navigation.trending" ns="header">
                Trending
              </I18nText>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/roadmap" className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <I18nText translationKey="navigation.roadmap" ns="header">
                Roadmap
              </I18nText>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Map - only for authenticated users */}
      {auth?.user && (
        <Link 
          to="/map" 
          className="text-slate-600 hover:text-slate-900 transition-colors relative flex items-center font-medium"
        >
          <Map className="h-4 w-4 inline mr-2" />
          <I18nText translationKey="navigation.map" ns="header">
            Map
          </I18nText>
        </Link>
      )}

      {/* Admin Dropdown - only for admins */}
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
              Admin
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Utilisateurs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/contributions" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Contributions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/conversion" className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Conversion Auto
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/symbols" className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Symboles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/collections" className="flex items-center">
                <Folder className="mr-2 h-4 w-4" />
                Collections
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Tools Section */}
            <DropdownMenuItem asChild>
              <Link to="/analysis" className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                <I18nText translationKey="navigation.analysis" ns="header">Analyse</I18nText>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mcp-search" className="flex items-center relative">
                <Brain className="mr-2 h-4 w-4 text-purple-600" />
                <span>MCP Search</span>
                <span className="absolute -top-2 -right-2 px-1 py-0.5 text-xs rounded-full text-white bg-purple-500">
                  AI
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/enterprise" className="flex items-center relative">
                <Building2 className="mr-2 h-4 w-4" />
                <span>Enterprise</span>
                <span className="absolute -top-2 -right-2 px-1 py-0.5 text-xs rounded-full text-white bg-amber-500">
                  New
                </span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};
