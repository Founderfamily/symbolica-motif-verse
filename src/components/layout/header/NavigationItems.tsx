
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

export const NavigationItems: React.FC = () => {
  const auth = useAuth();
  const isAdmin = auth?.profile?.is_admin;

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {/* Symbols Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium px-3 py-2 rounded-md transition-colors">
            <Hexagon className="h-4 w-4 mr-2" />
            <I18nText translationKey="navigation.symbols" ns="header">
              Symbols
            </I18nText>
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white border border-slate-200 shadow-lg rounded-md">
          <DropdownMenuItem asChild>
            <Link to="/symbols" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
              <Hexagon className="mr-2 h-4 w-4" />
              <I18nText translationKey="navigation.symbols" ns="header">
                Symbols
              </I18nText>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/collections" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
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
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium px-3 py-2 rounded-md transition-colors relative">
            <Users className="h-4 w-4 mr-2" />
            <I18nText translationKey="navigation.community" ns="header">
              Community
            </I18nText>
            <ChevronDown className="ml-1 h-3 w-3" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-full text-white bg-emerald-500 font-medium">
              New
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white border border-slate-200 shadow-lg rounded-md">
          <DropdownMenuItem asChild>
            <Link to="/community" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
              <Users className="mr-2 h-4 w-4" />
              <I18nText translationKey="navigation.community" ns="header">
                Community
              </I18nText>
            </Link>
          </DropdownMenuItem>
          {auth?.user && (
            <DropdownMenuItem asChild>
              <Link to="/contributions" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
                <FileText className="mr-2 h-4 w-4" />
                <I18nText translationKey="navigation.contributions" ns="header">
                  Contributions
                </I18nText>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link to="/trending" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
              <TrendingUp className="mr-2 h-4 w-4" />
              <I18nText translationKey="navigation.trending" ns="header">
                Trending
              </I18nText>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/roadmap" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
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
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center font-medium px-3 py-2 rounded-md"
        >
          <Map className="h-4 w-4 mr-2" />
          <I18nText translationKey="navigation.map" ns="header">
            Map
          </I18nText>
        </Link>
      )}

      {/* Admin Dropdown - only for admins */}
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium px-3 py-2 rounded-md transition-colors">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Admin
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border border-slate-200 shadow-lg rounded-md">
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/users" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
                <Users className="mr-2 h-4 w-4" />
                Utilisateurs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/contributions" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
                <FileText className="mr-2 h-4 w-4" />
                Contributions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/conversion" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
                <RefreshCw className="mr-2 h-4 w-4" />
                Conversion Auto
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/symbols" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
                <Star className="mr-2 h-4 w-4" />
                Symboles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/collections" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
                <Folder className="mr-2 h-4 w-4" />
                Collections
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-1 border-slate-200" />
            
            {/* Tools Section */}
            <DropdownMenuItem asChild>
              <Link to="/analysis" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50">
                <BarChart3 className="mr-2 h-4 w-4 text-blue-600" />
                <I18nText translationKey="navigation.analysis" ns="header">Analyse</I18nText>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mcp-search" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50 relative">
                <Brain className="mr-2 h-4 w-4 text-purple-600" />
                <span>MCP Search</span>
                <span className="ml-auto px-1.5 py-0.5 text-xs rounded-full text-white bg-purple-500 font-medium">
                  AI
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/enterprise" className="flex items-center px-3 py-2 text-sm hover:bg-slate-50 relative">
                <Building2 className="mr-2 h-4 w-4 text-amber-600" />
                <span>Enterprise</span>
                <span className="ml-auto px-1.5 py-0.5 text-xs rounded-full text-white bg-amber-500 font-medium">
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
