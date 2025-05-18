
import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { supabase } from '@/integrations/supabase/client';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, currentLanguage, validateCurrentPageTranslations } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Enhanced logging for better debugging
  useEffect(() => {
    console.log(`Layout: Rendering page at path: ${location.pathname} with language: ${currentLanguage}`);
    
    // In development, validate the translations on the current page
    if (process.env.NODE_ENV === 'development') {
      // Wait for the page to render fully before validating translations
      const timeoutId = setTimeout(() => {
        validateCurrentPageTranslations();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname, currentLanguage, validateCurrentPageTranslations]);
  
  // Force re-render on language change
  useEffect(() => {
    console.log(`Layout detected language change to: ${currentLanguage}`);
  }, [currentLanguage]);
  
  // Check and notify about authentication status 
  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed: ${event}`);
      setIsAuthenticated(!!session);
    });
    
    // Check if route requires authentication
    const requiresAuth = location.pathname.startsWith('/groups/create');
    
    if (requiresAuth && isAuthenticated === false) {
      toast.error(<I18nText translationKey="auth.requiresLogin" />);
      // Let the router handle the redirect
    }
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [location.pathname, isAuthenticated, t]);
  
  // Use key to force complete re-render on language change
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden" key={`layout-${currentLanguage}`}>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
