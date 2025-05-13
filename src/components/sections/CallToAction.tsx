
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Users } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-slate-50 -z-10"></div>
      
      {/* Decorative shapes */}
      <div className="absolute -z-5 inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-amber-200/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-slate-200/40 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-8 border-amber-100/10 rounded-full"></div>
      </div>
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-4">
          Rejoignez-nous
        </span>
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">Rejoignez la communauté Symbolica</h2>
        <p className="text-lg text-slate-700 mb-8 leading-relaxed">
          Participez à la préservation et à la redécouverte du patrimoine symbolique mondial.
          Une initiative ouverte et collaborative pour tous les passionnés de culture.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/20 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
            <Users className="h-4 w-4" />
            M'inscrire et contribuer
          </Button>
          <Button size="lg" variant="outline" className="border-slate-400 text-slate-700 hover:border-amber-300 hover:bg-amber-50 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
            Explorer les collections <MapPin className="ml-1 h-4 w-4 text-amber-600" />
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-amber-200"></div>
          <span className="text-slate-600 px-2">Projet soutenu par des musées, universités et institutions culturelles</span>
          <div className="h-0.5 w-16 bg-gradient-to-r from-amber-200 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
