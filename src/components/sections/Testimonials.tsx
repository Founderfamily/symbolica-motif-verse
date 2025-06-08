
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { getTestimonials, Testimonial } from '@/services/testimonialsService';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

// Données d'exemple pour le fallback
const fallbackTestimonials: Testimonial[] = [
  {
    id: 'fallback-1',
    name: 'Marie Dubois',
    role: { fr: 'Archéologue', en: 'Archaeologist' },
    quote: { 
      fr: 'Cette plateforme révolutionne notre façon d\'étudier les symboles culturels à travers le monde.',
      en: 'This platform revolutionizes how we study cultural symbols across the world.'
    },
    initials: 'MD',
    image_url: null,
    display_order: 1,
    is_active: true
  },
  {
    id: 'fallback-2',
    name: 'Prof. James Wilson',
    role: { fr: 'Historien de l\'art', en: 'Art Historian' },
    quote: { 
      fr: 'Une ressource inestimable pour mes recherches sur l\'iconographie médiévale.',
      en: 'An invaluable resource for my research on medieval iconography.'
    },
    initials: 'JW',
    image_url: null,
    display_order: 2,
    is_active: true
  },
  {
    id: 'fallback-3',
    name: 'Elena Rodriguez',
    role: { fr: 'Anthropologue culturelle', en: 'Cultural Anthropologist' },
    quote: { 
      fr: 'L\'interface collaborative facilite grandement le partage de découvertes entre chercheurs.',
      en: 'The collaborative interface greatly facilitates sharing discoveries between researchers.'
    },
    initials: 'ER',
    image_url: null,
    display_order: 3,
    is_active: true
  }
];

const Testimonials = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('🚀 [Testimonials] Fetching testimonials...');
        const data = await getTestimonials(true);
        console.log('✅ [Testimonials] Data received:', data?.length || 0, 'testimonials');
        
        if (data && data.length > 0) {
          setTestimonials(data);
          setUsingFallback(false);
        } else {
          console.log('📝 [Testimonials] No data, using fallback');
          setTestimonials(fallbackTestimonials);
          setUsingFallback(true);
        }
      } catch (err) {
        console.error('❌ [Testimonials] Error:', err);
        console.log('📝 [Testimonials] Using fallback data due to error');
        setTestimonials(fallbackTestimonials);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    // Timeout réduit à 3 secondes pour une meilleure UX
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ [Testimonials] Timeout reached, using fallback data');
        setTestimonials(fallbackTestimonials);
        setUsingFallback(true);
        setLoading(false);
      }
    }, 3000);

    fetchTestimonials().finally(() => {
      clearTimeout(safetyTimeout);
    });

    return () => clearTimeout(safetyTimeout);
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <I18nText 
            translationKey="sections.testimonials" 
            as="h2" 
            className="text-3xl font-bold text-slate-800 mb-4"
          />
          <I18nText 
            translationKey="testimonials.subtitle" 
            as="p" 
            className="text-xl text-slate-600"
          />
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-slate-600">Chargement des témoignages...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <I18nText 
          translationKey="sections.testimonials" 
          as="h2" 
          className="text-3xl font-bold text-slate-800 mb-4"
        />
        <I18nText 
          translationKey="testimonials.subtitle" 
          as="p" 
          className="text-xl text-slate-600"
        />
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border border-slate-200">
            <CardHeader className="flex flex-row items-center space-x-4 pb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-amber-100 text-amber-800">
                  {testimonial.initials || testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-slate-800">{testimonial.name}</h3>
                <p className="text-sm text-slate-500">
                  {testimonial.role?.[i18n.language] || testimonial.role?.fr || 'Role non spécifié'}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 italic">
                "{testimonial.quote?.[i18n.language] || testimonial.quote?.fr || 'Citation non disponible'}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {usingFallback && (
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            Données d'exemple • Les témoignages réels seront chargés prochainement
          </p>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
