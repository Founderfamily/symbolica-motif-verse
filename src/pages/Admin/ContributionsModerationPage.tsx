
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const ContributionsModerationPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const mockContributions = [
    {
      id: 1,
      title: "Symbole Celtique Ancien",
      author: "Jean Dupont",
      status: "pending",
      submittedAt: "2024-01-15",
      description: "Découverte d'un symbole gravé sur une pierre..."
    },
    {
      id: 2,
      title: "Motif Géométrique Maya",
      author: "Marie Martin",
      status: "approved",
      submittedAt: "2024-01-14",
      description: "Analyse d'un motif répétitif trouvé à Chichen Itza..."
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'flagged': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      flagged: "outline"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status === 'pending' && 'En attente'}
        {status === 'approved' && 'Approuvée'}
        {status === 'rejected' && 'Rejetée'}
        {status === 'flagged' && 'Signalée'}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Modération des Contributions
          </h1>
          <p className="text-slate-600 mt-2">
            Gérez et modérez les contributions soumises par la communauté.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="approved">Approuvées</TabsTrigger>
            <TabsTrigger value="rejected">Rejetées</TabsTrigger>
            <TabsTrigger value="flagged">Signalées</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Contributions en attente de modération
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockContributions
                    .filter(c => c.status === 'pending')
                    .map(contribution => (
                      <div key={contribution.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{contribution.title}</h3>
                          {getStatusBadge(contribution.status)}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          Par {contribution.author} • {contribution.submittedAt}
                        </p>
                        <p className="text-slate-700 mb-4">{contribution.description}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                          <Button size="sm" variant="outline">
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Contributions approuvées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Liste des contributions approuvées...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Contributions rejetées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Liste des contributions rejetées...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flagged">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Contributions signalées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Liste des contributions signalées...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContributionsModerationPage;
