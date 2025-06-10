
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentSectionsEditor from '@/components/admin/content/ContentSectionsEditor';
import TestimonialsEditor from '@/components/admin/content/TestimonialsEditor';
import RoadmapEditor from '@/components/admin/content/RoadmapEditor';
import PartnersEditor from '@/components/admin/content/PartnersEditor';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("sections");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gestion du contenu</h1>
        <p className="text-slate-500">Modifiez le contenu de la page d'accueil</p>
      </div>
      
      <Tabs defaultValue="sections" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="sections">Sections principales</TabsTrigger>
          <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
          <TabsTrigger value="roadmap">Feuille de route</TabsTrigger>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sections" className="space-y-4">
          <ContentSectionsEditor />
        </TabsContent>
        
        <TabsContent value="testimonials" className="space-y-4">
          <TestimonialsEditor />
        </TabsContent>
        
        <TabsContent value="roadmap" className="space-y-4">
          <RoadmapEditor />
        </TabsContent>
        
        <TabsContent value="partners" className="space-y-4">
          <PartnersEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
