import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users, BookOpen } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Link } from 'react-router-dom';
import { CollectionWithTranslations } from '../../types/collections';

interface CollectionsTimelineProps {
  collections: any[];
  getCollectionTitle: (collection: any) => string;
  getCollectionDescription: (collection: any) => string;
}

export const CollectionsTimeline: React.FC<CollectionsTimelineProps> = ({
  collections,
  getCollectionTitle,
  getCollectionDescription
}) => {
  return (
    <div className="relative max-w-6xl mx-auto py-8">
      {/* Ligne centrale verticale */}
      <div className="absolute left-1/2 transform -translate-x-0.5 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 h-full rounded-full" />
      
      {/* Points de connexion */}
      <div className="absolute left-1/2 transform -translate-x-2 w-4 h-4 bg-primary rounded-full top-0" />
      <div className="absolute left-1/2 transform -translate-x-2 w-4 h-4 bg-primary rounded-full bottom-0" />

      <div className="space-y-16">
        {collections.map((collection, index) => {
          const isLeft = index % 2 === 0;
          const title = getCollectionTitle(collection);
          const description = getCollectionDescription(collection);
          
          return (
            <motion.div
              key={collection.id}
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

              {/* Carte de collection */}
              <Card className={`w-80 p-6 bg-gradient-to-br from-background to-muted/30 border border-muted hover:shadow-xl transition-all duration-500 ${
                isLeft ? 'mr-20' : 'ml-20'
              }`}>
                <div className="space-y-4">
                  {/* Badge featured */}
                  {collection.is_featured && (
                    <Badge variant="secondary" className="w-fit">
                      <I18nText translationKey="collections.featured">Featured</I18nText>
                    </Badge>
                  )}

                  {/* Titre */}
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {description}
                  </p>

                  {/* Métadonnées */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {collection.created_at ? new Date(collection.created_at).getFullYear() : '2024'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>
                        {collection.symbols?.length || 0} symboles
                      </span>
                    </div>
                    {collection.cultures && collection.cultures.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{collection.cultures.length} cultures</span>
                      </div>
                    )}
                  </div>

                  {/* Bouton d'action */}
                  <Link to={`/collections/${collection.slug}`}>
                    <Button variant="outline" size="sm" className="w-full group">
                      <I18nText translationKey="collections.explore">Explorer</I18nText>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Numéro d'ordre */}
              <div className={`absolute ${
                isLeft ? 'left-0' : 'right-0'
              } w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary`}>
                {index + 1}
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
          <I18nText translationKey="collections.timelineEnd">
            Fin du parcours temporel
          </I18nText>
        </h3>
        <p className="text-muted-foreground mb-6">
          <I18nText translationKey="collections.timelineEndDescription">
            De nouvelles collections sont ajoutées régulièrement pour enrichir votre exploration
          </I18nText>
        </p>
        <Link to="/symbols">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
            <I18nText translationKey="collections.exploreSymbols">Explorer les Symboles</I18nText>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};