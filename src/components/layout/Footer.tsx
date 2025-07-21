
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Mail, Globe, Users, BookOpen, Sparkles, Trophy } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Newsletter Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">
              <I18nText translationKey="footer.newsletter.title">Restez Informé</I18nText>
            </h3>
          </div>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            <I18nText translationKey="footer.newsletter.description">
              Recevez les dernières mises à jour sur les nouveaux symboles et fonctionnalités
            </I18nText>
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input 
              type="email" 
              placeholder="Entrez votre email"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <Button className="px-6">
              <I18nText translationKey="footer.newsletter.subscribe">S'abonner</I18nText>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">12,500+</div>
            <div className="text-sm text-muted-foreground">
              <I18nText translationKey="footer.stats.symbols">Symboles</I18nText>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">250+</div>
            <div className="text-sm text-muted-foreground">
              <I18nText translationKey="footer.stats.cultures">Cultures</I18nText>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">1,200+</div>
            <div className="text-sm text-muted-foreground">
              <I18nText translationKey="footer.stats.contributors">Contributeurs</I18nText>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">85+</div>
            <div className="text-sm text-muted-foreground">
              <I18nText translationKey="footer.stats.countries">Pays</I18nText>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Symbolica</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              <I18nText translationKey="footer.tagline">
                Préserver et célébrer l'héritage symbolique mondial
              </I18nText>
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://github.com/symbolica-museum" 
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <Link 
                to="/contact" 
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">
                <I18nText translationKey="footer.platform">Plateforme</I18nText>
              </h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  <I18nText translationKey="footer.home">Accueil</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/symbols" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  <I18nText translationKey="footer.explore">Explorer</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  <I18nText translationKey="footer.map">Carte</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/innovation" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  Innovation Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Parcours Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Parcours</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/parcours/academique" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  Parcours Académique
                </Link>
              </li>
              <li>
                <Link to="/parcours/aventure" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  Parcours Aventure
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  <I18nText translationKey="footer.contribute">Contribuer</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  Tendances
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">
                <I18nText translationKey="footer.community">Communauté</I18nText>
              </h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  <I18nText translationKey="footer.community">Communauté</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  <I18nText translationKey="footer.about">À propos</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  <I18nText translationKey="footer.contact">Contact</I18nText>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors hover:underline">
                  <I18nText translationKey="footer.privacy">Confidentialité</I18nText>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              <I18nText translationKey="footer.copyright">
                © {currentYear} Musée Symbolica
              </I18nText>
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Conditions
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Confidentialité
              </Link>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>for cultural heritage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
