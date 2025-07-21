import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Scroll, Image as ImageIcon } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useCollections } from '../../hooks/useCollections';
import { useCollectionTranslations } from '@/hooks/useCollectionTranslations';
import { useCollectionSymbols } from '../../hooks/useCollectionSymbols';
import { useFrenchHistoricalEvents } from '../../hooks/useFrenchHistoricalEvents';
import { Skeleton } from '@/components/ui/skeleton';

export const CollectionSymbolsTimeline: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: collections = [], isLoading: collectionsLoading } = useCollections();
  const { getTranslation } = useCollectionTranslations();
  
  console.log('🔍 CollectionSymbolsTimeline - slug:', slug);
  console.log('🔍 CollectionSymbolsTimeline - collections:', collections);
  
  // Trouver la collection par slug
  const collection = collections.find(c => c.slug === slug);
  console.log('🔍 CollectionSymbolsTimeline - found collection:', collection);
  
  // Récupérer les symboles de cette collection
  const { data: symbols = [], isLoading: symbolsLoading } = useCollectionSymbols(collection?.id);
  console.log('🔍 CollectionSymbolsTimeline - symbols:', symbols);
  
  // Récupérer les événements historiques français si c'est la collection patrimoine-français
  const { data: historicalEvents = [], isLoading: eventsLoading } = useFrenchHistoricalEvents();
  const shouldShowEvents = collection?.slug === 'patrimoine-francais';
  
  console.log('🔍 CollectionSymbolsTimeline - collection slug:', collection?.slug);
  console.log('🔍 CollectionSymbolsTimeline - shouldShowEvents:', shouldShowEvents);
  console.log('🔍 CollectionSymbolsTimeline - historicalEvents COUNT:', historicalEvents.length);
  console.log('🔍 CollectionSymbolsTimeline - symbols COUNT:', symbols.length);
  console.log('🔍 CollectionSymbolsTimeline - eventsLoading:', eventsLoading);
  console.log('🔍 CollectionSymbolsTimeline - symbolsLoading:', symbolsLoading);
  
  const isLoading = collectionsLoading || symbolsLoading || (shouldShowEvents && eventsLoading);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <Skeleton className="h-64 w-80" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Collection non trouvée</h2>
        <Link to="/collections">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux collections
          </Button>
        </Link>
      </div>
    );
  }

  if (symbols.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Aucun symbole dans cette collection</h2>
        <p className="text-muted-foreground mb-6">Cette collection ne contient pas encore de symboles.</p>
        <Link to="/collections">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux collections
          </Button>
        </Link>
      </div>
    );
  }

  const title = getTranslation(collection, 'title');
  const description = getTranslation(collection, 'description');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-12">
        <Link to="/collections">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <I18nText translationKey="collections.backToCollections">Retour aux collections</I18nText>
          </Button>
        </Link>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">{title}</h1>
        </div>
      </div>

      {/* Timeline des symboles */}
      <div className="relative max-w-4xl mx-auto">
        {/* Ligne centrale verticale */}
        <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 bg-blue-300 h-full" />

        <div className="space-y-12">
          {(() => {
            // Créer une timeline mixte avec symboles et événements
            const timelineItems = [];
            
            // Ajouter les symboles avec des années réalistes basées sur leur période
            symbols.forEach((symbol, index) => {
              let symbolYear = 2024; // par défaut
              
              // Mapping intelligent des périodes vers des années
              if (symbol.period) {
                const period = symbol.period.toLowerCase();
                
                // Chercher une année explicite d'abord
                const yearMatch = symbol.period.match(/(\d{4})/);
                if (yearMatch) {
                  symbolYear = parseInt(yearMatch[1]);
                } else {
                  // Mapping intelligent des périodes historiques vers des années
                  if (period.includes('antiquité') || period.includes('gaulois') || period.includes('gaul') || period.includes('av. j.-c.') || period.includes('gallo-romain')) {
                    symbolYear = -100 + (index * 20); // Antiquité : -100 à 400
                  } else if (period.includes('haut moyen âge') || period.includes('haut moyen-âge')) {
                    symbolYear = 500 + (index * 30);
                  } else if (period.includes('moyen âge') || period.includes('moyen-âge') || period.includes('médiéval')) {
                    symbolYear = 1000 + (index * 15); // Moyen Âge : 1000-1500
                  } else if (period.includes('renaissance')) {
                    symbolYear = 1500 + (index * 10); // Renaissance : 1500-1600
                  } else if (period.includes('moderne') || period.includes('époque moderne')) {
                    symbolYear = 1600 + (index * 10); // Époque moderne : 1600-1800
                  } else if (period.includes('seconde guerre') || period.includes('guerre mondiale')) {
                    symbolYear = 1940 + (index * 2);
                  } else if (period.includes('xvie')) {
                    symbolYear = 1550 + (index * 5);
                  } else if (period.includes('xviie')) {
                    symbolYear = 1650 + (index * 5);
                  } else if (period.includes('xviiie')) {
                    symbolYear = 1750 + (index * 5);
                  } else if (period.includes('xixe') || period.includes('19e')) {
                    symbolYear = 1850 + (index * 5);
                  } else {
                    // Distribution par défaut plus serrée
                    const baseYears = [800, 1100, 1300, 1500, 1700, 1850, 1950];
                    symbolYear = baseYears[index % baseYears.length] || (1200 + index * 50);
                  }
                }
              }
              
              console.log(`🔍 Symbol "${symbol.name}" - Period: "${symbol.period}" - Mapped Year: ${symbolYear}`);
              
              timelineItems.push({
                type: 'symbol',
                data: symbol,
                year: symbolYear,
                originalIndex: index
              });
            });
            
            // Ajouter les événements historiques français si c'est la bonne collection
            if (shouldShowEvents && historicalEvents.length > 0) {
              historicalEvents.forEach((event) => {
                timelineItems.push({
                  type: 'event',
                  data: event,
                  year: event.year,
                  originalIndex: 0
                });
              });
            }
            
            // Trier par année
            timelineItems.sort((a, b) => a.year - b.year);
            
            console.log('🔍 Timeline items:', timelineItems);
            
            return timelineItems.map((item, timelineIndex) => {
              const isLeft = timelineIndex % 2 === 0;
              
              if (item.type === 'symbol') {
                const symbol = item.data;
                
                return (
                  <motion.div
                    key={symbol.id}
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: timelineIndex * 0.1 }}
                  >
                    {/* Point de connexion sur la ligne */}
                    <div className="absolute left-1/2 transform -translate-x-2 w-4 h-4 bg-blue-600 rounded-full z-10 top-8" />
                    
                    {/* Ligne de connexion horizontale */}
                    <div 
                      className={`absolute top-10 w-16 h-0.5 bg-blue-300 ${
                        isLeft 
                          ? 'left-1/2 transform -translate-x-16' 
                          : 'left-1/2 transform translate-x-2'
                      }`} 
                    />

                    {/* Carte de symbole */}
                    <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                      <Card className={`w-80 p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                        isLeft ? 'mr-20' : 'ml-20'
                      }`}>
                        {/* Image */}
                        <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          {symbol.image_url ? (
                            <img 
                              src={symbol.image_url} 
                              alt={symbol.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Titre */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                          {symbol.name}
                        </h3>

                        {/* Année */}
                        <div className="text-sm text-gray-600 mb-1">
                          {item.year > 0 ? `${item.year}` : `${Math.abs(item.year)} av. J.-C.`}
                        </div>

                        {/* Période */}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{symbol.temporal_period_name || symbol.period}</span>
                        </div>

                        {/* Région */}
                        {symbol.region_name && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{symbol.region_name}</span>
                          </div>
                        )}
                      </Card>
                    </div>
                  </motion.div>
                );
              } else {
                // Événement historique
                const event = item.data;
                
                return (
                  <motion.div
                    key={`event-${event.id}`}
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: timelineIndex * 0.1 }}
                  >
                    {/* Point de connexion sur la ligne */}
                    <div className="absolute left-1/2 transform -translate-x-2 w-4 h-4 bg-blue-600 rounded-full z-10 top-8" />
                    
                    {/* Ligne de connexion horizontale */}
                    <div 
                      className={`absolute top-10 w-16 h-0.5 bg-blue-300 ${
                        isLeft 
                          ? 'left-1/2 transform -translate-x-16' 
                          : 'left-1/2 transform translate-x-2'
                      }`} 
                    />

                    {/* Carte d'événement */}
                    <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                      <Card className={`w-80 p-4 bg-blue-50 border border-blue-200 shadow-sm hover:shadow-md transition-shadow ${
                        isLeft ? 'mr-20' : 'ml-20'
                      }`}>
                        {/* Titre */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                          {event.event_name}
                        </h3>

                        {/* Année */}
                        <div className="text-sm text-blue-600 mb-1 font-medium">
                          {event.year}
                        </div>

                        {/* Catégorie */}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <Scroll className="w-3 h-3" />
                          <span>{event.period_category}</span>
                        </div>

                        {/* Description courte */}
                        {event.description && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {event.description}
                          </p>
                        )}
                      </Card>
                    </div>
                  </motion.div>
                );
              }
            });
          })()}
        </div>
      </div>
    </div>
  );
};