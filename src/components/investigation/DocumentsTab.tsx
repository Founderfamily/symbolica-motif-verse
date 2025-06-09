
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Map, 
  Book, 
  Camera, 
  Archive,
  ExternalLink,
  Upload,
  Star,
  Calendar,
  User
} from 'lucide-react';
import { investigationService } from '@/services/investigationService';
import { QuestDocument } from '@/types/investigation';
import { TreasureQuest } from '@/types/quests';

interface DocumentsTabProps {
  quest: TreasureQuest;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ quest }) => {
  const [documents, setDocuments] = useState<QuestDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadDocuments();
  }, [quest.id]);

  const loadDocuments = async () => {
    setLoading(true);
    const result = await investigationService.getQuestDocuments(quest.id);
    if (result.success) {
      setDocuments(result.data || []);
    }
    setLoading(false);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'map': return Map;
      case 'manuscript': return Book;
      case 'photograph': return Camera;
      case 'archaeological': return Archive;
      default: return FileText;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      'historical': 'Document Historique',
      'map': 'Carte Ancienne',
      'manuscript': 'Manuscrit',
      'archaeological': 'Rapport Archéologique',
      'photograph': 'Photographie'
    };
    return labels[type] || type;
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    if (score >= 0.4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredDocuments = selectedType === 'all' 
    ? documents 
    : documents.filter(doc => doc.document_type === selectedType);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement des documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Archives Documentaires</h2>
            <p className="text-slate-600">
              Documents historiques, cartes anciennes et sources primaires liés à cette enquête
            </p>
          </div>
          
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Upload className="w-4 h-4 mr-2" />
            Ajouter un Document
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            Tous ({documents.length})
          </Button>
          {['historical', 'map', 'manuscript', 'archaeological', 'photograph'].map(type => {
            const count = documents.filter(doc => doc.document_type === type).length;
            return (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
                disabled={count === 0}
              >
                {getDocumentTypeLabel(type)} ({count})
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Liste des documents */}
      <div className="grid gap-6">
        {filteredDocuments.length === 0 ? (
          <Card className="p-12 text-center">
            <Archive className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Aucun document trouvé</h3>
            <p className="text-slate-500 mb-4">
              {selectedType === 'all' 
                ? "Aucun document n'a encore été ajouté à cette enquête."
                : `Aucun document de type "${getDocumentTypeLabel(selectedType)}" trouvé.`
              }
            </p>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Upload className="w-4 h-4 mr-2" />
              Ajouter le Premier Document
            </Button>
          </Card>
        ) : (
          filteredDocuments.map((document) => {
            const IconComponent = getDocumentIcon(document.document_type);
            
            return (
              <Card key={document.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-amber-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">
                          {document.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                          <Badge variant="outline">
                            {getDocumentTypeLabel(document.document_type)}
                          </Badge>
                          {document.date_created && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {document.date_created}
                            </span>
                          )}
                          {document.author && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {document.author}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={getCredibilityColor(document.credibility_score)}>
                          <Star className="w-3 h-3 mr-1" />
                          {Math.round(document.credibility_score * 100)}%
                        </Badge>
                      </div>
                    </div>
                    
                    {document.description && (
                      <p className="text-slate-600 mb-3 line-clamp-2">
                        {document.description}
                      </p>
                    )}
                    
                    {document.source && (
                      <p className="text-sm text-slate-500 mb-3">
                        <strong>Source:</strong> {document.source}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        Ajouté le {new Date(document.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      
                      {document.document_url && (
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Voir le Document
                        </Button>
                      )}
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

export default DocumentsTab;
