
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { getRoadmapItems, RoadmapItem } from '@/services/roadmapService';
import { CheckCircle, Clock, Circle } from 'lucide-react';

const RoadmapSection = () => {
  const { i18n } = useTranslation();
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getRoadmapItems();
        setItems(data);
      } catch (error) {
        console.error('Error loading roadmap:', error);
        // Afficher des données par défaut en cas d'erreur
        setItems([
          {
            id: '1',
            phase: 'Phase 1',
            title: { fr: 'Lancement de la plateforme', en: 'Platform Launch' },
            description: { fr: 'Mise en ligne de la version initiale', en: 'Initial platform release' },
            is_current: false,
            is_completed: true,
            display_order: 1
          },
          {
            id: '2',
            phase: 'Phase 2',
            title: { fr: 'Fonctionnalités communautaires', en: 'Community Features' },
            description: { fr: 'Groupes et discussions', en: 'Groups and discussions' },
            is_current: true,
            is_completed: false,
            display_order: 2
          }
        ]);
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
            <span className="ml-3 text-slate-600">Chargement...</span>
          </div>
        </div>
      </section>
    );
  }

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

        {/* Timeline */}
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
                      {item.title?.[i18n.language] || item.title?.fr || item.title || 'Titre'}
                    </CardTitle>
                    {getStatusBadge(item)}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-slate-600">
                    {item.description?.[i18n.language] || item.description?.fr || item.description || 'Description'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
