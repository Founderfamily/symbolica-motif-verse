
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Search, MapPin, Users } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const UploadTools = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Contribuez au patrimoine symbolique</h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Symbolica vous offre des outils puissants pour documenter, analyser et partager les symboles culturels
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Upload className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold">Capturez et téléchargez</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Photographiez des symboles lors de vos visites culturelles et téléchargez-les directement sur la plateforme
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Search className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold">Analysez et documentez</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Notre IA vous aide à identifier les motifs et les associer à leur contexte historique et culturel
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold">Partagez et échangez</h3>
              </div>
              <p className="text-slate-600 mb-4">
                La communauté peut voter, commenter et enrichir vos découvertes, vous permettant de gagner en expertise
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <AspectRatio ratio={3/4}>
              <div className="h-full bg-slate-100 rounded-lg p-4 flex flex-col">
                <div className="mb-4 text-left">
                  <h3 className="text-lg font-medium">Processus d'analyse</h3>
                  <p className="text-sm text-slate-500">Un exemple de traitement de motif architectural</p>
                </div>
                
                <div className="flex-grow grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-md p-2 border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square bg-slate-200 rounded-md mb-2"></div>
                    <span className="text-xs text-slate-500">Photo originale</span>
                  </div>
                  
                  <div className="bg-white rounded-md p-2 border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square bg-slate-200 rounded-md mb-2"></div>
                    <span className="text-xs text-slate-500">Détection IA</span>
                  </div>
                  
                  <div className="bg-white rounded-md p-2 border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square bg-slate-200 rounded-md mb-2"></div>
                    <span className="text-xs text-slate-500">Extraction de motif</span>
                  </div>
                  
                  <div className="bg-white rounded-md p-2 border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square bg-slate-200 rounded-md mb-2 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-xs text-slate-500">Classification</span>
                  </div>
                </div>
                
                <div className="mt-4 bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="text-sm font-medium mb-1">Résultat de l'analyse</div>
                  <div className="text-xs text-slate-600">Motif Art Nouveau - Période: 1890-1910 - Similarité avec 24 autres motifs</div>
                  <div className="mt-2 flex gap-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">Art Nouveau</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">Floral</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">Europe</span>
                  </div>
                </div>
              </div>
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadTools;
