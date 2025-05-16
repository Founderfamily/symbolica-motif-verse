
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import FAQ from '@/components/sections/FAQ';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* FAQ Section */}
      <FAQ />
      
      <div className="py-12 px-4 md:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-4">
                <I18nText translationKey="app.name">Symbolica</I18nText>
              </h2>
              <p className="max-w-md text-slate-400">
                <I18nText translationKey="footer.tagline">
                  Preserving and celebrating the world's symbolic heritage
                </I18nText>
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium text-white mb-4">
                  <I18nText translationKey="footer.platform">Platform</I18nText>
                </h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.home">Home</I18nText>
                  </Link></li>
                  <li><Link to="/explore" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.explore">Explore</I18nText>
                  </Link></li>
                  <li><Link to="/map" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.map">Map</I18nText>
                  </Link></li>
                  <li><Link to="/contributions" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.contribute">Contribute</I18nText>
                  </Link></li>
                  <li><Link to="/about" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.about">About</I18nText>
                  </Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-4">
                  <I18nText translationKey="footer.community">Community</I18nText>
                </h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.github">GitHub</I18nText>
                  </a></li>
                  <li><a href="#" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.discord">Discord</I18nText>
                  </a></li>
                  <li><a href="#" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.forum">Forum</I18nText>
                  </a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-4">
                  <I18nText translationKey="footer.legal">Legal</I18nText>
                </h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.terms">Terms of Use</I18nText>
                  </Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.privacy">Privacy Policy</I18nText>
                  </Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">
                    <I18nText translationKey="footer.license">License</I18nText>
                  </Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>
              <I18nText translationKey="footer.copyright">
                © 2025 Symbolica Museum
              </I18nText>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
