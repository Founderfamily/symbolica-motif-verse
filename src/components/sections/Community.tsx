
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, BookOpen, Search, ArrowRight, Plus } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { interestGroupService } from '@/services/interestGroupService';
import { usePlatformStats } from '@/hooks/usePlatformStats';

interface InterestGroup {
  id: string;
  name: string;
  culture: string;
  members_count: number;
  discoveries_count: number;
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
      'Art Déco': 'from-blue-100 to-indigo-100',
      'Celtique': 'from-green-100 to-emerald-100',
      'Japonais': 'from-red-100 to-pink-100',
      'Islamique': 'from-purple-100 to-violet-100',
      'Égyptien': 'from-yellow-100 to-orange-100',
      'Nordique': 'from-cyan-100 to-blue-100'
    };
    return gradients[culture] || 'from-slate-100 to-gray-100';
  };

  useEffect(() => {
    const loadGroups = async () => {
      try {
        console.log('🏘️ [Community] Loading interest groups...');
        setLoading(true);
        
        const groupsData = await interestGroupService.getInterestGroups(4);
        console.log('✅ [Community] Interest groups loaded:', groupsData);
        
        if (groupsData && groupsData.length > 0) {
          setGroups(groupsData);
        } else {
          // Fallback avec des données statiques améliorées
          console.log('🔄 [Community] Using fallback data');
          setGroups([
            {
              id: '1',
              name: 'Motifs Art Déco',
              culture: 'Art Déco',
              members_count: 156,
              discoveries_count: 342,
              themes: ['Architecture', 'Design', 'Géométrie']
            },
            {
              id: '2',
              name: 'Symbolisme Celtique',
              culture: 'Celtique',
              members_count: 203,
              discoveries_count: 489,
              themes: ['Spiritualité', 'Nature', 'Ancestral']
            },
            {
              id: '3',
              name: 'Motifs Japonais',
              culture: 'Japonais',
              members_count: 287,
              discoveries_count: 567,
              themes: ['Tradition', 'Minimalisme', 'Zen']
            },
            {
              id: '4',
              name: 'Art Islamique',
              culture: 'Islamique',
              members_count: 134,
              discoveries_count: 298,
              themes: ['Calligraphie', 'Géométrie', 'Ornements']
            }
          ]);
        }
      } catch (error) {
        console.error('❌ [Community] Error loading groups:', error);
        // Utiliser le fallback en cas d'erreur
        setGroups([
          {
            id: '1',
            name: 'Motifs Art Déco',
            culture: 'Art Déco',
            members_count: 156,
            discoveries_count: 342,
            themes: ['Architecture', 'Design']
          },
          {
            id: '2',
            name: 'Symbolisme Celtique',
            culture: 'Celtique',
            members_count: 203,
            discoveries_count: 489,
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="community.title">Une Communauté Passionnée</I18nText>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            <I18nText translationKey="community.description">
              Rejoignez des milliers d'explorateurs qui partagent leurs découvertes et enrichissent notre compréhension du patrimoine symbolique mondial.
            </I18nText>
          </p>
        </div>

        {/* Statistiques de la plateforme */}
        {!statsLoading && platformStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700 mb-1">
                  {platformStats.totalContributions.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Contributions</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-700 mb-1">
                  {platformStats.totalSymbols.toLocaleString()}
                </div>
                <div className="text-sm text-emerald-600">Symboles</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-700 mb-1">
                  {platformStats.totalCultures}
                </div>
                <div className="text-sm text-purple-600">Cultures</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-700 mb-1">
                  {platformStats.activeUsers}
                </div>
                <div className="text-sm text-amber-600">Contributeurs</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Groupes d'intérêt */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">Groupes d'Intérêt</h3>
          
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
                <Card key={group.id} className={`overflow-hidden hover:shadow-lg transition-all duration-200 bg-gradient-to-br ${culturalGradient(group.culture)}`}>
                  <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
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
                        <div className="text-slate-600">Contributeurs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-slate-900">
                          {group.discoveries_count.toLocaleString()}
                        </div>
                        <div className="text-slate-600">Découvertes</div>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-4" 
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

        {/* Activités récentes */}
        {!statsLoading && platformStats?.recentActivities && platformStats.recentActivities.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Activités Récentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platformStats.recentActivities.slice(0, 6).map((activity) => (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Plus className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">{activity.title}</p>
                        <p className="text-xs text-slate-600">par {activity.user_name}</p>
                        {activity.culture && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {activity.culture}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Fonctionnalités communautaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
            <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <CardContent className="p-6">
              <div className="bg-blue-100 p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                <I18nText translationKey="community.features.groups.title">Communautés Thématiques</I18nText>
              </h4>
              <p className="text-slate-600 text-sm">
                <I18nText translationKey="community.features.groups.description">
                  Rejoignez des groupes passionnés par des cultures spécifiques et partagez vos découvertes.
                </I18nText>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-200">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <CardContent className="p-6">
              <div className="bg-amber-100 p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                <I18nText translationKey="community.features.collections.title">Collections Personnelles</I18nText>
              </h4>
              <p className="text-slate-600 text-sm">
                <I18nText translationKey="community.features.collections.description">
                  Créez et organisez vos propres collections de symboles selon vos centres d'intérêt.
                </I18nText>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-200">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <CardContent className="p-6">
              <div className="bg-emerald-100 p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                <I18nText translationKey="community.features.discovery.title">Découverte Avancée</I18nText>
              </h4>
              <p className="text-slate-600 text-sm">
                <I18nText translationKey="community.features.discovery.description">
                  Explorez notre base de données enrichie et découvrez des connexions inattendues.
                </I18nText>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/community')}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-3"
          >
            <I18nText translationKey="community.exploreAll">Explorer la Communauté</I18nText>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Community;
