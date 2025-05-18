
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shapes, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const Sidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      path: '/dashboard',
      label: <I18nText translationKey="sidebar.dashboard" />,
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      path: '/symbols',
      label: <I18nText translationKey="sidebar.symbols" />,
      icon: <Shapes className="h-5 w-5" />
    },
    {
      path: '/groups',
      label: <I18nText translationKey="sidebar.groups" />,
      icon: <Users className="h-5 w-5" />
    }
  ];
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Symbolica</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button className="flex items-center space-x-3 px-3 py-2 w-full text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <LogOut className="h-5 w-5" />
            <span><I18nText translationKey="sidebar.logout" /></span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
