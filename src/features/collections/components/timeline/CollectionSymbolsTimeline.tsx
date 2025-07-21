import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimelineItem } from "./TimelineItem";

interface Symbol {
  id: string;
  name: string;
  description: string;
  created_at: string;
  period: string;
  culture: string;
}

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
  image_url?: string;
  position?: number;
  type: 'symbol' | 'event';
  originalIndex: number;
}

// Fonction pour mapper les périodes aux années
function mapPeriodToYear(period: string): number {
  const periodMappings: { [key: string]: number } = {
    // Périodes antiques
    'Antiquité': -100,
    'Époque gallo-romaine': -50,
    'Gallo-Roman': -50,
    'Antiquité tardive': 300,
    
    // Moyen Âge
    'Moyen Âge': 1000,
    'Haut Moyen Âge': 700,
    'Moyen Âge classique': 1100,
    'Bas Moyen Âge': 1300,
    
    // Époques modernes
    'Renaissance': 1500,
    'Époque moderne': 1600,
    'Temps modernes': 1700,
    'Époque contemporaine': 1800,
    'XXe siècle': 1950,
    'XXIe siècle': 2000,
    
    // Âges spécifiques
    'Âge du Bronze': -1200,
    'Âge du Fer': -500,
    'Paléolithique': -30000,
    'Néolithique': -5000,
    
    // Siècles spécifiques
    'XVIe siècle': 1550,
    'XVIIe siècle': 1650,
    'XVIIIe siècle': 1750,
    'XIXe siècle': 1850,
  };

  // Recherche exacte d'abord
  for (const [key, year] of Object.entries(periodMappings)) {
    if (period.toLowerCase().includes(key.toLowerCase())) {
      return year;
    }
  }

  // Extraction de siècles en chiffres romains
  const centuryMatch = period.match(/(\w+)e siècle/i);
  if (centuryMatch) {
    const romanNumerals: { [key: string]: number } = {
      'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
      'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
      'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15,
      'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20, 'XXI': 21
    };
    
    const roman = centuryMatch[1].toUpperCase();
    if (romanNumerals[roman]) {
      return (romanNumerals[roman] - 1) * 100 + 50; // Milieu du siècle
    }
  }

  return new Date().getFullYear(); // Fallback
}

