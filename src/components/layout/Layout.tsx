
import React, { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';
import { supabase } from '@/integrations/supabase/client';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t, currentLanguage, refreshLanguage } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Log current location for debugging
  useEffect(() => {
    console.log(`Layout: Rendering page at path: ${location.pathname} with language: ${currentLanguage}`);
  }, [location.pathname, currentLanguage]);
  
  // Make sure language is consistent when changing routes
  useEffect(() => {
    // Ensure the language is correctly set when the route changes
    refreshLanguage();
  }, [location.pathname, refreshLanguage]);
  
  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    // Check if route requires authentication
    const requiresAuth = location.pathname.startsWith('/groups/create');
    
    if (requiresAuth && isAuthenticated === false) {
      toast.error(t('auth.requiresLogin'));
      // Let the router handle the redirect
    }
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [location.pathname, isAuthenticated, t]);
  
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
