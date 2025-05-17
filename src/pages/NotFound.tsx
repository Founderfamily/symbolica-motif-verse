
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 bg-slate-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-7xl font-bold text-slate-800 mb-6">404</h1>
          <p className="text-xl text-slate-600 mb-6">
            <I18nText translationKey="error.pageNotFound">Oops! Page non trouvée</I18nText>
          </p>
          <p className="text-slate-500 mb-8">
            <I18nText translationKey="error.routeNotExist">
              La page que vous cherchez n'existe pas ou a été déplacée.
            </I18nText>
          </p>
          <Button asChild variant="default" className="bg-amber-500 hover:bg-amber-600">
            <Link to="/">
              <I18nText translationKey="error.returnHome">Retourner à l'accueil</I18nText>
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
