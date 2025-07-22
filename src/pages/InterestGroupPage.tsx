import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Share, MessageCircle, Hash, Eye, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useGroupBySlug } from '@/hooks/useInterestGroups';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const InterestGroupPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  
  const { data: group, isLoading, error } = useGroupBySlug(slug!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Chargement du groupe...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Groupe introuvable</h1>
          <p className="text-stone-600 mb-4">Ce groupe n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/community')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la Communauté
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/community')}
            className="mb-4 text-stone-600 hover:text-stone-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la Communauté
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {group.name.slice(0, 2).toUpperCase()}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-stone-800">{group.name}</h1>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                </div>
                <p className="text-stone-600 mb-2">{group.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {group.members_count} Membres de la Communauté
                  </span>
                  <span className="flex items-center gap-1">
                    <Share className="w-4 h-4" />
                    {group.discoveries_count} Découvertes
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm">
                <Users className="w-4 h-4 mr-2" />
                Inviter des utilisateurs
              </Button>
              <Button variant="outline" size="sm">
                Quitter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none px-4 py-3"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="discussion" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none px-4 py-3"
              >
                <Hash className="w-4 h-4 mr-2" />
                Discussion
              </TabsTrigger>
              <TabsTrigger 
                value="discoveries" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none px-4 py-3"
              >
                <Share className="w-4 h-4 mr-2" />
                découvertes
              </TabsTrigger>
              <TabsTrigger 
                value="symbols" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none px-4 py-3"
              >
                <Eye className="w-4 h-4 mr-2" />
                Symboles
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none px-4 py-3"
              >
                <Users className="w-4 h-4 mr-2" />
                Membres
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="chat" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200">
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Chat du groupe 
                      <span className="text-stone-500 font-normal">- {group.name}</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    En ligne
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-6 min-h-[400px]">
                <div className="text-center text-stone-500 mb-8">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Début de la conversation dans {group.name}</p>
                </div>

                {/* Sample message */}
                <div className="flex items-end gap-3 mb-4 justify-end">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-stone-500">17:52</span>
                      <span className="font-semibold text-stone-800">Abdou</span>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-md inline-block max-w-xs">
                      bonjour
                    </div>
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/lovable-uploads/5f02d740-1670-402d-8428-aad900265280.png" alt="Abdou" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                      A
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Message input */}
                <div className="mt-8 pt-4 border-t border-stone-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Écrire un message..."
                      className="flex-1 px-4 py-2 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Button size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700">
                      Envoyer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discussion" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-stone-800">Discussions du groupe</h3>
                <Button size="sm" variant="outline">
                  <Hash className="w-4 h-4 mr-2" />
                  Nouvelle discussion
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-stone-800 mb-1">Art tribal et masques traditionnels</h4>
                      <p className="text-sm text-stone-600 mb-2">Discussion sur les différents styles d'art tribal africain et leur signification culturelle...</p>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span>12 réponses</span>
                        <span>Dernière activité il y a 2h</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-stone-800 mb-1">Adinkra et leurs significations</h4>
                      <p className="text-sm text-stone-600 mb-2">Échangeons sur les symboles Adinkra du Ghana et leur importance spirituelle...</p>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span>8 réponses</span>
                        <span>Dernière activité il y a 1 jour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discoveries" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-stone-800">Découvertes partagées</h3>
                <Button size="sm" variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Partager une découverte
                </Button>
              </div>
              
              <div className="grid gap-4">
                <div className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Share className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-stone-800 mb-1">Masques Dan de Côte d'Ivoire</h4>
                      <p className="text-sm text-stone-600 mb-2">Découverte fascinante sur les masques traditionnels Dan et leur rôle dans les cérémonies...</p>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span>Partagé par Marie</span>
                        <span>il y a 3 jours</span>
                        <span>5 commentaires</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Share className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-stone-800 mb-1">Textile Bogolan du Mali</h4>
                      <p className="text-sm text-stone-600 mb-2">Technique ancestrale de teinture du tissu avec des éléments naturels...</p>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span>Partagé par Abdou</span>
                        <span>il y a 1 semaine</span>
                        <span>8 commentaires</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="symbols" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-stone-800">Symboles de l'Afrique Traditionnelle</h3>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Ajouter un symbole
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl font-bold">Ψ</span>
                    </div>
                    <h4 className="font-medium text-stone-800 mb-1">Adinkra - Gye Nyame</h4>
                    <p className="text-sm text-stone-600">Symbole de la suprématie de Dieu</p>
                  </div>
                </div>
                
                <div className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl font-bold">⚆</span>
                    </div>
                    <h4 className="font-medium text-stone-800 mb-1">Sankofa</h4>
                    <p className="text-sm text-stone-600">Retourner aux sources</p>
                  </div>
                </div>
                
                <div className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl font-bold">⊕</span>
                    </div>
                    <h4 className="font-medium text-stone-800 mb-1">Dwennimmen</h4>
                    <p className="text-sm text-stone-600">Force et humilité</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-stone-800">Membres du groupe ({group.members_count})</h3>
                <Button size="sm" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Inviter des membres
                </Button>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/lovable-uploads/5f02d740-1670-402d-8428-aad900265280.png" alt="Abdou" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-800">Abdou</h4>
                    <p className="text-sm text-stone-500">Administrateur • En ligne</p>
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">Admin</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white">M</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-800">Marie</h4>
                    <p className="text-sm text-stone-500">Membre • Hors ligne</p>
                  </div>
                  <Badge variant="outline">Membre</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">K</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-800">Kofi</h4>
                    <p className="text-sm text-stone-500">Membre • En ligne</p>
                  </div>
                  <Badge variant="outline">Membre</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-800">Ama</h4>
                    <p className="text-sm text-stone-500">Membre • Hors ligne</p>
                  </div>
                  <Badge variant="outline">Membre</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InterestGroupPage;