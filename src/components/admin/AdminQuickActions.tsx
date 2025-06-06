
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { I18nText } from '@/components/ui/i18n-text';
import { Users, CheckCircle, Clock, Settings } from 'lucide-react';
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
  color 
}: { 
  to: string; 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  loading: boolean;
  color: string;
}) => (
  <Link to={to}>
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${color} rounded-lg group-hover:bg-opacity-80 transition-colors`}>
            <Icon className={`h-5 w-5 ${color.includes('blue') ? 'text-blue-600' : 
              color.includes('amber') ? 'text-amber-600' : 
              color.includes('purple') ? 'text-purple-600' : 'text-green-600'}`} />
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <div className="h-4 w-16 bg-slate-200 animate-pulse rounded"></div>
              ) : (
                description
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default function AdminQuickActions({ stats, loading }: AdminQuickActionsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <QuickActionCard
        to="/admin/users"
        icon={Users}
        title="Utilisateurs"
        description={`${stats?.totalUsers || 0} utilisateurs`}
        loading={loading}
        color="bg-blue-100"
      />

      <QuickActionCard
        to="/admin/contributions"
        icon={Clock}
        title="Contributions"
        description={`${stats?.pendingContributions || 0} en attente`}
        loading={loading}
        color="bg-amber-100"
      />

      <QuickActionCard
        to="/admin/symbols"
        icon={CheckCircle}
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
    </div>
  );
}
