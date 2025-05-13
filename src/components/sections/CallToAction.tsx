
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white border-t border-slate-100">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Rejoignez la communauté Symbolica</h2>
        <p className="text-lg text-slate-700 mb-8">
          Participez à la préservation et à la redécouverte du patrimoine symbolique mondial.
          Une initiative ouverte et collaborative pour tous les passionnés de culture.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-slate-800 hover:bg-slate-700">
            M'inscrire et contribuer
          </Button>
          <Button size="lg" variant="outline" className="border-slate-500 text-slate-700 hover:bg-slate-50">
            Explorer les collections <MapPin className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          <span className="text-slate-600">Projet soutenu par des musées, universités et institutions culturelles</span>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
