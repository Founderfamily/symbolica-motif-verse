import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Collection {
  id: string;
  slug: string;
  collection_translations: Array<{
    title: string;
    description: string;
    language: string;
  }>;
}

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  year: number;
  period: string;
  culture?: string;
  type: 'symbol' | 'event';
  originalIndex: number;
}

// Fonction pour mapper les périodes aux années
function mapPeriodToYear(period: string): number {
  const periodMappings: { [key: string]: number } = {
    'Antiquité': -100,
    'Époque gallo-romaine': -50,
    'Gallo-Roman': -50,
    'Moyen Âge': 1000,
    'Âge du Fer': -500,
    'XVIe siècle': 1550,
    'XVIIe siècle': 1650,
    'XVIIIe siècle': 1750,
    'XIXe siècle': 1850,
    'XXe siècle': 1950,
  };

  for (const [key, year] of Object.entries(periodMappings)) {
    if (period.toLowerCase().includes(key.toLowerCase())) {
      return year;
    }
  }

  return new Date().getFullYear();
}

// Événements historiques français (sélection réduite)
const historicalEvents = [
  { title: "Vercingétorix et la résistance gauloise", description: "Dernière grande résistance gauloise", year: -52, period: "Antiquité", culture: "Gaule" },
  { title: "Baptême de Clovis", description: "Conversion au christianisme", year: 496, period: "Haut Moyen Âge", culture: "Royaume franc" },
  { title: "Couronnement de Charlemagne", description: "Empereur d'Occident", year: 800, period: "Haut Moyen Âge", culture: "Empire carolingien" },
  { title: "Construction de Notre-Dame", description: "Début de la construction", year: 1163, period: "Moyen Âge", culture: "France capétienne" },
  { title: "Jeanne d'Arc libère Orléans", description: "Tournant de la Guerre de Cent Ans", year: 1429, period: "Bas Moyen Âge", culture: "France" },
  { title: "Renaissance française", description: "Influence italienne sur les arts", year: 1515, period: "Renaissance", culture: "France" },
  { title: "Révolution française", description: "Chute de l'Ancien Régime", year: 1789, period: "XVIIIe siècle", culture: "France" },
  { title: "Empire napoléonien", description: "Napoléon redessine l'Europe", year: 1804, period: "XIXe siècle", culture: "France" }
];

export function CollectionSymbolsTimeline() {
  const { slug } = useParams<{ slug: string }>();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  // Récupération de la collection
  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ['collection', slug],
    queryFn: async (): Promise<Collection> => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          slug,
          collection_translations (
            title,
            description,
            language
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Récupération des symboles
  const { data: symbols, isLoading: symbolsLoading } = useQuery({
    queryKey: ['collection-symbols', collection?.id],
    queryFn: async () => {
      if (!collection?.id) return [];
      
      const { data, error } = await supabase
        .from('symbols')
        .select('id, name, description, period, culture, created_at')
        .eq('collection_id', collection.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!collection?.id
  });

  // Création de la timeline mixte
  useEffect(() => {
    if (!symbols) return;

    // Conversion des symboles en événements de timeline
    const symbolEvents: TimelineEvent[] = symbols.map((symbol, index) => {
      const symbolYear = mapPeriodToYear(symbol.period);
      
      return {
        id: `symbol-${symbol.id}`,
        title: symbol.name,
        description: symbol.description,
        year: symbolYear,
        period: symbol.period,
        culture: symbol.culture,
        type: 'symbol' as const,
        originalIndex: index
      };
    });

    // Conversion des événements historiques
    const eventEvents: TimelineEvent[] = historicalEvents.map((event, index) => ({
      id: `event-${index}`,
      title: event.title,
      description: event.description,
      year: event.year,
      period: event.period,
      culture: event.culture,
      type: 'event' as const,
      originalIndex: index
    }));

    // Fusion et tri chronologique
    const allEvents = [...symbolEvents, ...eventEvents].sort((a, b) => a.year - b.year);
    setTimelineEvents(allEvents);
  }, [symbols, collection]);

  if (collectionLoading || symbolsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement de la timeline...</p>
        </div>
      </div>
    );
  }

  const collectionTitle = collection?.collection_translations?.[0]?.title || collection?.slug;
  const collectionDescription = collection?.collection_translations?.[0]?.description;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6">
              <Clock className="w-3 h-3 mr-1" />
              Timeline Chronologique
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {collectionTitle}
            </h1>
            {collectionDescription && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {collectionDescription}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 bg-gradient-to-b from-primary/50 via-primary to-primary/50 h-full" />
          
          {/* Timeline Items */}
          <div className="space-y-12 pt-8">
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              const yearDisplay = event.year > 0 ? `${event.year}` : `${Math.abs(event.year)} av. J.-C.`;

              return (
                <div key={event.id} className="relative flex items-center justify-center">
                  {/* Timeline Point */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`absolute z-10 w-4 h-4 rounded-full border-4 border-background shadow-lg ${
                      event.type === 'symbol' ? 'bg-primary' : 'bg-muted-foreground'
                    }`}
                  />
                  
                  {/* Year Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="absolute z-20 -bottom-8 bg-background border border-muted rounded-full px-3 py-1 text-xs font-medium text-primary shadow-sm"
                  >
                    {yearDisplay}
                  </motion.div>

                  {/* Connection Line */}
                  <div 
                    className={`absolute w-16 h-0.5 bg-primary/30 ${
                      isLeft ? '-left-16' : '-right-16'
                    }`}
                  />

                  {/* Card */}
                  <div className={`${isLeft ? '-ml-16' : '-mr-16'} w-full max-w-xs`}>
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
                    >
                      <Card className={`
                        relative max-w-sm w-full p-4 
                        ${event.type === 'symbol' ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' : 'bg-gradient-to-br from-muted/30 to-muted/50'}
                        hover:shadow-lg transition-all duration-300
                      `}>
                        {/* Type Badge */}
                        <Badge 
                          variant={event.type === 'symbol' ? 'default' : 'secondary'} 
                          className="absolute -top-2 -right-2 text-xs"
                        >
                          {event.type === 'symbol' ? `#${event.originalIndex + 1}` : 'Événement'}
                        </Badge>

                        <div className="space-y-3">
                          {/* Title */}
                          <div>
                            <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2">
                              {event.title}
                            </h3>
                            {event.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </div>

                          {/* Metadata */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-3.5 h-3.5 text-primary" />
                              <span className="text-muted-foreground text-xs">{event.period}</span>
                            </div>
                            
                            {event.culture && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground text-xs line-clamp-1">{event.culture}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Stats */}
        <motion.div 
          className="mt-20 pt-8 border-t border-muted text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="p-4">
              <div className="text-2xl font-bold text-primary">{symbols?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Symboles</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-primary">{historicalEvents.length}</div>
              <div className="text-sm text-muted-foreground">Événements</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-primary">{timelineEvents.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}