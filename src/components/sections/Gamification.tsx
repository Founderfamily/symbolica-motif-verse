
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Star } from 'lucide-react';

const Gamification = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Participez et progressez</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Symbolica est une expérience enrichissante où chaque contribution est valorisée
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Award className="h-6 w-6 text-amber-700" />
              Badges et récompenses
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                "Explorateur", "Érudit", "Photographe",
                "Conservateur", "Mentor", "Détective"
              ].map((badge, i) => (
                <div key={i} className="bg-amber-50 py-2 px-3 rounded-lg border border-amber-100 text-center">
                  <p className="text-amber-900 font-medium text-sm">{badge}</p>
                </div>
              ))}
            </div>
            
            <p className="text-slate-600 text-sm">
              Gagnez des badges spéciaux en réalisant des missions spécifiques et en contribuant régulièrement à la communauté
            </p>
          </div>
          
          <div className="flex-1">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Star className="h-6 w-6 text-teal-700" />
              Niveaux et points
            </h3>
            
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Upload de photo</span>
                    <Badge className="bg-amber-700">+5 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Annotation de motif</span>
                    <Badge className="bg-amber-700">+3 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Identification validée</span>
                    <Badge className="bg-amber-700">+2 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Documentation avancée</span>
                    <Badge className="bg-amber-700">+10 pts</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-slate-600 text-sm">
              Progressez en niveaux en accumulant des points. Chaque niveau débloque de nouvelles fonctionnalités et privilèges
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
