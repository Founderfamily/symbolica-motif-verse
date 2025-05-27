
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { createGroup } from '@/services/interestGroupService';
import { useAuth } from '@/hooks/useAuth';

interface CreateGroupDialogProps {
  onGroupCreated?: () => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ onGroupCreated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    themeColor: '#3B82F6'
  });
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.user || loading) return;

    setLoading(true);
    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-');
      await createGroup({
        name: formData.name,
        slug: slug,
        description: formData.description,
        is_public: formData.isPublic,
        theme_color: formData.themeColor,
        created_by: auth.user.id
      });

      setFormData({ name: '', description: '', isPublic: true, themeColor: '#3B82F6' });
      setOpen(false);
      onGroupCreated?.();
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          <I18nText translationKey="community.createGroup">Create Group</I18nText>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <I18nText translationKey="community.createNewGroup">Create New Group</I18nText>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">
              <I18nText translationKey="community.groupName">Group Name</I18nText>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter group name..."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">
              <I18nText translationKey="community.description">Description</I18nText>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your group..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="themeColor">
              <I18nText translationKey="community.themeColor">Theme Color</I18nText>
            </Label>
            <Input
              id="themeColor"
              type="color"
              value={formData.themeColor}
              onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
              className="w-20 h-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
            <Label htmlFor="isPublic">
              <I18nText translationKey="community.publicGroup">Public Group</I18nText>
            </Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <I18nText translationKey="common.cancel">Cancel</I18nText>
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? (
                <I18nText translationKey="common.creating">Creating...</I18nText>
              ) : (
                <I18nText translationKey="community.createGroup">Create Group</I18nText>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
