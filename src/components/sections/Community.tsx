import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, BookOpen, Search, ArrowRight, Plus, ChevronDown, Sparkles } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePlatformStats } from '@/hooks/usePlatformStats';

interface InterestGroup {
  id: string;
  name: string;
  culture: string;
  members_count: number;
  contributions_count: number;
  themes?: string[];
}

const Community = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: platformStats, isLoading: statsLoading } = usePlatformStats();

  // Fonction pour obtenir un gradient basé sur la culture
  const culturalGradient = (culture: string) => {
    const gradients = {
      'Art Déco': 'from-amber-100 to-orange-100',
      'Celtique': 'from-emerald-100 to-green-100',
      'Japonais': 'from-red-100 to-pink-100',
      'Islamique': 'from-purple-100 to-violet-100',
      'Égyptien': 'from-yellow-100 to-orange-100',
      'Nordique': 'from-cyan-100 to-blue-100'
    };
    return gradients[culture] || 'from-amber-100 to-orange-100';
  };

  useEffect(() => {
    const loadGroups = async () => {
      try {
        console.log('🏘️ [Community] Loading interest groups...');
        setLoading(true);
        
        // Données statiques cohérentes avec le design
        setGroups([
          {
            id: '1',
            name: 'Motifs Art Déco',
            culture: 'Art Déco',
            members_count: 156,
            contributions_count: 342,
            themes: ['Architecture', 'Design', 'Géométrie']
          },
          {
            id: '2',
            name: 'Symbolisme Celtique',
            culture: 'Celtique',
            members_count: 203,
            contributions_count: 489,
            themes: ['Spiritualité', 'Nature', 'Ancestral']
          },
          {
            id: '3',
            name: 'Motifs Japonais',
            culture: 'Japonais',
            members_count: 287,
            contributions_count: 567,
            themes: ['Tradition', 'Minimalisme', 'Zen']
          },
          {
            id: '4',
            name: 'Art Islamique',
            culture: 'Islamique',
            members_count: 134,
            contributions_count: 298,
            themes: ['Calligraphie', 'Géométrie', 'Ornements']
          }
        ]);
      } catch (error) {
        console.error('❌ [Community] Error loading groups:', error);
        // Fallback simple en cas d'erreur
        setGroups([
          {
            id: '1',
            name: 'Motifs Art Déco',
            culture: 'Art Déco',
            members_count: 156,
            contributions_count: 342,
            themes: ['Architecture', 'Design']
          },
          {
            id: '2',
            name: 'Symbolisme Celtique',
            culture: 'Celtique',
            members_count: 203,
            contributions_count: 489,
            themes: ['Spiritualité', 'Nature']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  return (
    <section className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Indicateur d'étape */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 text-amber-800 font-semibold mb-6">
          <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
          <I18nText translationKey="community.step3">Rejoignez l'aventure collective</I18nText>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-500 bg-clip-text text-transparent">
          <I18nText translationKey="community.title">Une Communauté Passionnée</I18nText>
        </h2>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          <I18nText translationKey="community.description">
            Rejoignez des milliers d'explorateurs qui partagent leurs découvertes et enrichissent notre compréhension du patrimoine symbolique mondial.
          </I18nText>
        </p>
      </div>

      {/* Statistiques de la plateforme */}
      {!statsLoading && platformStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-700 mb-1">
                {platformStats.totalContributions.toLocaleString()}
              </div>
              <div className="text-sm text-amber-600">Contributions</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700 mb-1">
                {platformStats.totalSymbols.toLocaleString()}
              </div>
              <div className="text-sm text-orange-600">Symboles</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-700 mb-1">
                {platformStats.totalCultures}
              </div>
              <div className="text-sm text-red-600">Cultures</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-700 mb-1">
                {platformStats.activeUsers}
              </div>
              <div className="text-sm text-pink-600">Explorateurs</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Groupes d'intérêt */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-amber-500" />
          Groupes d'Intérêt
        </h3>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded mb-3"></div>
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className={`overflow-hidden hover:shadow-lg transition-all duration-200 bg-gradient-to-br ${culturalGradient(group.culture)} border-amber-200`}>
                <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-600"></div>
                <CardContent className="p-6">
                  
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-amber-100 text-amber-800 font-semibold">
                        {group.culture.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{group.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {group.culture}
                      </Badge>
                    </div>
                  </div>

                  {group.themes && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {group.themes.slice(0, 2).map((theme, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-slate-900">
                        {group.members_count.toLocaleString()}
                      </div>
                      <div className="text-slate-600">Explorateurs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-900">
                        {group.contributions_count.toLocaleString()}
                      </div>
                      <div className="text-slate-600">Contributions</div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4 bg-amber-100 text-amber-800 hover:bg-amber-200" 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/community')}
                  >
                    <I18nText translationKey="community.stats.join">Rejoindre</I18nText>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA principal */}
      <div className="text-center mb-16">
        <Button 
          onClick={() => navigate('/community')}
          size="lg"
          className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Users className="mr-2 h-5 w-5" />
          <I18nText translationKey="community.exploreAll">Rejoindre la Communauté</I18nText>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Transition narrative vers l'étape finale */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-3xl p-8 border border-amber-200">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">
            Prêt pour votre première quête ?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Vous avez découvert des symboles, organisé des collections et rejoint la communauté. 
            Il est temps de lancer votre première quête de découverte !
          </p>
          <div className="flex items-center justify-center">
            <ChevronDown className="h-6 w-6 text-amber-500 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
