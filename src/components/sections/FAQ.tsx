
import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-slate-200 py-4"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
        <h3 className="text-lg font-medium">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-1">
        <p className="text-slate-600">{answer}</p>
      </CollapsibleContent>
    </Collapsible>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "Qu'est-ce que Symbolica exactement ?",
      answer: "Symbolica est une plateforme collaborative open-source dédiée à la découverte, l'analyse et la création autour des symboles et motifs culturels du monde entier."
    },
    {
      question: "Comment puis-je contribuer à Symbolica ?",
      answer: "Vous pouvez contribuer en téléchargeant vos photos de motifs, en annotant des images existantes, en enrichissant la base de connaissances ou en participant aux défis communautaires."
    },
    {
      question: "Les contenus de Symbolica sont-ils libres de droits ?",
      answer: "Les contenus de Symbolica sont généralement sous licence Creative Commons. Les détails précis varient selon le type de contribution, mais nous favorisons l'open data et le partage des connaissances."
    },
    {
      question: "Comment fonctionne la reconnaissance IA de motifs ?",
      answer: "Notre système d'intelligence artificielle analyse les images téléchargées pour identifier des motifs connus. Il s'améliore constamment grâce aux retours des utilisateurs qui valident ou corrigent ses suggestions."
    },
    {
      question: "Symbolica est-il un projet commercial ?",
      answer: "Non, Symbolica est un projet à but non lucratif porté par une association. Notre mission est culturelle et éducative, dans l'esprit des communs numériques."
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Questions fréquentes</h2>
        
        <div>
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
