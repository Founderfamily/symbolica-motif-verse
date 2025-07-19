import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PaginatedSymbol } from '@/hooks/useAdminSymbols';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Image, CheckCircle, Eye } from 'lucide-react';

interface SymbolViewModalProps {
  symbol: PaginatedSymbol | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SymbolViewModal({ symbol, isOpen, onClose }: SymbolViewModalProps) {
  if (!symbol) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Détails du symbole
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{symbol.name}</h3>
              {symbol.description && (
                <p className="text-muted-foreground">{symbol.description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                Culture: {symbol.culture || 'Non définie'}
              </Badge>
              <Badge variant="secondary">
                Période: {symbol.period || 'Non définie'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Image className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Images</p>
                <p className="text-2xl font-bold">{symbol.image_count}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Vérifications</p>
                <p className="text-2xl font-bold">{symbol.verification_count}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations techniques */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Informations techniques
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <p className="font-mono text-xs break-all">{symbol.id}</p>
              </div>
              
              <div>
                <span className="text-muted-foreground">Créé le:</span>
                <p>{format(new Date(symbol.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
              </div>
              
              <div>
                <span className="text-muted-foreground">Modifié le:</span>
                <p>{format(new Date(symbol.updated_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
              </div>
              
              <div>
                <span className="text-muted-foreground">Statut:</span>
                <Badge variant={symbol.verification_count > 0 ? 'default' : 'secondary'}>
                  {symbol.verification_count > 0 ? 'Vérifié' : 'Non vérifié'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}