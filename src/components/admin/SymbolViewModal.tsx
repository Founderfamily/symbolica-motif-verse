import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaginatedSymbol } from '@/hooks/useAdminSymbols';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Image, CheckCircle, Calendar, FileText } from 'lucide-react';

interface SymbolViewModalProps {
  symbol: PaginatedSymbol | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (symbol: PaginatedSymbol) => void;
}

export function SymbolViewModal({ symbol, isOpen, onClose, onEdit }: SymbolViewModalProps) {
  if (!symbol) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails du symbole</span>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(symbol)}
                className="ml-2"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{symbol.name}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  <FileText className="h-3 w-3 mr-1" />
                  Culture: {symbol.culture || 'Non définie'}
                </Badge>
                <Badge variant="secondary">
                  <Calendar className="h-3 w-3 mr-1" />
                  Période: {symbol.period || 'Non définie'}
                </Badge>
                <Badge variant={symbol.image_count > 0 ? 'default' : 'secondary'}>
                  <Image className="h-3 w-3 mr-1" />
                  {symbol.image_count} image(s)
                </Badge>
                <Badge variant={symbol.verification_count > 0 ? 'default' : 'secondary'}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {symbol.verification_count} vérification(s)
                </Badge>
              </div>
            </div>

            {/* Description */}
            {symbol.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{symbol.description}</p>
                </div>
              </div>
            )}

            {/* Métadonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Informations</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-xs">{symbol.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créé le:</span>
                    <span>{format(new Date(symbol.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modifié le:</span>
                    <span>{format(new Date(symbol.updated_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Statistiques</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Images:</span>
                    <Badge variant={symbol.image_count > 0 ? 'default' : 'secondary'}>
                      {symbol.image_count}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vérifications:</span>
                    <Badge variant={symbol.verification_count > 0 ? 'default' : 'secondary'}>
                      {symbol.verification_count}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut:</span>
                    <Badge variant={symbol.verification_count > 0 ? 'default' : 'secondary'}>
                      {symbol.verification_count > 0 ? 'Vérifié' : 'Non vérifié'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}