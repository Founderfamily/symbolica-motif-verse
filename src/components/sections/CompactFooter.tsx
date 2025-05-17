
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { ArrowRight } from 'lucide-react';

const CompactFooter = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Left side */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              <I18nText translationKey="app.name" />
            </h2>
            <p className="text-slate-400 mb-6 max-w-md">
              <I18nText translationKey="compactFooter.tagline" />
            </p>
            
            {/* Newsletter signup */}
            <div className="max-w-sm">
              <h3 className="text-white text-sm font-medium mb-2">
                <I18nText translationKey="newsletter.title" />
              </h3>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder={t('newsletter.placeholder')}
                  className="bg-slate-800 border-slate-700 text-slate-300 focus:border-amber-500 rounded-r-none"
                />
                <Button className="rounded-l-none bg-amber-600 hover:bg-amber-700">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                <I18nText translationKey="newsletter.privacy" />
              </p>
            </div>
          </div>
          
          {/* Right side - Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Platform links */}
            <div>
              <h3 className="text-white font-medium mb-3">
                <I18nText translationKey="compactFooter.platform" />
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="nav.home" />
                </Link></li>
                <li><Link to="/explore" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="nav.explore" />
                </Link></li>
                <li><Link to="/map" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="nav.map" />
                </Link></li>
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="nav.about" />
                </Link></li>
              </ul>
            </div>
            
            {/* Community links */}
            <div>
              <h3 className="text-white font-medium mb-3">
                <I18nText translationKey="compactFooter.community" />
              </h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="compactFooter.discord" />
                </a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="compactFooter.github" />
                </a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="compactFooter.forum" />
                </a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-white font-medium mb-3">
                <I18nText translationKey="compactFooter.legal" />
              </h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="compactFooter.privacy" />
                </a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="compactFooter.terms" />
                </a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <I18nText translationKey="compactFooter.cookies" />
                </a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>
            <I18nText translationKey="compactFooter.copyright" />
          </p>
          <p className="mt-2 md:mt-0">
            <I18nText translationKey="compactFooter.rights" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CompactFooter;
