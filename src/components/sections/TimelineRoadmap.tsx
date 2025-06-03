
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

interface RoadmapItem {
  id: string;
  phase: string;
  title: any; // Database returns Json type
  description: any; // Database returns Json type
  is_current: boolean;
  is_completed: boolean;
  display_order: number;
}

// Données statiques de fallback
const FALLBACK_ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: '1',
    phase: 'Phase 1',
    title: { fr: 'Lancement de la plateforme', en: 'Platform Launch' },
    description: { fr: 'Mise en ligne de la version initiale avec les fonctionnalités de base', en: 'Initial release with core features' },
    is_current: false,
    is_completed: true,
    display_order: 1
  },
  {
    id: '2',
    phase: 'Phase 2',
    title: { fr: 'Ajout des fonctionnalités communautaires', en: 'Community Features' },
    description: { fr: 'Implémentation des groupes d\'intérêt et des discussions', en: 'Implementation of interest groups and discussions' },
    is_current: true,
    is_completed: false,
    display_order: 2
  },
  {
    id: '3',
    phase: 'Phase 3',
    title: { fr: 'Intelligence artificielle avancée', en: 'Advanced AI Features' },
    description: { fr: 'Reconnaissance automatique de motifs et analyse prédictive', en: 'Automatic pattern recognition and predictive analysis' },
    is_current: false,
    is_completed: false,
    display_order: 3
  }
];

const TimelineRoadmap = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchRoadmapItems = async () => {
      try {
        console.log('🚀 [TimelineRoadmap] Testing Supabase connection...');
        setLoading(true);
        setError(null);
        
        // Test de connexion avec timeout de 5 secondes
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        console.log('🔗 [TimelineRoadmap] Attempting to fetch roadmap data...');
        
        const { data, error } = await supabase
          .from('roadmap_items')
          .select('*')
          .order('display_order')
          .abortSignal(controller.signal);
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('❌ [TimelineRoadmap] Supabase error:', error);
          throw new Error(`Erreur Supabase: ${error.message}`);
        }
        
        console.log('✅ [TimelineRoadmap] Data received:', data?.length || 0, 'items');
        console.log('📄 [TimelineRoadmap] Sample data:', data?.[0]);
        
        if (data && data.length > 0) {
          setRoadmapItems(data);
          setUsingFallback(false);
        } else {
          console.log('⚠️ [TimelineRoadmap] No data returned, using fallback');
          setRoadmapItems(FALLBACK_ROADMAP_ITEMS);
          setUsingFallback(true);
        }
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
        console.error('❌ [TimelineRoadmap] Error:', errorMessage);
        
        // Utiliser les données de fallback en cas d'erreur
        console.log('🔄 [TimelineRoadmap] Using fallback data due to error');
        setRoadmapItems(FALLBACK_ROADMAP_ITEMS);
        setUsingFallback(true);
        setError(`Connexion base de données échouée (utilisation des données locales): ${errorMessage}`);
        
      } finally {
        setLoading(false);
        console.log('🏁 [TimelineRoadmap] Fetch completed');
      }
    };

    fetchRoadmapItems();
  }, []);

  console.log('🎨 [TimelineRoadmap] Rendering - loading:', loading, 'error:', error, 'items:', roadmapItems.length, 'fallback:', usingFallback);

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <I18nText 
            translationKey="sections.roadmap" 
            as="h2" 
            className="text-3xl font-bold text-slate-800 mb-4"
          />
          <I18nText 
            translationKey="roadmap.subtitle" 
            as="p" 
            className="text-xl text-slate-600"
          />
          {usingFallback && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                📱 Mode déconnecté - Affichage des données locales
              </p>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600">Chargement de la feuille de route...</span>
          </div>
        ) : roadmapItems.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Aucune étape de développement"
            description="La feuille de route n'est pas encore disponible. Revenez bientôt pour voir nos plans de développement."
            actionLabel="Explorer les fonctionnalités"
            onAction={() => navigate('/symbols')}
          />
        ) : (
          <div className="relative">
            {/* Message d'erreur non bloquant */}
            {error && !usingFallback && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm">{error}</p>
              </div>
            )}
            
            {/* Vertical line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-slate-200"></div>
            
            <div className="space-y-8">
              {roadmapItems.map((item) => {
                const circleColor = item.is_completed 
                  ? 'bg-green-500' 
                  : item.is_current 
                    ? 'bg-slate-700' 
                    : 'bg-slate-300';
                
                const statusBadge = item.is_completed 
                  ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><I18nText translationKey="roadmap.completed" /></Badge>
                  : item.is_current 
                    ? <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100"><I18nText translationKey="roadmap.inProgress" /></Badge>
                    : null;

                return (
                  <div key={item.id} className="relative flex items-start space-x-4">
                    {/* Circle */}
                    <div className={`w-4 h-4 rounded-full ${circleColor} relative z-10`}></div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {item.title?.[i18n.language] || item.title?.fr || item.title || 'Titre non disponible'}
                        </h3>
                        {statusBadge}
                      </div>
                      <p className="text-slate-600">
                        {item.description?.[i18n.language] || item.description?.fr || item.description || 'Description non disponible'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TimelineRoadmap;
