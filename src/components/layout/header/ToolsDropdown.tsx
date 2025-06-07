
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Search, Briefcase } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';

export const ToolsDropdown: React.FC = () => {
  const auth = useAuth();

  // Vérifier si l'utilisateur a accès à au moins un outil
  const hasAnalysisAccess = !!auth?.user;
  const hasMCPAccess = !!auth?.user;
  const hasEnterpriseAccess = auth?.user && auth?.profile?.is_admin;

  // Si l'utilisateur n'a accès à aucun outil, ne pas afficher le menu
  if (!hasAnalysisAccess && !hasMCPAccess && !hasEnterpriseAccess) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1">
        <Wrench className="h-4 w-4" />
        <span><I18nText translationKey="navigation.tools" ns="header">Outils</I18nText></span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white border border-slate-200 shadow-lg z-50">
        {hasAnalysisAccess && (
          <DropdownMenuItem asChild>
            <Link to="/analysis" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-slate-50">
              <Search className="h-4 w-4 text-slate-500" />
              <span><I18nText translationKey="navigation.analysis" ns="header">Analyse</I18nText></span>
            </Link>
          </DropdownMenuItem>
        )}
        
        {hasMCPAccess && (
          <DropdownMenuItem asChild>
            <Link to="/mcp-search" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-slate-50">
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">🧠</span>
                <span><I18nText translationKey="navigation.mcpSearch" ns="header">Recherche MCP</I18nText></span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  AI
                </Badge>
              </div>
            </Link>
          </DropdownMenuItem>
        )}
        
        {hasEnterpriseAccess && (
          <DropdownMenuItem asChild>
            <Link to="/enterprise" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-slate-50">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-slate-500" />
                <span><I18nText translationKey="navigation.enterprise" ns="header">Entreprise</I18nText></span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                  New
                </Badge>
              </div>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
