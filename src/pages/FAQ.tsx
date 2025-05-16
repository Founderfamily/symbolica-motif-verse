
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const FAQ = () => {
  const { t } = useTranslation();
  
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
    },
    {
      question: 'faq.questions.aiRecognition.question',
      answer: 'faq.questions.aiRecognition.answer'
    },
    {
      question: 'faq.questions.commercial.question',
      answer: 'faq.questions.commercial.answer'
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow">
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                <I18nText translationKey="faq.page.title" />
              </h1>
              <p className="text-slate-600 max-w-lg mx-auto">
                <I18nText translationKey="faq.page.subtitle" />
              </p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-slate-50 rounded-lg overflow-hidden px-4"
                >
                  <AccordionTrigger className="text-slate-800 py-4 hover:no-underline hover:text-amber-600 transition-colors">
                    <I18nText translationKey={faq.question} />
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-4">
                    <I18nText translationKey={faq.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQ;
