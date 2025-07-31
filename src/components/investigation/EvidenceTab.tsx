
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  FileText, 
  MapPin, 
  MessageSquare, 
  Package,
  Plus,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';
import { investigationService } from '@/services/investigationService';
import { QuestEvidence } from '@/types/investigation';
import { TreasureQuest } from '@/types/quests';

interface EvidenceTabProps {
  quest: TreasureQuest;
}

const EvidenceTab: React.FC<EvidenceTabProps> = ({ quest }) => {
  const [evidence, setEvidence] = useState<QuestEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadEvidence();
  }, [quest.id]);

  const loadEvidence = async () => {
    setLoading(true);
    const result = await investigationService.getQuestEvidence(quest.id);
    if (result.success) {
      setEvidence(result.data || []);
    }
    setLoading(false);
  };

  const handleValidation = async (evidenceId: string, voteType: 'validate' | 'dispute' | 'reject') => {
    const result = await investigationService.validateEvidence(evidenceId, voteType);
    if (result.success) {
      // Recharger les preuves pour mettre à jour les scores
      loadEvidence();
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'photo': return Camera;
      case 'document': return FileText;
      case 'location': return MapPin;
      case 'testimony': return MessageSquare;
      case 'artifact': return Package;
      default: return FileText;
    }
  };

  const getEvidenceTypeLabel = (type: string) => {
    const labels = {
      'photo': 'Photographie',
      'document': 'Document',
      'location': 'Localisation',
      'testimony': 'Témoignage',
      'artifact': 'Artefact'
    };
    return labels[type] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return CheckCircle;
      case 'rejected': return XCircle;
      case 'disputed': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'disputed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pending': 'En Attente',
      'validated': 'Validée',
      'disputed': 'Contestée',
      'rejected': 'Rejetée'
    };
    return labels[status] || status;
  };

  const filteredEvidence = selectedStatus === 'all' 
    ? evidence 
    : evidence.filter(ev => ev.validation_status === selectedStatus);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement des preuves...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Preuves Collectées</h2>
            <p className="text-slate-600">
              Contributions de la communauté avec validation collaborative
            </p>
          </div>
          
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Soumettre une Preuve
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('all')}
          >
            Toutes ({evidence.length})
          </Button>
          {['pending', 'validated', 'disputed', 'rejected'].map(status => {
            const count = evidence.filter(ev => ev.validation_status === status).length;
            return (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                disabled={count === 0}
              >
                {getStatusLabel(status)} ({count})
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Liste des preuves */}
      <div className="grid gap-6">
        {filteredEvidence.length === 0 ? (
          <Card className="p-12 text-center">
            <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Aucune preuve trouvée</h3>
            <p className="text-slate-500 mb-4">
              {selectedStatus === 'all' 
                ? "Aucune preuve n'a encore été soumise pour cette enquête."
                : `Aucune preuve "${getStatusLabel(selectedStatus)}" trouvée.`
              }
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Soumettre la Première Preuve
            </Button>
          </Card>
        ) : (
          filteredEvidence.map((evidenceItem) => {
            const IconComponent = getEvidenceIcon(evidenceItem.evidence_type);
            const StatusIcon = getStatusIcon(evidenceItem.validation_status);
            
            return (
              <Card key={evidenceItem.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">
                          {evidenceItem.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                          <Badge variant="outline">
                            {getEvidenceTypeLabel(evidenceItem.evidence_type)}
                          </Badge>
                          {evidenceItem.clue_index !== null && (
                            <span>Indice #{evidenceItem.clue_index}</span>
                          )}
                          {evidenceItem.location_name && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {evidenceItem.location_name}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={getStatusColor(evidenceItem.validation_status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(evidenceItem.validation_status)}
                        </Badge>
                      </div>
                    </div>
                    
                    {evidenceItem.description && (
                      <p className="text-slate-600 mb-3 line-clamp-2">
                        {evidenceItem.description}
                      </p>
                    )}
                    
                    {/* Score de validation */}
                    <div className="bg-slate-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Score de Validation</span>
                        <span className="text-sm text-slate-600">
                          {evidenceItem.validation_count} validation(s)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            evidenceItem.validation_score > 0.6 ? 'bg-green-500' :
                            evidenceItem.validation_score > 0.3 ? 'bg-yellow-500' :
                            evidenceItem.validation_score > 0 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.max(Math.abs(evidenceItem.validation_score) * 100, 10)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Actions de validation */}
                    {evidenceItem.validation_status === 'pending' && (
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleValidation(evidenceItem.id, 'validate')}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleValidation(evidenceItem.id, 'dispute')}
                          className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Contester
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleValidation(evidenceItem.id, 'reject')}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="text-xs text-slate-400">
                        Soumis le {new Date(evidenceItem.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Users className="w-3 h-3 mr-1" />
                          Voir Validations
                        </Button>
                        <Button variant="ghost" size="sm" className="text-purple-600">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Analyse IA
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EvidenceTab;
