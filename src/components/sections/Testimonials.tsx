
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { I18nText } from '@/components/ui/i18n-text';

const Testimonials = () => {
  const testimonials = [
    {
      id: '1',
      name: 'Sarah Dubois',
      role: { fr: 'Historienne de l\'Art', en: 'Art Historian' },
      quote: { 
        fr: 'Symbolica a révolutionné ma façon d\'explorer les motifs culturels. Une ressource inestimable.',
        en: 'Symbolica has revolutionized how I explore cultural patterns. An invaluable resource.'
      },
      initials: 'SD'
    },
    {
      id: '2',
      name: 'Marc Lefebvre',
      role: { fr: 'Anthropologue', en: 'Anthropologist' },
      quote: { 
        fr: 'La communauté est incroyablement savante et solidaire. J\'y ai découvert des connexions fascinantes.',
        en: 'The community is incredibly knowledgeable and supportive. I\'ve discovered fascinating connections.'
      },
      initials: 'ML'
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      role: { fr: 'Conservatrice de Musée', en: 'Museum Curator' },
      quote: { 
        fr: 'Un outil extraordinaire pour préserver et partager notre patrimoine symbolique mondial.',
        en: 'An extraordinary tool for preserving and sharing our global symbolic heritage.'
      },
      initials: 'ER'
    }
  ];
  
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">
          <I18nText translationKey="sections.testimonials">Ce que les gens en disent</I18nText>
        </h2>
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
          <I18nText translationKey="testimonials.subtitle">
            Ce que disent les membres de notre communauté
          </I18nText>
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-amber-100 text-amber-800">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">
                      <I18nText translationKey="testimonials.role" values={{ role: testimonial.role.fr }}>
                        {testimonial.role.fr}
                      </I18nText>
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 italic">
                  <I18nText translationKey="testimonials.quote" values={{ quote: testimonial.quote.fr }}>
                    {testimonial.quote.fr}
                  </I18nText>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
