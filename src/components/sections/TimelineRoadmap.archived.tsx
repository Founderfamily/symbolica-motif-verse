
import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import { getRoadmapItemsWithFallback, RoadmapItem } from '@/services/roadmapService';
import { RoadmapHeader } from './roadmap/RoadmapHeader';
import { RoadmapTimeline } from './roadmap/RoadmapTimeline';
import { LoadingSpinner } from './roadmap/LoadingSpinner';

const TimelineRoadmap = () => {
  const navigate = useNavigate();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchRoadmapItems = async () => {
      try {
        console.log('🚀 [TimelineRoadmap] Fetching roadmap items...');
        setLoading(true);
        setError(null);
        
        const { items, usingFallback: fallback, error: fetchError } = await getRoadmapItemsWithFallback();
        
        setRoadmapItems(items);
        setUsingFallback(fallback);
        setError(fetchError || null);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
        console.error('❌ [TimelineRoadmap] Error:', errorMessage);
        setError(errorMessage);
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
        <RoadmapHeader usingFallback={usingFallback} />
        
        {loading ? (
          <LoadingSpinner />
        ) : roadmapItems.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Aucune étape de développement"
            description="La feuille de route n'est pas encore disponible. Revenez bientôt pour voir nos plans de développement."
            actionLabel="Explorer les fonctionnalités"
            onAction={() => navigate('/symbols')}
          />
        ) : (
          <RoadmapTimeline 
            items={roadmapItems} 
            error={error} 
            usingFallback={usingFallback} 
          />
        )}
      </div>
    </section>
  );
};

export default TimelineRoadmap;
