import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Shield, Search, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  full_name: string;
  created_at: string;
  roles?: Array<{
    role: string;
    assigned_at: string;
  }>;
}

const ValidatorManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [validators, setValidators] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadValidators();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, created_at')
        .ilike('username', `%${searchQuery}%`)
        .limit(20);

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
    }
  };

  const loadValidators = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          assigned_at
        `)
        .eq('role', 'symbol_validator' as any);

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Get user profiles separately
        const userIds = data.map(item => item.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const validatorsData = data.map(item => {
          const profile = profiles?.find(p => p.id === item.user_id);
          return {
            id: item.user_id,
            username: profile?.username || 'Unknown',
            full_name: profile?.full_name || 'Unknown',
            created_at: item.assigned_at,
            roles: [{ role: item.role, assigned_at: item.assigned_at }]
          };
        });

        setValidators(validatorsData);
      } else {
        setValidators([]);
      }
    } catch (error: any) {
      console.error('Error loading validators:', error);
    }
  };

  const assignValidatorRole = async (userId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Insert the role directly
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'symbol_validator' as any,
          assigned_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Validateur assigné",
        description: "L'utilisateur a été désigné comme validateur de symboles"
      });

      loadValidators();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeValidatorRole = async (userId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'symbol_validator' as any);

      if (error) throw error;

      toast({
        title: "Validateur retiré",
        description: "Le rôle de validateur a été retiré"
      });

      loadValidators();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = () => {
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gestion des Validateurs
          </CardTitle>
          <CardDescription>
            Gérez les utilisateurs ayant le rôle de validateur de symboles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Validateurs actuels */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Validateurs actuels ({validators.length})
            </h3>
            <div className="space-y-2">
              {validators.length === 0 ? (
                <p className="text-muted-foreground">Aucun validateur assigné</p>
              ) : (
                validators.map((validator) => (
                  <div key={validator.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{validator.full_name || validator.username}</div>
                      <div className="text-sm text-muted-foreground">@{validator.username}</div>
                      <div className="text-xs text-muted-foreground">
                        Assigné le {new Date(validator.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <Shield className="w-3 h-3 mr-1" />
                        Validateur
                      </Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeValidatorRole(validator.id)}
                        disabled={loading}
                      >
                        Retirer
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recherche et assignation */}
          <div>
            <h3 className="text-lg font-medium mb-4">Assigner un nouveau validateur</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="search">Rechercher un utilisateur</Label>
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nom d'utilisateur..."
                    onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                  />
                </div>
                <Button onClick={searchUsers} className="mt-6">
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {users
                  .filter(user => !validators.some(v => v.id === user.id))
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{user.full_name || user.username}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                        <div className="text-xs text-muted-foreground">
                          Inscrit le {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        onClick={() => assignValidatorRole(user.id)}
                        disabled={loading}
                        size="sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assigner validateur
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidatorManagement;