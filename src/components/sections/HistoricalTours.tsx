
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Headphones, Users, Clock, Star } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HistoricalTours = () => {
  const navigate = useNavigate();

  const featuredTours = [
    {
      title: "Les Secrets de Notre-Dame",
      location: "Paris, France",
      duration: "2h 30min",
      rating: 4.9,
      participants: 1247,
      type: "Visite guidée IA",
      image: "photo-1492321936769-b49830bc1d1e",
      description: "Découvrez les symboles cachés dans l'architecture gothique",
      highlights: ["Gargouilles mystérieuses", "Vitraux codés", "Portails secrets"],
      price: "Gratuit"
    },
    {
      title: "Rome Antique Immersive",
      location: "Rome, Italie",
      duration: "3h 15min",
      rating: 4.8,
      participants: 892,
      type: "Réalité Augmentée",
      image: "photo-1470071459604-3b5ec3a7fe05",
      description: "Revivez l'époque des gladiateurs avec l'IA",
      highlights: ["Colisée reconstitué", "Forum romain", "Maisons patriciennes"],
      price: "15€"
    },
    {
      title: "Mystères de Stonehenge",
      location: "Angleterre, UK",
      duration: "1h 45min",
      rating: 4.7,
      participants: 654,
      type: "Investigation IA",
      image: "photo-1426604966848-d7adac402bff",
      description: "L'IA révèle les secrets du monument préhistorique",
      highlights: ["Alignements stellaires", "Rituels anciens", "Théories récentes"],
      price: "12€"
    }
  ];

  const tourFeatures = [
    {
      icon: Headphones,
      title: "Guides IA Intelligents",
      description: "Assistant personnel adaptatif selon vos intérêts",
      color: "blue"
    },
    {
      icon: Camera,
      title: "Réalité Augmentée",
      description: "Voyez les lieux tels qu'ils étaient autrefois",
      color: "purple"
    },
    {
      icon: Users,
      title: "Expérience Collaborative",
      description: "Partagez vos découvertes avec d'autres visiteurs",
      color: "emerald"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-slate-50/50">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          Parcours de Visite
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Parcours de visite et revisite des histoires
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Explorez les lieux historiques avec nos guides IA intelligents. 
          Revivez le passé grâce à la réalité augmentée et découvrez les histoires cachées.
        </p>
      </div>

      {/* Tour Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {tourFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const colorClasses = getColorClasses(feature.color);
          
          return (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${colorClasses} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Tours */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          Visites Populaires
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredTours.map((tour, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={`https://images.unsplash.com/${tour.image}?w=400&h=200&fit=crop`}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-slate-800">
                    {tour.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-600 text-white">
                    {tour.price}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-slate-800 mb-2">
                  {tour.title}
                </h4>
                
                <div className="flex items-center text-slate-600 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  {tour.location}
                </div>
                
                <p className="text-slate-600 text-sm mb-4">
                  {tour.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Durée</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Note</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{tour.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Participants</span>
                    <span className="font-medium">{tour.participants} visiteurs</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-2">Points forts :</p>
                  <div className="flex flex-wrap gap-1">
                    {tour.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Commencer la Visite
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Regional Tourism Module Placeholder */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-2xl border border-emerald-100">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Module Tourisme Régional
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Découvrez les trésors cachés de votre région. Bientôt disponible : 
            parcours personnalisés basés sur votre localisation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl">
            <h4 className="font-semibold text-slate-800 mb-3">À venir :</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Parcours géolocalisés</li>
              <li>• Recommandations IA locales</li>
              <li>• Guides touristiques personnalisés</li>
              <li>• Intégration offices de tourisme</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <h4 className="font-semibold text-slate-800 mb-3">Fonctionnalités :</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Cartes interactives</li>
              <li>• Réalité augmentée mobile</li>
              <li>• Mode hors-ligne</li>
              <li>• Communauté locale</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            Nous notifier du lancement
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HistoricalTours;
