
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Archive, 
  Search, 
  Filter, 
  FileText,
  Image,
  Book,
  Scroll,
  Download,
  Eye,
  Sparkles,
  Calendar,
  MapPin,
  User,
  Upload
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { investigationService } from '@/services/investigationService';

interface ArchivesTabProps {
  quest: TreasureQuest;
}

const ArchivesTab: React.FC<ArchivesTabProps> = ({ quest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load quest documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const result = await investigationService.getQuestDocuments(quest.id);
        if (result.success) {
          setDocuments(result.data);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [quest.id]);

  // Simuler des documents d'archives
  const mockArchives = [
    {
      id: '1',
      title: 'Registre Paroissial de Saint-Martin (1204)',
      type: 'manuscript',
      author: 'Frère Antoine',
      date: '1204-03-15',
      source: 'Archives Départementales',
      description: 'Registre mentionnant les donations des Templiers à l\'église Saint-Martin',
      content: 'Extrait en latin mentionnant "thesaurus templariorum"',
      url: '/api/placeholder/400/300',
      credibility: 92,
      aiRelevance: 95,
      tags: ['templiers', 'église', 'donations', 'latin']
    },
    {
      id: '2',
      title: 'Plan du Château (XIIIe siècle)',
      type: 'map',
      author: 'Architecte Royal',
      date: '1250-08-20',
      source: 'Bibliothèque Nationale',
      description: 'Plan architectural détaillé du château avec mentions de souterrains',
      content: 'Représentation des structures souterraines et passages secrets',
      url: '/api/placeholder/400/300',
      credibility: 88,
      aiRelevance: 90,
      tags: ['château', 'architecture', 'souterrains', 'médiéval']
    },
    {
      id: '3',
      title: 'Chronique de Guillaume de Malmesbury',
      type: 'chronicle',
      author: 'Guillaume de Malmesbury',
      date: '1225-12-10',
      source: 'Monastère de Cluny',
      description: 'Chronique relatant les événements liés à la dissolution de l\'Ordre du Temple',
      content: 'Récit des derniers jours des Templiers dans la région',
      url: '/api/placeholder/400/300',
      credibility: 85,
      aiRelevance: 87,
      tags: ['chronique', 'templiers', 'dissolution', 'histoire']
    },
    {
      id: '4',
      title: 'Inventaire des Biens Templiers (1307)',
      type: 'inventory',
      author: 'Bailli Royal',
      date: '1307-10-13',
      source: 'Archives Nationales',
      description: 'Inventaire officiel des biens saisis lors de l\'arrestation des Templiers',
      content: 'Liste détaillée des objets précieux et leur localisation',
      url: '/api/placeholder/400/300',
      credibility: 96,
      aiRelevance: 98,
      tags: ['inventaire', 'saisie', 'objets précieux', 'officiel']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'manuscript': return <Scroll className="h-4 w-4 text-amber-500" />;
      case 'map': return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'chronicle': return <Book className="h-4 w-4 text-green-500" />;
      case 'inventory': return <FileText className="h-4 w-4 text-purple-500" />;
      default: return <Archive className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredArchives = mockArchives.filter(archive => {
    const matchesSearch = archive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         archive.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         archive.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || archive.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Contrôles de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archives Historiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les archives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Ajouter Document
              </Button>
            </div>
          </div>

          {/* Filtres par type */}
          {!loading && documents.length > 0 && (
            <div className="flex gap-2 mb-4">
              <Button 
                variant={selectedFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                Tous ({documents.length})
              </Button>
              {['manuscript', 'map', 'chronicle', 'inventory'].map(type => {
                const count = documents.filter(doc => doc.document_type === type).length;
                if (count === 0) return null;
                return (
                  <Button 
                    key={type}
                    variant={selectedFilter === type ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedFilter(type)}
                  >
                    {type === 'manuscript' && 'Manuscrits'}
                    {type === 'map' && 'Cartes'}
                    {type === 'chronicle' && 'Chroniques'}
                    {type === 'inventory' && 'Inventaires'}
                    {' '}({count})
                  </Button>
                );
              })}
            </div>
          )}

          {/* Statistiques */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Archive className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Documents</span>
                </div>
                <div className="text-2xl font-bold">{documents.length}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Crédibilité Moy.</span>
                </div>
                <div className="text-2xl font-bold">
                  {documents.length > 0 
                    ? Math.round(documents.reduce((acc, d) => acc + (d.credibility_score || 0), 0) / documents.length)
                    : 0}%
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Sources</span>
                </div>
                <div className="text-2xl font-bold">
                  {new Set(documents.map(d => d.source)).size}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Types</span>
                </div>
                <div className="text-2xl font-bold">
                  {new Set(documents.map(d => d.document_type)).size}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des archives */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement des documents...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {documents
            .filter(doc => {
              const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
              const matchesFilter = selectedFilter === 'all' || doc.document_type === selectedFilter;
              return matchesSearch && matchesFilter;
            })
            .map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(doc.document_type)}
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {Math.round((doc.credibility_score || 0) * 100)}% fiable
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Document preview */}
              {doc.document_url && (
                <div className="relative">
                  <img 
                    src={doc.document_url} 
                    alt={doc.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button size="sm" variant="secondary" className="h-8 px-2">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 px-2">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Métadonnées */}
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {doc.author && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {doc.author}
                    </span>
                  )}
                  {doc.date_created && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {doc.date_created}
                    </span>
                  )}
                </div>
                {doc.description && (
                  <p className="text-sm">{doc.description}</p>
                )}
                {doc.source && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Source:</strong> {doc.source}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <FileText className="h-3 w-3 mr-1" />
                    Analyse
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <Download className="h-3 w-3 mr-1" />
                    Télécharger
                  </Button>
                </div>
                <Button size="sm" variant="outline">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Recherche IA
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {documents.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Aucun document trouvé</p>
            <p className="text-sm text-muted-foreground">
              Les documents d'archives pour cette quête n'ont pas encore été ajoutés
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArchivesTab;
