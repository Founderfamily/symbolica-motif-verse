
import React from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

interface TranslatedInputProps extends Omit<InputProps, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

const TranslatedInput: React.FC<TranslatedInputProps> = ({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  description,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const { currentLanguage } = useTranslation();

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={props.id || props.name} className="text-base">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
          <Globe className="h-3 w-3 inline mr-1" />
          {currentLanguage === 'fr' ? 'Français' : 'English'}
        </div>
      </div>
      
      {description && (
        <p className="text-sm text-slate-500">{description}</p>
      )}
      
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="resize-none w-full"
          {...props as any}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      )}
      
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TranslatedInput;
