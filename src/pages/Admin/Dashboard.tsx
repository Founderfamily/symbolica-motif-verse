
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Upload, 
  Camera, 
  Search,
  Plus 
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';

import AnalysisExampleForm from '@/components/admin/AnalysisExampleForm';
import AnalysisExamplesList from '@/components/admin/AnalysisExamplesList';
import AnalysisExampleDisplay from '@/components/admin/AnalysisExampleDisplay';
import { 
  getAnalysisExamples, 
  AnalysisExample 
} from '@/services/analysisExampleService';

const Dashboard = () => {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'upload' | 'process'>('upload');
  const { toast } = useToast();
  
  const { 
    data: examples = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['analysisExamples'],
    queryFn: getAnalysisExamples,
  });

  const handleRefetch = () => {
    refetch();
  };

  // Get the latest example for display
  const latestExample = examples.length > 0 ? examples[0] : null;

  return (
    <div>
      <h2 className="text-xl font-medium text-slate-800 mb-6">Tableau de bord</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800">Symboles</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">20</p>
          <p className="text-sm text-slate-500 mt-1">Symboles dans la base de données</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800">Images</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">60</p>
          <p className="text-sm text-slate-500 mt-1">Images de symboles</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800">Utilisateurs</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">1</p>
          <p className="text-sm text-slate-500 mt-1">Administrateurs</p>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Bienvenue dans l'administration</h3>
          <p className="text-slate-600">
            Cette interface vous permet de gérer les symboles et leurs images pour le musée Symbolica. 
            Vous pouvez ajouter de nouveaux symboles, modifier les existants, et gérer les trois types d'images 
            pour chaque symbole : image originale, extraction du motif, et nouvelle utilisation.
          </p>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Processus d'analyse</h3>
        <Card>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="upload" onClick={() => setActiveAnalysisTab('upload')}>
                <Upload className="mr-2 h-4 w-4" />
                Gestion des images
              </TabsTrigger>
              <TabsTrigger value="process" onClick={() => setActiveAnalysisTab('process')}>
                <BarChart className="mr-2 h-4 w-4" />
                Exemple de processus
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-slate-800">Exemples d'analyse</h4>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un exemple
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Ajouter un exemple d'analyse</DialogTitle>
                      </DialogHeader>
                      <AnalysisExampleForm onSubmitSuccess={() => {
                        handleRefetch();
                        const closeButton = document.querySelector('[data-radix-dialog-close]');
                        if (closeButton && closeButton instanceof HTMLElement) {
                          closeButton.click();
                        }
                      }} />
                    </DialogContent>
                  </Dialog>
                </div>

                {isLoading ? (
                  <div className="py-10 text-center">
                    <p className="text-slate-500">Chargement des exemples...</p>
                  </div>
                ) : isError ? (
                  <div className="py-10 text-center">
                    <p className="text-red-500">Erreur lors du chargement des exemples.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => refetch()} 
                      className="mt-2"
                    >
                      Réessayer
                    </Button>
                  </div>
                ) : (
                  <AnalysisExamplesList 
                    examples={examples} 
                    onUpdate={handleRefetch} 
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="process" className="p-6">
              {latestExample ? (
                <AnalysisExampleDisplay example={latestExample} />
              ) : (
                <div className="py-10 text-center">
                  <p className="text-slate-500">Aucun exemple d'analyse n'est disponible.</p>
                  <p className="text-slate-500 mt-2">
                    Ajoutez un exemple dans l'onglet "Gestion des images".
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
