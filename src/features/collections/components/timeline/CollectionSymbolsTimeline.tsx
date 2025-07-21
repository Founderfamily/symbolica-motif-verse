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
import { Skeleton } from '@/components/ui/skeleton';

export const CollectionSymbolsTimeline: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: collections = [], isLoading: collectionsLoading } = useCollections();
  const { getTranslation } = useCollectionTranslations();
  
  // Trouver la collection par slug
  const collection = collections.find(c => c.slug === slug);
  
  // Récupérer les symboles de cette collection
  const { data: symbols = [], isLoading: symbolsLoading } = useCollectionSymbols(collection?.id);
  
  const isLoading = collectionsLoading || symbolsLoading;

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
          {symbols.map((symbol, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <motion.div
                key={symbol.id}
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
                        <span>{symbol.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scroll className="w-3 h-3" />
                        <span>{symbol.culture}</span>
                      </div>
                      {/* Position dans la collection */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Position: {symbol.position}</span>
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