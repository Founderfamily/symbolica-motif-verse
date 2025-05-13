
import React from 'react';
import { MapPin, Book, Search } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Découverte et documentation du patrimoine</h2>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cartographie culturelle</h3>
            <p className="text-slate-700">Explorez les symboles géolocalisés à travers différentes cultures et époques avec notre interface de navigation intuitive.</p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Identification avancée</h3>
            <p className="text-slate-700">Notre technologie d'analyse permet d'identifier, classer et contextualiser les symboles culturels avec précision.</p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Documentation collaborative</h3>
            <p className="text-slate-700">Contribuez à enrichir la base de connaissances mondiale sur les symboles patrimoniaux partagés par notre communauté.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
