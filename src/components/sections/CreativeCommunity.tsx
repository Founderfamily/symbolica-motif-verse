
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Star, MessageCircle, Award, TrendingUp, Camera, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

const CreativeCommunity = () => {
  const [activeTab, setActiveTab] = useState('recent');

  const recentContributions = [
    {
      id: 1,
      user: { name: 'Marie Dubois', avatar: '👩‍🎨', level: 'Experte' },
      symbol: 'Triskèle Breton',
      culture: 'Celtique',
      likes: 24,
      comments: 8,
      timeAgo: '2h',
      preview: '/images/symbols/triskelion.png'
    },
    {
      id: 2,
      user: { name: 'Ahmed Hassan', avatar: '👨‍🏫', level: 'Contributeur' },
      symbol: 'Calligraphie Arabe',
      culture: 'Islamique',
      likes: 18,
      comments: 12,
      timeAgo: '4h',
      preview: '/images/symbols/arabesque.png'
    },
    {
      id: 3,
      user: { name: 'Yuki Tanaka', avatar: '👩‍💼', level: 'Ambassadrice' },
      symbol: 'Seigaiha',
      culture: 'Japonaise',
      likes: 31,
      comments: 15,
      timeAgo: '6h',
      preview: '/images/symbols/seigaiha.png'
    }
  ];

  const topContributors = [
    { name: 'Dr. Elena Rossi', contributions: 47, speciality: 'Art Renaissance', avatar: '👩‍🔬', badge: 'gold' },
    { name: 'Prof. James Wright', contributions: 38, speciality: 'Symboles Celtiques', avatar: '👨‍🎓', badge: 'silver' },
    { name: 'Sarah Chen', contributions: 29, speciality: 'Art Asiatique', avatar: '👩‍🎨', badge: 'bronze' }
  ];

  const communityStats = [
    { label: 'Contributions cette semaine', value: '127', icon: Camera, color: 'text-blue-600' },
    { label: 'Discussions actives', value: '43', icon: MessageCircle, color: 'text-green-600' },
    { label: 'Nouveaux membres', value: '89', icon: Users, color: 'text-purple-600' },
    { label: 'Symboles validés', value: '156', icon: Award, color: 'text-amber-600' }
  ];

  const badges = [
    { name: 'Découvreur', description: 'Premier à identifier un nouveau symbole', color: 'from-yellow-400 to-orange-500', count: 12 },
    { name: 'Expert Culturel', description: 'Spécialiste reconnu d\'une culture', color: 'from-blue-400 to-indigo-500', count: 8 },
    { name: 'Ambassadeur', description: 'Membre actif de la communauté', color: 'from-purple-400 to-pink-500', count: 24 },
    { name: 'Validateur', description: 'Contributions de haute qualité', color: 'from-green-400 to-teal-500', count: 15 }
  ];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Badge className="px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-rose-200">
            <Users className="w-4 h-4 mr-2" />
            Communauté Créative
          </Badge>
        </div>
        
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-rose-600 to-slate-700 bg-clip-text text-transparent">
          Une Communauté Passionnée
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Rejoignez des milliers de passionnés qui préservent et partagent le patrimoine symbolique mondial
        </p>

        {/* Statistiques de la communauté */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {/* Feed des contributions récentes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Dernières Découvertes</h3>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('recent')}
              >
                Récentes
              </Button>
              <Button 
                variant={activeTab === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('popular')}
              >
                Populaires
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {recentContributions.map((contribution) => (
              <Card key={contribution.id} className="p-6 hover:shadow-lg transition-all duration-300 border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{contribution.user.avatar}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-slate-800">{contribution.user.name}</span>
                      <Badge variant="outline" className="text-xs">{contribution.user.level}</Badge>
                      <span className="text-sm text-slate-500">• {contribution.timeAgo}</span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-slate-600">a découvert </span>
                      <span className="font-semibold text-slate-800">{contribution.symbol}</span>
                      <span className="text-slate-600"> • Culture {contribution.culture}</span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <button className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                        <Heart className="w-4 h-4" />
                        {contribution.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {contribution.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                        <Share className="w-4 h-4" />
                        Partager
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={contribution.preview} 
                      alt={contribution.symbol}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg hidden items-center justify-center">
                      <Camera className="w-6 h-6 text-slate-500" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/community">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                <Users className="mr-2 h-4 w-4" />
                Voir toute l'activité
              </Button>
            </Link>
          </div>
        </div>

        {/* Sidebar avec top contributeurs et badges */}
        <div className="space-y-8">
          {/* Top contributeurs */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Top Contributeurs
            </h3>
            
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="relative">
                    <div className="text-2xl">{contributor.avatar}</div>
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                      contributor.badge === 'gold' ? 'bg-yellow-400' :
                      contributor.badge === 'silver' ? 'bg-gray-400' : 'bg-amber-600'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 text-sm">{contributor.name}</div>
                    <div className="text-xs text-slate-500">{contributor.speciality}</div>
                    <div className="text-xs text-slate-400">{contributor.contributions} contributions</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Badges communautaires */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Badges Communautaires
            </h3>
            
            <div className="space-y-4">
              {badges.map((badge, index) => (
                <div key={index} className="p-3 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center`}>
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{badge.name}</div>
                      <div className="text-xs text-slate-500">{badge.count} membres</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{badge.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Call to action pour rejoindre */}
      <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-12 border border-rose-200">
        <h3 className="text-3xl font-bold text-slate-800 mb-4">
          Rejoignez Notre Communauté
        </h3>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
          Participez à la préservation du patrimoine symbolique mondial et connectez-vous avec des passionnés du monde entier
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="mr-2 h-5 w-5" />
              Créer un compte
            </Button>
          </Link>
          <Link to="/community">
            <Button variant="outline" size="lg" className="border-2 border-rose-300 text-rose-700 hover:bg-rose-50 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <MessageCircle className="mr-2 h-5 w-5" />
              Explorer les discussions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CreativeCommunity;
