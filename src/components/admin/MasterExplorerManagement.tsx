
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Crown, 
  Shield, 
  UserPlus, 
  Search, 
  MapPin, 
  BookOpen,
  Award,
  Users
} from 'lucide-react';
import { useUsersWithRoles, useAssignMasterExplorerRole } from '@/hooks/useRoles';
import { useQuests } from '@/hooks/useQuests';
import { toast } from 'sonner';

export const MasterExplorerManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [credentials, setCredentials] = useState('');
  const [expertiseAreas, setExpertiseAreas] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users, isLoading: usersLoading } = useUsersWithRoles();
  const { data: quests } = useQuests();
  const assignMasterExplorerMutation = useAssignMasterExplorerRole();

  const masterExplorers = users?.filter(user => user.is_master_explorer) || [];
  const availableUsers = users?.filter(user => !user.is_master_explorer && !user.roles.includes('banned')) || [];

  const filteredMasterExplorers = masterExplorers.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignRole = async () => {
    if (!selectedUser) {
      toast.error('Veuillez sélectionner un utilisateur');
      return;
    }

    try {
      await assignMasterExplorerMutation.mutateAsync({
        targetUserId: selectedUser,
        questIds: selectedQuests.length > 0 ? selectedQuests : null
      });

      setIsDialogOpen(false);
      setSelectedUser('');
      setSelectedQuests([]);
      setSpecialization('');
      setBio('');
      setCredentials('');
      setExpertiseAreas('');
    } catch (error) {
      console.error('Error assigning master explorer role:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'master_explorer':
        return <Badge variant="default" className="bg-purple-600"><Crown className="w-3 h-3 mr-1" />Maître Explorateur</Badge>;
      default:
        return <Badge variant="outline">Utilisateur</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Maîtres Explorateurs</h2>
          <p className="text-slate-600 mt-1">
            Gérez les experts qui guident et enrichissent les recherches collaboratives
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Nommer un Maître Explorateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                Nommer un nouveau Maître Explorateur
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="user-select">Utilisateur</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.username} ({user.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="specialization">Spécialisation</Label>
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Domaine d'expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="templar_history">Histoire des Templiers</SelectItem>
                    <SelectItem value="medieval_archaeology">Archéologie Médiévale</SelectItem>
                    <SelectItem value="ancient_civilizations">Civilisations Antiques</SelectItem>
                    <SelectItem value="religious_history">Histoire Religieuse</SelectItem>
                    <SelectItem value="historical_cartography">Cartographie Historique</SelectItem>
                    <SelectItem value="ancient_symbols">Symboles Anciens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expertise-areas">Domaines d'expertise (séparés par des virgules)</Label>
                <Input
                  id="expertise-areas"
                  value={expertiseAreas}
                  onChange={(e) => setExpertiseAreas(e.target.value)}
                  placeholder="Ex: Archéologie, Histoire médiévale, Paléographie"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="credentials">Diplômes et certifications</Label>
                <Input
                  id="credentials"
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  placeholder="Ex: Doctorat en Histoire Médiévale, Université de Paris"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Décrivez l'expertise et l'expérience de ce Maître Explorateur..."
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Quêtes assignées (optionnel)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {quests?.map((quest) => (
                    <label key={quest.id} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedQuests.includes(quest.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQuests([...selectedQuests, quest.id]);
                          } else {
                            setSelectedQuests(selectedQuests.filter(id => id !== quest.id));
                          }
                        }}
                      />
                      <span>{quest.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleAssignRole}
                disabled={assignMasterExplorerMutation.isPending || !selectedUser}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {assignMasterExplorerMutation.isPending ? 'Attribution...' : 'Nommer Maître Explorateur'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Maîtres Explorateurs</p>
                <p className="text-2xl font-bold">{masterExplorers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Quêtes Supervisées</p>
                <p className="text-2xl font-bold">{quests?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Candidats Disponibles</p>
                <p className="text-2xl font-bold">{availableUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Maîtres Explorateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, spécialisation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : filteredMasterExplorers.length === 0 ? (
            <div className="text-center py-8">
              <Crown className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucun Maître Explorateur trouvé</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Explorateur</TableHead>
                  <TableHead>Spécialisation</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Rôles</TableHead>
                  <TableHead>Depuis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMasterExplorers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Crown className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.full_name || 'Nom non défini'}</div>
                          <div className="text-sm text-muted-foreground">
                            @{user.username || 'username non défini'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.specialization || 'Non spécifié'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.expertise_areas?.slice(0, 2).map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {user.expertise_areas && user.expertise_areas.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.expertise_areas.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.roles.map((role) => getRoleBadge(role))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at || '').toLocaleDateString('fr-FR')}
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
};
