
import React from 'react';
import { Card } from '@/components/ui/card';
import { AnalysisExample } from '@/services/analysisExampleService';

interface AnalysisExampleDisplayProps {
  example: AnalysisExample;
}

export default function AnalysisExampleDisplay({ example }: AnalysisExampleDisplayProps) {
  return (
    <div className="space-y-6">
      <h4 className="text-md font-medium text-slate-800 mb-4">{example.title}</h4>
      
      {example.description && (
        <p className="text-slate-600 mb-4">{example.description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="aspect-video bg-slate-100 flex items-center justify-center">
            {example.original_image_url ? (
              <img 
                src={example.original_image_url} 
                alt="Photo originale" 
                className="object-contain w-full h-full"
              />
            ) : (
              <p className="text-slate-400">Photo originale</p>
            )}
          </div>
          <div className="p-4">
            <h5 className="font-medium text-slate-800">Photo originale</h5>
            <p className="text-sm text-slate-600 mt-1">
              Photographie d'un motif décoratif prise dans un bâtiment historique
            </p>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="aspect-video bg-slate-100 flex items-center justify-center">
            {example.detection_image_url ? (
              <img 
                src={example.detection_image_url} 
                alt="Détection IA" 
                className="object-contain w-full h-full"
              />
            ) : (
              <p className="text-slate-400">Détection IA</p>
            )}
          </div>
          <div className="p-4">
            <h5 className="font-medium text-slate-800">Détection IA</h5>
            <p className="text-sm text-slate-600 mt-1">
              Identification automatique des contours et structures du motif
            </p>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="aspect-video bg-slate-100 flex items-center justify-center">
            {example.extraction_image_url ? (
              <img 
                src={example.extraction_image_url} 
                alt="Extraction du motif" 
                className="object-contain w-full h-full"
              />
            ) : (
              <p className="text-slate-400">Extraction du motif</p>
            )}
          </div>
          <div className="p-4">
            <h5 className="font-medium text-slate-800">Extraction du motif</h5>
            <p className="text-sm text-slate-600 mt-1">
              Isolation du motif de son contexte et nettoyage
            </p>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="aspect-video bg-slate-100 flex items-center justify-center">
            {example.classification_image_url ? (
              <img 
                src={example.classification_image_url} 
                alt="Classification" 
                className="object-contain w-full h-full"
              />
            ) : (
              <p className="text-slate-400">Classification</p>
            )}
          </div>
          <div className="p-4">
            <h5 className="font-medium text-slate-800">Classification</h5>
            <p className="text-sm text-slate-600 mt-1">
              Analyse comparative et catégorisation du motif
            </p>
          </div>
        </Card>
      </div>
      
      {example.tags && example.tags.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-lg">
          <h5 className="font-medium text-slate-800">Résultat de l'analyse</h5>
          <div className="mt-3 flex gap-2 flex-wrap">
            {example.tags.map((tag, index) => (
              <span key={index} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
