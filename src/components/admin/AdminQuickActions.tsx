
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, AlertTriangle, Bookmark, Settings, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminStats } from '@/services/admin/statsService';

interface AdminQuickActionsProps {
  stats: AdminStats | null;
  loading: boolean;
}

const QuickActionCard = ({ 
  to, 
  icon: Icon, 
  title, 
  description, 
  loading, 
  color,
  badge 
}: { 
  to: string; 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  loading: boolean;
  color: string;
  badge?: { text: string; color: string };
}) => (
  <Link to={to}>
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group relative">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${color} rounded-lg group-hover:bg-opacity-80 transition-colors`}>
            <Icon className={`h-5 w-5 ${color.includes('blue') ? 'text-blue-600' : 
              color.includes('amber') ? 'text-amber-600' : 
              color.includes('red') ? 'text-red-600' : 
              color.includes('purple') ? 'text-purple-600' : 
              color.includes('green') ? 'text-green-600' : 
              color.includes('orange') ? 'text-orange-600' : 'text-green-600'}`} />
          </div>
          <div className="flex-1">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <div className="h-4 w-16 bg-slate-200 animate-pulse rounded"></div>
              ) : (
                description
              )}
            </p>
          </div>
          {badge && (
            <span className={`px-2 py-1 text-xs rounded-full text-white ${badge.color} absolute -top-1 -right-1`}>
              {badge.text}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default function AdminQuickActions({ stats, loading }: AdminQuickActionsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <QuickActionCard
        to="/admin/users"
        icon={Users}
        title="Utilisateurs"
        description={`${stats?.totalUsers || 0} utilisateurs`}
        loading={loading}
        color="bg-blue-100"
      />

      <QuickActionCard
        to="/admin/contributions/moderation"
        icon={Clock}
        title="Modération"
        description={`${stats?.pendingContributions || 0} en attente`}
        loading={loading}
        color="bg-amber-100"
        badge={stats?.pendingContributions ? { text: stats.pendingContributions.toString(), color: "bg-amber-500" } : undefined}
      />

      <QuickActionCard
        to="/admin/contributions/moderation"
        icon={AlertTriangle}
        title="Signalements"
        description="Gérer les signalements"
        loading={loading}
        color="bg-red-100"
      />

      <QuickActionCard
        to="/admin/symbols"
        icon={Bookmark}
        title="Symboles"
        description={`${stats?.totalSymbols || 0} symboles`}
        loading={loading}
        color="bg-purple-100"
      />

      <QuickActionCard
        to="/admin/settings"
        icon={Settings}
        title="Paramètres"
        description="Configuration système"
        loading={loading}
        color="bg-green-100"
      />

      <QuickActionCard
        to="/admin/master-explorer"
        icon={Crown}
        title="Master Explorer"
        description="Gestion des quêtes"
        loading={loading}
        color="bg-orange-100"
      />
    </div>
  );
}
