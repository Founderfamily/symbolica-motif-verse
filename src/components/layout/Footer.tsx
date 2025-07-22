
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Globe } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">12,500+</div>
            <div className="text-gray-600 text-lg">symboles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">250+</div>
            <div className="text-gray-600 text-lg">cultures</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">1,200+</div>
            <div className="text-gray-600 text-lg">contributeurs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">85+</div>
            <div className="text-gray-600 text-lg">pays</div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Symbolica Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Symbolica</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              <I18nText translationKey="footer.tagline">
                Préserver et célébrer l'héritage symbolique mondial
              </I18nText>
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com/symbolica-museum" 
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 text-gray-600" />
              </a>
              <Link 
                to="/contact" 
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>

          {/* Platform Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">plateforme</h3>
            </div>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  accueil
                </Link>
              </li>
              <li>
                <Link to="/symbols" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  explorer
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  collections
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  carte
                </Link>
              </li>
              <li>
                <Link to="/innovation" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  innovation
                </Link>
              </li>
            </ul>
          </div>

          {/* Parcours Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">parcours</h3>
            </div>
            <ul className="space-y-4">
              <li>
                <Link to="/parcours/academique" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  académique
                </Link>
              </li>
              <li>
                <Link to="/parcours/aventure" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  aventure
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  contribuer
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  tendances
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-3 h-2 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">communauté</h3>
            </div>
            <ul className="space-y-4">
              <li>
                <Link to="/community" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  communauté
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  à propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600">
              © {currentYear} Symbolica. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                Conditions
              </Link>
              <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
