
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
  const { data: platformStats, isLoading: statsLoading } = usePlatformStats();

  const getGroupStyle = (culture: string) => {
    const styles = {
      'Global Explorers': { 
        gradient: 'from-amber-50 to-stone-50', 
        accent: 'text-amber-700',
        border: 'border-amber-200'
      },
      'Cultural Heritage': { 
        gradient: 'from-stone-50 to-amber-50', 
        accent: 'text-stone-700',
        border: 'border-stone-200'
      },
      'Symbol Researchers': { 
        gradient: 'from-amber-50/50 to-stone-100', 
        accent: 'text-amber-800',
        border: 'border-amber-200'
      },
      'Digital Archivists': { 
        gradient: 'from-stone-50 to-stone-100', 
        accent: 'text-stone-700',
        border: 'border-stone-200'
      }
    };
    return styles[culture] || { 
      gradient: 'from-stone-50 to-amber-50', 
      accent: 'text-stone-700',
      border: 'border-stone-200'
    };
  };

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        
        setGroups([
          {
            id: '1',
            name: 'Global Explorers',
            culture: 'Global Explorers',
            members_count: 1284,
            contributions_count: 2567,
            themes: ['Discovery', 'Adventure', 'Heritage']
          },
          {
            id: '2',
            name: 'Cultural Heritage',
            culture: 'Cultural Heritage',
            members_count: 986,
            contributions_count: 1823,
            themes: ['Preservation', 'Education', 'Research']
          },
          {
            id: '3',
            name: 'Symbol Researchers',
            culture: 'Symbol Researchers',
            members_count: 756,
            contributions_count: 1334,
            themes: ['Analysis', 'Documentation', 'Study']
          },
          {
            id: '4',
            name: 'Digital Archivists',
            culture: 'Digital Archivists',
            members_count: 629,
            contributions_count: 1198,
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

  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative">
        {/* Section Header - Simplified */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-stone-800">
            <I18nText translationKey="community.title">Explorer Community</I18nText>
          </h2>
          
          <p className="text-base text-stone-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            <I18nText translationKey="community.description">
              Join a global community of enthusiasts who share 
              their discoveries and enrich our understanding of symbolic heritage.
            </I18nText>
          </p>
        </div>

        {/* Platform Statistics */}
        {!statsLoading && platformStats && (
          <div className="mb-8">
            <div className="bg-amber-50/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-stone-50 border-stone-200 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-stone-800 mb-1">
                      {platformStats.totalContributions.toLocaleString()}
                    </div>
                    <div className="text-sm text-stone-600">Contributions</div>
                  </CardContent>
                </Card>
                <Card className="bg-stone-50 border-stone-200 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-stone-800 mb-1">
                      {platformStats.totalSymbols.toLocaleString()}
                    </div>
                    <div className="text-sm text-stone-600">Symbols</div>
                  </CardContent>
                </Card>
                <Card className="bg-stone-50 border-stone-200 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-stone-800 mb-1">
                      {platformStats.totalCultures}
                    </div>
                    <div className="text-sm text-stone-600">Cultures</div>
                  </CardContent>
                </Card>
                <Card className="bg-stone-50 border-stone-200 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-stone-800 mb-1">
                      {platformStats.activeUsers}
                    </div>
                    <div className="text-sm text-stone-600">Active Members</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Community Groups */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Active Communities</h3>
            <p className="text-stone-600">Join specialized groups based on your interests</p>
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
            <div className="bg-amber-50/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {groups.map((group) => {
                  const style = getGroupStyle(group.culture);
                  return (
                    <Card key={group.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${style.gradient} border ${style.border}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar className="h-12 w-12 border-2 border-stone-300">
                            <AvatarFallback className="bg-stone-800 text-white font-semibold">
                              {group.culture.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-stone-800 mb-1">{group.name}</h4>
                            <Badge variant="secondary" className="text-xs bg-white/80 text-stone-700">
                              {group.culture}
                            </Badge>
                          </div>
                        </div>

                        {group.themes && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {group.themes.slice(0, 2).map((theme, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-white/60 border-stone-300 text-stone-600">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                          <div className="text-center bg-white/50 rounded-lg p-2">
                            <div className="font-semibold text-stone-800">
                              {group.members_count.toLocaleString()}
                            </div>
                            <div className="text-stone-600 text-xs">Members</div>
                          </div>
                          <div className="text-center bg-white/50 rounded-lg p-2">
                            <div className="font-semibold text-stone-800">
                              {group.contributions_count.toLocaleString()}
                            </div>
                            <div className="text-stone-600 text-xs">Posts</div>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-stone-800 hover:bg-stone-900 text-white" 
                          size="sm"
                          onClick={() => navigate('/community')}
                        >
                          <Users2 className="w-4 h-4 mr-2" />
                          <I18nText translationKey="community.stats.join">Join Group</I18nText>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <Button 
            onClick={() => navigate('/community')}
            size="lg"
            className="bg-stone-800 hover:bg-stone-900 text-amber-100 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Ship className="mr-2 h-4 w-4" />
            <I18nText translationKey="community.exploreAll">Explore Community</I18nText>
            <Crown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Transition Message */}
        <div className="text-center">
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-600 shadow-sm">
              <h3 className="text-xl font-semibold text-stone-800 mb-3">
                Community joined?
              </h3>
              <p className="text-base text-stone-600 leading-relaxed">
                Perfect! You're ready to embark on your greatest adventure yet. 
                Let's launch your first legendary expedition!
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
