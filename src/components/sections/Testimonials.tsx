
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { getTestimonials, Testimonial } from '@/services/testimonialsService';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

const Testimonials = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('🚀 [Testimonials] Fetching testimonials...');
        const data = await getTestimonials(true); // Only fetch active testimonials
        console.log('✅ [Testimonials] Data received:', data?.length || 0, 'testimonials');
        
        setTestimonials(data || []);
        setError(null);
      } catch (err) {
        console.error('❌ [Testimonials] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    // Timeout de sécurité raisonnable (10 secondes)
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ [Testimonials] Safety timeout reached');
        setLoading(false);
        setError('Délai d\'attente dépassé');
      }
    }, 10000);

    fetchTestimonials().finally(() => {
      clearTimeout(safetyTimeout);
    });

    return () => clearTimeout(safetyTimeout);
  }, []);

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
      
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-slate-600">Chargement des témoignages...</span>
        </div>
      ) : error ? (
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <EmptyState
            icon={MessageSquare}
            title="Impossible de charger les témoignages"
            description="Une erreur est survenue lors du chargement des témoignages."
            actionLabel="Réessayer"
            onAction={() => window.location.reload()}
          />
        </div>
      ) : testimonials.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Aucun témoignage"
          description="Il n'y a pas encore de témoignages d'utilisateurs disponibles."
          actionLabel="Contribuer à la plateforme"
          onAction={() => navigate('/contribute')}
        />
      ) : (
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
      )}
    </section>
  );
};

export default Testimonials;
