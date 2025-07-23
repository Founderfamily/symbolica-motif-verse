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

interface AIAnalysisInterfaceProps {
  quest: TreasureQuest;
}

const AIAnalysisInterface: React.FC<AIAnalysisInterfaceProps> = ({ quest }) => {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 3000);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-800">Assistant IA Avancé</h3>
            <p className="text-purple-600 text-sm">Analyse intelligente des indices et théories</p>
          </div>
        </div>
        
        <Button 
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
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
        <Card className="p-4 bg-white/80 border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Connexions Détectées
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Lien géographique trouvé</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Période historique cohérente</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Symboles récurrents</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/80 border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Pistes Prioritaires
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Zone château</span>
              <Badge className="bg-red-100 text-red-800">95%</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Document XV siècle</span>
              <Badge className="bg-amber-100 text-amber-800">78%</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Témoignage local</span>
              <Badge className="bg-green-100 text-green-800">65%</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/80 border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Suggestions IA
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-purple-700">Analyser les cartes anciennes de la région</p>
            <p className="text-purple-700">Vérifier les archives paroissiales</p>
            <p className="text-purple-700">Comparer avec quêtes similaires</p>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default AIAnalysisInterface;