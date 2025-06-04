
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Github, MessageCircle, Mail, Heart, Globe, Users, BookOpen, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate newsletter subscription
    setTimeout(() => {
      toast({
        title: t('footer.newsletter.success'),
        description: t('footer.newsletter.description'),
      });
      setEmail('');
      setIsSubscribing(false);
    }, 1000);
  };

  const stats = [
    { icon: BookOpen, label: 'footer.stats.symbols', value: '2,847' },
    { icon: Globe, label: 'footer.stats.cultures', value: '156' },
    { icon: Users, label: 'footer.stats.contributors', value: '1,234' },
    { icon: MapPin, label: 'footer.stats.countries', value: '89' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Stats section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">
                  <I18nText translationKey={stat.label} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.svg" alt="Symbolica" className="h-8 w-8" />
                <h2 className="text-2xl font-bold text-white">
                  <I18nText translationKey="app.name">Symbolica</I18nText>
                </h2>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                <I18nText translationKey="footer.tagline" />
              </p>
              
              {/* Newsletter Signup */}
              <div className="space-y-4">
                <h3 className="font-medium text-white">
                  <I18nText translationKey="footer.newsletter.title" />
                </h3>
                <p className="text-sm text-slate-400">
                  <I18nText translationKey="footer.newsletter.description" />
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder={t('footer.newsletter.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                    required
                  />
                  <Button type="submit" disabled={isSubscribing} className="bg-amber-600 hover:bg-amber-700">
                    <I18nText translationKey="footer.newsletter.subscribe" />
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Platform Links */}
            <div>
              <h3 className="font-medium text-white mb-4">
                <I18nText translationKey="footer.platform" />
              </h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.home" />
                </Link></li>
                <li><Link to="/symbols" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.explore" />
                </Link></li>
                <li><Link to="/collections" className="hover:text-white transition-colors">
                  <I18nText translationKey="navigation.collections" />
                </Link></li>
                <li><Link to="/map" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.map" />
                </Link></li>
                <li><Link to="/contribute" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.contribute" />
                </Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.about" />
                </Link></li>
              </ul>
            </div>
            
            {/* Community & Legal */}
            <div>
              <h3 className="font-medium text-white mb-4">
                <I18nText translationKey="footer.community" />
              </h3>
              <ul className="space-y-2 mb-6">
                <li><Link to="/community" className="hover:text-white transition-colors">
                  <I18nText translationKey="footer.community" />
                </Link></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  <I18nText translationKey="footer.github" />
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <I18nText translationKey="footer.discord" />
                </a></li>
              </ul>
              
              <h4 className="font-medium text-white mb-2">
                <I18nText translationKey="footer.legal" />
              </h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white transition-colors text-sm">
                  <I18nText translationKey="footer.privacy" />
                </Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors text-sm">
                  <I18nText translationKey="footer.terms" />
                </Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors text-sm">
                  <I18nText translationKey="footer.contact" />
                </Link></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-slate-800 mb-6" />
          
          {/* Copyright section */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              <I18nText translationKey="footer.copyright" />
            </p>
            <div className="flex items-center space-x-1 mt-4 md:mt-0">
              <span className="text-sm">Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm">for cultural heritage</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
