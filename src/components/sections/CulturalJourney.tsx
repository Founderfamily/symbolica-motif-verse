
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, Clock, Globe, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const CulturalJourney = () => {
  const [selectedEra, setSelectedEra] = useState(0);

  const eras = [
    {
      name: 'Antiquité',
      period: '3000 av. J.-C. - 500 ap. J.-C.',
      description: 'Les premières civilisations et leurs symboles fondateurs',
      cultures: ['Égyptienne', 'Grecque', 'Romaine', 'Mésopotamienne'],
      symbols: ['Ankh', 'Méandre grec', 'Aigle romain', 'Ziggurat'],
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50'
    },
    {
      name: 'Moyen Âge',
      period: '500 - 1500 ap. J.-C.',
      description: 'L\'âge des cathédrales et des symboles spirituels',
      cultures: ['Byzantine', 'Celtique', 'Islamique', 'Gothique'],
      symbols: ['Triskèle celtique', 'Croix byzantine', 'Arabesque', 'Rosace gothique'],
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      name: 'Renaissance',
      period: '1400 - 1700 ap. J.-C.',
      description: 'Le renouveau artistique et la redécouverte des classiques',
      cultures: ['Italienne', 'Française', 'Flamande', 'Allemande'],
      symbols: ['Fleur de lys', 'Médaillon Renaissance', 'Blason', 'Perspective'],
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      name: 'Époque Moderne',
      period: '1700 - Aujourd\'hui',
      description: 'L\'évolution industrielle et la mondialisation des symboles',
      cultures: ['Industrielle', 'Art Nouveau', 'Moderne', 'Contemporaine'],
      symbols: ['Art déco', 'Bauhaus', 'Logo moderne', 'Émoji'],
      color: 'from-green-400 to-teal-500',
      bgColor: 'from-green-50 to-teal-50'
    }
  ];

  const continents = [
    { name: 'Europe', symbols: 12, x: '45%', y: '25%' },
    { name: 'Asie', symbols: 18, x: '70%', y: '35%' },
    { name: 'Afrique', symbols: 8, x: '48%', y: '55%' },
    { name: 'Amérique', symbols: 6, x: '25%', y: '45%' },
    { name: 'Océanie', symbols: 3, x: '80%', y: '70%' }
  ];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Badge className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
            <Clock className="w-4 h-4 mr-2" />
            Voyage Temporel
          </Badge>
        </div>
        
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-purple-600 to-slate-700 bg-clip-text text-transparent">
          À Travers les Civilisations
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Explorez l'évolution des symboles à travers les époques et découvrez comment ils ont façonné nos cultures
        </p>
      </div>

      {/* Timeline interactive */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedEra(Math.max(0, selectedEra - 1))}
            disabled={selectedEra === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 mx-4">
            <div className="relative h-2 bg-slate-200 rounded-full">
              <div 
                className="absolute h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${((selectedEra + 1) / eras.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedEra(Math.min(eras.length - 1, selectedEra + 1))}
            disabled={selectedEra === eras.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation des époques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {eras.map((era, index) => (
            <button
              key={index}
              onClick={() => setSelectedEra(index)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedEra === index
                  ? 'border-purple-300 bg-purple-50 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className={`text-lg font-bold mb-1 ${
                selectedEra === index ? 'text-purple-700' : 'text-slate-700'
              }`}>
                {era.name}
              </div>
              <div className="text-sm text-slate-500">{era.period}</div>
            </button>
          ))}
        </div>

        {/* Détails de l'époque sélectionnée */}
        <Card className={`p-8 bg-gradient-to-br ${eras[selectedEra].bgColor} border-2 border-purple-200`}>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">
                {eras[selectedEra].name}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {eras[selectedEra].description}
              </p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-700 mb-3">Cultures représentées :</h4>
                <div className="flex flex-wrap gap-2">
                  {eras[selectedEra].cultures.map((culture, index) => (
                    <Badge key={index} variant="outline" className="bg-white/80">
                      {culture}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Link to="/symbols">
                <Button className={`bg-gradient-to-r ${eras[selectedEra].color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explorer cette époque
                </Button>
              </Link>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-slate-700 mb-4">Symboles emblématiques :</h4>
              <div className="grid grid-cols-2 gap-4">
                {eras[selectedEra].symbols.map((symbol, index) => (
                  <div key={index} className="p-4 bg-white/80 rounded-lg border border-white/50 hover:shadow-md transition-all duration-300">
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${eras[selectedEra].color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-medium text-slate-700">{symbol}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Carte du monde interactive */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
            <Map className="h-8 w-8 text-blue-500" />
            Exploration Géographique
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Découvrez la répartition des symboles à travers les continents
          </p>
        </div>

        <div className="relative bg-white rounded-2xl p-8 border border-blue-200 mb-8">
          {/* Carte stylisée du monde */}
          <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {/* Continents stylisés */}
              {continents.map((continent, index) => (
                <div
                  key={index}
                  className="absolute w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full cursor-pointer hover:scale-125 transition-all duration-300 flex items-center justify-center group"
                  style={{ left: continent.x, top: continent.y }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                      <div className="font-medium">{continent.name}</div>
                      <div>{continent.symbols} symboles</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/map">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <Globe className="mr-2 h-5 w-5" />
              Explorer la carte interactive
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CulturalJourney;
