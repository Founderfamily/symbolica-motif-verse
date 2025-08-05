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
import DocumentUploadDialog from './DocumentUploadDialog';
import { useArchiveMap } from '@/contexts/ArchiveMapContext';
import { ArchiveEnrichmentDialog } from './ArchiveEnrichmentDialog';
import { ArchiveContributionsList } from './ArchiveContributionsList';
import { ArchiveEditDialog } from '../admin/ArchiveEditDialog';
import { useAuth } from '@/hooks/useAuth';
import { historicalArchiveService, type HistoricalArchive } from '@/services/historicalArchiveService';

interface ArchivesTabProps {
  quest: TreasureQuest;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const ArchivesTab: React.FC<ArchivesTabProps> = ({ quest, activeTab, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [documents, setDocuments] = useState<any[]>([]);
  const [archives, setArchives] = useState<HistoricalArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributionsRefresh, setContributionsRefresh] = useState(0);
  const { setSelectedArchive, archiveLocations } = useArchiveMap();
  const { isAdmin } = useAuth();

  const loadDocuments = async () => {
    try {
      setLoading(true);
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

  const loadArchives = async () => {
    try {
      const data = await historicalArchiveService.getArchives();
      setArchives(data);
    } catch (error) {
      console.error('Error loading archives:', error);
    }
  };

  // Load quest documents and historical archives
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadDocuments(), loadArchives()]);
      setLoading(false);
    };
    loadData();
  }, [quest.id]);

  // Combine documents and archives for display
  const archivesToDisplay = [...documents, ...archives];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'manuscript': return <Scroll className="h-4 w-4 text-amber-500" />;
      case 'map': return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'chronicle': return <Book className="h-4 w-4 text-green-500" />;
      case 'inventory': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'registry': return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'official': return <Scroll className="h-4 w-4 text-red-500" />;
      case 'memoir': return <Book className="h-4 w-4 text-pink-500" />;
      default: return <Archive className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredArchives = archivesToDisplay.filter(archive => {
    const title = archive.title || '';
    const description = archive.description || '';
    const content = archive.content || '';
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const type = archive.type || archive.document_type || '';
    const matchesFilter = selectedFilter === 'all' || type === selectedFilter;
    
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
              <DocumentUploadDialog questId={quest.id} onDocumentAdded={loadDocuments}>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter Document
                </Button>
              </DocumentUploadDialog>
            </div>
          </div>

          {/* Filtres par type */}
          {!loading && archivesToDisplay.length > 0 && (
            <div className="flex gap-2 mb-4">
              <Button 
                variant={selectedFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                Tous ({archivesToDisplay.length})
              </Button>
              {['manuscript', 'map', 'chronicle', 'inventory', 'registry', 'official', 'memoir'].map(type => {
                const count = archivesToDisplay.filter(doc => (doc.document_type || doc.type) === type).length;
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
                    {type === 'registry' && 'Registres'}
                    {type === 'official' && 'Officiels'}
                    {type === 'memoir' && 'Mémoires'}
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
                <div className="text-2xl font-bold">{archivesToDisplay.length}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Archives</span>
                </div>
                <div className="text-2xl font-bold">{archives.length}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Sources</span>
                </div>
                <div className="text-2xl font-bold">
                  {new Set(archivesToDisplay.map(d => d.source)).size}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Types</span>
                </div>
                <div className="text-2xl font-bold">
                  {new Set(archivesToDisplay.map(d => d.document_type || d.type)).size}
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
          {filteredArchives.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(doc.document_type || doc.type)}
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {Math.round((doc.credibility_score || doc.credibility || 95))}% fiable
                  </Badge>
                  {isAdmin && (
                    <ArchiveEditDialog 
                      archive={doc}
                      onArchiveUpdated={() => {
                        loadDocuments();
                        loadArchives();
                      }}
                    />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Document preview */}
              {(doc.document_url || doc.url) && (
                <div className="relative">
                  <img 
                    src={doc.document_url || doc.url} 
                    alt={doc.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                    }}
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
                  {(doc.date_created || doc.date) && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {doc.date_created || doc.date}
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
                {(doc.archive_link || doc.archiveLink) && (
                  <div className="text-xs">
                    <a 
                      href={doc.archive_link || doc.archiveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      🔗 Consulter aux archives
                    </a>
                  </div>
                )}
                {(doc.physical_location || doc.physicalLocation) && (
                  <div className="text-xs text-muted-foreground">
                    📍 <strong>Localisation:</strong> {doc.physical_location || doc.physicalLocation}
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
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const location = archiveLocations.find(loc => 
                        loc.relatedDocuments?.includes(doc.id)
                      );
                      if (location && setActiveTab) {
                        setSelectedArchive(doc.id);
                        setActiveTab('map');
                      }
                    }}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Voir sur carte
                  </Button>
                </div>
                <ArchiveEnrichmentDialog 
                  archiveId={doc.id}
                  archiveTitle={doc.title}
                  onContributionAdded={() => setContributionsRefresh(prev => prev + 1)}
                />
              </div>

              {/* Archive Contributions Section */}
              <div className="mt-4 pt-4 border-t">
                <ArchiveContributionsList 
                  archiveId={doc.id}
                  refreshTrigger={contributionsRefresh}
                />
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {archivesToDisplay.length === 0 && !loading && (
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