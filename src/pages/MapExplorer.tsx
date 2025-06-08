
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { MapPin } from 'lucide-react';
import SimpleMap from '@/components/map/SimpleMap';

const MapExplorer = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-8 w-8 text-amber-600" />
              <h1 className="text-3xl font-bold text-slate-900">
                {t('mapExplorer.title')}
              </h1>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Explorez les symboles géolocalisés sur une carte interactive
            </p>
          </div>
          
          <SimpleMap />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">À propos de cette carte</h2>
            <div className="space-y-3 text-slate-600">
              <p>
                Cette carte affiche les emplacements géographiques des symboles culturels 
                répertoriés dans notre base de données.
              </p>
              <p>
                Cliquez sur les marqueurs pour voir les détails de chaque symbole, 
                y compris sa culture d'origine et sa description.
              </p>
              <p className="text-sm text-slate-500">
                💡 La carte est configurée par les administrateurs du site
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;
