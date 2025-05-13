
import React from 'react';

const HowItWorks = () => {
  return (
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
  );
};

export default HowItWorks;
