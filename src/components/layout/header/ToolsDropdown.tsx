
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, BarChart3, Brain, Building2, Search, Smartphone, Compass } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';

export const ToolsDropdown: React.FC = () => {
  const auth = useAuth();

  // Ne pas afficher le dropdown si l'utilisateur n'est pas admin
  if (!auth?.user || !auth?.profile?.is_admin) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 transition-colors">
        <span>
          <I18nText translationKey="navigation.tools">Outils</I18nText>
        </span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {/* Outils d'analyse */}
        <DropdownMenuItem asChild>
          <Link to="/analysis" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>
              <I18nText translationKey="navigation.analysis">Analyse</I18nText>
            </span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/symbol-explorer" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Explorateur de Symboles</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Outils IA et avancés */}
        <DropdownMenuItem asChild>
          <Link to="/mcp-search" className="flex items-center space-x-2 relative">
            <Brain className="h-4 w-4 text-purple-600" />
            <span>MCP Search</span>
            <span className="absolute -top-2 -right-2 px-1 py-0.5 text-xs rounded-full text-white bg-purple-500">
              AI
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/map" className="flex items-center space-x-2">
            <Compass className="h-4 w-4" />
            <span>Carte Interactive</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Outils entreprise et mobile */}
        <DropdownMenuItem asChild>
          <Link to="/enterprise" className="flex items-center space-x-2 relative">
            <Building2 className="h-4 w-4" />
            <span>Enterprise</span>
            <span className="absolute -top-2 -right-2 px-1 py-0.5 text-xs rounded-full text-white bg-amber-500">
              New
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/mobile" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>Application Mobile</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
