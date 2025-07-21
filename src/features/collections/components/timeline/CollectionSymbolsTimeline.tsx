import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Clock, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const [loading, setLoading] = useState(true);
  const [collectionTitle, setCollectionTitle] = useState<string>("");
  const [collectionDescription, setCollectionDescription] = useState<string>("");
  const [symbolsCount, setSymbolsCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Requête simple pour la collection
        const collectionResponse = await fetch(
          `https://djczgpmhrbirbqrycodq.supabase.co/rest/v1/collections?slug=eq.${slug}&select=id`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqY3pncG1ocmJpcmJxcnljb2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDc0MDMsImV4cCI6MjA2MjcyMzQwM30.hFrbeO7mmXXYdAkzoVT88O8enMOMqd8C94EfermuCas',
            }
          }
        );
        const collections = await collectionResponse.json();
        
        if (collections.length === 0) {
          setLoading(false);
          return;
        }

        const collection = collections[0];

        // Requête pour les traductions
        const translationsResponse = await fetch(
          `https://djczgpmhrbirbqrycodq.supabase.co/rest/v1/collection_translations?collection_id=eq.${collection.id}&language=eq.fr&select=title,description`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqY3pncG1ocmJpcmJxcnljb2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDc0MDMsImV4cCI6MjA2MjcyMzQwM30.hFrbeO7mmXXYdAkzoVT88O8enMOMqd8C94EfermuCas',
            }
          }
        );
        const translations = await translationsResponse.json();
        
        if (translations.length > 0) {
          setCollectionTitle(translations[0].title || slug || "");
          setCollectionDescription(translations[0].description || "");
        } else {
          setCollectionTitle(slug || "");
        }

        // Requête pour les symboles
        const symbolsResponse = await fetch(
          `https://djczgpmhrbirbqrycodq.supabase.co/rest/v1/symbols?collection_id=eq.${collection.id}&select=id,name,description,period,culture`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqY3pncG1ocmJpcmJxcnljb2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDc0MDMsImV4cCI6MjA2MjcyMzQwM30.hFrbeO7mmXXYdAkzoVT88O8enMOMqd8C94EfermuCas',
            }
          }
        );
        const symbols = await symbolsResponse.json();

        setSymbolsCount(symbols.length);

        // Conversion des symboles en événements de timeline
        const symbolEvents: TimelineEvent[] = symbols.map((symbol: any, index: number) => {
          const symbolYear = mapPeriodToYear(symbol.period || "");
          
          return {
            id: `symbol-${symbol.id}`,
            title: symbol.name || "Symbole sans nom",
            description: symbol.description,
            year: symbolYear,
            period: symbol.period || "Période inconnue",
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

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement de la timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 pb-12">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2 text-slate-600 text-sm">
              <Clock className="w-4 h-4" />
              Timeline Chronologique
            </div>
            <h1 className="text-6xl font-bold text-blue-600 leading-tight">
              {collectionTitle}
            </h1>
            {collectionDescription && (
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {collectionDescription}
              </p>
            )}
          </motion.div>
        </div>
        
        {/* Timeline Line Start */}
        <div className="flex justify-center">
          <div className="w-1 h-12 bg-blue-600"></div>
        </div>
      </div>

      {/* Content Area with minimal timeline content for clean look */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="w-1 h-40 bg-blue-600/20"></div>
        </div>

        {/* Footer Stats */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="p-8 text-center bg-white border-slate-200 shadow-sm">
              <div className="text-slate-600 text-base mb-2">Symboles</div>
            </Card>
            <Card className="p-8 text-center bg-white border-slate-200 shadow-sm">
              <div className="text-5xl font-bold text-blue-600 mb-2">{historicalEvents.length}</div>
              <div className="text-slate-600 text-base">Événements</div>
            </Card>
            <Card className="p-8 text-center bg-white border-slate-200 shadow-sm">
              <div className="text-5xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-slate-600 text-base">Total</div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}