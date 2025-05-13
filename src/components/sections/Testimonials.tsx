
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: "Jean D.",
    role: "Historien d'art",
    quote: "Symbolica m'a permis de documenter et comparer des motifs médiévaux à travers l'Europe, facilitant grandement ma recherche comparative.",
    initials: "JD"
  },
  {
    id: 2,
    name: "Sofia M.",
    role: "Designer textile",
    quote: "Une source d'inspiration inestimable pour mon travail créatif. J'ai découvert des motifs que je n'aurais jamais trouvés ailleurs.",
    initials: "SM"
  },
  {
    id: 3,
    name: "Léo T.",
    role: "Étudiant en design",
    quote: "La fonctionnalité de génération IA m'a ouvert de nouvelles perspectives créatives pour mes projets universitaires.",
    initials: "LT"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Témoignages</h2>
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
          Découvrez comment Symbolica transforme la façon dont les experts et passionnés interagissent avec les symboles culturels
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-amber-100 text-amber-800">{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic">{testimonial.quote}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
