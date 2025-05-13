
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="pt-10 md:pt-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-block p-2 bg-amber-100 rounded-full mb-4">
          <div className="bg-amber-800/20 px-4 py-1 rounded-full text-amber-900 text-sm font-medium">
            Version Alpha
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-800 to-teal-700 bg-clip-text text-transparent">
          Symbolica
        </h1>
        <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto">
          Découvrez, analysez et créez autour des symboles & motifs culturels du monde entier
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="bg-amber-700 hover:bg-amber-800">
            Explorer les symboles <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-teal-700 text-teal-700 hover:bg-teal-50">
            Contribuer
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
