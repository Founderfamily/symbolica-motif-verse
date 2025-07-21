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
  const shouldShowEvents = collection?.slug === 'patrimoine-français';
  
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
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            {description}
          </p>
          {collection.is_featured && (
            <Badge variant="secondary" className="mb-6">
              <I18nText translationKey="collections.featured">Featured</I18nText>
            </Badge>
          )}
        </div>
      </div>

      {/* Timeline des symboles */}
      <div className="relative max-w-6xl mx-auto">
        {/* Ligne centrale verticale */}
        <div className="absolute left-1/2 transform -translate-x-0.5 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 h-full rounded-full" />
        
        {/* Points de connexion */}
        <div className="absolute left-1/2 transform -translate-x-2 w-4 h-4 bg-primary rounded-full top-0" />
        <div className="absolute left-1/2 transform -translate-x-2 w-4 h-4 bg-primary rounded-full bottom-0" />

        <div className="space-y-20">
          {/* Affichage des événements historiques français pour la collection patrimoine-français */}
          {shouldShowEvents && historicalEvents.length > 0 && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-primary">Dates importantes de l'Histoire de France</h2>
                <p className="text-muted-foreground">30 événements marquants du patrimoine français</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {historicalEvents
                  .sort((a, b) => a.year - b.year)
                  .map((event, eventIndex) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: eventIndex * 0.05 }}
                    >
                      <Card className="p-4 h-full bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full" />
                            <span className="font-bold text-primary text-lg">{event.year}</span>
                            <Badge variant="outline" className="text-xs">
                              {event.period_category}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {event.date_text}
                          </div>
                          
                          <h3 className="font-bold text-foreground leading-tight">
                            {event.event_name}
                          </h3>
                          
                          {event.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {event.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-1">
                              {[...Array(event.importance_level)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full" />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Importance: {event.importance_level}/10
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
          
          {/* Timeline des symboles */}
          {symbols
            .sort((a, b) => a.temporal_period_order - b.temporal_period_order)
            .map((symbol, index) => {
            const isLeft = index % 2 === 0;
            const currentPeriod = symbol.temporal_period_name || symbol.period;
            const previousPeriod = index > 0 ? (symbols[index - 1].temporal_period_name || symbols[index - 1].period) : null;
            const isPeriodChange = currentPeriod !== previousPeriod && index > 0;
            
            return (
              <div key={symbol.id}>
                {/* Séparateur d'ère */}
                {isPeriodChange && (
                  <motion.div
                    className="relative flex items-center justify-center my-16"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Ligne de séparation */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-primary/30"></div>
                    </div>
                    
                    {/* Badge de la nouvelle ère */}
                    <div className="relative bg-gradient-to-r from-primary/10 to-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-8 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-lg font-bold text-primary">
                          {currentPeriod}
                        </span>
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
                  initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                {/* Point de connexion sur la ligne */}
                <div className="absolute left-1/2 transform -translate-x-3 w-6 h-6 bg-background border-4 border-primary rounded-full z-10" />
                
                {/* Ligne de connexion vers la carte */}
                <div 
                  className={`absolute left-1/2 w-16 h-0.5 bg-primary/30 ${
                    isLeft ? 'transform -translate-x-16' : 'transform translate-x-3'
                  }`} 
                />

                {/* Carte de symbole */}
                <Card className={`w-96 p-6 bg-gradient-to-br from-background to-muted/30 border border-muted hover:shadow-xl transition-all duration-500 ${
                  isLeft ? 'mr-20' : 'ml-20'
                }`}>
                  <div className="space-y-4">
                    {/* Image */}
                    <div className="w-full h-40 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                      {symbol.image_url ? (
                        <img 
                          src={symbol.image_url} 
                          alt={symbol.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>

                    {/* Titre du symbole */}
                    <h3 className="text-2xl font-bold text-foreground">
                      {symbol.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {symbol.description}
                    </p>

                    {/* Métadonnées */}
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{symbol.temporal_period_name || symbol.period}</span>
                        {symbol.cultural_period_name && (
                          <span className="text-primary">({symbol.cultural_period_name})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Scroll className="w-3 h-3" />
                        <span>{symbol.culture}</span>
                      </div>
                      {/* Position dans la collection */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Position: {symbol.symbol_position}</span>
                      </div>
                    </div>

                    {/* Bouton d'action */}
                    <Button variant="outline" size="sm" className="w-full">
                      <I18nText translationKey="symbols.learnMore">En savoir plus</I18nText>
                    </Button>
                  </div>
                </Card>

                {/* Numéro d'ordre avec période */}
                <div className={`absolute ${
                  isLeft ? 'left-0' : 'right-0'
                } flex flex-col items-center`}>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary mb-2">
                    {index + 1}
                  </div>
                  <div className="text-xs text-center text-muted-foreground max-w-24">
                    {new Date(symbol.created_at).getFullYear()}
                  </div>
                </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Footer de la timeline */}
        <motion.div 
          className="text-center mt-16 pt-8 border-t border-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4">
            <I18nText translationKey="collections.timelineComplete">
              Parcours chronologique terminé
            </I18nText>
          </h3>
          <p className="text-muted-foreground mb-6">
            <I18nText translationKey="collections.exploreOtherCollections">
              Explorez d'autres collections pour découvrir plus de symboles
            </I18nText>
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/collections">
              <Button variant="outline">
                <I18nText translationKey="collections.backToCollections">Collections</I18nText>
              </Button>
            </Link>
            <Link to="/symbols">
              <Button>
                <I18nText translationKey="symbols.explore">Explorer tous les symboles</I18nText>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};