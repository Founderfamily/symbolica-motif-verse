
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { Testimonial, getTestimonials } from '@/services/testimonialsService';

const Testimonials = () => {
  const { t, i18n } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTestimonials(true); // Only active testimonials
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const lang = i18n.language || 'fr';
  
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">{t('sections.testimonials')}</h2>
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
          Découvrez comment Symbolica transforme la façon dont les experts et passionnés interagissent avec les symboles culturels
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            // Placeholders while loading
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="border-slate-200 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div>
                      <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 w-16 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded"></div>
                    <div className="h-3 bg-slate-100 rounded"></div>
                    <div className="h-3 bg-slate-100 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-amber-100 text-amber-800">{testimonial.initials || testimonial.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role?.[lang]}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">{testimonial.quote?.[lang]}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            // Fallback if no testimonials are available
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-amber-100 text-amber-800">AB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Nom Prénom</p>
                      <p className="text-sm text-slate-500">Profession</p>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">Témoignage à propos de Symbolica...</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
