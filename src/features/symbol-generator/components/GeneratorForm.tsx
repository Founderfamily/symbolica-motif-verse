
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkle } from 'lucide-react';

interface GeneratorFormProps {
  theme: string;
  onThemeChange: (value: string) => void;
  onPropose: () => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ theme, onThemeChange, onPropose, isLoading }) => {
  return (
    <div>
      <div className="flex gap-2 mb-5">
        <Input
          placeholder="Thème ou culture (optionnel)"
          value={theme}
          onChange={e => onThemeChange(e.target.value)}
          disabled={isLoading}
        />
        <Button
          onClick={onPropose}
          variant="default"
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkle className="w-4 h-4" />}
          Générer 5 symboles
        </Button>
      </div>
    </div>
  );
};

