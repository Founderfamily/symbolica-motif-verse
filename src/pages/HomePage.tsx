
import React from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedCollections } from '@/hooks/useCollections';
import CollectionCard from '@/components/collections/CollectionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Trophy, Star, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

const HomePage = () => {
  const { data: featuredCollections, isLoading } = useFeaturedCollections();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Explorez les Collections
            <span className="text-amber-600 block">Culturelles du Monde</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Découvrez des parcours thématiques fascinants à travers les symboles et traditions 
            du monde entier. Complétez des collections et gagnez des badges !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/collections">
              <Button size="lg" className="text-lg px-8 py-4">
                Voir toutes les collections
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/symbols">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Explorer tous les symboles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Collections à la Une
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Commencez votre exploration par ces collections spécialement sélectionnées
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-slate-200 rounded mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCollections?.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}

          {featuredCollections?.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Collections bientôt disponibles</h3>
              <p className="text-slate-600">
                Nous préparons des parcours passionnants pour vous !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Gamification CTA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Gagnez des Badges en Explorant
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Complétez des collections, découvrez de nouveaux symboles et débloquez des réalisations. 
              Montez dans le classement et devenez un expert des cultures du monde !
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Collectionnez</h3>
                  <p className="text-sm text-slate-600">
                    Visitez tous les symboles d'une collection pour gagner des points
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Progressez</h3>
                  <p className="text-sm text-slate-600">
                    Débloquez des badges et montez de niveau en explorant
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Partagez</h3>
                  <p className="text-sm text-slate-600">
                    Rejoignez la communauté et partagez vos découvertes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Commencer votre Exploration ?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'explorateurs culturels et découvrez les secrets 
            des symboles à travers le monde
          </p>
          <Link to="/collections">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Commencer l'aventure
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
