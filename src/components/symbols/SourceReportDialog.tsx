import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, AlertCircle, FileText, Link2Off, Scale, Clock, Copy, Ban } from 'lucide-react';

interface ReportCategory {
  id: string;
  name: string;
  description: string;
  severity_level: number;
  icon: string;
}

interface SourceReportDialogProps {
  sourceId: string;
  children: React.ReactNode;
}

const iconMap = {
  AlertTriangle,
  AlertCircle,
  FileText,
  LinkOff: Link2Off,
  Scale,
  Clock,
  Copy,
  Ban,
};

export const SourceReportDialog: React.FC<SourceReportDialogProps> = ({
  sourceId,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('source_report_categories')
      .select('*')
      .order('severity_level', { ascending: false });

    if (error) {
      console.error('Error loading categories:', error);
      return;
    }

    setCategories(data || []);
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie de signalement",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour signaler une source",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('symbol_source_reports')
      .insert({
        source_id: sourceId,
        user_id: user.id,
        category_id: selectedCategory,
        reason: reason.trim() || null,
        evidence_url: evidenceUrl.trim() || null,
      });

    if (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre le signalement",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signalement envoyé",
        description: "Votre signalement a été transmis à l'équipe de modération",
      });
      setOpen(false);
      setSelectedCategory('');
      setReason('');
      setEvidenceUrl('');
    }

    setLoading(false);
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Signaler cette source
          </DialogTitle>
          <DialogDescription>
            Aidez-nous à maintenir la qualité des sources en signalant les problèmes que vous identifiez.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Type de problème</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de problème" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || AlertCircle;
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{category.description}</div>
                          <div className={`text-xs ${
                            category.severity_level >= 4 ? 'text-red-500' :
                            category.severity_level >= 3 ? 'text-orange-500' :
                            'text-yellow-500'
                          }`}>
                            Gravité: {category.severity_level}/4
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedCategoryData && (
            <div className={`p-3 rounded-lg border ${
              selectedCategoryData.severity_level >= 4 ? 'bg-red-50 border-red-200' :
              selectedCategoryData.severity_level >= 3 ? 'bg-orange-50 border-orange-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <p className="text-sm text-muted-foreground">
                {selectedCategoryData.description}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="reason">Détails (optionnel)</Label>
            <Textarea
              id="reason"
              placeholder="Expliquez le problème identifié..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="evidence">Preuve ou source alternative (optionnel)</Label>
            <Input
              id="evidence"
              type="url"
              placeholder="https://..."
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Envoi...' : 'Signaler'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};