import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles,
  Zap,
  Target,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Search,
  FileText,
  MessageSquare,
  Users,
  Eye,
  Star
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useToast } from '@/hooks/use-toast';

interface AIAnalysisInterfaceProps {
  quest: TreasureQuest;
}

const AIAnalysisInterface: React.FC<AIAnalysisInterfaceProps> = ({ quest }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    setAnalyzing(true);
    toast({
      title: "🤖 Analyse IA démarrée",
      description: "L'Assistant IA analyse les données de la quête...",
    });
    
    setTimeout(() => {
      setAnalyzing(false);
      toast({
        title: "✅ Analyse terminée",
        description: "Nouvelles connexions et pistes détectées !",
      });
    }, 3000);
  };

  return (
    <Card className="p-6 bg-white border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Assistant IA Avancé</h3>
            <p className="text-slate-600 text-sm">Analyse intelligente des indices et théories</p>
          </div>
        </div>
        
        <Button 
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-slate-800 hover:bg-slate-900 text-white"
        >
          {analyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyse...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Analyser Tout
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 bg-slate-50 border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-slate-600" />
            Connexions Détectées
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-700">Indices géographiques</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-slate-700">Références historiques</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-700">Motifs similaires</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-slate-50 border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-600" />
            Analyse de la Quête
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Titre: {quest.title}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Type: {quest.quest_type}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Difficulté: {quest.difficulty_level}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Indices: {quest.clues?.length || 0}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-slate-50 border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-slate-600" />
            Suggestions IA
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">Consulter les indices disponibles</p>
            <p className="text-slate-700">Analyser les connexions historiques</p>
            <p className="text-slate-700">Rechercher des ressources externes</p>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default AIAnalysisInterface;