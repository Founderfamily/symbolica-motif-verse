
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const FAQ = () => {
  const { t } = useTranslation();
  
  const faqs = [
    {
      question: 'faq.question1',
      answer: 'faq.answer1'
    },
    {
      question: 'faq.question2',
      answer: 'faq.answer2'
    },
    {
      question: 'faq.question3',
      answer: 'faq.answer3'
    },
    {
      question: 'faq.question4',
      answer: 'faq.answer4'
    },
    {
      question: 'faq.question5',
      answer: 'faq.answer5'
    }
  ];
  
  return (
    <section className="py-16 px-4 md:px-8 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            <I18nText translationKey="faq.title" />
          </h2>
          <p className="text-slate-300 max-w-lg mx-auto">
            <I18nText translationKey="faq.subtitle" />
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
