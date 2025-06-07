

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { Search, Users, UserCheck, UserX, Shield, MoreHorizontal, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
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
import { userManagementService, UserFilters } from '@/services/admin/userManagementService';
import { adminStatsService } from '@/services/admin/statsService';
import { UserProfile } from '@/types/auth';

export default function UsersManagement() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'user' | 'admin' | 'banned'>('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    bannedUsers: 0
  });

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadStats();
    }
  }, [isAdmin, searchQuery, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await userManagementService.getUsers({
        search: searchQuery || undefined,
        roleFilter: filterStatus,
        limit: 50,
        offset: 0
      });
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await adminStatsService.getUserStats();
      setStats({
        totalUsers: Number(statsData.total_users),
        activeUsers: Number(statsData.active_users_30d),
        adminUsers: Number(statsData.admin_users),
        bannedUsers: Number(statsData.banned_users)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleToggleBan = async (userId: string, currentIsBanned: boolean) => {
    try {
      await userManagementService.toggleUserBan(userId, !currentIsBanned);
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_banned: !currentIsBanned }
          : user
      ));

      toast.success(`L'utilisateur a été ${!currentIsBanned ? 'banni' : 'débanni'}.`);
      
      // Recharger les stats
      loadStats();
    } catch (error) {
      console.error('Error toggling ban status:', error);
      toast.error("Impossible de modifier le statut de bannissement.");
    }
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    try {
      await userManagementService.toggleUserAdmin(userId, !currentIsAdmin);
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_admin: !currentIsAdmin }
          : user
      ));

      toast.success(`L'utilisateur a été ${!currentIsAdmin ? 'promu administrateur' : 'retiré des administrateurs'}.`);
      
      // Recharger les stats
      loadStats();
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error("Impossible de modifier le statut administrateur.");
    }
  };

  const getStatusBadge = (user: UserProfile) => {
    if (user.is_banned) {
      return <Badge variant="destructive">Banni</Badge>;
    }
    if (user.is_admin) {
      return <Badge variant="default">Admin</Badge>;
    }
    return <Badge variant="outline">Utilisateur</Badge>;
  };

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <I18nText translationKey="admin.users.title">
              Gestion des utilisateurs
            </I18nText>
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>
        <Button onClick={loadUsers} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
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
                    Utilisateurs actifs (30j)
                  </I18nText>
                </p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
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
                <p className="text-2xl font-bold">{stats.adminUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserX className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Utilisateurs bannis
                </p>
                <p className="text-2xl font-bold">{stats.bannedUsers}</p>
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
                variant={filterStatus === 'user' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('user')}
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
              <Button
                variant={filterStatus === 'banned' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('banned')}
                size="sm"
              >
                Bannis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : users.length === 0 ? (
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
                  <TableHead>Points</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead>
                    <I18nText translationKey="admin.users.actions">
                      Actions
                    </I18nText>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{userData.full_name || 'Nom non défini'}</div>
                        <div className="text-sm text-muted-foreground">
                          @{userData.username || 'username non défini'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(userData)}</TableCell>
                    <TableCell>{userData.created_at ? new Date(userData.created_at).toLocaleDateString('fr-FR') : 'Non défini'}</TableCell>
                    <TableCell>{userData.contributions_count || 0}</TableCell>
                    <TableCell>{userData.total_points || 0}</TableCell>
                    <TableCell>
                      {userData.last_activity 
                        ? new Date(userData.last_activity).toLocaleDateString('fr-FR')
                        : 'Jamais'
                      }
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
                          {userData.id !== user?.id && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleToggleAdmin(userData.id, userData.is_admin || false)}
                                className={userData.is_admin ? "text-orange-600" : "text-blue-600"}
                              >
                                {userData.is_admin ? (
                                  <I18nText translationKey="admin.users.removeAdmin">
                                    Retirer les droits admin
                                  </I18nText>
                                ) : (
                                  <I18nText translationKey="admin.users.makeAdmin">
                                    Rendre administrateur
                                  </I18nText>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleBan(userData.id, userData.is_banned || false)}
                                className={userData.is_banned ? "text-green-600" : "text-red-600"}
                              >
                                {userData.is_banned ? 'Débannir' : 'Bannir'}
                              </DropdownMenuItem>
                            </>
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

