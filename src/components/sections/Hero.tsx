
import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="pt-10 md:pt-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-block p-2 bg-amber-50 rounded-full mb-4">
          <div className="bg-amber-800/10 px-4 py-1 rounded-full text-amber-900 text-sm font-medium">
            Version Alpha
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-800">
          Symbolica
        </h1>
        <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-8">
          Explorez, documentez et partagez le patrimoine symbolique mondial avec notre communauté de passionnés
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="bg-slate-800 hover:bg-slate-700">
            Rejoindre la communauté <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-slate-500 text-slate-700 hover:bg-slate-50">
            Découvrir les symboles <MapPin className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
