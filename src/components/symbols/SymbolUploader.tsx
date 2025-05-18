
import React, { useState } from 'react';
import SymbolForm from '@/components/symbols/SymbolForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';

// Define taxonomy options and form types
interface TaxonomyOption {
  value: string;
  label: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface SymbolFormData {
  id?: string;
  name: string;
  description: string;
  culture: string;
  period: string;
  location?: Location;
  techniques: string[];
  functions: string[];
  mediums: string[];
  images: File[];
}

interface SymbolUploaderProps {
  onSubmit: (data: SymbolFormData) => Promise<{ success: boolean; symbolId?: string; error?: string }>;
  initialData?: Partial<SymbolFormData>;
  mode?: 'create' | 'edit';
}

const SymbolUploader: React.FC<SymbolUploaderProps> = ({
  onSubmit,
  initialData = {},
  mode = 'create'
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample taxonomy options
  const cultures: TaxonomyOption[] = [
    { value: 'egyptian', label: t('taxonomies.cultures.egyptian') },
    { value: 'greek', label: t('taxonomies.cultures.greek') },
    { value: 'roman', label: t('taxonomies.cultures.roman') },
    { value: 'mesopotamian', label: t('taxonomies.cultures.mesopotamian') },
    { value: 'celtic', label: t('taxonomies.cultures.celtic') },
    { value: 'mayan', label: t('taxonomies.cultures.mayan') },
    { value: 'chinese', label: t('taxonomies.cultures.chinese') },
    { value: 'japanese', label: t('taxonomies.cultures.japanese') },
    { value: 'aboriginal', label: t('taxonomies.cultures.aboriginal') },
    { value: 'islamic', label: t('taxonomies.cultures.islamic') },
  ];
  
  const periods: TaxonomyOption[] = [
    { value: 'prehistoric', label: t('taxonomies.periods.prehistoric') },
    { value: 'ancient', label: t('taxonomies.periods.ancient') },
    { value: 'classical', label: t('taxonomies.periods.classical') },
    { value: 'medieval', label: t('taxonomies.periods.medieval') },
    { value: 'renaissance', label: t('taxonomies.periods.renaissance') },
    { value: 'modern', label: t('taxonomies.periods.modern') },
    { value: 'contemporary', label: t('taxonomies.periods.contemporary') },
  ];
  
  const techniques: TaxonomyOption[] = [
    { value: 'painting', label: t('taxonomies.techniques.painting') },
    { value: 'carving', label: t('taxonomies.techniques.carving') },
    { value: 'weaving', label: t('taxonomies.techniques.weaving') },
    { value: 'embroidery', label: t('taxonomies.techniques.embroidery') },
    { value: 'metalwork', label: t('taxonomies.techniques.metalwork') },
    { value: 'pottery', label: t('taxonomies.techniques.pottery') },
    { value: 'printing', label: t('taxonomies.techniques.printing') },
  ];
  
  const functions: TaxonomyOption[] = [
    { value: 'religious', label: t('taxonomies.functions.religious') },
    { value: 'decorative', label: t('taxonomies.functions.decorative') },
    { value: 'protective', label: t('taxonomies.functions.protective') },
    { value: 'identity', label: t('taxonomies.functions.identity') },
    { value: 'narrative', label: t('taxonomies.functions.narrative') },
    { value: 'educational', label: t('taxonomies.functions.educational') },
  ];
  
  const mediums: TaxonomyOption[] = [
    { value: 'stone', label: t('taxonomies.mediums.stone') },
    { value: 'textile', label: t('taxonomies.mediums.textile') },
    { value: 'ceramic', label: t('taxonomies.mediums.ceramic') },
    { value: 'metal', label: t('taxonomies.mediums.metal') },
    { value: 'wood', label: t('taxonomies.mediums.wood') },
    { value: 'paper', label: t('taxonomies.mediums.paper') },
    { value: 'digital', label: t('taxonomies.mediums.digital') },
  ];
  
  const handleSubmit = async (data: SymbolFormData) => {
    setIsLoading(true);
    
    try {
      const result = await onSubmit(data);
      
      if (result.success) {
        toast.success(
          mode === 'create' 
            ? t('symbols.uploader.createSuccess') 
            : t('symbols.uploader.updateSuccess')
        );
        
        if (result.symbolId) {
          navigate(`/symbols/${result.symbolId}`);
        } else {
          navigate('/explore');
        }
      } else {
        toast.error(result.error || t('symbols.uploader.genericError'));
      }
    } catch (error) {
      console.error('Error submitting symbol:', error);
      toast.error(t('symbols.uploader.submitError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? (
            <I18nText translationKey="symbols.uploader.createTitle">Upload New Symbol</I18nText>
          ) : (
            <I18nText translationKey="symbols.uploader.editTitle">Edit Symbol</I18nText>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SymbolForm
          initialData={initialData}
          cultures={cultures}
          periods={periods}
          techniques={techniques}
          functions={functions}
          mediums={mediums}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          mode={mode}
        />
      </CardContent>
    </Card>
  );
};

export default SymbolUploader;
