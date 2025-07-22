import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowLeft, Users } from 'lucide-react';
import { useWelcomeGroup } from '@/hooks/useCommunityGroups';

const WelcomeGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: welcomeGroupData, isLoading } = useWelcomeGroup();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Chargement du groupe...</p>
        </div>
      </div>
    );
  }

  if (!welcomeGroupData) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Groupe non trouvé</h1>
          <Button onClick={() => navigate('/community')}>
            Retour au Hub Communautaire
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/community')}
              className="text-stone-600 hover:text-stone-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au Hub
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-stone-800">{welcomeGroupData.name}</h1>
              <p className="text-stone-600 mt-1">{welcomeGroupData.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {welcomeGroupData.totalMembers} membres
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {welcomeGroupData.onlineMembers} en ligne
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Discussion Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Discussion Principale</h2>
              
              {/* Welcome Message */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-purple-800 mb-2">👋 Bienvenue dans notre communauté !</h3>
                <p className="text-purple-700 text-sm">
                  Ce groupe est spécialement conçu pour accueillir les nouveaux membres. 
                  N'hésitez pas à vous présenter, poser vos questions et partager vos premières découvertes !
                </p>
              </div>

              {/* Discussion placeholder */}
              <div className="space-y-4">
                <div className="text-center py-12 text-stone-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Commencez la conversation</h3>
                  <p className="text-sm">Soyez le premier à poster un message dans ce groupe !</p>
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                    Écrire un message
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Group Info */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">À propos du groupe</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Créé le</span>
                  <span className="font-medium">{new Date(welcomeGroupData.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Type</span>
                  <span className="font-medium text-purple-600">Groupe d'accueil</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Accès</span>
                  <span className="font-medium text-green-600">Ouvert à tous</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Liens utiles</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/guide')}
                >
                  📖 Guide du débutant
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/collections')}
                >
                  🔍 Explorer les collections
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/contributions/new')}
                >
                  ➕ Faire une contribution
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGroupPage;