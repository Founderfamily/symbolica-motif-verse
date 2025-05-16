
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const FAQ = () => {
  const { t } = useTranslation();
  
  const faqs = [
    {
      question: 'faq.questions.general.what',
      answer: 'faq.answers.general.what'
    },
    {
      question: 'faq.questions.general.how',
      answer: 'faq.answers.general.how'
    },
    {
      question: 'faq.questions.technical.compatibility',
      answer: 'faq.answers.technical.compatibility'
    },
    {
      question: 'faq.questions.technical.requirements',
      answer: 'faq.answers.technical.requirements'
    },
    {
      question: 'faq.questions.support.contact',
      answer: 'faq.answers.support.contact'
    }
  ];
  
  return (
    <section className="py-16 px-4 md:px-8 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            <I18nText translationKey="faq.section.title" />
          </h2>
          <p className="text-slate-300 max-w-lg mx-auto">
            <I18nText translationKey="faq.section.subtitle" />
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-slate-800 rounded-lg overflow-hidden px-4"
            >
              <AccordionTrigger className="text-white py-4 hover:no-underline hover:text-amber-300 transition-colors">
                <I18nText translationKey={faq.question} />
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 pb-4">
                <I18nText translationKey={faq.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
