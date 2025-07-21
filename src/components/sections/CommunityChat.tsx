
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, History, Crown, Book, Compass } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CommunityChat = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('academic');

  const academicGroups = [
    {
      name: "Historiens & Archéologues",
      members: 342,
      online: 28,
      topic: "Débat sur l'origine des symboles celtiques",
      expertise: "Expert",
      icon: History,
      color: "blue"
    },
    {
      name: "Experts UNESCO",
      members: 156,
      online: 12,
      topic: "Classification des patrimoines mondiaux",
      expertise: "Maître",
      icon: Crown,
      color: "purple"
    },
    {
      name: "Chercheurs en Symbologie",
      members: 498,
      online: 45,
      topic: "Nouvelles découvertes en Mésopotamie",
      expertise: "Expert",
      icon: Book,
      color: "emerald"
    }
  ];

  const adventureGroups = [
    {
      name: "Chasseurs de Trésors",
      members: 1247,
      online: 89,
      topic: "Indice mystérieux trouvé en Bretagne !",
      expertise: "Tous niveaux",
      icon: Compass,
      color: "amber"
    },
    {
      name: "Explorateurs Urbains",
      members: 756,
      online: 52,
      topic: "Symboles cachés dans le métro parisien",
      expertise: "Intermédiaire",
      icon: MessageCircle,
      color: "rose"
    },
    {
      name: "Aventuriers Numériques",
      members: 923,
      online: 67,
      topic: "Quête collective : Le Code de Vinci 2.0",
      expertise: "Débutant",
      icon: Users,
      color: "indigo"
    }
  ];

  const recentDiscussions = [
    {
      author: "Dr. Marie Dubois",
      role: "Archéologue",
      message: "Les nouvelles analyses radiocarbone confirment...",
      time: "Il y a 5 min",
      likes: 12,
      type: "academic"
    },
    {
      author: "Alex_Explorer",
      role: "Aventurier",
      message: "J'ai trouvé ce symbole gravé sur une pierre près de Carnac !",
      time: "Il y a 12 min",
      likes: 28,
      type: "adventure"
    },
    {
      author: "Prof. Chen Wei",
      role: "Sinologue",
      message: "Comparaison fascinante entre les dragons chinois et...",
      time: "Il y a 18 min",
      likes: 15,
      type: "academic"
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
      case 'amber':
        return 'bg-amber-100 text-amber-800';
      case 'rose':
        return 'bg-rose-100 text-rose-800';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpertiseColor = (expertise: string) => {
    switch (expertise) {
      case 'Maître':
        return 'bg-red-100 text-red-800';
      case 'Expert':
        return 'bg-orange-100 text-orange-800';
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-rose-100 text-rose-800 rounded-full text-sm font-medium mb-4">
          <MessageCircle className="w-4 h-4 mr-2" />
          Communauté & Discussions
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Venez discuter sur l'histoire
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Rejoignez nos communautés spécialisées. Échangez avec des experts académiques 
          ou partagez vos aventures avec d'autres explorateurs.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Académique
          </TabsTrigger>
          <TabsTrigger value="adventure" className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            Aventure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="mt-8">
          <div className="grid md:grid-cols-3 gap-6">
            {academicGroups.map((group, index) => {
              const Icon = group.icon;
              const colorClasses = getColorClasses(group.color);
              const expertiseClasses = getExpertiseColor(group.expertise);
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${colorClasses} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge className={expertiseClasses}>
                        {group.expertise}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {group.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <span>{group.members} membres</span>
                      <span className="text-green-600">{group.online} en ligne</span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4 italic">
                      "Sujet actuel : {group.topic}"
                    </p>
                    
                    <Button className="w-full" variant="outline">
                      Rejoindre la Discussion
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="adventure" className="mt-8">
          <div className="grid md:grid-cols-3 gap-6">
            {adventureGroups.map((group, index) => {
              const Icon = group.icon;
              const colorClasses = getColorClasses(group.color);
              const expertiseClasses = getExpertiseColor(group.expertise);
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${colorClasses} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge className={expertiseClasses}>
                        {group.expertise}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {group.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <span>{group.members} membres</span>
                      <span className="text-green-600">{group.online} en ligne</span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4 italic">
                      "Sujet actuel : {group.topic}"
                    </p>
                    
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Rejoindre l'Aventure
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Discussions */}
      <div className="bg-slate-50 p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Discussions Récentes
        </h3>
        
        <div className="space-y-4 mb-6">
          {recentDiscussions.map((discussion, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-slate-600">
                  {discussion.author.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-800">{discussion.author}</span>
                  <Badge variant="outline" className="text-xs">
                    {discussion.role}
                  </Badge>
                  <span className="text-xs text-slate-500">{discussion.time}</span>
                </div>
                
                <p className="text-slate-600 text-sm mb-2">
                  {discussion.message}
                </p>
                
                <div className="flex items-center gap-2">
                  <button className="text-xs text-slate-500 hover:text-rose-600">
                    ❤️ {discussion.likes}
                  </button>
                  <button className="text-xs text-slate-500 hover:text-blue-600">
                    Répondre
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={() => navigate('/community')}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Rejoindre les Discussions
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunityChat;
