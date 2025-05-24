
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Map, BookOpen, Upload, Users, TrendingUp } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

const QuickAccess: React.FC = () => {
  const quickActions = [
    {
      title: 'Explorer les Symboles',
      description: 'Découvrez notre collection complète avec filtres avancés',
      icon: Search,
      href: '/symbols',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Carte Interactive',
      description: 'Explorez les symboles par localisation géographique',
      icon: Map,
      href: '/map',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'Collections Thématiques',
      description: 'Parcourez nos collections organisées par thème',
      icon: BookOpen,
      href: '/collections',
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Contribuer',
      description: 'Partagez vos découvertes avec la communauté',
      icon: Upload,
      href: '/contribute',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Communauté',
      description: 'Rejoignez groupes d\'intérêt et discussions',
      icon: Users,
      href: '/community',
      color: 'bg-rose-50 hover:bg-rose-100 border-rose-200',
      iconColor: 'text-rose-600'
    },
    {
      title: 'Tendances',
      description: 'Découvrez les symboles populaires et récents',
      icon: TrendingUp,
      href: '/trending',
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="quickAccess.title">Accès Rapide</I18nText>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="quickAccess.description">
              Explorez, découvrez et contribuez à notre collection mondiale de symboles culturels
            </I18nText>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href} className="block group">
              <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-105 ${action.color} border-2`}>
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-600 text-sm mb-4">
                    {action.description}
                  </p>
                  <Button variant="ghost" size="sm" className="p-0 h-auto font-medium group-hover:underline">
                    <I18nText translationKey="quickAccess.explore">Explorer →</I18nText>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
