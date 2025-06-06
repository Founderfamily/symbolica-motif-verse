
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { I18nText } from '@/components/ui/i18n-text';
import { Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile } from '@/types/auth';

interface AdminWelcomeCardProps {
  profile: UserProfile | null;
}

export default function AdminWelcomeCard({ profile }: AdminWelcomeCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Bienvenue, {profile?.full_name || profile?.username || 'Administrateur'}
            </h2>
            <p className="text-slate-500 mt-1">
              <I18nText translationKey="admin.dashboard.welcomeMessage">
                Gérez et supervisez la plateforme Symbolica
              </I18nText>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/users">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                <I18nText translationKey="admin.actions.manageUsers">
                  Gérer les utilisateurs
                </I18nText>
              </Button>
            </Link>
            <Link to="/admin/contributions">
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                <I18nText translationKey="admin.actions.moderateContributions">
                  Modérer les contributions
                </I18nText>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
