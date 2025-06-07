
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Info, MapPin, Calendar, Share2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { SYMBOLS } from '@/data/symbols';
import { I18nText } from '@/components/ui/i18n-text';
import { ShareButton } from '@/components/social/ShareButton';
import { toast } from 'sonner';

const SymbolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log(`SymbolDetailPage: ID reçu: ${id}`);

  // Fonction améliorée pour trouver le symbole
  const findSymbol = (identifier: string) => {
    if (!identifier) return null;

    console.log(`SymbolDetailPage: Recherche du symbole "${identifier}"`);

    // 1. Essayer de parser comme index numérique
    const numericIndex = parseInt(identifier, 10);
    if (!isNaN(numericIndex) && numericIndex >= 0 && numericIndex < SYMBOLS.length) {
      console.log(`SymbolDetailPage: Symbole trouvé par index ${numericIndex}:`, SYMBOLS[numericIndex].name);
      return { symbol: SYMBOLS[numericIndex], index: numericIndex };
    }

    // 2. Créer un mapping nom -> index pour les symboles statiques
    const nameToIndexMap: Record<string, number> = {};
    SYMBOLS.forEach((symbol, index) => {
      // Version originale du nom
      nameToIndexMap[symbol.name.toLowerCase()] = index;
      
      // Version avec tirets
      const slugVersion = symbol.name.toLowerCase()
        .replace(/[éèê]/g, 'e')
        .replace(/[àâ]/g, 'a')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      nameToIndexMap[slugVersion] = index;
      
      // Version avec espaces remplacés par des tirets
      const simpleSlug = symbol.name.toLowerCase().replace(/\s+/g, '-');
      nameToIndexMap[simpleSlug] = index;
      
      // Versions avec des suffixes numériques (compatibilité avec les anciens liens)
      nameToIndexMap[`${slugVersion}-${index}`] = index;
      nameToIndexMap[`${simpleSlug}-${index}`] = index;
      
      // Cas spéciaux pour certains symboles
      if (symbol.name === "Dreamcatcher") {
        nameToIndexMap["dreamcatcher-10"] = index;
        nameToIndexMap["attrape-reves"] = index;
      }
      if (symbol.name === "Yin et Yang") {
        nameToIndexMap["yin-yang"] = index;
        nameToIndexMap["yin-et-yang"] = index;
      }
      if (symbol.name === "Nœud celtique") {
        nameToIndexMap["noeud-celtique"] = index;
        nameToIndexMap["nœud-celtique"] = index;
      }
    });

    // 3. Chercher dans le mapping
    const lowerIdentifier = identifier.toLowerCase();
    if (nameToIndexMap[lowerIdentifier] !== undefined) {
      const foundIndex = nameToIndexMap[lowerIdentifier];
      console.log(`SymbolDetailPage: Symbole trouvé par nom/slug "${identifier}" à l'index ${foundIndex}:`, SYMBOLS[foundIndex].name);
      return { symbol: SYMBOLS[foundIndex], index: foundIndex };
    }

    // 4. Recherche approximative (dernière chance)
    for (let i = 0; i < SYMBOLS.length; i++) {
      const symbol = SYMBOLS[i];
      if (symbol.name.toLowerCase().includes(lowerIdentifier) || 
          lowerIdentifier.includes(symbol.name.toLowerCase().replace(/\s+/g, '-'))) {
        console.log(`SymbolDetailPage: Symbole trouvé par recherche approximative "${identifier}" à l'index ${i}:`, symbol.name);
        return { symbol, index: i };
      }
    }

    console.log(`SymbolDetailPage: Aucun symbole trouvé pour "${identifier}"`);
    return null;
  };

  const result = findSymbol(id || '');
  const symbol = result?.symbol || null;
  const symbolIndex = result?.index ?? -1;

  // Redirection automatique pour les anciens liens
  React.useEffect(() => {
    if (symbol && symbolIndex >= 0 && id !== symbolIndex.toString()) {
      console.log(`SymbolDetailPage: Redirection de "${id}" vers "${symbolIndex}"`);
      navigate(`/symbols/${symbolIndex}`, { replace: true });
    }
  }, [symbol, symbolIndex, id, navigate]);

  // Fonctions pour les boutons
  const handleExplore = () => {
    if (symbol) {
      // Naviguer vers une page d'analyse ou d'exploration plus détaillée
      navigate(`/analysis?symbol=${symbolIndex}&name=${encodeURIComponent(symbol.name)}`);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/symbols/${symbolIndex}`;
    const title = `${symbol?.name} - Symbole ${symbol?.culture}`;
    const description = `Découvrez ce symbole de la culture ${symbol?.culture} datant de ${symbol?.period}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Lien copié dans le presse-papiers !');
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
      toast.error('Erreur lors du partage');
    }
  };

  if (!symbol) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="symbols.notFound">Symbole non trouvé</I18nText>
          </h2>
          <p className="text-slate-600 mb-4">
            <I18nText translationKey="symbols.notFoundDesc">Le symbole que vous recherchez n'existe pas.</I18nText>
          </p>
          <p className="text-sm text-slate-500 mb-6">
            ID recherché : "{id}"
          </p>
          <div className="space-y-2 mb-6">
            <p className="text-xs text-slate-400">Symboles disponibles :</p>
            <div className="max-h-32 overflow-y-auto text-xs text-slate-500">
              {SYMBOLS.slice(0, 5).map((s, i) => (
                <div key={i}>#{i}: {s.name}</div>
              ))}
              {SYMBOLS.length > 5 && <div>... et {SYMBOLS.length - 5} autres</div>}
            </div>
          </div>
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

            {/* Actions fonctionnelles */}
            <div className="flex gap-4">
              <Button onClick={handleExplore} className="flex-1">
                <I18nText translationKey="common.explore">Explorer</I18nText>
              </Button>
              <ShareButton
                url={`${window.location.origin}/symbols/${symbolIndex}`}
                title={`${symbol.name} - Symbole ${symbol.culture}`}
                description={`Découvrez ce symbole de la culture ${symbol.culture} datant de ${symbol.period}`}
                image={symbol.src}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolDetailPage;
