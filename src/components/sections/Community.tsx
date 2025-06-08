
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Book, Search } from 'lucide-react';
import { culturalGradient } from '@/lib/utils';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { getInterestGroups } from '@/services/interestGroupService';
import { InterestGroup } from '@/types/interest-groups';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

// Données d'exemple pour le fallback
const fallbackGroups: InterestGroup[] = [
  {
    id: 'fallback-1',
    name: 'Symboles Celtes',
    slug: 'symboles-celtes',
    description: 'Exploration des symboles de la culture celtique à travers l\'Europe',
    icon: null,
    banner_image: null,
    theme_color: '#2563eb',
    is_public: true,
    created_at: '',
    updated_at: '',
    created_by: '',
    members_count: 234,
    discoveries_count: 45
  },
  {
    id: 'fallback-2',
    name: 'Art Médiéval',
    slug: 'art-medieval',
    description: 'Découverte des symboles dans l\'art et l\'architecture médiévale',
    icon: null,
    banner_image: null,
    theme_color: '#7c3aed',
    is_public: true,
    created_at: '',
    updated_at: '',
    created_by: '',
    members_count: 189,
    discoveries_count: 67
  },
  {
    id: 'fallback-3',
    name: 'Cultures Asiatiques',
    slug: 'cultures-asiatiques',
    description: 'Étude comparative des symboles traditionnels asiatiques',
    icon: null,
    banner_image: null,
    theme_color: '#dc2626',
    is_public: true,
    created_at: '',
    updated_at: '',
    created_by: '',
    members_count: 156,
    discoveries_count: 38
  },
  {
    id: 'fallback-4',
    name: 'Patrimoine Africain',
    slug: 'patrimoine-africain',
    description: 'Préservation et analyse des symboles du patrimoine africain',
    icon: null,
    banner_image: null,
    theme_color: '#059669',
    is_public: true,
    created_at: '',
    updated_at: '',
    created_by: '',
    members_count: 112,
    discoveries_count: 29
  }
];

const Community = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log('🚀 [Community] Fetching interest groups...');
        const allGroups = await getInterestGroups();
        const topGroups = allGroups
          ?.sort((a, b) => b.members_count - a.members_count)
          ?.slice(0, 4);
        
        console.log('✅ [Community] Data received:', topGroups?.length || 0, 'groups');
        
        if (topGroups && topGroups.length > 0) {
          setGroups(topGroups);
          setUsingFallback(false);
        } else {
          console.log('📝 [Community] No data, using fallback');
          setGroups(fallbackGroups);
          setUsingFallback(true);
        }
      } catch (err) {
        console.error('❌ [Community] Error:', err);
        console.log('📝 [Community] Using fallback data due to error');
        setGroups(fallbackGroups);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    // Timeout réduit à 3 secondes
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ [Community] Timeout reached, using fallback data');
        setGroups(fallbackGroups);
        setUsingFallback(true);
        setLoading(false);
      }
    }, 3000);

    fetchGroups().finally(() => {
      clearTimeout(safetyTimeout);
    });

    return () => clearTimeout(safetyTimeout);
  }, []);
  
  return (
    <section className="py-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pattern-grid-lg"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-2">
            <I18nText translationKey="community" ns="sections">Communauté</I18nText>
          </span>
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            <I18nText translationKey="title" ns="community">Hub Communautaire</I18nText>
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            <I18nText translationKey="description" ns="community">Participez aux discussions, partagez vos découvertes et collaborez avec d'autres chercheurs</I18nText>
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32 mb-12">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600">Chargement des groupes communautaires...</span>
          </div>
        ) : (
          <div className="mb-12" data-testid="community-groups">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {groups.map((group, i) => (
                <Card 
                  key={group.id} 
                  className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden symbol-card ${culturalGradient('default')} cursor-pointer`}
                  onClick={() => navigate(`/groups/${group.slug}`)}
                >
                  <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                        <AvatarImage 
                          src={group.banner_image || group.icon} 
                          alt={group.name} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg">
                          {group.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-slate-800 line-clamp-1">
                          {group.name}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center">
                          <Users className="h-3 w-3 mr-1 text-slate-400" /> 
                          {group.members_count} <I18nText translationKey="stats.members" ns="community">membres</I18nText>
                        </p>
                      </div>
                    </div>
                    
                    {group.description && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {group.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between text-sm items-center">
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        {group.discoveries_count} <I18nText translationKey="stats.discoveries" ns="community">découvertes</I18nText>
                      </span>
                      <span className="px-3 py-1.5 text-sm font-medium bg-white rounded-md shadow-sm hover:shadow border border-slate-100 text-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white cursor-pointer transition-all duration-200">
                        <I18nText translationKey="stats.join" ns="community">Voir</I18nText>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {usingFallback && (
              <div className="text-center mt-8">
                <p className="text-sm text-slate-500">
                  Données d'exemple • Les groupes réels seront synchronisés prochainement
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <I18nText translationKey="features.thematicCommunities.title" ns="community">Communautés Thématiques</I18nText>
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="features.thematicCommunities.description" ns="community">Rejoignez des groupes spécialisés selon vos centres d'intérêt culturels et patrimoniaux</I18nText>
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200">
              <Book className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <I18nText translationKey="features.personalSpace.title" ns="community">Espace Personnel</I18nText>
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="features.personalSpace.description" ns="community">Créez votre propre collection de symboles et partagez vos découvertes avec la communauté</I18nText>
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <I18nText translationKey="features.intuitiveNavigation.title" ns="community">Navigation Intuitive</I18nText>
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="features.intuitiveNavigation.description" ns="community">Explorez facilement les symboles grâce à notre interface de recherche avancée et nos filtres intelligents</I18nText>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
