
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-4">{t('app.name')}</h2>
            <p className="max-w-md text-slate-400">{t('footer.tagline')}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-white mb-4">{t('footer.platform')}</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">{t('footer.home')}</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">{t('footer.explore')}</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">{t('footer.contribute')}</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">{t('footer.about')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">{t('footer.community')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.github')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.discord')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.forum')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">{t('footer.license')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
