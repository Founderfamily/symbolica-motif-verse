
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Eye, Folder, FileText } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { shareDiscovery } from '@/services/communityService';
import { toast } from 'sonner';

interface ShareDiscoveryDialogProps {
  groupId: string;
  children: React.ReactNode;
}

const ShareDiscoveryDialog: React.FC<ShareDiscoveryDialogProps> = ({ groupId, children }) => {
  const [open, setOpen] = useState(false);
  const [entityType, setEntityType] = useState<'symbol' | 'collection' | 'contribution'>('symbol');
  const [entityId, setEntityId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleShare = async () => {
    if (!auth?.user) return;
    if (!entityId.trim() || !title.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await shareDiscovery(groupId, auth.user.id, entityType, entityId, title, description);
      toast.success('Discovery shared successfully!');
      setOpen(false);
      // Reset form
      setEntityId('');
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error sharing discovery:', error);
      toast.error('Failed to share discovery');
    } finally {
      setLoading(false);
    }
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
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
            <Select value={entityType} onValueChange={(value: 'symbol' | 'collection' | 'contribution') => setEntityType(value)}>
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

          {/* Entity ID */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              {getEntityIcon()}
              <I18nText translationKey="community.entityId">Item ID</I18nText>
            </label>
            <Input
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              placeholder="Enter the ID of the item you want to share..."
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <I18nText translationKey="community.discoveryTitle">Title</I18nText>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your discovery a descriptive title..."
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
              placeholder="Describe why this discovery is interesting..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              <I18nText translationKey="common.cancel">Cancel</I18nText>
            </Button>
            <Button onClick={handleShare} disabled={loading} className="flex-1">
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

export default ShareDiscoveryDialog;