// Événements historiques français
const historicalEvents = [
  { title: "Vercingétorix et la résistance gauloise", description: "Dernière grande résistance gauloise face à Rome", year: -52, period: "Antiquité", culture: "Gaule" },
  { title: "Conquête romaine de la Gaule", description: "Jules César achève la conquête de la Gaule", year: -50, period: "Antiquité", culture: "Rome" },
  { title: "Baptême de Clovis", description: "Le roi des Francs se convertit au christianisme", year: 496, period: "Haut Moyen Âge", culture: "Royaume franc" },
  { title: "Couronnement de Charlemagne", description: "Empereur d'Occident couronné par le pape", year: 800, period: "Haut Moyen Âge", culture: "Empire carolingien" },
  { title: "Bataille de Hastings", description: "Guillaume le Conquérant devient roi d'Angleterre", year: 1066, period: "Moyen Âge", culture: "Normandie" },
  { title: "Première Croisade", description: "Appel du pape Urbain II à la croisade", year: 1095, period: "Moyen Âge", culture: "Chrétienté" },
  { title: "Construction de Notre-Dame", description: "Début de la construction de la cathédrale", year: 1163, period: "Moyen Âge", culture: "France capétienne" },
  { title: "Règne de Philippe Auguste", description: "Consolidation du royaume de France", year: 1200, period: "Moyen Âge", culture: "France capétienne" },
  { title: "Bataille de Bouvines", description: "Victoire française face à la coalition", year: 1214, period: "Moyen Âge", culture: "France capétienne" },
  { title: "Règne de Louis IX (Saint Louis)", description: "Apogée de la France médiévale", year: 1250, period: "Moyen Âge", culture: "France capétienne" },
  { title: "Début de la Guerre de Cent Ans", description: "Conflit entre la France et l'Angleterre", year: 1337, period: "Bas Moyen Âge", culture: "France" },
  { title: "Peste noire en France", description: "Grande épidémie qui décime l'Europe", year: 1348, period: "Bas Moyen Âge", culture: "Europe" },
  { title: "Jeanne d'Arc libère Orléans", description: "Tournant de la Guerre de Cent Ans", year: 1429, period: "Bas Moyen Âge", culture: "France" },
  { title: "Fin de la Guerre de Cent Ans", description: "Victoire française à Castillon", year: 1453, period: "Bas Moyen Âge", culture: "France" },
  { title: "Renaissance française", description: "Influence italienne sur les arts français", year: 1515, period: "Renaissance", culture: "France" },
  { title: "Guerres de Religion", description: "Conflits entre catholiques et protestants", year: 1562, period: "XVIe siècle", culture: "France" },
  { title: "Édit de Nantes", description: "Henri IV proclame la tolérance religieuse", year: 1598, period: "XVIe siècle", culture: "France" },
  { title: "Règne de Louis XIV", description: "Le Roi-Soleil et l'apogée de la monarchie", year: 1650, period: "XVIIe siècle", culture: "France" },
  { title: "Construction de Versailles", description: "Symbole de la puissance royale française", year: 1661, period: "XVIIe siècle", culture: "France" },
  { title: "Siècle des Lumières", description: "Rayonnement intellectuel français en Europe", year: 1750, period: "XVIIIe siècle", culture: "France" },
  { title: "Révolution française", description: "Chute de l'Ancien Régime", year: 1789, period: "XVIIIe siècle", culture: "France" },
  { title: "Empire napoléonien", description: "Napoléon redessine l'Europe", year: 1804, period: "XIXe siècle", culture: "France" },
  { title: "Restauration monarchique", description: "Retour des Bourbons sur le trône", year: 1815, period: "XIXe siècle", culture: "France" },
  { title: "Révolution de 1848", description: "Établissement de la IIe République", year: 1848, period: "XIXe siècle", culture: "France" },
  { title: "Second Empire", description: "Règne de Napoléon III", year: 1852, period: "XIXe siècle", culture: "France" },
  { title: "IIIe République", description: "Longue période républicaine", year: 1870, period: "XIXe siècle", culture: "France" },
  { title: "Belle Époque", description: "Prospérité et rayonnement culturel", year: 1900, period: "XXe siècle", culture: "France" },
  { title: "Première Guerre mondiale", description: "La Grande Guerre transforme la France", year: 1914, period: "XXe siècle", culture: "France" },
  { title: "Front populaire", description: "Gouvernement de gauche en France", year: 1936, period: "XXe siècle", culture: "France" },
  { title: "Libération de la France", description: "Fin de l'occupation allemande", year: 1944, period: "XXe siècle", culture: "France" }
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
    queryFn: async (): Promise<Symbol[]> => {
      if (!collection?.id) return [];
      
      const { data, error } = await supabase
        .from('symbols')
        .select(`
          id,
          name,
          description,
          created_at,
          period,
          culture
        `)
        .eq('collection_id', collection.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!collection?.id
  });

  // Création de la timeline mixte
  useEffect(() => {
    if (!symbols) return;

    console.log('🔍 CollectionSymbolsTimeline - found collection:', collection);
    console.log(`📊 CollectionSymbolsTimeline - processing ${symbols.length} symbols`);

    // Conversion des symboles en événements de timeline
    const symbolEvents: TimelineEvent[] = symbols.map((symbol, index) => {
      const symbolYear = mapPeriodToYear(symbol.temporal_period_name || symbol.period);
      
      console.log(`🎯 Symbol ${symbol.name}: ${symbol.temporal_period_name || symbol.period} → ${symbolYear}`);
      
      return {
        id: `symbol-${symbol.id}`,
        title: symbol.name,
        description: symbol.description,
        year: symbolYear,
        period: symbol.temporal_period_name || symbol.period,
        culture: symbol.culture,
        image_url: symbol.image_url,
        position: symbol.symbol_position,
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
    
    console.log(`📅 Timeline created with ${allEvents.length} events (${symbolEvents.length} symbols + ${eventEvents.length} historical events)`);
    setTimelineEvents(allEvents);
  }, [symbols, collection]);

  if (collectionLoading || symbolsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            <I18nText translationKey="collections.loading">Chargement de la timeline...</I18nText>
          </p>
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
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 bg-gradient-to-b from-primary/50 via-primary to-primary/50 h-full" />
          
          {/* Timeline Items */}
          <div className="space-y-16 pt-8">
            {timelineEvents.map((event, index) => (
              <TimelineItem key={event.id} {...event} index={index} />
            ))}
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