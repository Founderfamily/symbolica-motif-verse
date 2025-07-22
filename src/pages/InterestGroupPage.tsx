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
              <div className="text-center text-stone-500 py-12">
                <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucune discussion</h3>
                <p>Les discussions apparaîtront ici une fois créées.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discoveries" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="text-center text-stone-500 py-12">
                <Share className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucune découverte</h3>
                <p>Les découvertes partagées apparaîtront ici.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="symbols" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="text-center text-stone-500 py-12">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucun symbole</h3>
                <p>Les symboles liés à ce groupe apparaîtront ici.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="text-center text-stone-500 py-12">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Membres du groupe</h3>
                <p>{group.members_count} membres dans ce groupe.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InterestGroupPage;