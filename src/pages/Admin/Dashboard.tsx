
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Upload, Camera, Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Dashboard = () => {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'upload' | 'process'>('upload');
  
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
                <div>
                  <h4 className="text-md font-medium text-slate-800 mb-2">Ajouter un exemple d'analyse</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Téléchargez des images représentant les différentes étapes du processus d'analyse de motifs.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Titre de l'exemple</Label>
                        <Input id="title" placeholder="Art Nouveau - Motif floral" />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Description du processus d'analyse" rows={3} />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Images du processus</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="border border-dashed border-slate-300 rounded-md p-4 text-center">
                            <Camera className="h-6 w-6 mx-auto text-slate-400" />
                            <p className="text-xs text-slate-500 mt-1">Photo originale</p>
                            <Button variant="outline" size="sm" className="mt-2 w-full">Télécharger</Button>
                          </div>
                          <div className="border border-dashed border-slate-300 rounded-md p-4 text-center">
                            <Search className="h-6 w-6 mx-auto text-slate-400" />
                            <p className="text-xs text-slate-500 mt-1">Détection IA</p>
                            <Button variant="outline" size="sm" className="mt-2 w-full">Télécharger</Button>
                          </div>
                          <div className="border border-dashed border-slate-300 rounded-md p-4 text-center">
                            <Camera className="h-6 w-6 mx-auto text-slate-400" />
                            <p className="text-xs text-slate-500 mt-1">Extraction du motif</p>
                            <Button variant="outline" size="sm" className="mt-2 w-full">Télécharger</Button>
                          </div>
                          <div className="border border-dashed border-slate-300 rounded-md p-4 text-center">
                            <BarChart className="h-6 w-6 mx-auto text-slate-400" />
                            <p className="text-xs text-slate-500 mt-1">Classification</p>
                            <Button variant="outline" size="sm" className="mt-2 w-full">Télécharger</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Enregistrer l'exemple
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="process" className="p-6">
              <h4 className="text-md font-medium text-slate-800 mb-4">Un exemple de traitement de motif architectural</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <p className="text-slate-400">Photo originale</p>
                  </div>
                  <div className="p-4">
                    <h5 className="font-medium text-slate-800">Photo originale</h5>
                    <p className="text-sm text-slate-600 mt-1">Photographie d'un motif décoratif prise dans un bâtiment historique</p>
                  </div>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <p className="text-slate-400">Détection IA</p>
                  </div>
                  <div className="p-4">
                    <h5 className="font-medium text-slate-800">Détection IA</h5>
                    <p className="text-sm text-slate-600 mt-1">Identification automatique des contours et structures du motif</p>
                  </div>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <p className="text-slate-400">Extraction du motif</p>
                  </div>
                  <div className="p-4">
                    <h5 className="font-medium text-slate-800">Extraction du motif</h5>
                    <p className="text-sm text-slate-600 mt-1">Isolation du motif de son contexte et nettoyage</p>
                  </div>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <p className="text-slate-400">Classification</p>
                  </div>
                  <div className="p-4">
                    <h5 className="font-medium text-slate-800">Classification</h5>
                    <p className="text-sm text-slate-600 mt-1">Analyse comparative et catégorisation du motif</p>
                  </div>
                </Card>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <h5 className="font-medium text-slate-800">Résultat de l'analyse</h5>
                <p className="text-amber-700 mt-2">Motif Art Nouveau - Période: 1890-1910 - Similarité avec 24 autres motifs</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Art Nouveau</span>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Floral</span>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Europe</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
