
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Share2, Eye, Folder, FileText, Check, ChevronsUpDown, AlertCircle, CheckCircle } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { EntityPreview } from '@/types/interest-groups';
import { shareDiscovery } from '@/services/communityService';
import { validateAndPreviewEntity, searchEntities } from '@/services/discoveryService';
import { toast } from 'sonner';

interface EnhancedShareDiscoveryDialogProps {
  groupId: string;
  children: React.ReactNode;
  onDiscoveryShared?: () => void;
}

const EnhancedShareDiscoveryDialog: React.FC<EnhancedShareDiscoveryDialogProps> = ({ 
  groupId, 
  children, 
  onDiscoveryShared 
}) => {
  const [open, setOpen] = useState(false);
  const [entityType, setEntityType] = useState<'symbol' | 'collection' | 'contribution'>('symbol');
  const [entityId, setEntityId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [entityPreview, setEntityPreview] = useState<EntityPreview | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [searchResults, setSearchResults] = useState<EntityPreview[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useAuth();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, entityType]);

  useEffect(() => {
    if (entityId && entityId !== searchQuery) {
      validateEntity(entityId);
    } else {
      setEntityPreview(null);
      setValidationStatus('idle');
    }
  }, [entityId, entityType]);

  const handleSearch = async (query: string) => {
    try {
      const results = await searchEntities(query, entityType);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching entities:', error);
    }
  };

  const validateEntity = async (id: string) => {
    setValidating(true);
    try {
      const preview = await validateAndPreviewEntity(entityType, id);
      setEntityPreview(preview);
      setValidationStatus(preview ? 'valid' : 'invalid');
      
      if (preview && !title) {
        setTitle(preview.name);
      }
    } catch (error) {
      console.error('Error validating entity:', error);
      setValidationStatus('invalid');
      setEntityPreview(null);
    } finally {
      setValidating(false);
    }
  };

  const handleEntitySelect = (entity: EntityPreview) => {
    setEntityId(entity.id);
    setSearchQuery(entity.name);
    setTitle(entity.name);
    if (entity.description) {
      setDescription(entity.description);
    }
    setSearchOpen(false);
  };

  const handleShare = async () => {
    if (!auth?.user) return;
    if (!entityId.trim() || !title.trim()) {
       toast.error('Veuillez renseigner tous les champs obligatoires');
       return;
     }
     if (validationStatus !== 'valid') {
       toast.error('Veuillez sélectionner une entité valide');
       return;
    }

    setLoading(true);
    try {
       await shareDiscovery(groupId, auth.user.id, entityType, entityId, title, description);
       toast.success('Découverte partagée avec succès !');
       setOpen(false);
       resetForm();
       if (onDiscoveryShared) {
         onDiscoveryShared();
       }
     } catch (error) {
       console.error('Error sharing discovery:', error);
       toast.error('Échec du partage de la découverte');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEntityId('');
    setTitle('');
    setDescription('');
    setSearchQuery('');
    setEntityPreview(null);
    setValidationStatus('idle');
    setSearchResults([]);
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case 'symbol':
        return <Eye className="h-4 w-4" />;
      case 'collection':
        return <Folder className="h-4 w-4" />;
      case 'contribution':
        return <FileText className="h-4 w-4" />;
    }
  };

  const getValidationIcon = () => {
    if (validating) {
      return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
    }
    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            <I18nText translationKey="community.shareDiscovery">Share Discovery</I18nText>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Entity Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <I18nText translationKey="community.discoveryType">Discovery Type</I18nText>
            </label>
            <Select value={entityType} onValueChange={(value: 'symbol' | 'collection' | 'contribution') => {
              setEntityType(value);
              resetForm();
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="symbol">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Symbol
                  </div>
                </SelectItem>
                <SelectItem value="collection">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    Collection
                  </div>
                </SelectItem>
                <SelectItem value="contribution">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Contribution
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Entity Search/Select */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              {getEntityIcon()}
              <I18nText translationKey="community.entityId">Select Item</I18nText>
            </label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={searchOpen}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    {validationStatus === 'valid' && entityPreview ? (
                      <>
                        <Badge variant="secondary" className="text-xs">
                          {entityPreview.type}
                        </Badge>
                        <span className="truncate">{entityPreview.name}</span>
                      </>
                    ) : searchQuery ? (
                      <span className="truncate">{searchQuery}</span>
                    ) : (
                      <span className="text-slate-500">
                        <I18nText translationKey="community.searchOrEnterId">Search or enter ID...</I18nText>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getValidationIcon()}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Rechercher ou saisir l'ID..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                     <CommandEmpty>
                       <I18nText translationKey="community.noResultsFound">
                         {searchQuery.length >= 2 ? 'No results found.' : 'Type to search...'}
                       </I18nText>
                     </CommandEmpty>
                    {searchResults.length > 0 && (
                      <CommandGroup>
                        {searchResults.map((entity) => (
                          <CommandItem
                            key={entity.id}
                            value={entity.id}
                            onSelect={() => handleEntitySelect(entity)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Badge variant="outline" className="text-xs">
                                {entity.type}
                              </Badge>
                              <div className="flex-1">
                                <div className="font-medium">{entity.name}</div>
                                {entity.description && (
                                  <div className="text-xs text-slate-500 truncate">
                                    {entity.description}
                                  </div>
                                )}
                              </div>
                              <Check className={`h-4 w-4 ${entityId === entity.id ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {searchQuery.length >= 2 && (
                      <CommandGroup>
                        <CommandItem
                          value={searchQuery}
                          onSelect={() => {
                            setEntityId(searchQuery);
                            setSearchOpen(false);
                          }}
                        >
                           <div className="flex items-center gap-2">
                             <div className="font-medium">
                               <I18nText translationKey="community.useId">Use ID:</I18nText> {searchQuery}
                             </div>
                           </div>
                        </CommandItem>
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {/* Manual ID Input */}
            <div className="mt-2">
              <Input
                placeholder="Ou saisir l'ID directement..."
                value={entityId}
                onChange={(e) => {
                  setEntityId(e.target.value);
                  setSearchQuery(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Entity Preview */}
          {entityPreview && validationStatus === 'valid' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="text-xs">
                  {entityPreview.type}
                </Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">{entityPreview.name}</h4>
                  {entityPreview.description && (
                    <p className="text-sm text-green-700 mt-1">{entityPreview.description}</p>
                  )}
                  {(entityPreview.culture || entityPreview.period) && (
                    <div className="flex gap-2 mt-2">
                      {entityPreview.culture && (
                        <Badge variant="outline" className="text-xs">
                          {entityPreview.culture}
                        </Badge>
                      )}
                      {entityPreview.period && (
                        <Badge variant="outline" className="text-xs">
                          {entityPreview.period}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Validation Error */}
          {validationStatus === 'invalid' && entityId && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
               <div className="flex items-center gap-2">
                 <AlertCircle className="h-4 w-4" />
                 <I18nText translationKey="community.entityNotFound">Entity not found. Please check the ID and try again.</I18nText>
               </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <I18nText translationKey="community.discoveryTitle">Title</I18nText> *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Donnez un titre descriptif à votre découverte..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <I18nText translationKey="community.discoveryDescription">Description (Optional)</I18nText>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez pourquoi cette découverte est intéressante..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              <I18nText translationKey="common.cancel">Cancel</I18nText>
            </Button>
            <Button 
              onClick={handleShare} 
              disabled={loading || !entityId.trim() || !title.trim() || validationStatus !== 'valid'} 
              className="flex-1"
            >
              {loading ? (
                <I18nText translationKey="common.sharing">Sharing...</I18nText>
              ) : (
                <I18nText translationKey="community.shareDiscovery">Share Discovery</I18nText>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedShareDiscoveryDialog;
