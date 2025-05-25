
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tags, Plus, X, Lightbulb } from 'lucide-react';
import { ContributionFormData } from '@/types/contributions';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface ContributionTagsStepProps {
  form: UseFormReturn<ContributionFormData>;
}

const ContributionTagsStep: React.FC<ContributionTagsStepProps> = ({ form }) => {
  const [currentTag, setCurrentTag] = useState('');
  const { t } = useTranslation();

  const popularTags = [
    'géométrique', 'floral', 'religieux', 'architecture', 'textile',
    'céramique', 'sculpture', 'manuscrit', 'ornement', 'motif'
  ];

  const handleAddTag = () => {
    const tag = currentTag.trim().toLowerCase();
    if (tag && !form.getValues().tags.includes(tag)) {
      form.setValue('tags', [...form.getValues().tags, tag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      'tags',
      form.getValues().tags.filter(tag => tag !== tagToRemove)
    );
  };

  const handleAddPopularTag = (tag: string) => {
    if (!form.getValues().tags.includes(tag)) {
      form.setValue('tags', [...form.getValues().tags, tag]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5" />
          <I18nText translationKey="contributions.form.sections.tags" />
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <I18nText translationKey="contributions.form.sections.tagsDescription" />
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ajout de tags */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder={t('contributions.form.fields.tagsPlaceholder')}
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleAddTag}
              disabled={!currentTag.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tags populaires */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span>Tags populaires :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleAddPopularTag(tag)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags sélectionnés */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            <I18nText translationKey="contributions.form.fields.selectedTags" /> ({form.getValues().tags.length})
          </h4>
          
          {form.getValues().tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {form.getValues().tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg text-center">
              <Tags className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p><I18nText translationKey="contributions.form.fields.noTags" /></p>
              <p className="text-xs mt-1">
                <I18nText translationKey="contributions.form.fields.addTagsHelp" />
              </p>
            </div>
          )}
        </div>

        {/* Validation */}
        {form.getValues().tags.length === 0 && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            <I18nText translationKey="contributions.form.validation.minTags" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContributionTagsStep;
