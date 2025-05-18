
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  const faqs = [
    {
      question: 'faq.questions.whatIs.question',
      answer: 'faq.questions.whatIs.answer'
    },
    {
      question: 'faq.questions.howContribute.question',
      answer: 'faq.questions.howContribute.answer'
    },
    {
      question: 'faq.questions.rights.question',
      answer: 'faq.questions.rights.answer'
    }
  ];
  
  return (
    <footer className="bg-slate-900 text-slate-300">      
      <div className="py-12 px-4 md:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: About & Logo */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                <I18nText translationKey="app.name">Symbolica</I18nText>
              </h2>
              <p className="max-w-md text-slate-400 mb-4">
                <I18nText translationKey="footer.tagline">
                  Preserving and celebrating the world's symbolic heritage
                </I18nText>
              </p>
            </div>
            
            {/* Column 2: Platform Links */}
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
            
            {/* Column 3: Community Links */}
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
            
            {/* Column 4: FAQ Accordion */}
            <div>
              <h3 className="font-medium text-white mb-4">
                <I18nText translationKey="faq.title">FAQ</I18nText>
              </h3>
              <Accordion 
                type="single" 
                collapsible 
                className="space-y-2"
                value={expandedFaq || undefined}
                onValueChange={(value) => setExpandedFaq(value)}
              >
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="border-b border-slate-800"
                  >
                    <AccordionTrigger className="text-sm text-slate-200 py-2 hover:no-underline hover:text-amber-300">
                      <I18nText translationKey={faq.question} />
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-slate-400 pb-2">
                      <I18nText translationKey={faq.answer} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
          
          {/* Copyright section */}
          <div className="border-t border-slate-800 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
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
