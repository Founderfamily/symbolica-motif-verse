
import React, { useState } from 'react';
import { Control, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tags, Plus } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { ContributionFormData } from '@/types/contributions';
import { COMMON_TAGS } from '@/data/contributionOptions';

interface TagsSectionProps {
  control: Control<ContributionFormData>;
  getValues: UseFormGetValues<ContributionFormData>;
  setValue: UseFormSetValue<ContributionFormData>;
  formErrors: any;
}

const TagsSection: React.FC<TagsSectionProps> = ({ getValues, setValue, formErrors }) => {
  const { t } = useTranslation();
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = (tag?: string) => {
    const tagToAdd = tag || currentTag;
    const currentTags = getValues().tags || []; // Fix: ensure tags is never undefined
    if (tagToAdd.trim() && !currentTags.includes(tagToAdd)) {
      setValue('tags', [...currentTags, tagToAdd]);
      if (!tag) setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues().tags || []; // Fix: ensure tags is never undefined
    setValue(
      'tags',
      currentTags.filter(tag => tag !== tagToRemove)
    );
  };

  const currentTags = getValues().tags || []; // Fix: ensure tags is never undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tags className="mr-2 h-5 w-5 text-primary" />
          {t('contributions.form.sections.tags')}
        </CardTitle>
        <CardDescription>
          {t('contributions.form.sections.tagsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex">
            <Input
              placeholder={t('contributions.form.fields.tagsPlaceholder')}
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="mr-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={() => handleAddTag()}>
              {t('contributions.form.fields.addTag')}
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">{t('contributions.form.fields.commonTags')}</p>
            <p className="text-xs text-muted-foreground mb-3">{t('contributions.form.fields.commonTagsDescription')}</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.filter(tag => !currentTags.includes(tag)).map(tag => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTag(t(`contributions.form.tags.${tag}`))}
                  className="h-7 text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {t(`contributions.form.tags.${tag}`)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {currentTags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
            {currentTags.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                {t('contributions.form.fields.noTags')}
              </p>
            )}
          </div>
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
