
import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const FAQItem = ({ questionKey, answerKey }: { questionKey: string, answerKey: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-slate-200 py-4"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
        <h3 className="text-lg font-medium">
          <I18nText translationKey={questionKey} />
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-1">
        <p className="text-slate-600">
          <I18nText translationKey={answerKey} />
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};

const FAQ = () => {
  const { t } = useTranslation();
  
  const faqItems = [
    {
      questionKey: "faq.questions.whatIs.question",
      answerKey: "faq.questions.whatIs.answer"
    },
    {
      questionKey: "faq.questions.howContribute.question",
      answerKey: "faq.questions.howContribute.answer"
    },
    {
      questionKey: "faq.questions.rights.question",
      answerKey: "faq.questions.rights.answer"
    },
    {
      questionKey: "faq.questions.aiRecognition.question",
      answerKey: "faq.questions.aiRecognition.answer"
    },
    {
      questionKey: "faq.questions.commercial.question",
      answerKey: "faq.questions.commercial.answer"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">
          <I18nText translationKey="faq.title" />
        </h2>
        
        <div>
          {faqItems.map((item, index) => (
            <FAQItem 
              key={index} 
              questionKey={item.questionKey} 
              answerKey={item.answerKey} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
