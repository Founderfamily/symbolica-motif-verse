
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Ship, ArrowRight, Globe, Crown, Users2 } from 'lucide-react';
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
  const { data: platformStats, isLoading: statsLoading, error: statsError } = usePlatformStats();

  console.log('🏠 [Community] Platform stats:', platformStats);
  console.log('🏠 [Community] Stats loading:', statsLoading);
  console.log('🏠 [Community] Stats error:', statsError);

  const getGroupStyle = (culture: string) => {
    const styles = {
      'Global Explorers': { 
        gradient: 'from-amber-50/80 to-orange-50/80', 
        accent: 'text-amber-700',
        border: 'border-amber-200/60'
      },
      'Cultural Heritage': { 
        gradient: 'from-stone-50/80 to-amber-50/80', 
        accent: 'text-stone-700',
        border: 'border-stone-200/60'
      },
      'Symbol Researchers': { 
        gradient: 'from-amber-50/70 to-stone-100/70', 
        accent: 'text-amber-800',
        border: 'border-amber-200/60'
      },
      'Digital Archivists': { 
        gradient: 'from-stone-50/80 to-stone-100/80', 
        accent: 'text-stone-700',
        border: 'border-stone-200/60'
      }
    };
    return styles[culture] || { 
      gradient: 'from-stone-50/80 to-amber-50/80', 
      accent: 'text-stone-700',
      border: 'border-stone-200/60'
    };
  };

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        
        // Données réalistes pour une communauté naissante
        setGroups([
          {
            id: '1',
            name: 'Global Explorers',
            culture: 'Global Explorers',
            members_count: 3, // Plus réaliste
            contributions_count: 8,
            themes: ['Discovery', 'Adventure', 'Heritage']
          },
          {
            id: '2',
            name: 'Cultural Heritage',
            culture: 'Cultural Heritage',
            members_count: 2,
            contributions_count: 5,
            themes: ['Preservation', 'Education', 'Research']
          },
          {
            id: '3',
            name: 'Symbol Researchers',
            culture: 'Symbol Researchers',
            members_count: 2,
            contributions_count: 3,
            themes: ['Analysis', 'Documentation', 'Study']
          },
          {
            id: '4',
            name: 'Digital Archivists',
            culture: 'Digital Archivists',
            members_count: 1,
            contributions_count: 2,
            themes: ['Technology', 'Digital', 'Archive']
          }
        ]);
      } catch (error) {
        console.error('Error loading groups:', error);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  // Fonction pour formater les petits nombres sans virgules inutiles
  const formatSmallNumber = (num: number): string => {
    return num.toString(); // Pas de .toLocaleString() pour les petits nombres
  };

  // Afficher les vraies données ou des valeurs par défaut réalistes
  const displayStats = platformStats || {
    totalContributions: 1,
    totalSymbols: 20,
    totalCultures: 6,
    activeUsers: 6
  };

  console.log('📈 [Community] Display stats:', displayStats);

  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      {/* Subtle background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-64 h-64 bg-stone-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-stone-800">
            <I18nText translationKey="app.community.title">Communauté d'Explorateurs en Croissance</I18nText>
          </h2>
          
          <p className="text-base text-stone-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            <I18nText translationKey="app.community.description">
              Rejoignez notre communauté grandissante d'explorateurs pionniers qui construisent 
              les fondations de la découverte du patrimoine symbolique.
            </I18nText>
          </p>
        </div>

        {/* Platform Statistics */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50">
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="bg-amber-50/50 border-amber-200/60 text-center">
                    <CardContent className="p-4">
                      <div className="animate-pulse">
                        <div className="h-8 bg-amber-300/50 rounded mb-2"></div>
                        <div className="h-4 bg-amber-300/50 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-amber-50/60 border-amber-200/60 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-stone-800 mb-1">
                      {formatSmallNumber(displayStats.totalContributions)}
                    </div>
                    <div className="text-sm text-stone-600">
                      {displayStats.totalContributions === 1 ? 'Contribution' : 'Contributions'}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-stone-50/60 border-stone-200/60 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-stone-800 mb-1">
                      {formatSmallNumber(displayStats.totalSymbols)}
                    </div>
                    <div className="text-sm text-stone-600">Symboles</div>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50/60 border-amber-200/60 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-stone-800 mb-1">
                      {formatSmallNumber(displayStats.totalCultures)}
                    </div>
                    <div className="text-sm text-stone-600">Cultures</div>
                  </CardContent>
                </Card>
                <Card className="bg-stone-50/60 border-stone-200/60 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-stone-800 mb-1">
                      {formatSmallNumber(displayStats.activeUsers)}
                    </div>
                    <div className="text-sm text-stone-600">Explorateurs Pionniers</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Community Groups */}
        <div className="mb-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Groupes Pionniers</h3>
            <p className="text-stone-600">Rejoignez les premières communautés d'explorateurs spécialisées</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="bg-stone-100/60">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-stone-300 rounded mb-3"></div>
                      <div className="h-6 bg-stone-300 rounded mb-2"></div>
                      <div className="h-3 bg-stone-300 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/40">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {groups.map((group) => {
                  const style = getGroupStyle(group.culture);
                  return (
                    <Card key={group.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${style.gradient} border ${style.border} backdrop-blur-sm`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar className="h-12 w-12 border-2 border-amber-300/50">
                            <AvatarFallback className="bg-stone-800 text-white font-semibold">
                              {group.culture.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-stone-800 mb-1">{group.name}</h4>
                            <Badge variant="secondary" className="text-xs bg-white/80 text-stone-700 border-amber-200/50">
                              {group.culture}
                            </Badge>
                          </div>
                        </div>

                        {group.themes && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {group.themes.slice(0, 2).map((theme, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-white/60 border-amber-300/50 text-stone-600">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                          <div className="text-center bg-white/50 rounded-lg p-2">
                            <div className="font-semibold text-stone-800">
                              {formatSmallNumber(group.members_count)}
                            </div>
                            <div className="text-stone-600 text-xs">
                              {group.members_count === 1 ? 'Membre' : 'Membres'}
                            </div>
                          </div>
                          <div className="text-center bg-white/50 rounded-lg p-2">
                            <div className="font-semibold text-stone-800">
                              {formatSmallNumber(group.contributions_count)}
                            </div>
                            <div className="text-stone-600 text-xs">Publications</div>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-stone-800 hover:bg-amber-700 text-white transition-colors" 
                          size="sm"
                          onClick={() => navigate('/community')}
                        >
                          <Users2 className="w-4 h-4 mr-2" />
                          <I18nText translationKey="app.community.stats.join">Rejoindre le Groupe</I18nText>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <Button 
            onClick={() => navigate('/community')}
            size="lg"
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Ship className="mr-2 h-4 w-4" />
            <I18nText translationKey="app.community.exploreAll">Rejoindre la Communauté</I18nText>
            <Crown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Transition Message */}
        <div className="text-center">
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-l-4 border-amber-600 shadow-lg border border-amber-200/50">
              <h3 className="text-xl font-semibold text-stone-800 mb-3">
                Prêt à être un pionnier ?
              </h3>
              <p className="text-base text-stone-600 leading-relaxed">
                Parfait ! Rejoignez nos explorateurs fondateurs et aidez à construire 
                la base de données du patrimoine symbolique la plus complète au monde.
              </p>
              
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
