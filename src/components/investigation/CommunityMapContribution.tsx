import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  MapPin, 
  Users, 
  ThumbsUp, 
  Eye,
  Calendar,
  Star,
  FileImage,
  Archive
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CommunityContribution {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  votes: number;
  views: number;
  type: 'historical_plan' | 'location' | 'photo' | 'analysis';
  verified: boolean;
}

interface CommunityMapContributionProps {
  onContributionSubmit: (contribution: any) => void;
}

const CommunityMapContribution: React.FC<CommunityMapContributionProps> = ({ 
  onContributionSubmit 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contributionType, setContributionType] = useState<'historical_plan' | 'location' | 'photo' | 'analysis'>('location');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Exemples de contributions communautaires
  const sampleContributions: CommunityContribution[] = [
    {
      id: '1',
      title: 'Plan du château de 1808 par Percier',
      description: 'Plan architectural détaillé montrant les modifications de Napoléon',
      author: 'Dr. Marie Dubois',
      date: '2024-01-15',
      latitude: 48.4021,
      longitude: 2.7004,
      imageUrl: '/lovable-uploads/3e8b8b00-715e-4299-b6c3-a77d4a023e43.png',
      votes: 23,
      views: 156,
      type: 'historical_plan',
      verified: true
    },
    {
      id: '2',
      title: 'Passage secret découvert',
      description: 'Accès dissimulé derrière la tapisserie de la galerie François Ier',
      author: 'Jean Explorateur',
      date: '2024-01-10',
      latitude: 48.4019,
      longitude: 2.7006,
      votes: 15,
      views: 89,
      type: 'location',
      verified: false
    },
    {
      id: '3',
      title: 'Analyse comparative des symboles',
      description: 'Étude croisée des emblèmes royaux entre 1528 et 1808',
      author: 'Équipe SymboleFrance',
      date: '2024-01-08',
      latitude: 48.4023,
      longitude: 2.7002,
      votes: 31,
      views: 203,
      type: 'analysis',
      verified: true
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newContribution = {
      title,
      description,
      type: contributionType,
      author: 'Utilisateur Connecté', // À remplacer par l'utilisateur réel
      file: selectedFile,
      timestamp: new Date().toISOString()
    };

    onContributionSubmit(newContribution);
    
    toast({
      title: "Contribution soumise",
      description: "Votre contribution sera examinée par la communauté",
    });

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setShowForm(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'historical_plan': return <Archive className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'photo': return <FileImage className="h-4 w-4" />;
      case 'analysis': return <Star className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const configs = {
      historical_plan: { label: 'Plan Historique', color: 'bg-purple-100 text-purple-800' },
      location: { label: 'Lieu', color: 'bg-green-100 text-green-800' },
      photo: { label: 'Photo', color: 'bg-blue-100 text-blue-800' },
      analysis: { label: 'Analyse', color: 'bg-orange-100 text-orange-800' }
    };
    const config = configs[type as keyof typeof configs] || configs.location;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header avec bouton de contribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contributions Communautaires
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Upload className="h-4 w-4 mr-2" />
              Contribuer
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showForm && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de contribution</label>
                <select 
                  value={contributionType} 
                  onChange={(e) => setContributionType(e.target.value as any)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="location">Nouveau lieu</option>
                  <option value="historical_plan">Plan historique</option>
                  <option value="photo">Photo/Document</option>
                  <option value="analysis">Analyse</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Titre</label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Plan de Fontainebleau 1810"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre découverte ou votre analyse..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Document/Image (optionnel)</label>
                <Input 
                  type="file" 
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept="image/*,.pdf"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Soumettre</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Liste des contributions */}
      <div className="grid gap-4">
        {sampleContributions.map((contribution) => (
          <Card key={contribution.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(contribution.type)}
                  <h3 className="font-semibold">{contribution.title}</h3>
                  {contribution.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✓ Vérifié
                    </Badge>
                  )}
                </div>
                {getTypeBadge(contribution.type)}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {contribution.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Par {contribution.author}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(contribution.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {contribution.votes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {contribution.views}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques communautaires */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de la communauté</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-sm text-muted-foreground">Contributions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-muted-foreground">Vérifiées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">45</div>
              <div className="text-sm text-muted-foreground">Contributeurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-muted-foreground">Plans historiques</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityMapContribution;