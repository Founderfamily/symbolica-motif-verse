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
      'Art Déco': 'from-amber-50 to-orange-50',
      'Celtique': 'from-emerald-50 to-green-50',
      'Japonais': 'from-red-50 to-pink-50',
      'Islamique': 'from-purple-50 to-violet-50',
      'Égyptien': 'from-yellow-50 to-orange-50',
      'Nordique': 'from-cyan-50 to-blue-50'
    };
    return gradients[culture] || 'from-slate-50 to-slate-100';
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
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      {/* Titre principal avec design épuré */}
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-800">
          <I18nText translationKey="community.title">Une Communauté Passionnée</I18nText>
        </h2>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          <I18nText translationKey="community.description">
            Rejoignez des milliers d'explorateurs qui partagent leurs découvertes et enrichissent 
            notre compréhension du patrimoine symbolique mondial.
          </I18nText>
        </p>
      </div>

      {/* Statistiques de la plateforme */}
      {!statsLoading && platformStats && (
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-xl mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {platformStats.totalContributions.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Contributions</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {platformStats.totalSymbols.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Symboles</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {platformStats.totalCultures}
                </div>
                <div className="text-sm text-slate-600">Cultures</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {platformStats.activeUsers}
                </div>
                <div className="text-sm text-slate-600">Explorateurs</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Groupes d'intérêt */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-200">
            <Users className="h-5 w-5 text-slate-700" />
            <span className="font-medium text-slate-800">Groupes d'Intérêt</span>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm">
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
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${culturalGradient(group.culture)} border-slate-200`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-slate-100 text-slate-800 font-semibold">
                          {group.culture.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{group.name}</h4>
                        <Badge variant="secondary" className="text-xs bg-white/80">
                          {group.culture}
                        </Badge>
                      </div>
                    </div>

                    {group.themes && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {group.themes.slice(0, 2).map((theme, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white/60">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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
                      className="w-full bg-white/80 text-slate-800 hover:bg-white/90 hover:text-slate-900 border border-slate-200" 
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
          </div>
        )}
      </div>

      {/* CTA principal */}
      <div className="text-center mb-16">
        <Button 
          onClick={() => navigate('/community')}
          size="lg"
          className="bg-slate-800 hover:bg-slate-900 text-white px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <Users className="mr-3 h-5 w-5" />
          <I18nText translationKey="community.exploreAll">Rejoindre la Communauté</I18nText>
          <ArrowRight className="ml-3 h-5 w-5" />
        </Button>
      </div>

      {/* Message de transition narratif */}
      <div className="text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">
            Communauté rejointe ?
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Formidable ! Vous avez maintenant tout ce qu'il faut pour lancer votre première quête 
            de découverte et commencer votre aventure dans le patrimoine symbolique mondial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Community;
