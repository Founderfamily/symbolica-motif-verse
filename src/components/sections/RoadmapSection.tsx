
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { getRoadmapItems, RoadmapItem } from '@/services/roadmapService';
import { CheckCircle, Clock, Circle, AlertCircle } from 'lucide-react';

// Fallback data in case Supabase fails
const fallbackRoadmapItems: RoadmapItem[] = [
  {
    id: 'fallback-1',
    phase: 'Phase 0',
    title: { fr: 'Fondations techniques', en: 'Technical Foundations' },
    description: { fr: 'Mise en place de l\'infrastructure de base', en: 'Setting up basic infrastructure' },
    is_current: false,
    is_completed: true,
    display_order: 0
  },
  {
    id: 'fallback-2',
    phase: 'Phase 1',
    title: { fr: 'Plateforme de base', en: 'Base Platform' },
    description: { fr: 'Développement des fonctionnalités core', en: 'Development of core features' },
    is_current: true,
    is_completed: false,
    display_order: 1
  },
  {
    id: 'fallback-3',
    phase: 'Phase 2',
    title: { fr: 'Communauté et collaboration', en: 'Community and Collaboration' },
    description: { fr: 'Outils collaboratifs et communautaires', en: 'Collaborative and community tools' },
    is_current: false,
    is_completed: false,
    display_order: 2
  }
];

const RoadmapSection = () => {
  const { i18n } = useTranslation();
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const timeout = setTimeout(() => {
        console.log('⏰ [RoadmapSection] Timeout reached, using fallback data');
        setItems(fallbackRoadmapItems);
        setLoading(false);
      }, 5000); // 5 second timeout

      try {
        console.log('🚀 [RoadmapSection] Starting Supabase fetch...');
        setLoading(true);
        setError(null);
        
        const data = await getRoadmapItems();
        clearTimeout(timeout);
        
        console.log('✅ [RoadmapSection] Supabase data received:', data?.length || 0, 'items');
        
        if (data && data.length > 0) {
          setItems(data);
        } else {
          console.log('📝 [RoadmapSection] No data from Supabase, using fallback');
          setItems(fallbackRoadmapItems);
        }
      } catch (err) {
        clearTimeout(timeout);
        const errorMessage = err instanceof Error ? err.message : 'Erreur de chargement';
        console.error('❌ [RoadmapSection] Supabase error:', errorMessage);
        console.log('🔄 [RoadmapSection] Using fallback data due to error');
        setError(errorMessage);
        setItems(fallbackRoadmapItems); // Use fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const getStatusIcon = (item: RoadmapItem) => {
    if (item.is_completed) return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (item.is_current) return <Clock className="w-6 h-6 text-blue-500" />;
    return <Circle className="w-6 h-6 text-gray-300" />;
  };

  const getStatusBadge = (item: RoadmapItem) => {
    if (item.is_completed) {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <I18nText translationKey="roadmap:completed">Terminé</I18nText>
        </Badge>
      );
    }
    if (item.is_current) {
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <I18nText translationKey="roadmap:inProgress">En cours</I18nText>
        </Badge>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <I18nText 
              translationKey="sections.roadmap" 
              as="h2" 
              className="text-3xl font-bold text-slate-800 mb-4"
            />
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600">Chargement de la feuille de route...</span>
          </div>
        </div>
      </section>
    );
  }

  // Main render with data (Supabase or fallback)
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <I18nText 
            translationKey="sections.roadmap" 
            as="h2" 
            className="text-3xl font-bold text-slate-800 mb-4"
          />
          <I18nText 
            translationKey="roadmap:subtitle" 
            as="p" 
            className="text-xl text-slate-600"
          />
        </div>

        {/* Error notice (if applicable) */}
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
              <p className="text-amber-700 text-sm">
                Données de démonstration affichées (problème de connexion)
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-200"></div>
          
          <div className="space-y-8">
            {items.map((item) => {
              const title = typeof item.title === 'object' 
                ? item.title?.[i18n.language] || item.title?.fr || 'Titre manquant'
                : item.title || 'Titre manquant';
              
              const description = typeof item.description === 'object'
                ? item.description?.[i18n.language] || item.description?.fr || 'Description manquante'
                : item.description || 'Description manquante';

              return (
                <Card key={item.id} className="relative ml-12 shadow-sm hover:shadow-md transition-shadow">
                  {/* Icône de statut */}
                  <div className="absolute -left-[35px] top-6">
                    {getStatusIcon(item)}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {title}
                      </CardTitle>
                      {getStatusBadge(item)}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-slate-600">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Debug info en dev mode */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
            <p><strong>Debug:</strong> {items.length} éléments affichés</p>
            <p><strong>Source:</strong> {error ? 'Fallback' : 'Supabase'}</p>
            <p><strong>Phases:</strong> {items.map(item => item.phase).join(', ')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoadmapSection;
