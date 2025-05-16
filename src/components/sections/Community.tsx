
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Book, Search } from 'lucide-react';
import { culturalGradient } from '@/lib/utils';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const Community = () => {
  const { t } = useTranslation();
  
  const communityGroups = [
    {
      nameKey: 'community.groups.artDeco.name',
      members: "4.2K",
      discoveries: "12K",
      icon: "AD",
      image: "/images/symbols/adinkra.png",
      cultureKey: 'community.groups.artDeco.culture',
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      nameKey: 'community.groups.celticSymbolism.name',
      members: "3.8K",
      discoveries: "9K",
      icon: "SC",
      image: "/images/symbols/triskelion.png",
      cultureKey: 'community.groups.celticSymbolism.culture',
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50"
    },
    {
      nameKey: 'community.groups.japanesePatterns.name',
      members: "5.1K",
      discoveries: "15K",
      icon: "MJ",
      image: "/images/symbols/seigaiha.png",
      cultureKey: 'community.groups.japanesePatterns.culture',
      color: "from-sky-500 to-blue-600",
      bgColor: "bg-sky-50"
    },
    {
      nameKey: 'community.groups.islamicArt.name',
      members: "3.5K",
      discoveries: "8K",
      icon: "AI",
      image: "/images/symbols/arabesque.png",
      cultureKey: 'community.groups.islamicArt.culture', 
      color: "from-teal-500 to-emerald-600",
      bgColor: "bg-teal-50"
    }
  ];

  // For each group, get their culture value from translation
  const groupsWithCulture = communityGroups.map(group => ({
    ...group,
    culture: t(group.cultureKey)
  }));
  
  return (
    <section className="py-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pattern-grid-lg"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-2">
            <I18nText translationKey="sections.community" />
          </span>
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            <I18nText translationKey="community.title" />
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            <I18nText translationKey="community.description" />
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {groupsWithCulture.map((group, i) => (
            <Card key={i} className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden symbol-card ${culturalGradient(group.culture)}`}>
              <div className={`h-2 w-full bg-gradient-to-r ${group.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                    <AvatarImage src={group.image} alt={t(group.nameKey)} />
                    <AvatarFallback className={`bg-gradient-to-br ${group.color} text-white text-lg`}>{group.icon}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg text-slate-800">
                      <I18nText translationKey={group.nameKey} />
                    </p>
                    <p className="text-sm text-slate-500 flex items-center">
                      <Users className="h-3 w-3 mr-1 text-slate-400" /> 
                      {group.members} <I18nText translationKey="community.stats.members" />
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {group.discoveries} <I18nText translationKey="community.stats.discoveries" />
                  </span>
                  <span className="px-3 py-1.5 text-sm font-medium bg-white rounded-md shadow-sm hover:shadow border border-slate-100 text-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white cursor-pointer transition-all duration-200">
                    <I18nText translationKey="community.stats.join" />
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
            <h3 className="text-xl font-semibold mb-2">
              <I18nText translationKey="community.features.thematicCommunities.title" />
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="community.features.thematicCommunities.description" />
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200">
              <Book className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <I18nText translationKey="community.features.personalSpace.title" />
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="community.features.personalSpace.description" />
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <I18nText translationKey="community.features.intuitiveNavigation.title" />
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="community.features.intuitiveNavigation.description" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
