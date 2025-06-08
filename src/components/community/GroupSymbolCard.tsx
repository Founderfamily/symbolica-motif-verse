
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Trash2 } from 'lucide-react';
import { GroupSymbol } from '@/types/interest-groups';
import { useAuth } from '@/hooks/useAuth';

interface GroupSymbolCardProps {
  groupSymbol: GroupSymbol;
  onView: (symbolId: string) => void;
  onRemove: (groupSymbolId: string) => void;
}

const GroupSymbolCard: React.FC<GroupSymbolCardProps> = ({ 
  groupSymbol, 
  onView, 
  onRemove 
}) => {
  const auth = useAuth();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-lg text-slate-900">
                  {groupSymbol.symbol?.name || 'Symbole inconnu'}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary">
                    {groupSymbol.symbol?.culture}
                  </Badge>
                  <Badge variant="outline">
                    {groupSymbol.symbol?.period}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(groupSymbol.symbol_id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {auth?.user?.id === groupSymbol.added_by && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(groupSymbol.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {groupSymbol.symbol?.description && (
              <p className="text-slate-600 mb-3">
                {groupSymbol.symbol.description}
              </p>
            )}

            {groupSymbol.notes && (
              <div className="bg-slate-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-slate-700">{groupSymbol.notes}</p>
              </div>
            )}

            {/* Additional Symbol Info */}
            {(groupSymbol.symbol?.medium || groupSymbol.symbol?.technique || groupSymbol.symbol?.function) && (
              <div className="flex flex-wrap gap-1 mb-3">
                {groupSymbol.symbol?.medium?.map((m, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {m}
                  </Badge>
                ))}
                {groupSymbol.symbol?.technique?.map((t, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {t}
                  </Badge>
                ))}
                {groupSymbol.symbol?.function?.map((f, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {f}
                  </Badge>
                ))}
              </div>
            )}

            {/* Added by info */}
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Avatar className="h-6 w-6">
                <AvatarImage 
                  src={`https://avatar.vercel.sh/${groupSymbol.added_by_profile?.username || 'user'}.png`} 
                  alt={groupSymbol.added_by_profile?.username || 'User'} 
                />
                <AvatarFallback>
                  {groupSymbol.added_by_profile?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span>
                Ajouté par {groupSymbol.added_by_profile?.full_name || groupSymbol.added_by_profile?.username || 'Utilisateur inconnu'}
              </span>
              <span>•</span>
              <span>{new Date(groupSymbol.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupSymbolCard;
