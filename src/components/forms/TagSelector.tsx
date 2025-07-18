
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Tag } from 'lucide-react';
import { POPULAR_TAGS } from '@/data/formOptions';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange }) => {
  const [newTag, setNewTag] = useState('');

  const addTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      onTagsChange([...selectedTags, tag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Tags</Label>
      
      {/* Tags populaires */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Tags populaires :</Label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.filter(tag => !selectedTags.includes(tag)).slice(0, 8).map((tag) => (
            <Button
              key={tag}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTag(tag)}
              className="h-7 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Champ pour nouveau tag */}
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Ajouter un tag personnalisé..."
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={() => addTag(newTag)} 
          size="sm"
          disabled={!newTag.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Tags sélectionnés */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => removeTag(tag)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
