
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { I18nText } from '@/components/ui/i18n-text';
import { Home } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-extrabold text-gray-700 tracking-widest">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">
        <I18nText translationKey="notFound.title" />
      </h2>
      <p className="text-gray-500 mt-2 mb-8 max-w-md">
        <I18nText translationKey="notFound.message" />
      </p>
      
      <Link to="/">
        <Button className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <I18nText translationKey="notFound.backHome" />
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
