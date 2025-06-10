
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { masterExplorerService } from '@/services/masterExplorerService';
import { 
  Search, 
  BookOpen, 
  Users, 
  Trophy, 
  Map, 
  Compass,
  Crown
} from 'lucide-react';

const NavigationItems = () => {
  const { user } = useAuth();
  const [isMasterExplorer, setIsMasterExplorer] = useState(false);

  useEffect(() => {
    if (user?.id) {
      masterExplorerService.isMasterExplorer(user.id).then(setIsMasterExplorer);
    }
  }, [user]);

  const navigationItems = [
    { 
      name: 'Découvrir', 
      href: '/symbols', 
      icon: Search,
      description: 'Explorer les symboles'
    },
    { 
      name: 'Collections', 
      href: '/collections', 
      icon: BookOpen,
      description: 'Parcourir les collections'
    },
    { 
      name: 'Recherches', 
      href: '/quests', 
      icon: Compass,
      description: 'Chasses aux trésors collaboratives'
    },
    { 
      name: 'Communauté', 
      href: '/community', 
      icon: Users,
      description: 'Rejoindre la communauté'
    },
    { 
      name: 'Tendances', 
      href: '/trending', 
      icon: Trophy,
      description: 'Contenu populaire'
    },
    { 
      name: 'Carte', 
      href: '/map', 
      icon: Map,
      description: 'Explorer géographiquement'
    }
  ];

  // Ajouter le lien Master Explorer si l'utilisateur est qualifié
  if (isMasterExplorer) {
    navigationItems.push({
      name: 'Master Explorer',
      href: '/master-explorer',
      icon: Crown,
      description: 'Dashboard expert'
    });
  }

  return (
    <div className="hidden lg:flex lg:gap-x-8">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center gap-2 text-slate-600 hover:text-amber-600 font-medium transition-colors group"
            title={item.description}
          >
            <Icon className={`w-4 h-4 transition-colors ${
              item.name === 'Master Explorer' ? 'text-amber-600' : 'group-hover:text-amber-600'
            }`} />
            <span className={item.name === 'Master Explorer' ? 'text-amber-600 font-semibold' : ''}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavigationItems;
