import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Crown, 
  Star, 
  TrendingUp, 
  ExternalLink, 
  Plus, 
  Search,
  Filter,
  Users,
  Calendar,
  MapPin,
  FileText
} from 'lucide-react';
import { aiDataExtractionService, AIHistoricalFigure } from '@/services/AIDataExtractionService';
import { historicalFiguresService, HistoricalFigureMetadata } from '@/services/historicalFiguresService';
import WikipediaLinkDialog from './widgets/WikipediaLinkDialog';

interface HistoricalFiguresTabProps {
  questId: string;
}

const HistoricalFiguresTab: React.FC<HistoricalFiguresTabProps> = ({ questId }) => {
  const [figures, setFigures] = useState<AIHistoricalFigure[]>([]);
  const [metadata, setMetadata] = useState<HistoricalFigureMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFigure, setSelectedFigure] = useState<AIHistoricalFigure | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  useEffect(() => {
    loadHistoricalFigures();
  }, [questId]);

  const loadHistoricalFigures = async () => {
    try {
      setLoading(true);
      console.log('Loading historical figures for quest:', questId);
      
      const [figuresData, metadataData] = await Promise.all([
        aiDataExtractionService.getHistoricalFigures(questId),
        historicalFiguresService.getHistoricalFiguresMetadata(questId)
      ]);
      
      console.log('Figures data:', figuresData);
      console.log('Metadata data:', metadataData);
      
      // Enrichir les figures avec les métadonnées Wikipedia
      const enrichedFigures = figuresData.map(figure => {
        const figureMetadata = metadataData.find(
          m => m.figure_name === figure.name && m.figure_role === figure.role
        );
        return {
          ...figure,
          wikipediaUrl: figureMetadata?.wikipedia_url,
          imageUrl: figureMetadata?.image_url
        };
      });
      
      setFigures(enrichedFigures);
      setMetadata(metadataData);
    } catch (error) {
      console.error('Erreur lors du chargement des personnages historiques:', error);
      setFigures([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestWikipedia = (figure: AIHistoricalFigure) => {
    setSelectedFigure(figure);
    setIsDialogOpen(true);
  };

  const handleSuggestionSubmitted = () => {
    loadHistoricalFigures();
  };

  const getRoleIcon = (role: string) => {
    const roleKey = role.toLowerCase();
    if (roleKey.includes('roi') || roleKey.includes('empereur')) return Crown;
    if (roleKey.includes('cardinal') || roleKey.includes('ministre')) return Star;
    return User;
  };

  const getRoleColor = (role: string) => {
    const roleKey = role.toLowerCase();
    if (roleKey.includes('roi') || roleKey.includes('empereur')) return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    if (roleKey.includes('cardinal') || roleKey.includes('ministre')) return 'bg-purple-500/10 text-purple-700 border-purple-200';
    return 'bg-blue-500/10 text-blue-700 border-blue-200';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getSourceIcon = (description: string) => {
    if (description.includes('(archive)')) return FileText;
    if (description.includes('(document)')) return MapPin;
    return Users;
  };

  // Filtrage et tri
  const filteredAndSortedFigures = figures
    .filter(figure => {
      const matchesSearch = figure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           figure.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || figure.role === selectedRole;
      const matchesPeriod = selectedPeriod === 'all' || figure.period === selectedPeriod;
      return matchesSearch && matchesRole && matchesPeriod;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'period':
          return a.period.localeCompare(b.period);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'relevance':
        default:
          return b.relevance - a.relevance;
      }
    });

  // Obtenir les valeurs uniques pour les filtres
  const uniqueRoles = [...new Set(figures.map(f => f.role))];
  const uniquePeriods = [...new Set(figures.map(f => f.period))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6" />
            Personnages Historiques
          </h2>
          <p className="text-muted-foreground mt-1">
            {figures.length} personnage{figures.length > 1 ? 's' : ''} identifié{figures.length > 1 ? 's' : ''} dans cette quête
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un personnage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                {uniquePeriods.map(period => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Pertinence</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="period">Période</SelectItem>
                <SelectItem value="role">Rôle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grille des personnages */}
      {filteredAndSortedFigures.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucun personnage trouvé</p>
              <p className="text-sm">Modifiez vos critères de recherche</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedFigures.map((figure) => {
            const RoleIcon = getRoleIcon(figure.role);
            const SourceIcon = getSourceIcon(figure.description);
            
            return (
              <Card key={figure.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={getRoleColor(figure.role)}>
                        {getInitials(figure.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {figure.name}
                        <RoleIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {figure.period}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {figure.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {figure.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Pertinence: {Math.round(figure.relevance * 100)}%
                      </span>
                      <SourceIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {figure.wikipediaUrl ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(figure.wikipediaUrl, '_blank', 'noopener,noreferrer')}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Wikipedia
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestWikipedia(figure)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Suggérer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog pour suggérer un lien Wikipedia */}
      {selectedFigure && (
        <WikipediaLinkDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          questId={questId}
          figureName={selectedFigure.name}
          figureRole={selectedFigure.role}
          figurePeriod={selectedFigure.period}
          onSuggestionSubmitted={handleSuggestionSubmitted}
        />
      )}
    </div>
  );
};

export default HistoricalFiguresTab;