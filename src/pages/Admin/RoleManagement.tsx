
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Shield, Users } from 'lucide-react';
import { MasterExplorerManagement } from '@/components/admin/MasterExplorerManagement';
import UsersManagement from './UsersManagement';

export default function RoleManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Rôles</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les utilisateurs, admins et Maîtres Explorateurs
          </p>
        </div>
      </div>

      <Tabs defaultValue="master-explorers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="master-explorers" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Maîtres Explorateurs
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Administrateurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="master-explorers">
          <MasterExplorerManagement />
        </TabsContent>

        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Gestion des Administrateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Interface de gestion des administrateurs - À implémenter
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
