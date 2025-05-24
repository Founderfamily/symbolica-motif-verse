
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { Check, X, Flag, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface Comment {
  id: string;
  content: string;
  author: string;
  contributionTitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  createdAt: string;
  reportCount: number;
}

// Mock data for demonstration
const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Ce motif me rappelle les ornements que j\'ai vus dans les temples de Kyoto.',
    author: 'cultural_explorer',
    contributionTitle: 'Motif géométrique japonais',
    status: 'pending',
    createdAt: '2024-01-20T10:30:00Z',
    reportCount: 0
  },
  {
    id: '2',
    content: 'Votre analyse est complètement fausse ! Ce n\'est pas du tout d\'origine celtique.',
    author: 'angry_user',
    contributionTitle: 'Entrelacs celtiques',
    status: 'flagged',
    createdAt: '2024-01-19T14:20:00Z',
    reportCount: 3
  },
  {
    id: '3',
    content: 'Excellente contribution ! Les détails historiques sont très instructifs.',
    author: 'pattern_lover',
    contributionTitle: 'Symboles aztèques',
    status: 'approved',
    createdAt: '2024-01-18T09:15:00Z',
    reportCount: 0
  },
  {
    id: '4',
    content: 'Spam message with inappropriate content here...',
    author: 'spammer123',
    contributionTitle: 'Art islamique',
    status: 'rejected',
    createdAt: '2024-01-17T16:45:00Z',
    reportCount: 5
  }
];

export default function CommentModeration() {
  const { t } = useTranslation();
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [activeTab, setActiveTab] = useState('pending');

  const handleCommentAction = (commentId: string, action: 'approve' | 'reject' | 'flag' | 'unflag') => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        switch (action) {
          case 'approve':
            return { ...comment, status: 'approved' as const };
          case 'reject':
            return { ...comment, status: 'rejected' as const };
          case 'flag':
            return { ...comment, status: 'flagged' as const };
          case 'unflag':
            return { ...comment, status: 'pending' as const };
          default:
            return comment;
        }
      }
      return comment;
    }));
  };

  const getStatusBadge = (status: Comment['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      case 'flagged':
        return <Badge variant="destructive" className="bg-orange-600">Signalé</Badge>;
    }
  };

  const filterComments = (status: string) => {
    if (status === 'all') return comments;
    return comments.filter(comment => comment.status === status);
  };

  const pendingCount = comments.filter(c => c.status === 'pending').length;
  const flaggedCount = comments.filter(c => c.status === 'flagged').length;
  const approvedCount = comments.filter(c => c.status === 'approved').length;
  const rejectedCount = comments.filter(c => c.status === 'rejected').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <I18nText translationKey="admin.moderation.title">
            Modération des commentaires
          </I18nText>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">En attente</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Flag className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Signalés</p>
                <p className="text-2xl font-bold">{flaggedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Approuvés</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Rejetés</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments Tabs */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                En attente ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="flagged">
                Signalés ({flaggedCount})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approuvés ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejetés ({rejectedCount})
              </TabsTrigger>
            </TabsList>

            {['pending', 'flagged', 'approved', 'rejected'].map((status) => (
              <TabsContent key={status} value={status}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Commentaire</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead>Contribution</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Signalements</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterComments(status).map((comment) => (
                      <TableRow key={comment.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="truncate">{comment.content}</p>
                          </div>
                        </TableCell>
                        <TableCell>{comment.author}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {comment.contributionTitle}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(comment.status)}</TableCell>
                        <TableCell>
                          {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          {comment.reportCount > 0 && (
                            <Badge variant="outline" className="text-red-600">
                              {comment.reportCount}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {comment.status === 'pending' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleCommentAction(comment.id, 'approve')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleCommentAction(comment.id, 'reject')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {comment.status === 'flagged' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleCommentAction(comment.id, 'approve')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleCommentAction(comment.id, 'reject')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {(comment.status === 'approved' || comment.status === 'rejected') && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleCommentAction(comment.id, 'flag')}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                <Flag className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
