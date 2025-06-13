
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Ship, Swords, ArrowRight, Flag, Crown, Skull } from 'lucide-react';
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
  flag?: string;
}

const Community = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: platformStats, isLoading: statsLoading } = usePlatformStats();

  // Fonction pour obtenir le drapeau et gradient selon l'équipage
  const getCrewStyle = (culture: string) => {
    const styles = {
      'Corsaires des Caraïbes': { 
        gradient: 'from-red-100 to-orange-100', 
        flag: '🏴‍☠️',
        accent: 'text-red-700'
      },
      'Navigateurs Nordiques': { 
        gradient: 'from-blue-100 to-cyan-100', 
        flag: '⚔️',
        accent: 'text-blue-700'
      },
      'Explorateurs d\'Orient': { 
        gradient: 'from-purple-100 to-pink-100', 
        flag: '🎌',
        accent: 'text-purple-700'
      },
      'Chasseurs de Reliques': { 
        gradient: 'from-amber-100 to-yellow-100', 
        flag: '💎',
        accent: 'text-amber-700'
      }
    };
    return styles[culture] || { 
      gradient: 'from-slate-100 to-gray-100', 
      flag: '⚓',
      accent: 'text-slate-700'
    };
  };

  useEffect(() => {
    const loadGroups = async () => {
      try {
        console.log('🏴‍☠️ [Community] Loading pirate crews...');
        setLoading(true);
        
        // Équipages pirates thématiques
        setGroups([
          {
            id: '1',
            name: 'Les Corsaires des Caraïbes',
            culture: 'Corsaires des Caraïbes',
            members_count: 284,
            contributions_count: 567,
            themes: ['Trésor', 'Navigation', 'Combat'],
            flag: '🏴‍☠️'
          },
          {
            id: '2',
            name: 'Navigateurs Nordiques',
            culture: 'Navigateurs Nordiques',
            members_count: 198,
            contributions_count: 423,
            themes: ['Exploration', 'Légendes', 'Océans'],
            flag: '⚔️'
          },
          {
            id: '3',
            name: 'Explorateurs d\'Orient',
            culture: 'Explorateurs d\'Orient',
            members_count: 156,
            contributions_count: 334,
            themes: ['Temples', 'Mystères', 'Sagesse'],
            flag: '🎌'
          },
          {
            id: '4',
            name: 'Chasseurs de Reliques',
            culture: 'Chasseurs de Reliques',
            members_count: 229,
            contributions_count: 498,
            themes: ['Artefacts', 'Archéologie', 'Aventure'],
            flag: '💎'
          }
        ]);
      } catch (error) {
        console.error('❌ [Community] Error loading crews:', error);
        // Fallback simple
        setGroups([
          {
            id: '1',
            name: 'Les Corsaires des Caraïbes',
            culture: 'Corsaires des Caraïbes',
            members_count: 284,
            contributions_count: 567,
            themes: ['Trésor', 'Navigation'],
            flag: '🏴‍☠️'
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
      {/* Design Taverne de Pirates */}
      <div className="relative">
        {/* Ambiance taverne avec lanternes */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-20 w-24 h-40 bg-gradient-to-t from-orange-600/40 via-yellow-500/30 to-transparent rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-32 w-20 h-36 bg-gradient-to-t from-orange-600/40 via-yellow-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-18 h-32 bg-gradient-to-t from-orange-600/40 via-yellow-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Titre avec style taverne */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-4 bg-blue-900/80 backdrop-blur-sm px-10 py-5 rounded-full shadow-2xl border-2 border-cyan-400 mb-8">
            <Ship className="h-8 w-8 text-cyan-400 animate-pulse" />
            <span className="font-bold text-2xl text-cyan-100 tracking-wider">TAVERNE DES ÉQUIPAGES</span>
            <Ship className="h-8 w-8 text-cyan-400 animate-pulse" />
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold mb-8 text-blue-900 text-shadow-lg" style={{ textShadow: '3px 3px 6px rgba(30, 58, 138, 0.5)' }}>
            <I18nText translationKey="community.title">Fraternité d'Aventuriers</I18nText>
          </h2>
          
          <p className="text-2xl text-blue-800 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
            <I18nText translationKey="community.description">
              Rejoignez des milliers de corsaires, explorateurs et chasseurs de trésors qui partagent 
              leurs découvertes et enrichissent notre cartographie du patrimoine mondial.
            </I18nText>
          </p>
        </div>

        {/* Comptoir de la taverne - Statistiques */}
        {!statsLoading && platformStats && (
          <div className="mb-16 relative">
            {/* Fond style comptoir de taverne */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-yellow-600/10 to-amber-800/20 rounded-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-amber-100/90 to-yellow-100/90 backdrop-blur-lg rounded-3xl p-10 border-4 border-amber-700 shadow-2xl">
              {/* Décorations de taverne */}
              <div className="absolute top-4 left-4 text-3xl">🍺</div>
              <div className="absolute top-4 right-4 text-3xl">⚓</div>
              <div className="absolute bottom-4 left-4 text-3xl">🗡️</div>
              <div className="absolute bottom-4 right-4 text-3xl">💰</div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-400 text-center transform hover:scale-105 transition-all">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-red-700 mb-2">
                      {platformStats.totalContributions.toLocaleString()}
                    </div>
                    <div className="text-sm text-red-600 font-bold">Trésors Trouvés</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-400 text-center transform hover:scale-105 transition-all">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-blue-700 mb-2">
                      {platformStats.totalSymbols.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600 font-bold">Artefacts</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 text-center transform hover:scale-105 transition-all">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-green-700 mb-2">
                      {platformStats.totalCultures}
                    </div>
                    <div className="text-sm text-green-600 font-bold">Territoires</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-400 text-center transform hover:scale-105 transition-all">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-purple-700 mb-2">
                      {platformStats.activeUsers}
                    </div>
                    <div className="text-sm text-purple-600 font-bold">Corsaires Actifs</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Équipages de pirates */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-blue-800/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-xl border-2 border-cyan-500">
              <Flag className="h-6 w-6 text-cyan-400" />
              <span className="font-bold text-xl text-cyan-100">Équipages Légendaires</span>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="bg-slate-100/60 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-slate-300 rounded mb-3"></div>
                      <div className="h-6 bg-slate-300 rounded mb-2"></div>
                      <div className="h-3 bg-slate-300 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Fond style pont de navire */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-cyan-600/5 to-blue-800/10 rounded-3xl"></div>
              
              <div className="relative bg-gradient-to-br from-blue-50/90 to-cyan-100/90 backdrop-blur-lg rounded-3xl p-10 border-4 border-blue-600 shadow-2xl">
                {/* Cordages de navire */}
                <div className="absolute top-0 left-1/4 w-px h-8 bg-blue-700"></div>
                <div className="absolute top-0 right-1/4 w-px h-8 bg-blue-700"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {groups.map((group) => {
                    const style = getCrewStyle(group.culture);
                    return (
                      <Card key={group.id} className={`overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 bg-gradient-to-br ${style.gradient} border-2 border-blue-400 hover:border-blue-600`}>
                        <CardContent className="p-6 relative">
                          {/* Drapeau d'équipage */}
                          <div className="absolute -top-4 -right-4 text-4xl transform rotate-12">
                            {style.flag}
                          </div>
                          
                          <div className="flex items-start gap-3 mb-4">
                            <Avatar className="h-16 w-16 border-4 border-blue-600">
                              <AvatarFallback className="bg-blue-700 text-white font-bold text-lg">
                                {group.culture.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-bold text-blue-900 mb-2 text-lg">{group.name}</h4>
                              <Badge variant="secondary" className="text-xs bg-blue-700 text-white font-bold">
                                {group.culture}
                              </Badge>
                            </div>
                          </div>

                          {group.themes && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {group.themes.slice(0, 2).map((theme, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-white/80 border-blue-400 text-blue-800 font-medium">
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                            <div className="text-center bg-white/50 rounded-lg p-2">
                              <div className="font-bold text-blue-900 text-lg">
                                {group.members_count.toLocaleString()}
                              </div>
                              <div className="text-blue-700 font-medium">Corsaires</div>
                            </div>
                            <div className="text-center bg-white/50 rounded-lg p-2">
                              <div className="font-bold text-blue-900 text-lg">
                                {group.contributions_count.toLocaleString()}
                              </div>
                              <div className="text-blue-700 font-medium">Trésors</div>
                            </div>
                          </div>

                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white border-2 border-blue-900 font-bold shadow-lg" 
                            size="sm"
                            onClick={() => navigate('/community')}
                          >
                            <Swords className="w-4 h-4 mr-2" />
                            <I18nText translationKey="community.stats.join">Rejoindre l'Équipage</I18nText>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA principal */}
        <div className="text-center mb-16">
          <Button 
            onClick={() => navigate('/community')}
            size="lg"
            className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-cyan-100 px-16 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border-4 border-cyan-400 text-xl font-bold"
          >
            <Ship className="mr-4 h-6 w-6" />
            <I18nText translationKey="community.exploreAll">REJOINDRE LA FLOTTE</I18nText>
            <Crown className="ml-4 h-6 w-6" />
          </Button>
        </div>

        {/* Message de transition épique */}
        <div className="text-center">
          <div className="relative max-w-3xl mx-auto">
            {/* Parchemin de capitaine */}
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-10 border-4 border-blue-700 shadow-2xl relative">
              {/* Sceau de cire */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-red-600 rounded-full shadow-lg"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-blue-800 rounded-full shadow-lg"></div>
              
              <h3 className="text-3xl font-bold text-blue-900 mb-6 text-shadow" style={{ textShadow: '2px 2px 4px rgba(30, 58, 138, 0.3)' }}>
                Équipage Recruté ?
              </h3>
              <p className="text-xl text-blue-800 leading-relaxed font-medium">
                Parfait, Capitaine ! Votre navire est prêt, votre équipage rassemblé. 
                Il est temps de hisser les voiles et de lancer votre première expédition légendaire !
              </p>
              
              {/* Gouvernail vers l'étape suivante */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <Skull className="h-6 w-6 text-white" />
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
