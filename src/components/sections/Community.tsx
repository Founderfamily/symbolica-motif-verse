
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Book, Search } from 'lucide-react';
import { culturalGradient } from '@/lib/utils';

const Community = () => {
  const communityGroups = [
    {
      name: "Art Déco",
      members: "4.2K",
      discoveries: "12K",
      icon: "AD",
      image: "/images/symbols/adinkra.png",
      culture: "Française",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Symbolisme Celtique",
      members: "3.8K",
      discoveries: "9K",
      icon: "SC",
      image: "/images/symbols/triskelion.png",
      culture: "Celtique",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50"
    },
    {
      name: "Motifs Japonais",
      members: "5.1K",
      discoveries: "15K",
      icon: "MJ",
      image: "/images/symbols/seigaiha.png",
      culture: "Japonaise",
      color: "from-sky-500 to-blue-600",
      bgColor: "bg-sky-50"
    },
    {
      name: "Art Islamique",
      members: "3.5K",
      discoveries: "8K",
      icon: "AI",
      image: "/images/symbols/arabesque.png",
      culture: "Islamique", 
      color: "from-teal-500 to-emerald-600",
      bgColor: "bg-teal-50"
    }
  ];
  
  return (
    <section className="py-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pattern-grid-lg"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-2">Patrimoine mondial</span>
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Notre communauté de passionnés</h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'amateurs et experts du patrimoine mondial, 
            partagez vos découvertes et trouvez votre communauté thématique
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityGroups.map((group, i) => (
            <Card key={i} className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden symbol-card ${culturalGradient(group.culture)}`}>
              <div className={`h-2 w-full bg-gradient-to-r ${group.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                    <AvatarImage src={group.image} alt={group.name} />
                    <AvatarFallback className={`bg-gradient-to-br ${group.color} text-white text-lg`}>{group.icon}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg text-slate-800">{group.name}</p>
                    <p className="text-sm text-slate-500 flex items-center">
                      <Users className="h-3 w-3 mr-1 text-slate-400" /> 
                      {group.members} membres
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {group.discoveries} découvertes
                  </span>
                  <span className="px-3 py-1.5 text-sm font-medium bg-white rounded-md shadow-sm hover:shadow border border-slate-100 text-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white cursor-pointer transition-all duration-200">
                    Rejoindre
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Communautés thématiques</h3>
            <p className="text-slate-600">Rejoignez des groupes spécialisés selon vos intérêts : Art Déco, Symbolisme Médiéval, Motifs Asiatiques...</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200">
              <Book className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Votre espace personnel</h3>
            <p className="text-slate-600">Conservez vos découvertes, suivez vos contributions et visualisez votre progression d'expertise</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Navigation intuitive</h3>
            <p className="text-slate-600">Explorez les connexions entre symboles, lieux et cultures grâce à notre navigation "mind mapping"</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
