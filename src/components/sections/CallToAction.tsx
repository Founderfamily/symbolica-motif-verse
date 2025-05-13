
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Rejoignez le projet Symbolica</h2>
        <p className="text-lg text-slate-700 mb-8">
          Participez à la préservation et à la redécouverte des symboles du patrimoine mondial.
          Symbolica est une initiative open-source et collaborative.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-teal-700 hover:bg-teal-800">
            M'inscrire maintenant
          </Button>
          <Button size="lg" variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-50">
            En savoir plus
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          <span className="text-slate-600">Projet soutenu par des musées, universités et contributeurs passionnés</span>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
