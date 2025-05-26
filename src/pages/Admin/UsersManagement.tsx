import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { Search, Users, UserCheck, UserX, Shield, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface User {
  id: string;
  username: string | null;
  full_name: string | null;
  email?: string;
  is_admin: boolean;
  created_at: string;
  contributions_count: number;
  verified_uploads: number;
  bio?: string;
  location?: string;
  website?: string;
  favorite_cultures?: string[];
}

export default function UsersManagement() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'admin'>('all');

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          is_admin,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Assurer que tous les champs requis sont présents avec des valeurs par défaut
      const usersWithDefaults = (data || []).map(user => ({
        ...user,
        contributions_count: 0,
        verified_uploads: 0,
        bio: undefined,
        location: undefined,
        website: undefined,
        favorite_cultures: undefined
      }));

      setUsers(usersWithDefaults);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentIsAdmin })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_admin: !currentIsAdmin }
          : user
      ));

      toast({
        title: "Statut mis à jour",
        description: `L'utilisateur a été ${!currentIsAdmin ? 'promu administrateur' : 'retiré des administrateurs'}.`,
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut administrateur.",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.username?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && !user.is_admin) ||
      (filterStatus === 'admin' && user.is_admin);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (user: User) => {
    if (user.is_admin) {
      return <Badge variant="default">Admin</Badge>;
    }
    return <Badge variant="outline">Utilisateur</Badge>;
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.is_admin).length;
  const adminUsers = users.filter(u => u.is_admin).length;

  if (!isAdmin) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
        <p className="text-muted-foreground">
          Vous devez être administrateur pour accéder à cette page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <I18nText translationKey="admin.users.title">
            Gestion des utilisateurs
          </I18nText>
        </h1>
        <Button onClick={loadUsers} variant="outline">
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">
                  <I18nText translationKey="admin.users.totalUsers">
                    Utilisateurs totaux
                  </I18nText>
                </p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">
                  <I18nText translationKey="admin.users.activeUsers">
                    Utilisateurs actifs
                  </I18nText>
                </p>
                <p className="text-2xl font-bold">{activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">
                  <I18nText translationKey="admin.users.admins">
                    Administrateurs
                  </I18nText>
                </p>
                <p className="text-2xl font-bold">{adminUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>
            <I18nText translationKey="admin.users.filters">
              Filtres
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                Tous
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                size="sm"
              >
                Utilisateurs
              </Button>
              <Button
                variant={filterStatus === 'admin' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('admin')}
                size="sm"
              >
                Admins
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>
                    <I18nText translationKey="admin.users.status">
                      Statut
                    </I18nText>
                  </TableHead>
                  <TableHead>
                    <I18nText translationKey="admin.users.joinDate">
                      Date d'inscription
                    </I18nText>
                  </TableHead>
                  <TableHead>Contributions</TableHead>
                  <TableHead>Localization</TableHead>
                  <TableHead>
                    <I18nText translationKey="admin.users.actions">
                      Actions
                    </I18nText>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || 'Nom non défini'}</div>
                        <div className="text-sm text-muted-foreground">
                          @{user.username || 'username non défini'}
                        </div>
                        {user.bio && (
                          <div className="text-xs text-slate-400 max-w-xs truncate mt-1">
                            {user.bio}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.contributions_count} contributions</div>
                        <div className="text-slate-500">{user.verified_uploads} vérifiées</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-500">
                        {user.location || 'Non renseigné'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <I18nText translationKey="admin.users.viewProfile">
                              Voir le profil
                            </I18nText>
                          </DropdownMenuItem>
                          {user.id !== user?.id && (
                            <DropdownMenuItem
                              onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                              className={user.is_admin ? "text-orange-600" : "text-blue-600"}
                            >
                              {user.is_admin ? (
                                <I18nText translationKey="admin.users.removeAdmin">
                                  Retirer les droits admin
                                </I18nText>
                              ) : (
                                <I18nText translationKey="admin.users.makeAdmin">
                                  Rendre administrateur
                                </I18nText>
                              )}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
