
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { useToast } from '@/hooks/use-toast';

const NewsletterSignup = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: t('common.error'),
        description: t('common.fieldRequired'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: t('common.success'),
        description: t('sections.newsletterSuccess'),
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-700 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>
        <div className="absolute inset-0 pattern-zigzag-lg"></div>
      </div>
      
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">
            <I18nText translationKey="sections.newsletter" />
          </h2>
          <p className="text-amber-100">
            <I18nText translationKey="sections.newsletterSub" />
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('header.email')} 
            className="bg-white/90 border-transparent focus:border-white focus:ring-white text-amber-900 shadow-lg"
            required
          />
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-amber-900 hover:bg-amber-100 whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <I18nText translationKey="sections.subscribe" />
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
