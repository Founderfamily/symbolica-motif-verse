
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Info, MapPin, Calendar } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { SYMBOLS } from '@/data/symbols';
import { I18nText } from '@/components/ui/i18n-text';

const SymbolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Parser l'ID et trouver le symbole par index
  const symbolIndex = id ? parseInt(id, 10) : -1;
  const symbol = symbolIndex >= 0 && symbolIndex < SYMBOLS.length ? SYMBOLS[symbolIndex] : null;

  console.log(`SymbolDetailPage: ID reçu: ${id}, Index parsé: ${symbolIndex}, Symbole trouvé: ${symbol?.name || 'Non trouvé'}`);

  // Vérifier si l'ID est un nombre valide
  if (id && isNaN(symbolIndex)) {
    console.error(`ID invalide: "${id}" n'est pas un nombre`);
  }

  if (!symbol) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="symbols.notFound">Symbole non trouvé</I18nText>
          </h2>
          <p className="text-slate-600 mb-6">
            <I18nText translationKey="symbols.notFoundDesc">Le symbole que vous recherchez n'existe pas.</I18nText>
          </p>
          <Button onClick={() => navigate('/symbols')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <I18nText translationKey="common.backToSymbols">Retour aux symboles</I18nText>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/symbols')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <I18nText translationKey="common.backToSymbols">Retour aux symboles</I18nText>
          </Button>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image du symbole */}
          <Card className="overflow-hidden">
            <AspectRatio ratio={1} className="bg-slate-100">
              <img
                src={symbol.src}
                alt={symbol.name}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </AspectRatio>
          </Card>

          {/* Informations du symbole */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {symbol.name}
              </h1>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{symbol.culture}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{symbol.period}</span>
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-slate-900">
                  <I18nText translationKey="symbols.details.information">Informations</I18nText>
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    <I18nText translationKey="symbols.culture">Culture</I18nText>
                  </label>
                  <p className="text-slate-900">{symbol.culture}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    <I18nText translationKey="symbols.period">Période</I18nText>
                  </label>
                  <p className="text-slate-900">{symbol.period}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Type d'image</label>
                  <p className="text-slate-900">
                    {symbol.isExternal ? 'Image externe' : 'Image locale'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Index du symbole</label>
                  <p className="text-slate-900">#{symbolIndex}</p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button className="flex-1">
                <I18nText translationKey="common.explore">Explorer</I18nText>
              </Button>
              <Button variant="outline" className="flex-1">
                <I18nText translationKey="common.share">Partager</I18nText>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolDetailPage;
