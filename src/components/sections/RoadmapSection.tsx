
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { getRoadmapItems, RoadmapItem } from '@/services/roadmapService';
import { CheckCircle, Clock, Circle, AlertCircle } from 'lucide-react';

const RoadmapSection = () => {
  const { i18n } = useTranslation();
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('🚀 [RoadmapSection] Fetching roadmap items from Supabase...');
        setLoading(true);
        setError(null);
        
        const data = await getRoadmapItems();
        console.log('✅ [RoadmapSection] Données récupérées:', data.length, 'items');
        console.log('📊 [RoadmapSection] Détail des items:', data);
        
        setItems(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion à Supabase';
        console.error('❌ [RoadmapSection] Erreur lors de la récupération:', errorMessage);
        setError(errorMessage);
        // PAS DE FALLBACK - on laisse items vide pour afficher l'erreur
      } finally {
        setLoading(false);
        console.log('🏁 [RoadmapSection] Chargement terminé');
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
          <I18nText translationKey="roadmap.completed" />
        </Badge>
      );
    }
    if (item.is_current) {
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <I18nText translationKey="roadmap.inProgress" />
        </Badge>
      );
    }
    return null;
  };

  // État de chargement
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

  // État d'erreur
  if (error) {
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
            <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
            <div className="text-center">
              <p className="text-red-600 font-semibold">Erreur de chargement</p>
              <p className="text-slate-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Aucune donnée mais pas d'erreur
  if (items.length === 0) {
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
            <div className="text-center">
              <p className="text-slate-600">Aucune étape de développement disponible pour le moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Affichage des vraies données de Supabase
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
            translationKey="roadmap.subtitle" 
            as="p" 
            className="text-xl text-slate-600"
          />
        </div>

        {/* Timeline - Affichage des VRAIES données de Supabase */}
        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-200"></div>
          
          <div className="space-y-8">
            {items.map((item) => (
              <Card key={item.id} className="relative ml-12 shadow-sm hover:shadow-md transition-shadow">
                {/* Icône de statut */}
                <div className="absolute -left-[35px] top-6">
                  {getStatusIcon(item)}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {item.title?.[i18n.language] || item.title?.fr || item.title || `${item.phase} - Titre`}
                    </CardTitle>
                    {getStatusBadge(item)}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-slate-600">
                    {item.description?.[i18n.language] || item.description?.fr || item.description || 'Description en cours...'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Debug info en dev mode */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
            <p><strong>Debug:</strong> {items.length} éléments chargés depuis Supabase</p>
            <p><strong>Phases:</strong> {items.map(item => item.phase).join(', ')}</p>
            <p><strong>Données:</strong> {JSON.stringify(items.map(item => ({ id: item.id, phase: item.phase, completed: item.is_completed, current: item.is_current })), null, 2)}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoadmapSection;
