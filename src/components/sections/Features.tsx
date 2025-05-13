
import React from 'react';
import { MapPin, Search, Users } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Fonctionnalités principales</h2>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="bg-amber-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Carte interactive</h3>
            <p className="text-slate-700">Explorez les symboles géolocalisés à travers le monde et filtrez par culture, époque ou type.</p>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reconnaissance IA</h3>
            <p className="text-slate-700">Identifiez automatiquement les motifs grâce à notre intelligence artificielle en constante évolution.</p>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Communauté collaborative</h3>
            <p className="text-slate-700">Participez à la documentation et la préservation du patrimoine symbolique mondial.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
