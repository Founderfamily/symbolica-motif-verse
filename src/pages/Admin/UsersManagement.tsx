
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { Search, Users, UserCheck, UserX, Shield, MoreHorizontal } from 'lucide-react';
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
  username: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  isBanned: boolean;
  joinDate: string;
  lastActive: string;
  contributionsCount: number;
  pointsTotal: number;
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'sarah_symbols',
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    isAdmin: true,
    isBanned: false,
    joinDate: '2024-01-15',
    lastActive: '2024-01-20',
    contributionsCount: 45,
    pointsTotal: 1250
  },
  {
    id: '2',
    username: 'cultural_explorer',
    email: 'explorer@example.com',
    fullName: 'David Chen',
    isAdmin: false,
    isBanned: false,
    joinDate: '2024-02-01',
    lastActive: '2024-01-19',
    contributionsCount: 23,
    pointsTotal: 670
  },
  {
    id: '3',
    username: 'pattern_hunter',
    email: 'hunter@example.com',
    fullName: 'Maria Rodriguez',
    isAdmin: false,
    isBanned: true,
    joinDate: '2024-01-20',
    lastActive: '2024-01-18',
    contributionsCount: 8,
    pointsTotal: 120
  }
];

export default function UsersManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned' | 'admin'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && !user.isBanned && !user.isAdmin) ||
                         (filterStatus === 'banned' && user.isBanned) ||
                         (filterStatus === 'admin' && user.isAdmin);
    
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (userId: string, action: 'ban' | 'unban' | 'makeAdmin' | 'removeAdmin') => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'ban':
            return { ...user, isBanned: true };
          case 'unban':
            return { ...user, isBanned: false };
          case 'makeAdmin':
            return { ...user, isAdmin: true };
          case 'removeAdmin':
            return { ...user, isAdmin: false };
          default:
            return user;
        }
      }
      return user;
    }));
  };

  const getStatusBadge = (user: User) => {
    if (user.isBanned) {
      return <Badge variant="destructive">Banni</Badge>;
    }
    if (user.isAdmin) {
      return <Badge variant="default">Admin</Badge>;
    }
    return <Badge variant="outline">Actif</Badge>;
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBanned && !u.isAdmin).length;
  const bannedUsers = users.filter(u => u.isBanned).length;
  const adminUsers = users.filter(u => u.isAdmin).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <I18nText translationKey="admin.users.title">
            Gestion des utilisateurs
          </I18nText>
        </h1>
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
              <UserX className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">
                  <I18nText translationKey="admin.users.bannedUsers">
                    Utilisateurs bannis
                  </I18nText>
                </p>
                <p className="text-2xl font-bold">{bannedUsers}</p>
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
                  placeholder={t('admin.users.search')}
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
                Actifs
              </Button>
              <Button
                variant={filterStatus === 'banned' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('banned')}
                size="sm"
              >
                Bannis
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
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
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground">@{user.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getStatusBadge(user)}</TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{user.contributionsCount}</TableCell>
                  <TableCell>{user.pointsTotal}</TableCell>
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
                        {!user.isBanned ? (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'ban')}
                            className="text-red-600"
                          >
                            <I18nText translationKey="admin.users.banUser">
                              Bannir l'utilisateur
                            </I18nText>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'unban')}
                            className="text-green-600"
                          >
                            <I18nText translationKey="admin.users.unbanUser">
                              Débannir l'utilisateur
                            </I18nText>
                          </DropdownMenuItem>
                        )}
                        {!user.isAdmin ? (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'makeAdmin')}
                          >
                            <I18nText translationKey="admin.users.makeAdmin">
                              Rendre administrateur
                            </I18nText>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'removeAdmin')}
                            className="text-orange-600"
                          >
                            <I18nText translationKey="admin.users.removeAdmin">
                              Retirer les droits admin
                            </I18nText>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
