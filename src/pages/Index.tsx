
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Search, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
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
        
        <div className="relative mt-8 md:mt-12 mb-16">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full border border-amber-200 z-10">
            <span className="text-amber-800 text-sm font-medium">Des milliers de motifs à découvrir</span>
          </div>
          <div className="bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden">
            <div className="aspect-video w-full bg-slate-100 flex items-center justify-center">
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 p-4 w-full">
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-amber-50 rounded-lg aspect-square flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(${i * 25}deg, #f5f0e0, ${i % 2 === 0 ? '#eaddca' : '#d8e8e6'})`
                    }}
                  >
                    <div className="w-3/4 h-3/4 rounded-full bg-opacity-50" 
                      style={{
                        backgroundImage: `radial-gradient(circle at ${i % 3 * 30}% ${i % 2 * 70}%, #e5e7eb 1px, transparent 1px)`,
                        backgroundSize: `${10 + i * 3}px ${10 + i * 3}px`
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* How it works */}
      <section className="py-16 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Comment ça marche</h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">Une plateforme open-source pour préserver, éduquer et inspirer autour des symboles culturels</p>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { 
                step: "1", 
                title: "Photographiez", 
                desc: "Capturez et téléchargez des photos de symboles que vous trouvez" 
              },
              { 
                step: "2", 
                title: "Annotez", 
                desc: "Identifiez et décrivez les motifs de façon interactive" 
              },
              { 
                step: "3", 
                title: "Explorez", 
                desc: "Découvrez les liens entre les symboles à travers cultures et époques" 
              },
              { 
                step: "4", 
                title: "Créez", 
                desc: "Générez de nouveaux motifs inspirés par le patrimoine avec notre IA" 
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 mt-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join section */}
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

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-4">Symbolica</h2>
              <p className="max-w-md text-slate-400">Une plateforme open-source dédiée à la découverte, l'analyse et la création autour des symboles & motifs culturels.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium text-white mb-4">Plateforme</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Explorer</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Contribuer</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">À propos</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-4">Communauté</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-4">Légal</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="hover:text-white transition-colors">Mentions légales</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Confidentialité</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Licence</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Symbolica — Association loi 1901</p>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">FR</a>
                <a href="#" className="hover:text-white transition-colors">EN</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
