
import React, { useState } from 'react';
import { Control, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tags, Plus, X } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { ContributionFormData } from '@/types/contributions';

interface TagsSectionProps {
  control: Control<ContributionFormData>;
  getValues: UseFormGetValues<ContributionFormData>;
  setValue: UseFormSetValue<ContributionFormData>;
  formErrors: any;
}

// Organize common tags by categories for better UX
const TAG_CATEGORIES = {
  art: ['symbole', 'motif', 'art', 'decoratif', 'geometrique'],
  spiritual: ['religieux', 'spirituel', 'sacre', 'rituel', 'cosmologie'],
  cultural: ['traditionnel', 'folklore', 'mythologie'],
  nature: ['nature', 'protection']
};

const TagsSection: React.FC<TagsSectionProps> = ({ getValues, setValue, formErrors }) => {
  const { t } = useTranslation();
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = (tagKey?: string) => {
    const tagToAdd = tagKey || currentTag.trim();
    if (!tagToAdd) return;

    const currentTags = getValues('tags') || [];
    
    // For common tags, use the translation key; for custom tags, use the input value
    const displayTag = tagKey ? t(`contributions:form.tags.${tagKey}`) : tagToAdd;
    
    if (!currentTags.includes(displayTag)) {
      const newTags = [...currentTags, displayTag];
      setValue('tags', newTags, { shouldValidate: true });
      if (!tagKey) setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues('tags') || [];
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setValue('tags', newTags, { shouldValidate: true });
  };

  const currentTags = getValues('tags') || [];

  const isTagSelected = (tagKey: string) => {
    const translatedTag = t(`contributions:form.tags.${tagKey}`);
    return currentTags.includes(translatedTag);
  };

  const renderTagCategory = (categoryKey: string, tagKeys: string[]) => {
    const availableTags = tagKeys.filter(tagKey => !isTagSelected(tagKey));
    
    if (availableTags.length === 0) return null;

    return (
      <div key={categoryKey} className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t(`contributions:form.tagCategories.${categoryKey}`)}
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tagKey => (
            <Badge
              key={tagKey}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-xs"
              onClick={() => handleAddTag(tagKey)}
            >
              <Plus className="mr-1 h-3 w-3" />
              {t(`contributions:form.tags.${tagKey}`)}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tags className="mr-2 h-5 w-5 text-primary" />
          {t('contributions:form.sections.tags')}
        </CardTitle>
        <CardDescription>
          {t('contributions:form.sections.tagsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Custom tag input */}
          <div className="flex gap-2">
            <Input
              placeholder={t('contributions:form.fields.tagsPlaceholder')}
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={() => handleAddTag()}
              disabled={!currentTag.trim()}
            >
              <Plus className="mr-1 h-4 w-4" />
              {t('contributions:form.fields.addTag')}
            </Button>
          </div>

          {/* Common tags organized by categories */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">{t('contributions:form.fields.commonTags')}</p>
              <p className="text-xs text-muted-foreground mb-4">{t('contributions:form.fields.commonTagsDescription')}</p>
            </div>
            
            <div className="space-y-4">
              {Object.entries(TAG_CATEGORIES).map(([categoryKey, tagKeys]) => 
                renderTagCategory(categoryKey, tagKeys)
              )}
            </div>
          </div>

          {/* Selected tags display */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t('contributions:form.fields.selectedTags')}</h4>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[50px] bg-muted/20">
              {currentTags.length > 0 ? (
                currentTags.map((tag, index) => (
                  <Badge
                    key={`${tag}-${index}`}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors px-3 py-1 pr-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="ml-1 h-3 w-3 hover:bg-destructive-foreground/20 rounded-full p-0.5" />
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {t('contributions:form.fields.noTags')}
                </p>
              )}
            </div>
          </div>

          {/* Error display */}
          {formErrors.tags && (
            <p className="text-sm text-destructive">
              {formErrors.tags.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagsSection;
