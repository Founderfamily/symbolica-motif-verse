
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Mail } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo.svg" 
                alt="Symbolica" 
                className="h-8 w-8 brightness-0 invert"
              />
              <span className="font-bold text-xl text-white">Symbolica</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              <I18nText translationKey="footer.tagline">
                Préserver et célébrer l'héritage symbolique mondial
              </I18nText>
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/symbolica-museum" 
                className="text-slate-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <Link 
                to="/contact" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              <I18nText translationKey="footer.platform">Plateforme</I18nText>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.home">Accueil</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/symbols" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.explore">Explorer</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.collections">Collections</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.map">Carte</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.contribute">Contribuer</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.search">Recherche</I18nText>
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              <I18nText translationKey="footer.community">Communauté</I18nText>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/community" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.community">Communauté</I18nText>
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/symbolica-museum" 
                  className="hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <I18nText translationKey="footer.github">GitHub</I18nText>
                </a>
              </li>
              <li>
                <Link to="/trending" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.trending">Tendances</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.contact">Contact</I18nText>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              <I18nText translationKey="footer.legal">Légal</I18nText>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.privacy">Politique de confidentialité</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.terms">Conditions d'utilisation</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.legal">Mentions légales</I18nText>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-slate-400 mb-4 sm:mb-0">
              <I18nText translationKey="footer.copyright">
                © {currentYear} Musée Symbolica
              </I18nText>
            </p>
            <div className="flex items-center text-sm text-slate-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>for cultural heritage</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
