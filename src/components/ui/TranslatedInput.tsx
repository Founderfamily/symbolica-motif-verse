
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface TranslatedInputProps {
  id: string;
  label: string;
  translationKey?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  rows?: number;
}

const TranslatedInput: React.FC<TranslatedInputProps> = ({
  id,
  label,
  translationKey,
  placeholder,
  value,
  onChange,
  multiline = false,
  required = false,
  className = '',
  labelClassName = '',
  rows = 3
}) => {
  const { t } = useTranslation();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  
  const inputPlaceholder = placeholder || (translationKey ? t(`${translationKey}.placeholder`) : '');
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className={labelClassName}>
        {translationKey ? (
          <I18nText translationKey={`${translationKey}.label`}>{label}</I18nText>
        ) : (
          label
        )}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={inputPlaceholder}
          required={required}
          rows={rows}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={inputPlaceholder}
          required={required}
        />
      )}
    </div>
  );
};

export default TranslatedInput;
