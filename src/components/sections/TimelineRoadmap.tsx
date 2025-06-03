
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { getRoadmapItems, RoadmapItem } from '@/services/roadmapService';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

const TimelineRoadmap = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmapItems = async () => {
      try {
        console.log('🚀 [TimelineRoadmap] Starting fetch...');
        console.log('🚀 [TimelineRoadmap] Service function:', typeof getRoadmapItems);
        
        const data = await getRoadmapItems();
        
        console.log('✅ [TimelineRoadmap] Fetch successful');
        console.log('📊 [TimelineRoadmap] Items count:', data?.length || 0);
        console.log('📋 [TimelineRoadmap] Raw data:', data);
        
        if (data && Array.isArray(data)) {
          setRoadmapItems(data);
          setError(null);
          console.log('✅ [TimelineRoadmap] State updated with items:', data.length);
        } else {
          console.log('⚠️ [TimelineRoadmap] Data is not an array:', typeof data);
          setRoadmapItems([]);
          setError('Invalid data format');
        }
      } catch (err) {
        console.error('❌ [TimelineRoadmap] Error caught:', err);
        console.error('❌ [TimelineRoadmap] Error type:', typeof err);
        console.error('❌ [TimelineRoadmap] Error message:', err instanceof Error ? err.message : String(err));
        setError(err instanceof Error ? err.message : 'Unknown error');
        setRoadmapItems([]);
      } finally {
        console.log('🏁 [TimelineRoadmap] Setting loading to false');
        setLoading(false);
      }
    };

    fetchRoadmapItems();
  }, []);

  // Debug current state
  console.log('🔍 [TimelineRoadmap] Current state:', {
    loading,
    error,
    itemsCount: roadmapItems.length,
    items: roadmapItems
  });

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
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600">Chargement de la feuille de route...</span>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-red-800 font-semibold mb-2">Erreur de chargement</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <EmptyState
              icon={MapPin}
              title="Impossible de charger la feuille de route"
              description="Une erreur est survenue lors du chargement des étapes de développement."
              actionLabel="Réessayer"
              onAction={() => window.location.reload()}
            />
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
            {/* Vertical line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-slate-200"></div>
            
            <div className="space-y-8">
              {roadmapItems.map((item, index) => {
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
                          {item.title?.[i18n.language] || item.title?.fr || 'Titre non disponible'}
                        </h3>
                        {statusBadge}
                      </div>
                      <p className="text-slate-600">
                        {item.description?.[i18n.language] || item.description?.fr || 'Description non disponible'}
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
