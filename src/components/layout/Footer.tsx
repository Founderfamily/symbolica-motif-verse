
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-4">{t('app.name')}</h2>
            <p className="max-w-md text-slate-400">
              <I18nText translationKey="footer.tagline" />
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-white mb-4">
                <I18nText translationKey="footer.platform" />
              </h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.home" />
                </Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.explore" />
                </Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.contribute" />
                </Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.about" />
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">
                <I18nText translationKey="footer.community" />
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.github" />
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.discord" />
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.forum" />
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">
                <I18nText translationKey="footer.legal" />
              </h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.terms" />
                </Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.privacy" />
                </Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.license" />
                </Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>
            <I18nText translationKey="footer.copyright" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
