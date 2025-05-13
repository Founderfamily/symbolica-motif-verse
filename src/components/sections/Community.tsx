
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Book, Search } from 'lucide-react';

const Community = () => {
  const communityGroups = [
    {
      name: "Art Déco",
      members: "4.2K",
      discoveries: "12K",
      icon: "AD"
    },
    {
      name: "Symbolisme Celtique",
      members: "3.8K",
      discoveries: "9K",
      icon: "SC"
    },
    {
      name: "Motifs Japonais",
      members: "5.1K",
      discoveries: "15K",
      icon: "MJ"
    },
    {
      name: "Art Islamique",
      members: "3.5K",
      discoveries: "8K",
      icon: "AI"
    }
  ];
  
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Notre communauté de passionnés</h2>
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
          Rejoignez des milliers d'amateurs et experts du patrimoine mondial, 
          partagez vos découvertes et trouvez votre communauté thématique
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityGroups.map((group, i) => (
            <Card key={i} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-slate-100 text-slate-800 text-lg">{group.icon}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{group.name}</p>
                    <p className="text-sm text-slate-500">{group.members} membres</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {group.discoveries} découvertes
                  </span>
                  <span className="text-slate-700 font-medium hover:text-amber-700 cursor-pointer">
                    Rejoindre
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <Users className="h-8 w-8 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Communautés thématiques</h3>
            <p className="text-slate-600">Rejoignez des groupes spécialisés selon vos intérêts : Art Déco, Symbolisme Médiéval, Motifs Asiatiques...</p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <Book className="h-8 w-8 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Votre espace personnel</h3>
            <p className="text-slate-600">Conservez vos découvertes, suivez vos contributions et visualisez votre progression d'expertise</p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <Search className="h-8 w-8 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Navigation intuitive</h3>
            <p className="text-slate-600">Explorez les connexions entre symboles, lieux et cultures grâce à notre navigation "mind mapping"</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
